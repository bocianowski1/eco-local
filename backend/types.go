package main

import (
	"crypto"
	"encoding/json"
	"net/http"
	"time"
)

type APIServer struct {
	listenAddr string
	store      Storager
	rw         *ResponseWriter
}

type APIFunc func(w http.ResponseWriter, r *http.Request) error

type APIError struct {
	Error string `json:"error"`
}

type ResponseWriter struct {
	http.ResponseWriter
}

func (rw *ResponseWriter) WriteHeader(statusCode int) {
	rw.ResponseWriter.WriteHeader(statusCode)
}

func (rw *ResponseWriter) Write(b []byte) (int, error) {
	return rw.ResponseWriter.Write(b)
}

func (rw *ResponseWriter) WriteJSON(statusCode int, v any) error {
	// rw.Header().Set("Content-Type", "application/json")
	rw.WriteHeader(statusCode)
	// return json.NewEncoder(rw).Encode(v)
	// return hello world string
	return json.NewEncoder(rw).Encode("hello world")
}

type RouteHandlerPair struct {
	route   string
	handler http.HandlerFunc
}

type CreateProductRequest struct {
	Title       string `json:"title"`
	Description string `json:"description"`
	Price       int    `json:"price"`
	AccountID   int    `json:"accountId"`
}

type CreateAccountRequest struct {
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
	Email     string `json:"email"`
	Password  string `json:"password"`
}

type Account struct {
	ID         int       `json:"id"`
	FirstName  string    `json:"firstName"`
	LastName   string    `json:"lastName"`
	Email      string    `json:"email"`
	Password   []byte    `json:"password"`
	Token      string    `json:"token"`
	Role       string    `json:"role"`
	CreatedAt  time.Time `json:"createdAt"`
	ModifiedAt time.Time `json:"modifiedAt"`
}

func NewAccount(firstName, lastName, email, password string) *Account {
	return &Account{
		FirstName:  firstName,
		LastName:   lastName,
		Email:      email,
		Password:   crypto.SHA256.New().Sum([]byte(password)),
		Role:       "USER",
		CreatedAt:  time.Now().UTC(),
		ModifiedAt: time.Now().UTC(),
	}
}

// func NewAdminAccount(firstName, lastName, email string) *Account {
// 	account := NewAccount(firstName, lastName, email)
// 	account.Role = "ADMIN"
// 	return account
// }

type Product struct {
	ID          int       `json:"id"`
	Title       string    `json:"title"`
	Price       int       `json:"price"`
	Description string    `json:"description"`
	AccountID   int       `json:"accountId"`
	CreatedAt   time.Time `json:"createdAt"`
	ModifiedAt  time.Time `json:"modifiedAt"`
}

func NewProduct(title, description string, price, accountID int) *Product {
	return &Product{
		Title:       title,
		Description: description,
		Price:       price,
		AccountID:   accountID,
		CreatedAt:   time.Now().UTC(),
		ModifiedAt:  time.Now().UTC(),
	}
}

type Login struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}
