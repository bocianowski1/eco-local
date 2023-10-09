package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
)

func (s *Server) HandleUser(w http.ResponseWriter, r *http.Request) error {
	switch r.Method {
	case "GET":
		{
			return s.HandleGetUser(w, r)
		}
	case "POST":
		{
			return s.HandleCreateUser(w, r)
		}
	default:
		{
			return WriteJSON(w, http.StatusMethodNotAllowed, fmt.Sprintf("Method %v not allowed", r.Method))
		}
	}
}

func (s *Server) HandleUserByID(w http.ResponseWriter, r *http.Request) error {
	id, err := getID(r)
	if err != nil {
		return err
	}

	switch r.Method {
	case "GET":
		{
			return s.HandleGetUserByID(w, r, id)
		}
	case "DELETE":
		{
			return s.HandleDeleteUser(w, r, id)
		}
	default:
		{
			return WriteJSON(w, http.StatusMethodNotAllowed, fmt.Sprintf("Method %v not allowed", r.Method))

		}
	}
}

func (s *Server) HandleGetUser(w http.ResponseWriter, r *http.Request) error {
	users, err := s.store.GetUser()
	if err != nil {
		return err
	}

	return WriteJSON(w, http.StatusOK, users)
}

func (s *Server) HandleGetUserByID(w http.ResponseWriter, r *http.Request, id int) error {
	user, err := s.store.GetUserByID(id)
	if err != nil {
		return err
	}

	return WriteJSON(w, http.StatusOK, user)
}

func (s *Server) HandleCreateUser(w http.ResponseWriter, r *http.Request) error {
	createUserReq := CreateUserRequest{}
	if err := json.NewDecoder(r.Body).Decode(&createUserReq); err != nil {
		return err
	}
	defer r.Body.Close()

	user := NewUser(createUserReq.FirstName, createUserReq.LastName, createUserReq.Email, createUserReq.Password)

	tokenString, err := createJWT(user)
	if err != nil {
		return err
	}

	user.Token = tokenString

	id, err := s.store.CreateUser(user)
	if err != nil {
		return err
	}

	if id == 1 {
		return WriteJSON(w, http.StatusCreated, user)
	}

	updatedUser, err := s.store.GetUserByID(id)
	if err != nil {
		return err
	}

	if id == 0 {
		return WriteJSON(w, http.StatusBadRequest, HTTPError{
			StatusCode: http.StatusBadRequest,
			Message:    fmt.Sprintf("User with email %v not found", user.Email),
		})
	}

	return WriteJSON(w, http.StatusCreated, updatedUser)
}
func (s *Server) HandleUserProducts(w http.ResponseWriter, r *http.Request) error {
	id, err := getID(r)
	if err != nil {
		return err
	}

	products, err := s.store.GetUserProducts(id)
	if err != nil {
		return err
	}

	return WriteJSON(w, http.StatusOK, products)
}

func (s *Server) HandleDeleteUser(w http.ResponseWriter, r *http.Request, id int) error {
	if err := s.store.DeleteUser(id); err != nil {
		return err
	}

	return WriteJSON(w, http.StatusOK, map[string]int{
		"deleted": id,
	})
}

func getID(r *http.Request) (int, error) {
	idString := mux.Vars(r)["id"]

	id, err := strconv.Atoi(idString)
	if err != nil {
		return id, fmt.Errorf("ID %v incorrect format", idString)
	}
	return id, nil
}
