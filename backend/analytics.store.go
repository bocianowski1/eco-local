package main

import "database/sql"

func (s *PostgresStore) GetPageViews() ([]*PageView, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	rows, err := s.db.Query("select * from page_views")
	if err != nil {
		return nil, err
	}

	defer rows.Close()

	pageViews := []*PageView{}
	for rows.Next() {
		pageView, err := scanIntoPageView(rows)
		if err != nil {
			return nil, err
		}
		pageViews = append(pageViews, pageView)
	}

	return pageViews, nil
}

func (s *PostgresStore) CreatePageView(pageView *PageView) (int, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	var id int
	err := s.db.QueryRow(`
        insert into page_views (product_id, user_id, created_at)
        values ($1, $2, $3)
        returning id
    `, pageView.ProductID, pageView.UserID, pageView.CreatedAt).Scan(&id)

	if err != nil {
		return 0, err
	}

	return id, nil
}

func scanIntoPageView(rows *sql.Rows) (*PageView, error) {
	pageView := &PageView{}
	err := rows.Scan(
		&pageView.ID,
		&pageView.ProductID,
		&pageView.UserID,
		&pageView.CreatedAt,
	)

	if err != nil {
		return nil, err
	}

	return pageView, nil
}

func (s *PostgresStore) GetReviews() ([]*Review, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	rows, err := s.db.Query("select * from reviews")
	if err != nil {
		return nil, err
	}

	defer rows.Close()

	reviews := []*Review{}
	for rows.Next() {
		review, err := scanIntoReview(rows)
		if err != nil {
			return nil, err
		}
		reviews = append(reviews, review)
	}

	return reviews, nil
}

func (s *PostgresStore) CreateReview(review *Review) (int, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	var id int
	err := s.db.QueryRow(`
		insert into reviews (product_id, user_id, comment, rating, created_at)
		values ($1, $2, $3, $4, $5)
		returning id
	`, review.ProductID, review.UserID, review.Comment, review.Rating, review.CreatedAt).Scan(&id)

	if err != nil {
		return 0, err
	}

	return id, nil
}

func scanIntoReview(rows *sql.Rows) (*Review, error) {
	review := &Review{}
	err := rows.Scan(
		&review.ID,
		&review.ProductID,
		&review.UserID,
		&review.Comment,
		&review.Rating,
		&review.CreatedAt,
	)

	if err != nil {
		return nil, err
	}

	return review, nil
}
