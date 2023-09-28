package main

import (
	"net/http"
	"time"
)

type APIServer struct {
	listenAddr string
	store      Storager
}

type APIFunc func(w http.ResponseWriter, r *http.Request) error

type APIError struct {
	Error string `json:"error"`
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
}

type Account struct {
	ID         int       `json:"id"`
	FirstName  string    `json:"firstName"`
	LastName   string    `json:"lastName"`
	Email      string    `json:"email"`
	Token      string    `json:"token"`
	Role       string    `json:"role"`
	CreatedAt  time.Time `json:"createdAt"`
	ModifiedAt time.Time `json:"modifiedAt"`
}

func NewAccount(firstName, lastName, email string) *Account {
	return &Account{
		FirstName:  firstName,
		LastName:   lastName,
		Email:      email,
		Role:       "USER",
		CreatedAt:  time.Now().UTC(),
		ModifiedAt: time.Now().UTC(),
	}
}

func NewAdminAccount(firstName, lastName, email string) *Account {
	account := NewAccount(firstName, lastName, email)
	account.Role = "ADMIN"
	return account
}

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
	Email string `json:"email"`
	// Password string `json:"password"`
}
