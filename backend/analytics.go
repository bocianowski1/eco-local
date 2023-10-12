package main

import (
	"encoding/json"
	"fmt"
	"net/http"
)

func (s *Server) HandlePageViews(w http.ResponseWriter, r *http.Request) error {
	switch r.Method {
	case "GET":
		{
			return s.HandleGetPageViews(w, r)
		}
	case "POST":
		{
			return s.HandleCreatePageView(w, r)
		}
	default:
		{
			return WriteJSON(w, http.StatusMethodNotAllowed, fmt.Sprintf("Method %v not allowed", r.Method))
		}
	}
}

func (s *Server) HandleGetPageViews(w http.ResponseWriter, r *http.Request) error {
	pageViews, err := s.store.GetPageViews()
	if err != nil {
		return err
	}

	return WriteJSON(w, http.StatusOK, pageViews)
}

func (s *Server) HandleCreatePageView(w http.ResponseWriter, r *http.Request) error {
	createPageViewReq := &CreatePageViewRequest{}
	if err := json.NewDecoder(r.Body).Decode(&createPageViewReq); err != nil {
		return err
	}

	pageView := NewPageView(createPageViewReq.ProductID, createPageViewReq.UserID)

	id, err := s.store.CreatePageView(pageView)
	if err != nil {
		return err
	}

	return WriteJSON(w, http.StatusCreated, map[string]int{
		"id": id,
	})
}
