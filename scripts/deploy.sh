#!/bin/bash

cd /home/ubuntu/budget-app
set -a
source .env
git checkout main
git fetch --all
git reset --hard origin/main
git pull origin main