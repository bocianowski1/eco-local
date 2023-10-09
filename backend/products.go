package main

import (
	"encoding/json"
	"fmt"
	"net/http"
)

func (s *Server) HandleProduct(w http.ResponseWriter, r *http.Request) error {
	switch r.Method {
	case "GET":
		{
			return s.HandleGetProduct(w, r)
		}
	case "POST":
		{
			return s.HandleCreateProduct(w, r)
		}
	default:
		{
			return WriteJSON(w, http.StatusMethodNotAllowed, fmt.Sprintf("Method %v not allowed", r.Method))
		}
	}
}

func (s *Server) HandleProductByID(w http.ResponseWriter, r *http.Request) error {
	id, err := getID(r)
	if err != nil {
		return err
	}

	switch r.Method {
	case "GET":
		{
			product, err := s.store.GetProductByID(id)
			if err != nil {
				return err
			}

			return WriteJSON(w, http.StatusOK, product)
		}
	case "DELETE":
		{
			if err := s.store.DeleteProduct(id); err != nil {
				return err
			}

			return WriteJSON(w, http.StatusOK, map[string]int{
				"deleted": id,
			})
		}
	default:
		{
			return WriteJSON(w, http.StatusMethodNotAllowed, fmt.Sprintf("Method %v not allowed", r.Method))

		}
	}
}

func (s *Server) HandleGetProduct(w http.ResponseWriter, r *http.Request) error {
	products, err := s.store.GetProduct()
	if err != nil {
		return err
	}

	return WriteJSON(w, http.StatusOK, products)
}

func (s *Server) HandleUserProducts(w http.ResponseWriter, r *http.Request) error {
	id, err := getID(r)
	if err != nil {
		return err
	}

	products, err := s.store.GetUserProducts(id)
	if err != nil {
		return err
	}

	return WriteJSON(w, http.StatusOK, products)
}

func (s *Server) HandleCreateProduct(w http.ResponseWriter, r *http.Request) error {
	createProductRequest := &CreateProductRequest{}
	if err := json.NewDecoder(r.Body).Decode(createProductRequest); err != nil {
		return err
	}
	defer r.Body.Close()

	product := NewProduct(
		createProductRequest.Title,
		createProductRequest.Description,
		createProductRequest.Price,
		createProductRequest.UserID,
	)

	if product.Title == "" || product.Description == "" || product.Price < 0 {
		return WriteJSON(w, http.StatusBadRequest, "Bad request")
	}

	if err := s.store.CreateProduct(product); err != nil {
		return err
	}

	return WriteJSON(w, http.StatusCreated, product)
}
