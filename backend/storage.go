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
	CreateProduct(*Product) (int, error)
	UpdateProduct(*Product) error
	DeleteProduct(int) error
	GetProduct() ([]*Product, error)
	GetProductByID(int) (*Product, error)

	// Analytics
	GetPageViews() ([]*PageView, error)
	CreatePageView(*PageView) (int, error)
	GetPageviewsForProduct(int) ([]int, error)
	GetReviews() ([]*Review, error)
	CreateReview(*Review) (int, error)
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

	err = s.Seed()
	if err != nil {
		log.Println("Error seeding")
		return err
	}

	return nil
}

func (s *PostgresStore) DropAllTables() error {
	_, err := s.db.Exec(`
		DROP TABLE IF EXISTS users CASCADE;
		DROP TABLE IF EXISTS products CASCADE;
		DROP TABLE IF EXISTS page_views CASCADE;
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
			verified BOOLEAN NOT NULL DEFAULT FALSE,

			created_at TIMESTAMP NOT NULL,
			modified_at TIMESTAMP NOT NULL
		);
	`)

	if err != nil {
		return err
	}
	_, err = s.db.Exec(`
		CREATE TABLE IF NOT EXISTS products (
			id SERIAL PRIMARY KEY,
			title VARCHAR(255) NOT NULL,
			price DECIMAL NOT NULL,
			description VARCHAR(255) NOT NULL,
			category VARCHAR(255) NOT NULL,
			user_id INT NOT NULL,

			created_at TIMESTAMP NOT NULL,
			modified_at TIMESTAMP NOT NULL
		);
	`)

	if err != nil {
		return err
	}

	_, err = s.db.Exec(`
		CREATE TABLE IF NOT EXISTS page_views (
			id SERIAL PRIMARY KEY,
			product_id INT NOT NULL,
			user_id INT NOT NULL,

			created_at TIMESTAMP NOT NULL
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
		return "user=postgres dbname=db password=postgres host=host.docker.internal port=5432 sslmode=disable"
	}
	return fmt.Sprintf("user=%s dbname=%s password=%s host=%s port=%s sslmode=disable", user, dbname, password, host, port)

}
