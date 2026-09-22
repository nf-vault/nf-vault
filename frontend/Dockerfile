FROM node:lts-alpine AS build-certs
WORKDIR /
RUN apk update && \
    apk add --no-cache openssl
COPY ./scripts/gen-selfsigned-certs.sh .
RUN source ./gen-selfsigned-certs.sh

FROM node:lts-alpine AS build-front
WORKDIR /app

COPY ./frontend .
RUN npm install && npm run build:prod

FROM nginx:1.29.4-alpine-slim

COPY ./nginx-conf/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build-certs /nginx-conf/certs /etc/nginx/certs
COPY --from=build-front /app/dist/ /var/www/html/main/

EXPOSE 80
EXPOSE 443