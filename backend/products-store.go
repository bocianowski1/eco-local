package main

import (
	"database/sql"
	"fmt"

	_ "github.com/lib/pq"
)

func (s *PostgresStore) createProductTable() error {
	query := `create table if not exists product (
		id serial primary key,
		title varchar(100),
        price serial,
        description varchar(100),
		account_id int,
		created_at timestamp,
        modified_at timestamp
	)`

	_, err := s.db.Exec(query)
	return err
}

func (s *PostgresStore) CreateProduct(prod *Product) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	query := `insert into product 
	(title, price, description, account_id, created_at, modified_at)
	values ($1, $2, $3, $4, $5, $6)`

	_, err := s.db.Query(
		query,
		prod.Title,
		prod.Price,
		prod.Description,
		prod.AccountID,
		prod.CreatedAt,
		prod.ModifiedAt,
	)

	return err
}

func (s *PostgresStore) UpdateProduct(prod *Product) error {
	return nil
}

func (s *PostgresStore) DeleteProduct(id int) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	_, err := s.db.Query("delete from product where id = $1", id)
	return err
}

func (s *PostgresStore) GetProductByID(id int) (*Product, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	rows, err := s.db.Query("select * from product where id = $1", id)
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

	rows, err := s.db.Query("select * from product")
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
		&prod.AccountID,
		&prod.CreatedAt,
		&prod.ModifiedAt,
	)

	return prod, err
}
