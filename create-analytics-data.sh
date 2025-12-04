#!/bin/bash

echo "========================================="
echo "  Creating Analytics Dummy Data"
echo "========================================="

# Login to get token
echo "📝 Logging in as guru..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"guru","password":"guru123"}')

TOKEN=$(echo $LOGIN_RESPONSE | python3 -c "import sys, json; print(json.load(sys.stdin)['data']['token'])" 2>/dev/null)

if [ -z "$TOKEN" ]; then
    echo "❌ Failed to get token"
    echo $LOGIN_RESPONSE
    exit 1
fi

echo "✅ Token obtained"

# Create a test student if not exists
echo "📝 Creating test student..."
STUDENT_RESPONSE=$(curl -s -X POST http://localhost:5000/api/v1/admin/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "username": "student_test",
    "email": "student.test@codesmart.com",
    "password": "test123",
    "name": "Test Student",
    "role": "student",
    "current_level": "fundamental",
    "pretest_score": 75
  }')

echo $STUDENT_RESPONSE | python3 -m json.tool 2>/dev/null || echo $STUDENT_RESPONSE

# Get student ID
STUDENT_ID=$(echo $STUDENT_RESPONSE | python3 -c "import sys, json; data=json.load(sys.stdin); print(data.get('data', {}).get('user', {}).get('id', ''))" 2>/dev/null)

if [ -z "$STUDENT_ID" ]; then
    echo "⚠️ Student might already exist, trying to find existing student..."
    # Get existing students
    STUDENTS=$(curl -s -X GET "http://localhost:5000/api/v1/admin/users?role=student&limit=1" \
      -H "Authorization: Bearer $TOKEN")
    STUDENT_ID=$(echo $STUDENTS | python3 -c "import sys, json; data=json.load(sys.stdin); users=data.get('data', {}).get('users', []); print(users[0]['id'] if users else '')" 2>/dev/null)
fi

echo "✅ Student ID: $STUDENT_ID"

# Get modules
echo "📚 Getting modules..."
MODULES=$(curl -s -X GET "http://localhost:5000/api/v1/modules" \
  -H "Authorization: Bearer $TOKEN")

MODULE_FUND=$(echo $MODULES | python3 -c "import sys, json; data=json.load(sys.stdin); modules=[m for m in data.get('data', {}).get('modules', []) if m.get('level')=='fundamental']; print(modules[0]['id'] if modules else '')" 2>/dev/null)

echo "✅ Module ID (Fundamental): $MODULE_FUND"

# Create assignment
echo "📝 Creating test assignment..."
ASSIGNMENT=$(curl -s -X POST http://localhost:5000/api/v1/assignments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{
    \"module_id\": $MODULE_FUND,
    \"title\": \"Analytics Test Assignment\",
    \"description\": \"This is a test assignment for analytics\",
    \"due_date\": \"2025-12-10\",
    \"max_score\": 100
  }")

ASSIGNMENT_ID=$(echo $ASSIGNMENT | python3 -c "import sys, json; data=json.load(sys.stdin); print(data.get('data', {}).get('assignment', {}).get('id', ''))" 2>/dev/null)

if [ -z "$ASSIGNMENT_ID" ]; then
    echo "⚠️ Failed to create assignment, trying to get existing..."
    ASSIGNMENTS=$(curl -s -X GET "http://localhost:5000/api/v1/assignments?module_id=$MODULE_FUND&limit=1" \
      -H "Authorization: Bearer $TOKEN")
    ASSIGNMENT_ID=$(echo $ASSIGNMENTS | python3 -c "import sys, json; data=json.load(sys.stdin); assignments=data.get('data', []); print(assignments[0]['id'] if assignments else '')" 2>/dev/null)
fi

echo "✅ Assignment ID: $ASSIGNMENT_ID"

# Create submissions and grade them
echo "📝 Creating and grading submissions..."

# Create submission files directory
mkdir -p /tmp/dummy-submissions
echo "Test submission content" > /tmp/dummy-submissions/test1.txt

# Submit assignment as student (need student token)
STUDENT_LOGIN=$(curl -s -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"siswa","password":"siswa123"}')

STUDENT_TOKEN=$(echo $STUDENT_LOGIN | python3 -c "import sys, json; print(json.load(sys.stdin)['data']['token'])" 2>/dev/null)

if [ ! -z "$STUDENT_TOKEN" ]; then
    echo "✅ Student token obtained"

    # Submit assignment
    SUBMISSION=$(curl -s -X POST http://localhost:5000/api/v1/submissions \
      -H "Content-Type: multipart/form-data" \
      -H "Authorization: Bearer $STUDENT_TOKEN" \
      -F "assignment_id=$ASSIGNMENT_ID" \
      -F "file=@/tmp/dummy-submissions/test1.txt")

    SUBMISSION_ID=$(echo $SUBMISSION | python3 -c "import sys, json; data=json.load(sys.stdin); print(data.get('data', {}).get('submission', {}).get('id', ''))" 2>/dev/null)

    echo "✅ Submission ID: $SUBMISSION_ID"

    # Grade the submission
    if [ ! -z "$SUBMISSION_ID" ]; then
        GRADE=$(curl -s -X PUT "http://localhost:5000/api/v1/submissions/$SUBMISSION_ID/grade" \
          -H "Content-Type: application/json" \
          -H "Authorization: Bearer $TOKEN" \
          -d '{
            "score": 85,
            "feedback": "Good work! Keep it up."
          }')

        echo "✅ Graded submission"
        echo $GRADE | python3 -m json.tool 2>/dev/null || echo $GRADE
    fi
fi

echo ""
echo "========================================="
echo "  Verifying Analytics Data"
echo "========================================="

# Test analytics API
echo "📊 Testing Analytics Dashboard..."
curl -s -X GET "http://localhost:5000/api/v1/analytics/dashboard" \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool

echo ""
echo "✅ Done! Check the analytics page now."
echo "🌐 http://localhost:8080/src/pages/assessor/analytics-sidebar.html"
