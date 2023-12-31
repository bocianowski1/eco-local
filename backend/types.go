package main

import (
	"crypto"
	"net/http"
	"time"
)

type HTTPHandler func(w http.ResponseWriter, r *http.Request) error

type HTTPError struct {
	StatusCode int    `json:"statusCode"`
	Message    string `json:"message"`
}

type HandlerFuncPair struct {
	Route   string
	Handler http.HandlerFunc
}

type User struct {
	ID         int       `json:"id"`
	FirstName  string    `json:"firstName"`
	LastName   string    `json:"lastName"`
	Email      string    `json:"email"`
	Password   []byte    `json:"-"`
	Token      string    `json:"token"`
	Premium    bool      `json:"premium"`
	Verified   bool      `json:"verified"`
	CreatedAt  time.Time `json:"createdAt"`
	ModifiedAt time.Time `json:"modifiedAt"`
}

func NewUser(firstName, lastName, email, password string) *User {
	return &User{
		FirstName:  firstName,
		LastName:   lastName,
		Email:      email,
		Password:   crypto.SHA256.New().Sum([]byte(password)),
		Premium:    false,
		Verified:   false,
		CreatedAt:  time.Now().UTC(),
		ModifiedAt: time.Now().UTC(),
	}
}

type CreateUserRequest struct {
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
	Email     string `json:"email"`
	Password  string `json:"password"`
}

type UpdateUserRequest struct {
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
	Email     string `json:"email"`
	Premium   bool   `json:"premium"`
	Verified  bool   `json:"verified"`
}

func UpdateUser(firstName, lastName, email string, premium, verified bool) *User {
	return &User{
		FirstName:  firstName,
		LastName:   lastName,
		Email:      email,
		Premium:    premium,
		Verified:   verified,
		ModifiedAt: time.Now().UTC(),
	}
}

type Business struct {
	ID        int       `json:"id"`
	Name      string    `json:"name"`
	Email     string    `json:"email"`
	Password  []byte    `json:"-"`
	Token     string    `json:"token"`
	Location  Location  `json:"location"`
	Products  []Product `json:"products"`
	CreatedAt time.Time `json:"createdAt"`
	Modified  time.Time `json:"modifiedAt"`
}

func NewBusiness(name, email, password string, location Location) *Business {
	return &Business{
		Name:      name,
		Email:     email,
		Password:  crypto.SHA256.New().Sum([]byte(password)),
		Location:  location,
		Products:  []Product{},
		CreatedAt: time.Now().UTC(),
		Modified:  time.Now().UTC(),
	}
}

type CreateBusinessRequest struct {
	Name     string   `json:"name"`
	Email    string   `json:"email"`
	Password string   `json:"password"`
	Location Location `json:"location"`
}

type Location struct {
	Address    string  `json:"address"`
	City       string  `json:"city"`
	PostalCode string  `json:"postalCode"`
	Latitude   float64 `json:"latitude"`
	Longitude  float64 `json:"longitude"`
}

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

const (
	PHONE = "phone"
	OTHER = "other"
)

type Product struct {
	ID          int       `json:"id"`
	Title       string    `json:"title"`
	Price       float64   `json:"price"`
	Description string    `json:"description"`
	Category    string    `json:"category"`
	UserID      int       `json:"userId"`
	CreatedAt   time.Time `json:"createdAt"`
	ModifiedAt  time.Time `json:"modifiedAt"`
}

func NewProduct(title, description, category string, price float64, userID int) *Product {
	return &Product{
		Title:       title,
		Price:       price,
		Description: description,
		Category:    category,
		UserID:      userID,
		CreatedAt:   time.Now().UTC(),
		ModifiedAt:  time.Now().UTC(),
	}
}

type CreateProductRequest struct {
	Title       string  `json:"title"`
	Description string  `json:"description"`
	Category    string  `json:"category"`
	Price       float64 `json:"price"`
	UserID      int     `json:"userId"`
}

type PageView struct {
	ID        int       `json:"id"`
	ProductID int       `json:"productId"`
	UserID    int       `json:"userId"`
	CreatedAt time.Time `json:"createdAt"`
}

func NewPageView(productID, userID int) *PageView {
	return &PageView{
		ProductID: productID,
		UserID:    userID,
		CreatedAt: time.Now().UTC(),
	}
}

type CreatePageViewRequest struct {
	ProductID int `json:"productId"`
	UserID    int `json:"userId"`
}

type Review struct {
	ID        int       `json:"id"`
	ProductID int       `json:"productId"`
	UserID    int       `json:"userId"`
	Comment   string    `json:"comment"`
	Rating    int       `json:"rating"`
	CreatedAt time.Time `json:"createdAt"`
}

func NewReview(productID, userID int, comment string, rating int) *Review {
	if rating < 1 {
		rating = 1
	}

	if rating > 5 {
		rating = 5
	}

	return &Review{
		ProductID: productID,
		UserID:    userID,
		Comment:   comment,
		Rating:    rating,
		CreatedAt: time.Now().UTC(),
	}
}

type CreateReviewRequest struct {
	ProductID int    `json:"productId"`
	UserID    int    `json:"userId"`
	Comment   string `json:"comment"`
	Rating    int    `json:"rating"`
}
