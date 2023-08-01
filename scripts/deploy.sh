#!/bin/bash

cd /home/ubuntu/budget_app
set -a
source .env
aws ecr get-login-password --region eu-north-1 | sudo docker login --username AWS --password-stdin 071386689683.dkr.ecr.eu-north-1.amazonaws.com
docker compose -f docker-compose.production.yml down
docker compose -f docker-compose.production.yml pull
docker compose -f docker-compose.production.yml up