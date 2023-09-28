package main

import (
	"database/sql"
	"fmt"

	_ "github.com/lib/pq"
)

func (s *PostgresStore) createAccountTable() error {
	query := `create table if not exists account (
		id serial primary key,
		first_name varchar(255),
		last_name varchar(255),
		number serial,
		balance serial,
		token varchar(255),
		role varchar(10),
		created_at timestamp
	)`

	_, err := s.db.Exec(query)
	return err
}

func (s *PostgresStore) CreateAccount(acc *Account) (int, error) {
	query := `insert into account 
	(first_name, last_name, number, balance, token, role, created_at)
	values ($1, $2, $3, $4, $5, $6, $7)`

	_, err := s.db.Query(
		query,
		acc.FirstName,
		acc.LastName,
		acc.Number,
		acc.Balance,
		acc.Token,
		acc.Role,
		acc.CreatedAt)

	rows, err := s.db.Query("select id from account where number = $1", acc.Number)
	if err != nil {
		return 0, err
	}

	defer rows.Close()

	for rows.Next() {
		var id int
		err := rows.Scan(&id)
		if err != nil {
			return 0, err
		}

		return id, nil
	}

	return 0, fmt.Errorf("Account with number %v not found", acc.Number)
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
	rows, err := s.db.Query("select * from account")
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

func scanIntoAccount(rows *sql.Rows) (*Account, error) {
	acc := &Account{}
	err := rows.Scan(
		&acc.ID,
		&acc.FirstName,
		&acc.LastName,
		&acc.Number,
		&acc.Balance,
		&acc.Token,
		&acc.Role,
		&acc.CreatedAt,
	)

	return acc, err
}
