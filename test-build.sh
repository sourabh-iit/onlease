#!/bin/bash

set -e

cd angular
npm install
npm run-script build
cd ..
docker-compose -p onlease_test -f docker-compose-test.yml up --build -d
