#!/bin/sh

# echo "Waiting for database"
# until pg_isready -h database -p 5432 -U "$(cat /run/secrets/db_user)"; do
#   sleep 2
# done

# echo "Database is ready!"
exec java -jar nfVault-0.0.1.jar  \
    --spring.datasource.username="$(cat "$DB_USER_FILE")" \
    --spring.datasource.password="$(cat "$DB_PASSWORD_FILE")"