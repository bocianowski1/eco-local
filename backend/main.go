package main

import (
	"log"
	"os"
)

func main() {
	poolSize := 8
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

	workerPool := NewWorkerPool(poolSize)
	defer workerPool.Shutdown()
	s := NewServer(listenAddr, store)

	s.Start([]HandlerFuncPair{
		{"/api/accounts", MakeHTTPHandler(s.HandleUser, workerPool)},
		{"/api/accounts/{id}", withJWTAuth(MakeHTTPHandler(s.HandleUserByID, workerPool), s.store)},
		{"/api/accounts/{id}/products", withJWTAuth(MakeHTTPHandler(s.HandleUserProducts, workerPool), s.store)},
		{"/api/products", MakeHTTPHandler(s.HandleProduct, workerPool)},
		{"/api/products/{id}", MakeHTTPHandler(s.HandleProductByID, workerPool)},
		{"/api/login", MakeHTTPHandler(s.HandleLogin, workerPool)},
	})
}
