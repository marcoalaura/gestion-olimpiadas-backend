#!/bin/bash
set -e

SERVER="backend_base_db";
PW="postgres";
DB="postgres";

echo "Deteniendo y removiendo instancia anterior de [$SERVER] e iniciando una nueva"
(docker kill $SERVER || :) && \
  (docker rm $SERVER || :) && \
  docker run --name $SERVER -e POSTGRES_PASSWORD=$PW \
  -e PGPASSWORD=$PW \
  -p 5432:5432 \
  -d postgres

# esperando contenedor
echo "esperando a que el pg-server [$SERVER] inicie";
sleep 3;

# creando la base de datos
echo "CREATE DATABASE $DB ENCODING 'UTF-8';" | docker exec -i $SERVER psql -U postgres
echo "\l" | docker exec -i $SERVER psql -U postgres

