package main

import (
	"encoding/json"
	"fmt"
	"net/http"
)

func (s *APIServer) HandleAccount(w http.ResponseWriter, r *http.Request) error {
	switch r.Method {
	case "GET":
		{
			return s.HandleGetAccount(w, r)
		}
	case "POST":
		{
			return s.HandleCreateAccount(w, r)
		}
	default:
		{
			return WriteJSON(w, http.StatusMethodNotAllowed, fmt.Sprintf("Method %v not allowed", r.Method))
		}
	}
}

func (s *APIServer) HandleAccountByID(w http.ResponseWriter, r *http.Request) error {
	id, err := getID(r)
	if err != nil {
		return err
	}

	switch r.Method {
	case "GET":
		{
			account, err := s.store.GetAccountByID(id)
			if err != nil {
				return err
			}

			return WriteJSON(w, http.StatusOK, account)
		}
	case "DELETE":
		{
			if err := s.store.DeleteAccount(id); err != nil {
				return err
			}

			return WriteJSON(w, http.StatusOK, map[string]int{
				"deleted": id,
			})
		}
	default:
		{
			return WriteJSON(w, http.StatusMethodNotAllowed, fmt.Sprintf("Method %v not allowed", r.Method))

		}
	}
}

func (s *APIServer) HandleGetAccount(w http.ResponseWriter, r *http.Request) error {
	accounts, err := s.store.GetAccount()
	if err != nil {
		return err
	}

	return WriteJSON(w, http.StatusOK, accounts)
}

func (s *APIServer) HandleCreateAccount(w http.ResponseWriter, r *http.Request) error {
	createAccReq := CreateAccountRequest{}
	if err := json.NewDecoder(r.Body).Decode(&createAccReq); err != nil {
		return err
	}
	defer r.Body.Close()

	account := NewAccount(createAccReq.FirstName, createAccReq.LastName)

	tokenString, err := createJWT(account)
	if err != nil {
		return err
	}

	account.Token = tokenString

	id, err := s.store.CreateAccount(account)
	if err != nil {
		return err
	}

	updatedAccount, err := s.store.GetAccountByID(id)
	if err != nil {
		return err
	}

	if id == 0 {
		return WriteJSON(w, http.StatusBadRequest, APIError{
			Error: fmt.Sprintf("Bad request, %v", id),
		})
	}

	return WriteJSON(w, http.StatusCreated, updatedAccount)
}

func (s *APIServer) HandleAccountProducts(w http.ResponseWriter, r *http.Request) error {
	id, err := getID(r)
	if err != nil {
		return err
	}

	products, err := s.store.GetAccountProducts(id)
	if err != nil {
		return err
	}

	return WriteJSON(w, http.StatusOK, products)
}
