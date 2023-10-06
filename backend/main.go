package main

import (
	"log"
	"os"
)

func main() {
	maxConcurrentRequests := 10
	listenAddr := ":8080"
	if val, ok := os.LookupEnv("FUNCTIONS_CUSTOMHANDLER_PORT"); ok {
		listenAddr = ":" + val
	}

	db, err := NewPostgresStore()
	if err != nil {
		log.Fatal(err)
	}

	if err := db.Init(); err != nil {
		log.Fatal("init failed\n", err)
	}

	s := NewAPIServer(listenAddr, db)

	s.Run([]RouteHandlerPair{
		{"/api/accounts", s.makeHTTPHandleFunc(s.HandleAccount)},
		{"/api/accounts/{id}", withJWTAuth(s.makeHTTPHandleFunc(s.HandleAccountByID), s.store)},
		{"/api/accounts/{id}/products", withJWTAuth(s.makeHTTPHandleFunc(s.HandleAccountProducts), s.store)},
		{"/api/products", s.makeHTTPHandleFunc(s.HandleProduct)},
		{"/api/products/{id}", s.makeHTTPHandleFunc(s.HandleProductByID)},
		{"/api/login", s.makeHTTPHandleFunc(s.HandleLogin)},
	}, maxConcurrentRequests)
}
