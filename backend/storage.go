package main

import (
	"database/sql"
	"log"
)

type Storager interface {
	// Account
	CreateAccount(*Account) (int, error)
	UpdateAccount(*Account) error
	DeleteAccount(int) error
	GetAccount() ([]*Account, error)
	GetAccountByID(int) (*Account, error)
	GetAccountProducts(int) ([]*Product, error)

	// Product
	CreateProduct(*Product) error
	UpdateProduct(*Product) error
	DeleteProduct(int) error
	GetProduct() ([]*Product, error)
	GetProductByID(int) (*Product, error)
}

type PostgresStore struct {
	db *sql.DB
}

func NewPostgresStore() (*PostgresStore, error) {
	connStr := "user=postgres dbname=db password=postgres sslmode=disable"
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Println("Could not connect")
		return nil, err
	}

	if err := db.Ping(); err != nil {
		log.Println("Could not ping db")
		return nil, err
	}

	return &PostgresStore{
		db: db,
	}, nil
}

func (s *PostgresStore) Init() error {
	err := s.createAccountTable()
	if err != nil {
		return err
	}
	err = s.createProductTable()
	if err != nil {
		return err
	}
	return nil
}
