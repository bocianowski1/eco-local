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
			PermissionDenied(w)
			return
		}

		token, err := validateJWT(tokenString)
		if err != nil {
			log.Println("Error validating JWT token:", err, tokenString)
			PermissionDenied(w)
			return
		}

		if !token.Valid {
			log.Println("Invalid JWT token:", err)
			PermissionDenied(w)
			return
		}

		userID, err := getID(r)
		if err != nil {
			log.Println("Error getting ID from request:", err)
			PermissionDenied(w)
			return
		}
		user, err := s.GetUserByID(userID)
		if err != nil {
			WriteJSON(w, http.StatusNotFound, fmt.Sprintf("User with id %v not found", userID))
			return
		}

		claims := token.Claims.(jwt.MapClaims)
		claimsEmail := claims["email"].(string)
		if user.Email != claimsEmail {
			log.Println("User number mismatch", user.Email, claimsEmail)
			PermissionDenied(w)
			return
		}
		// claimsAccountNumber := int64(claims["account_number"].(float64))
		// if account.Number != claimsAccountNumber {
		// 	log.Println("Account number mismatch", account.Number, claimsAccountNumber)
		// 	PermissionDenied(w)
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

func createJWT(account *User) (string, error) {
	claims := jwt.MapClaims{
		"expires_at": time.Now().Add(time.Hour * 24).Unix(),
		"email":      account.Email,
	}

	secret := os.Getenv("JWT_SECRET")
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	return token.SignedString([]byte(secret))
}
