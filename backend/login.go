package main

import (
	"encoding/json"
	"fmt"
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
		return err
	}

	account, err := s.store.GetAccountByEmail(login.Email)
	if err != nil {
		return err
	}

	// if account.Password != login.Password {
	//     return WriteJSON(w, http.StatusUnauthorized, "Invalid password")
	// }

	token, err := createJWT(account)
	if err != nil {
		return err
	}

	account.Token = token

	return WriteJSON(w, http.StatusOK, account)
}
