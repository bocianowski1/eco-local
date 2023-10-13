package main

import (
	"encoding/json"
	"fmt"
	"net/http"
)

func (s *Server) HandlePageviews(w http.ResponseWriter, r *http.Request) error {
	switch r.Method {
	case "GET":
		{
			return s.HandleGetPageviews(w, r)
		}
	case "POST":
		{
			return s.HandleCreatePageview(w, r)
		}
	default:
		{
			return WriteJSON(w, http.StatusMethodNotAllowed, fmt.Sprintf("Method %v not allowed", r.Method))
		}
	}
}

func (s *Server) HandleGetPageviews(w http.ResponseWriter, r *http.Request) error {
	pageViews, err := s.store.GetPageViews()
	if err != nil {
		return err
	}

	return WriteJSON(w, http.StatusOK, pageViews)
}

func (s *Server) HandleCreatePageview(w http.ResponseWriter, r *http.Request) error {
	createPageViewReq := &CreatePageViewRequest{}
	if err := json.NewDecoder(r.Body).Decode(&createPageViewReq); err != nil {
		return err
	}

	pageView := NewPageView(createPageViewReq.ProductID, createPageViewReq.UserID)

	id, err := s.store.CreatePageView(pageView)
	if err != nil {
		return err
	}

	return WriteJSON(w, http.StatusOK, map[string]int{
		"id": id,
	})
}

func (s *Server) HandleReviews(w http.ResponseWriter, r *http.Request) error {
	switch r.Method {
	case "GET":
		{
			return s.HandleGetReviews(w, r)
		}
	case "POST":
		{
			return s.HandleCreateReview(w, r)
		}
	default:
		{
			return WriteJSON(w, http.StatusMethodNotAllowed, fmt.Sprintf("Method %v not allowed", r.Method))
		}
	}
}

func (s *Server) HandleGetReviews(w http.ResponseWriter, r *http.Request) error {
	reviews, err := s.store.GetReviews()
	if err != nil {
		return err
	}

	return WriteJSON(w, http.StatusOK, reviews)
}

func (s *Server) HandleCreateReview(w http.ResponseWriter, r *http.Request) error {
	createReviewReq := &CreateReviewRequest{}
	if err := json.NewDecoder(r.Body).Decode(&createReviewReq); err != nil {
		return err
	}

	review := NewReview(createReviewReq.ProductID, createReviewReq.UserID, createReviewReq.Comment, createReviewReq.Rating)

	id, err := s.store.CreateReview(review)
	if err != nil {
		return err
	}

	return WriteJSON(w, http.StatusOK, map[string]int{
		"id": id,
	})
}
