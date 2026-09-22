STACK_NAME=nfVault

BACKEND_DOCKERFILE=./backend/Dockerfile 
BACKEND_IMAGE_NAME=nf-vault-backend
BACKEND_DEV_IMAGE_NAME=nf-vault-backend-dev
BACKEND_PATH=./backend

FRONTEND_DOCKERFILE=./frontend/Dockerfile
FRONTEND_IMAGE_NAME=nf-vault-frontend
FRONTEND_PATH=./frontend

PROD_COMPOSE=docker-compose.yaml
DEV_COMPOSE=docker-compose.dev.yaml

run: build-all deploy
	@echo "Running"

stop:
	docker stack rm $(STACK_NAME)
	@echo "Stopped"

restart: stop run

build-backend:
	docker buildx build \
		-f $(BACKEND_DOCKERFILE) \
		-t $(BACKEND_IMAGE_NAME) $(BACKEND_PATH)

build-frontend:
	docker buildx build \
		-f $(FRONTEND_DOCKERFILE) \
		-t $(FRONTEND_IMAGE_NAME) $(FRONTEND_PATH)

build-all:
	@echo "Parallel build started"
	@$(MAKE) -j2 build-backend build-frontend
	@echo "Parallel build completed"

deploy:
	docker stack deploy \
		-c ${PROD_COMPOSE} \
		$(STACK_NAME)

frontend-dev:
	cd ./frontend/frontend && \
		npm start

build-backend-dev:
	docker buildx build \
		-f $(BACKEND_DOCKERFILE) \
		-t $(BACKEND_DEV_IMAGE_NAME) $(BACKEND_PATH)

backend-dev: build-backend-dev
	docker compose -f ${DEV_COMPOSE} up --force-recreate
