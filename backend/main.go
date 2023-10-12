package main

import (
	"log"
)

func main() {
	poolSize := 8
	listenAddr := ":8080"

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

	routes := []HandlerFuncPair{
		{"/health", MakeHTTPHandler(s.HealthCheck, workerPool)},
		{"/api/login", MakeHTTPHandler(s.HandleUserLogin, workerPool)},
		{"/api/users", MakeHTTPHandler(s.HandleUser, workerPool)},
		{"/api/users/verify", MakeHTTPHandler(s.HandleVerifyUser, workerPool)},
		{"/api/users/{id}", withJWTAuth(MakeHTTPHandler(s.HandleUserByID, workerPool), s.store)},
		{"/api/users/{id}/products", withJWTAuth(MakeHTTPHandler(s.HandleUserProducts, workerPool), s.store)},
		{"/api/products", MakeHTTPHandler(s.HandleProduct, workerPool)},
		{"/api/products/{id}", MakeHTTPHandler(s.HandleProductByID, workerPool)},
		{"/api/analytics", MakeHTTPHandler(s.HandlePageViews, workerPool)},
	}

	for _, route := range routes {
		log.Println("Route:", route.Route)
	}

	s.Start(routes)
}
