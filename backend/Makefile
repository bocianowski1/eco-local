build: 
	@go build -o bin/backend

run: build
	@./bin/backend

test:
	@go test -v ./...

apply-infra:
	@cd terraform && bash apply.sh