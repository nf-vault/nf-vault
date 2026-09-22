#!/bin/sh

mkdir -p nginx-conf/certs

if [ ! -f nginx-conf/certs/selfsigned.crt ] || [ ! -f nginx-conf/certs/selfsigned.key ]; then
    echo "Сертификаты не найдены. Генерируем новые."
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
      -keyout nginx-conf/certs/selfsigned.key \
      -out nginx-conf/certs/selfsigned.crt \
      -subj "/C=RU/ST=Moscow/L=Moscow/O=Dev/OU=IT/CN=localhost"
else
    echo "Сертификаты уже существуют. Пропускаем генерацию."
fi