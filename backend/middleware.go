package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	jwt "github.com/golang-jwt/jwt/v4"
)

func withJWTAuth(handlerFunc http.HandlerFunc, s Storager) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		tokenString := r.Header.Get("x-jwt-token")
		if tokenString == "" {
			log.Println("No JWT token provided")
			permissionDenied(w)
			return
		}

		token, err := validateJWT(tokenString)
		if err != nil {
			log.Println("Error validating JWT token:", err, tokenString)
			permissionDenied(w)
			return
		}

		if !token.Valid {
			log.Println("Invalid JWT token:", err)
			permissionDenied(w)
			return
		}

		userID, err := getID(r)
		if err != nil {
			log.Println("Error getting ID from request:", err)
			permissionDenied(w)
			return
		}
		account, err := s.GetAccountByID(userID)
		if err != nil {
			WriteJSON(w, http.StatusNotFound, fmt.Sprintf("Account with id %v not found", userID))
			return
		}

		claims := token.Claims.(jwt.MapClaims)
		claimsEmail := claims["email"].(string)
		if account.Email != claimsEmail {
			log.Println("Account number mismatch", account.Email, claimsEmail)
			permissionDenied(w)
			return
		}
		// claimsAccountNumber := int64(claims["account_number"].(float64))
		// if account.Number != claimsAccountNumber {
		// 	log.Println("Account number mismatch", account.Number, claimsAccountNumber)
		// 	permissionDenied(w)
		// 	return
		// }

		handlerFunc(w, r)
	}
}

func validateJWT(tokenString string) (*jwt.Token, error) {
	secret := os.Getenv("JWT_SECRET")
	return jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
		}

		return []byte(secret), nil
	})
}

func createJWT(account *Account) (string, error) {
	claims := jwt.MapClaims{
		"expires_at": time.Now().Add(time.Hour * 24).Unix(),
		"email":      account.Email,
	}

	secret := os.Getenv("JWT_SECRET")
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	return token.SignedString([]byte(secret))
}
