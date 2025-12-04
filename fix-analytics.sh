#!/bin/bash

echo "========================================="
echo "  Fix Analytics - Creating Test Data"
echo "========================================="

# Login as admin
echo "📝 Logging in as admin..."
ADMIN_TOKEN=$(curl -s -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' | python3 -c "import sys, json; print(json.load(sys.stdin)['data']['token'])" 2>/dev/null)

echo "✅ Admin token obtained"

# Login as guru (assessor)
GURU_TOKEN=$(curl -s -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"guru","password":"guru123"}' | python3 -c "import sys, json; print(json.load(sys.stdin)['data']['token'])" 2>/dev/null)

echo "✅ Guru token obtained"

# Create 3 test students
echo ""
echo "📝 Creating test students..."
for i in 1 2 3; do
    STUDENT=$(curl -s -X POST http://localhost:5000/api/v1/admin/users \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer $ADMIN_TOKEN" \
      -d "{
        \"username\": \"student$i\",
        \"email\": \"student$i@test.com\",
        \"password\": \"test123\",
        \"name\": \"Test Student $i\",
        \"role\": \"student\",
        \"current_level\": \"fundamental\",
        \"pretest_score\": $((70 + i * 5))
      }")

    STUDENT_ID=$(echo $STUDENT | python3 -c "import sys, json; data=json.load(sys.stdin); print(data.get('data', {}).get('user', {}).get('id', ''))" 2>/dev/null)
    echo "✅ Created student$i (ID: $STUDENT_ID)"
done

# Get first module
MODULE_ID=$(curl -s -X GET "http://localhost:5000/api/v1/modules" \
  -H "Authorization: Bearer $GURU_TOKEN" | python3 -c "import sys, json; data=json.load(sys.stdin); modules=data.get('data', {}).get('modules', []); print(modules[0]['id'] if modules else '')" 2>/dev/null)

echo ""
echo "📝 Using module ID: $MODULE_ID"

# Create test assignment
echo "📝 Creating test assignment..."
ASSIGNMENT=$(curl -s -X POST http://localhost:5000/api/v1/assignments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $GURU_TOKEN" \
  -d "{
    \"module_id\": $MODULE_ID,
    \"title\": \"Test Assignment for Analytics\",
    \"description\": \"This assignment is created to populate analytics data\",
    \"due_date\": \"2025-12-10T23:59:59\",
    \"max_score\": 100
  }")

ASSIGNMENT_ID=$(echo $ASSIGNMENT | python3 -c "import sys, json; data=json.load(sys.stdin); print(data.get('data', {}).get('assignment', {}).get('id', data.get('data', {}).get('id', '')))" 2>/dev/null)

if [ -z "$ASSIGNMENT_ID" ]; then
    # Get existing assignment
    ASSIGNMENT_ID=$(curl -s -X GET "http://localhost:5000/api/v1/assignments" \
      -H "Authorization: Bearer $GURU_TOKEN" | python3 -c "import sys, json; data=json.load(sys.stdin); assignments=data.get('data', []); print(assignments[0]['id'] if assignments else '')" 2>/dev/null)
fi

echo "✅ Assignment ID: $ASSIGNMENT_ID"

# Submit and grade assignments for each student
echo ""
echo "📝 Creating submissions..."

# Create dummy file
mkdir -p /tmp/test-submissions
echo "Test submission content - Sample code" > /tmp/test-submissions/submission.txt

for i in 1 2 3; do
    # Login as student
    STUDENT_TOKEN=$(curl -s -X POST http://localhost:5000/api/v1/auth/login \
      -H "Content-Type: application/json" \
      -d "{\"username\":\"student$i\",\"password\":\"test123\"}" | python3 -c "import sys, json; print(json.load(sys.stdin)['data']['token'])" 2>/dev/null)

    if [ ! -z "$STUDENT_TOKEN" ]; then
        # Submit assignment
        SUBMISSION=$(curl -s -X POST http://localhost:5000/api/v1/submissions \
          -H "Authorization: Bearer $STUDENT_TOKEN" \
          -F "assignment_id=$ASSIGNMENT_ID" \
          -F "file=@/tmp/test-submissions/submission.txt")

        SUBMISSION_ID=$(echo $SUBMISSION | python3 -c "import sys, json; data=json.load(sys.stdin); print(data.get('data', {}).get('submission', {}).get('id', data.get('data', {}).get('id', '')))" 2>/dev/null)

        echo "  ✅ Student$i submitted (ID: $SUBMISSION_ID)"

        # Grade the submission
        if [ ! -z "$SUBMISSION_ID" ]; then
            SCORE=$((75 + i * 5))
            GRADE=$(curl -s -X PUT "http://localhost:5000/api/v1/submissions/$SUBMISSION_ID/grade" \
              -H "Content-Type: application/json" \
              -H "Authorization: Bearer $GURU_TOKEN" \
              -d "{
                \"score\": $SCORE,
                \"feedback\": \"Good work! Score: $SCORE\"
              }")

            echo "  ✅ Student$i graded with score: $SCORE"
        fi
    fi
done

echo ""
echo "========================================="
echo "  Verifying Analytics Data"
echo "========================================="

# Test analytics API
curl -s -X GET "http://localhost:5000/api/v1/analytics/dashboard" \
  -H "Authorization: Bearer $GURU_TOKEN" | python3 -m json.tool

echo ""
echo "========================================="
echo "✅ Done! Analytics data created."
echo "🌐 Open: http://localhost:8080/src/pages/assessor/analytics-sidebar.html"
echo "🔑 Login: guru / guru123"
echo "========================================="
