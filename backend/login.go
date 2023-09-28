package main

import (
	"crypto"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
)

func (s *APIServer) Login(w http.ResponseWriter, r *http.Request) error {
	switch r.Method {
	case "POST":
		{
			return s.HandleLogin(w, r)
		}
	default:
		{
			return WriteJSON(w, http.StatusMethodNotAllowed, fmt.Sprintf("Method %v not allowed", r.Method))
		}
	}
}

func (s *APIServer) HandleLogin(w http.ResponseWriter, r *http.Request) error {
	login := Login{}
	if err := json.NewDecoder(r.Body).Decode(&login); err != nil {
		log.Println("Error decoding login:", err)
		return err
	}

	account, err := s.store.GetAccountByEmail(login.Email)
	if err != nil {
		log.Println("Error getting account by email:", err)
		return err
	}

	encryptedPassword := crypto.SHA256.New().Sum([]byte(login.Password))

	if string(account.Password) != string(encryptedPassword) {
		return fmt.Errorf("Invalid password")
	}

	token, err := createJWT(account)
	if err != nil {
		log.Println("Error creating JWT:", err)
		return err
	}

	account.Token = token

	return WriteJSON(w, http.StatusOK, account)
}
