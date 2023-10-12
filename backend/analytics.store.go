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
        INSERT INTO page_views (product_id, user_id, created_at)
        VALUES ($1, $2, $3)
        RETURNING id
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
