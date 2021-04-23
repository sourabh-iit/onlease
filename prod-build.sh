#!/bin/bash

set -e

git pull origin master

cd angular
npm install
npm run-script build
cd ..

docker-compose -p onlease_prod -f docker-compose-prod.yml up --build -d
