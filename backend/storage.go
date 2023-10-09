package main

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	"sync"
)

type Storager interface {
	// User
	CreateUser(*User) (int, error)
	UpdateUser(*User) error
	DeleteUser(int) error
	GetUser() ([]*User, error)
	GetUserProducts(int) ([]*Product, error)
	GetUserByID(int) (*User, error)
	GetUserByEmail(string) (*User, error)

	// Product
	CreateProduct(*Product) error
	UpdateProduct(*Product) error
	DeleteProduct(int) error
	GetProduct() ([]*Product, error)
	GetProductByID(int) (*Product, error)
}

type PostgresStore struct {
	db *sql.DB
	mu sync.Mutex
}

func NewPostgresStore() (*PostgresStore, error) {
	connStr := connectionString()
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
	var err error
	err = s.DropAllTables()
	if err != nil {
		log.Println("Error dropping tables")
		return err
	}

	err = s.CreateTables()
	if err != nil {
		log.Println("Error creating tables")
		return err
	}

	return nil
}

func (s *PostgresStore) DropAllTables() error {
	_, err := s.db.Exec(`
		DROP TABLE IF EXISTS users CASCADE;
	`)

	return err
}

func (s *PostgresStore) CreateTables() error {
	var err error
	_, err = s.db.Exec(`
		CREATE TABLE IF NOT EXISTS users (
			id SERIAL PRIMARY KEY,
			first_name VARCHAR(255) NOT NULL,
			last_name VARCHAR(255) NOT NULL,
			email VARCHAR(255) NOT NULL,
			password BYTEA NOT NULL,
			token VARCHAR(255) NOT NULL,
			premium BOOLEAN NOT NULL DEFAULT FALSE,

			created_at TIMESTAMP NOT NULL,
			modified_at TIMESTAMP NOT NULL
		);
	`)

	if err != nil {
		return err
	}

	return nil
}

func connectionString() string {
	var (
		host     = os.Getenv("DB_HOST")
		port     = os.Getenv("DB_PORT")
		user     = os.Getenv("DB_USER")
		password = os.Getenv("DB_PASSWORD")
		dbname   = os.Getenv("DB_NAME")
	)

	if host == "" || port == "" || user == "" || password == "" || dbname == "" {
		log.Println("Missing required environment variables")
		return "user=postgres dbname=db password=postgres host=host.docker.internal sslmode=disable"
	}
	return fmt.Sprintf("user=%s dbname=%s password=%s host=%s port=%s sslmode=disable", user, dbname, password, host, port)

}
