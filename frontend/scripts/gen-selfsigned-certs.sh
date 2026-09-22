#!/bin/sh

mkdir -p certs

if [ ! -f certs/selfsigned.crt ] || [ ! -f certs/selfsigned.key ]; then
    echo "Сертификаты не найдены. Генерируем новые."
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
      -keyout certs/selfsigned.key \
      -out certs/selfsigned.crt \
      -subj "/C=RU/ST=Moscow/L=Moscow/O=Dev/OU=IT/CN=localhost"
else
    echo "Сертификаты уже существуют. Пропускаем генерацию."
fi