package main

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/lib/pq"
)

func (s *PostgresStore) createUserTable() error {
	query := `create table if not exists users (
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

func (s *PostgresStore) CreateUser(user *User) (int, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	query := `insert into users 
	(first_name, last_name, email, password, token, role, created_at, modified_at)
	values ($1, $2, $3, $4, $5, $6, $7, $8)`

	_, err := s.db.Query(
		query,
		user.FirstName,
		user.LastName,
		user.Email,
		user.Password,
		user.Token,
		user.Role,
		user.CreatedAt,
		user.ModifiedAt,
	)

	if err != nil {
		log.Println("Error creating user:", err)
		return 0, err
	}

	rows, err := s.db.Query("select id from users where email = $1", user.Email)
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

	return 0, fmt.Errorf("User with email %v not found", user.Email)
}

func (s *PostgresStore) UpdateUser(acc *User) error {
	return fmt.Errorf("Not implemented")
}

func (s *PostgresStore) DeleteUser(id int) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	_, err := s.db.Query("delete from users where id = $1", id)
	return err
}

func (s *PostgresStore) GetUserByID(id int) (*User, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	rows, err := s.db.Query("select * from users where id = $1", id)
	if err != nil {
		return nil, err
	}

	defer rows.Close()

	for rows.Next() {
		return scanIntoUser(rows)
	}
	return nil, fmt.Errorf("User with id %v not found", id)
}

func (s *PostgresStore) GetUser() ([]*User, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	rows, err := s.db.Query(`select * from users`)
	if err != nil {
		return nil, err
	}

	defer rows.Close()

	users := []*User{}
	for rows.Next() {
		user, err := scanIntoUser(rows)
		if err != nil {
			return nil, err
		}
		users = append(users, user)
	}

	return users, nil
}

func (s *PostgresStore) GetUserProducts(id int) ([]*Product, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	rows, err := s.db.Query("select * from product where user_id = $1", id)
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

func (s *PostgresStore) GetUserByEmail(email string) (*User, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	rows, err := s.db.Query("select * from users where email = $1", email)
	if err != nil {
		return nil, err
	}

	defer rows.Close()

	for rows.Next() {
		return scanIntoUser(rows)
	}
	return nil, fmt.Errorf("User with email %v not found", email)
}

func scanIntoUser(rows *sql.Rows) (*User, error) {
	user := &User{}
	err := rows.Scan(
		&user.ID,
		&user.FirstName,
		&user.LastName,
		&user.Email,
		&user.Password,
		&user.Token,
		&user.Role,
		&user.CreatedAt,
		&user.ModifiedAt,
	)

	return user, err
}
