build:
	@docker build --platform linux/amd64 -f Dockerfile -t rec .

run: build
	@echo -ne "\nRunning function"
	@docker rm -f recommender || true
	@docker run --platform linux/amd64 -v $(PWD):/app -p 7071:7071 \
           		--name recommender rec