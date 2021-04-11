#!/bin/bash

set -e

cd angular
npm install
npm run-script build
cd ..
docker-compose -f docker-compose-test.yml up --build -d
