package main

import (
	"encoding/json"
	"net/http"

	"github.com/gorilla/mux"
)

type Server struct {
	listenAddr string
	store      Storager
}

func NewServer(listenAddr string, store Storager) *Server {
	return &Server{
		listenAddr: listenAddr,
		store:      store,
	}
}

func (s *Server) Start(pairs []HandlerFuncPair) {
	router := mux.NewRouter()
	for _, pair := range pairs {
		router.HandleFunc(pair.Route, pair.Handler)
	}
	http.ListenAndServe(s.listenAddr, router)
}

func (s *Server) Shutdown() {}

func WriteJSON(w http.ResponseWriter, statusCode int, v interface{}) error {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	return json.NewEncoder(w).Encode(v)
}

func PermissionDenied(w http.ResponseWriter) {
	WriteJSON(w, http.StatusForbidden, HTTPError{
		StatusCode: http.StatusForbidden,
		Message:    "Permission denied",
	})
}

func MakeHTTPHandler(f HTTPHandler, wp *WorkerPool) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		wp.Enqueue(r)
		if err := f(w, r); err != nil {
			WriteJSON(w, http.StatusInternalServerError, &HTTPError{
				StatusCode: http.StatusInternalServerError,
				Message:    err.Error(),
			})
		}
	}
}
