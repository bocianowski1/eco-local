package main

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/lib/pq"
)

func (s *PostgresStore) createAccountTable() error {
	query := `create table if not exists account (
		id serial primary key,
		first_name varchar(255),
		last_name varchar(255),
		email varchar(255),
		password bytea,
		token varchar(255),
		role varchar(10),
		created_at timestamp,
		modified_at timestamp
	)`

	_, err := s.db.Exec(query)
	return err
}

func (s *PostgresStore) CreateAccount(acc *Account) (int, error) {
	query := `insert into account 
	(first_name, last_name, email, password, token, role, created_at, modified_at)
	values ($1, $2, $3, $4, $5, $6, $7, $8)`

	_, err := s.db.Query(
		query,
		acc.FirstName,
		acc.LastName,
		acc.Email,
		acc.Password,
		acc.Token,
		acc.Role,
		acc.CreatedAt,
		acc.ModifiedAt,
	)

	if err != nil {
		log.Println("Error creating account:", err)
		return 0, err
	}

	rows, err := s.db.Query("select id from account where email = $1", acc.Email)
	if err != nil {
		return 0, err
	}

	defer rows.Close()

	i := 0
	for rows.Next() {
		i++
		var id int
		err := rows.Scan(&id)
		if err != nil {
			return 0, err
		}

		return id, nil
	}

	// if i == 0 {
	// 	log.Println("Eh")
	// 	return 1, nil
	// }

	return 0, fmt.Errorf("Account with email %v not found", acc.Email)
}

func (s *PostgresStore) UpdateAccount(acc *Account) error {
	return fmt.Errorf("Not implemented")
}

func (s *PostgresStore) DeleteAccount(id int) error {
	_, err := s.db.Query("delete from account where id = $1", id)
	return err
}

func (s *PostgresStore) GetAccountByID(id int) (*Account, error) {
	rows, err := s.db.Query("select * from account where id = $1", id)
	if err != nil {
		return nil, err
	}

	defer rows.Close()

	for rows.Next() {
		return scanIntoAccount(rows)
	}
	return nil, fmt.Errorf("Account with id %v not found", id)
}

func (s *PostgresStore) GetAccount() ([]*Account, error) {
	rows, err := s.db.Query(`select * from account`)
	if err != nil {
		return nil, err
	}

	defer rows.Close()

	accounts := []*Account{}
	for rows.Next() {
		acc, err := scanIntoAccount(rows)
		if err != nil {
			return nil, err
		}
		accounts = append(accounts, acc)
	}

	return accounts, nil
}

func (s *PostgresStore) GetAccountProducts(id int) ([]*Product, error) {
	rows, err := s.db.Query("select * from product where account_id = $1", id)
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

func (s *PostgresStore) GetAccountByEmail(email string) (*Account, error) {
	rows, err := s.db.Query("select * from account where email = $1", email)
	if err != nil {
		return nil, err
	}

	defer rows.Close()

	for rows.Next() {
		return scanIntoAccount(rows)
	}
	return nil, fmt.Errorf("Account with email %v not found", email)
}

func scanIntoAccount(rows *sql.Rows) (*Account, error) {
	acc := &Account{}
	err := rows.Scan(
		&acc.ID,
		&acc.FirstName,
		&acc.LastName,
		&acc.Email,
		&acc.Password,
		&acc.Token,
		&acc.Role,
		&acc.CreatedAt,
		&acc.ModifiedAt,
	)

	return acc, err
}
