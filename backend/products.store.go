package main

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/lib/pq"
)

func (s *PostgresStore) CreateProduct(prod *Product) (int, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	query := `insert into products 
	(title, price, description, category, user_id, created_at, modified_at)
	values ($1, $2, $3, $4, $5, $6, $7)
	returning id`

	var id int
	err := s.db.QueryRow(
		query,
		prod.Title,
		prod.Price,
		prod.Description,
		prod.Category,
		prod.UserID,
		prod.CreatedAt,
		prod.ModifiedAt,
	).Scan(&id)

	if err != nil {
		log.Println("Error creating product:", err)
		return 0, err
	}

	return id, nil
}

func (s *PostgresStore) UpdateProduct(prod *Product) error {
	return nil
}

func (s *PostgresStore) DeleteProduct(id int) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	_, err := s.db.Query("delete from products where id = $1", id)
	return err
}

func (s *PostgresStore) GetProductByID(id int) (*Product, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	rows, err := s.db.Query("select * from products where id = $1", id)
	if err != nil {
		return nil, err
	}

	defer rows.Close()

	for rows.Next() {
		return scanIntoProduct(rows)
	}
	return nil, fmt.Errorf("Product with id %v not found", id)
}

func (s *PostgresStore) GetProduct() ([]*Product, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	rows, err := s.db.Query("select * from products")
	if err != nil {
		return nil, err
	}

	defer rows.Close()

	products := []*Product{}
	for rows.Next() {
		prod, err := scanIntoProduct(rows)
		if err != nil {
			return nil, err
		}
		products = append(products, prod)
	}

	return products, nil
}

func scanIntoProduct(rows *sql.Rows) (*Product, error) {
	prod := &Product{}
	err := rows.Scan(
		&prod.ID,
		&prod.Title,
		&prod.Price,
		&prod.Description,
		&prod.Category,
		&prod.UserID,
		&prod.CreatedAt,
		&prod.ModifiedAt,
	)

	return prod, err
}
