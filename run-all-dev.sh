#!/usr/bin/env bash
docker compose up --build -d
echo "Started docker services. Now start web-admin and mobile separately:"
echo "cd web-admin && npm install && npm run dev"
echo "cd mobile-app && npm install && npx expo start"
