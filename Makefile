client:
	@cd frontend && npm run dev

server:
	@cd backend && docker compose up --build

email:
	@cd functions/email && npm start

apply:
	@cd backend/terraform && bash apply.sh