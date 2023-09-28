package main

import (
	"math/rand"
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
}

type Account struct {
	ID        int       `json:"id"`
	FirstName string    `json:"firstName"`
	LastName  string    `json:"lastName"`
	Number    int64     `json:"accountNumber"`
	Balance   int       `json:"balance"`
	Token     string    `json:"token"`
	Role      string    `json:"role"`
	CreatedAt time.Time `json:"createdAt"`
}

func NewAccount(firstName, lastName string) *Account {
	return &Account{
		FirstName: firstName,
		LastName:  lastName,
		Number:    int64(rand.Intn(100000)),
		Role:      "USER",
		CreatedAt: time.Now().UTC(),
	}
}

func NewAdminAccount(firstName, lastName string) *Account {
	account := NewAccount(firstName, lastName)
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
