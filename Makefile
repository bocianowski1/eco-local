client:
	@cd frontend && npm run dev

server:
	@cd backend && docker compose up --build

apply:
	@cd backend/terraform && bash apply.sh