package main

import (
	"log"
	"os"
)

func main() {
	listenAddr := ":8080"
	if val, ok := os.LookupEnv("FUNCTIONS_CUSTOMHANDLER_PORT"); ok {
		listenAddr = ":" + val
	}

	store, err := NewPostgresStore()
	if err != nil {
		log.Fatal(err)
	}

	if err := store.Init(); err != nil {
		log.Fatal("init failed\n", err)
	}

	server := NewAPIServer(listenAddr, store)

	server.Run([]RouteHandlerPair{
		{"/api/accounts", makeHTTPHandleFunc(server.HandleAccount)},
		{"/api/accounts/{id}", withJWTAuth(makeHTTPHandleFunc(server.HandleAccountByID), server.store)},
		{"/api/accounts/{id}/products", withJWTAuth(makeHTTPHandleFunc(server.HandleAccountProducts), server.store)},
		{"/api/products", makeHTTPHandleFunc(server.HandleProduct)},
		{"/api/products/{id}", makeHTTPHandleFunc(server.HandleProductByID)},
	})
}
