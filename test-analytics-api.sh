#!/bin/bash

echo "Testing Analytics API..."
echo ""

# Wait for database
sleep 3

# Try login multiple times
for i in {1..5}; do
    echo "Login attempt $i..."
    RESPONSE=$(curl -s -X POST http://localhost:5000/api/v1/auth/login \
      -H "Content-Type: application/json" \
      -d '{"username":"guru","password":"guru123"}')

    if echo "$RESPONSE" | grep -q '"success":true'; then
        echo "✅ Login successful!"
        TOKEN=$(echo "$RESPONSE" | python3 -c "import sys, json; data=json.load(sys.stdin); print(data['data']['token'])" 2>/dev/null)

        if [ ! -z "$TOKEN" ]; then
            echo "✅ Token extracted"
            echo ""

            # Test Dashboard
            echo "=== Testing Dashboard ==="
            curl -s -X GET "http://localhost:5000/api/v1/analytics/dashboard" \
              -H "Authorization: Bearer $TOKEN" | python3 -m json.tool

            echo ""
            echo "=== Testing Grade Distribution ==="
            curl -s -X GET "http://localhost:5000/api/v1/analytics/grade-distribution" \
              -H "Authorization: Bearer $TOKEN" | python3 -m json.tool

            echo ""
            echo "✅ API Tests Complete!"
            exit 0
        fi
    fi

    echo "⏳ Retrying in 3 seconds..."
    sleep 3
done

echo "❌ Failed to login after 5 attempts"
exit 1
