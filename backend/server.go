package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
)

func NewAPIServer(listenAddr string, store Storager) *APIServer {
	return &APIServer{
		listenAddr: listenAddr,
		store:      store,
		rw:         &ResponseWriter{},
	}
}

func (s *APIServer) Run(rhp []RouteHandlerPair, maxConcurrentRequests int) {
	router := mux.NewRouter()

	for _, pair := range rhp {
		router.HandleFunc(pair.route, pair.handler)
	}

	requestChannel := make(chan *http.Request, maxConcurrentRequests)

	for i := 0; i < maxConcurrentRequests; i++ {
		go func() {
			for r := range requestChannel {
				router.ServeHTTP(s.rw, r)
			}
		}()
	}

	log.Println(fmt.Sprintf("Running on port http://localhost%v", s.listenAddr))
	http.ListenAndServe(s.listenAddr, http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		requestChannel <- r
	}))
}

func WriteJSON(w http.ResponseWriter, statusCode int, v any) error {
	log.Println("Writing JSON")
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	return json.NewEncoder(w).Encode(v)
}

func permissionDenied(w http.ResponseWriter) {
	WriteJSON(w, http.StatusForbidden, APIError{
		Error: "Permission denied",
	})
}

func (s *APIServer) makeHTTPHandleFunc(f APIFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if err := f(w, r); err != nil {
			s.rw.WriteJSON(http.StatusBadRequest, APIError{
				Error: err.Error(),
			})
		}
	}
}

func getID(r *http.Request) (int, error) {
	idString := mux.Vars(r)["id"]

	id, err := strconv.Atoi(idString)
	if err != nil {
		return id, fmt.Errorf("ID %v incorrect format", idString)
	}
	return id, nil
}
