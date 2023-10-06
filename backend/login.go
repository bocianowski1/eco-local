package main

import (
	"crypto"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
)

func (s *Server) Login(w http.ResponseWriter, r *http.Request) error {
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

func (s *Server) HandleLogin(w http.ResponseWriter, r *http.Request) error {
	login := Login{}
	if err := json.NewDecoder(r.Body).Decode(&login); err != nil {
		log.Println("Error decoding login:", err)
		return err
	}

	user, err := s.store.GetUserByEmail(login.Email)
	if err != nil {
		log.Println("Error getting user by email:", err)
		return err
	}

	encryptedPassword := crypto.SHA256.New().Sum([]byte(login.Password))

	if string(user.Password) != string(encryptedPassword) {
		return fmt.Errorf("Invalid password")
	}

	token, err := createJWT(user)
	if err != nil {
		log.Println("Error creating JWT:", err)
		return err
	}

	user.Token = token

	return WriteJSON(w, http.StatusOK, user)
}
