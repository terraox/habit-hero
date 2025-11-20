#!/bin/bash

# Base URL
BASE_URL="http://localhost:8080/api/admin"
AUTH="admin@habithero.com:admin123"

echo "Testing Backend Endpoints..."

# 1. Dashboard
echo "GET /dashboard"
curl -u $AUTH -X GET $BASE_URL/dashboard
echo -e "\n"

# 2. Habits
echo "GET /habits"
curl -u $AUTH -X GET $BASE_URL/habits
echo -e "\n"

# 3. Habit Stats (assuming ID 1 exists from seeding)
echo "GET /habits/1/stats"
curl -u $AUTH -X GET $BASE_URL/habits/1/stats
echo -e "\n"

# 4. List Coupons
echo "GET /coupons"
curl -u $AUTH -X GET $BASE_URL/coupons
echo -e "\n"

# 5. Create Coupon
echo "POST /coupons"
curl -u $AUTH -X POST $BASE_URL/coupons \
  -H "Content-Type: application/json" \
  -d '{"code":"TEST50", "description":"50% off test", "percentOff":50, "active":true}'
echo -e "\n"

# 6. Update Coupon (assuming ID 1 exists)
echo "PUT /coupons/1"
curl -u $AUTH -X PUT $BASE_URL/coupons/1 \
  -H "Content-Type: application/json" \
  -d '{"code":"WELCOME20_UPDATED", "description":"Updated desc", "percentOff":25, "active":true}'
echo -e "\n"

# 7. Delete Coupon (assuming ID 1 exists)
echo "DELETE /coupons/1"
curl -u $AUTH -X DELETE $BASE_URL/coupons/1
echo -e "\n"

# 8. List Users
echo "GET /users"
curl -u $AUTH -X GET $BASE_URL/users
echo -e "\n"

echo "Done."
