package main

import (
	"log"
	"sync"
)

func (s *PostgresStore) Seed() error {
	var wg sync.WaitGroup
	wg.Add(2)
	go func() {
		defer wg.Done()
		user := NewUser("Test", "User", "test@user.com", "hei")
		_, err := s.CreateUser(user)
		if err != nil {
			log.Println(err)
		}
	}()

	go func() {
		defer wg.Done()
		var products []*Product
		products = append(products, NewProduct("Macbook Pro", "Really good mac please buy it", OTHER, 9999, 1))
		products = append(products, NewProduct("iPhone 15", "The latest iPhone, come on you need that", PHONE, 14999, 1))
		products = append(products, NewProduct("Flaske", "Glassflaske av glass som du kan drikke av", OTHER, 120, 1))

		for _, product := range products {
			_, err := s.CreateProduct(product)
			if err != nil {
				log.Println(err)
			}
		}
	}()

	wg.Wait()

	return nil

}
