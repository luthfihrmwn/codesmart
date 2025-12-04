#!/bin/bash

echo "========================================="
echo "  Creating Analytics Data for Hasan"
echo "========================================="

# Login as guru (assessor)
echo "📝 Logging in as guru..."
GURU_TOKEN=$(curl -s -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"guru","password":"guru123"}' | python3 -c "import sys, json; print(json.load(sys.stdin)['data']['token'])" 2>/dev/null)

echo "✅ Guru token obtained"

# Login as hasan (student)
echo "📝 Logging in as hasan..."
HASAN_TOKEN=$(curl -s -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"hasan","password":"hasan123"}' | python3 -c "import sys, json; print(json.load(sys.stdin)['data']['token'])" 2>/dev/null)

echo "✅ Hasan token obtained (User ID: 5)"

# Get modules
echo ""
echo "📚 Getting modules..."
MODULES=$(curl -s -X GET "http://localhost:5000/api/v1/modules" \
  -H "Authorization: Bearer $GURU_TOKEN")

MODULE_FUND=$(echo $MODULES | python3 -c "import sys, json; data=json.load(sys.stdin); modules=[m for m in data.get('data', {}).get('modules', []) if m.get('level')=='fundamental']; print(modules[0]['id'] if modules else '')" 2>/dev/null)

MODULE_INTER=$(echo $MODULES | python3 -c "import sys, json; data=json.load(sys.stdin); modules=[m for m in data.get('data', {}).get('modules', []) if m.get('level')=='intermediate']; print(modules[0]['id'] if modules else '')" 2>/dev/null)

MODULE_ADV=$(echo $MODULES | python3 -c "import sys, json; data=json.load(sys.stdin); modules=[m for m in data.get('data', {}).get('modules', []) if m.get('level')=='advance']; print(modules[0]['id'] if modules else '')" 2>/dev/null)

echo "✅ Module IDs: Fundamental=$MODULE_FUND, Intermediate=$MODULE_INTER, Advance=$MODULE_ADV"

# Create dummy file
echo ""
echo "📝 Creating test submission files..."
mkdir -p /tmp/test-submissions
echo "// Test submission content - Sample JavaScript code
function calculateSum(a, b) {
    return a + b;
}
console.log(calculateSum(5, 3));" > /tmp/test-submissions/submission.js

echo "✅ Test file created"

# Create assignments and submissions
echo ""
echo "📝 Creating assignments and submissions..."

# Function to create assignment, submit, and grade
create_and_submit() {
    MODULE_ID=$1
    TITLE=$2
    SCORE=$3

    # Create assignment
    ASSIGNMENT=$(curl -s -X POST http://localhost:5000/api/v1/assignments \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer $GURU_TOKEN" \
      -d "{
        \"module_id\": $MODULE_ID,
        \"title\": \"$TITLE\",
        \"description\": \"Analytics test assignment\",
        \"due_date\": \"2025-12-15T23:59:59\",
        \"max_score\": 100
      }")

    ASSIGNMENT_ID=$(echo $ASSIGNMENT | python3 -c "import sys, json; data=json.load(sys.stdin); print(data.get('data', {}).get('assignment', {}).get('id', data.get('data', {}).get('id', '')))" 2>/dev/null)

    if [ ! -z "$ASSIGNMENT_ID" ]; then
        echo "  ✅ Created assignment: $TITLE (ID: $ASSIGNMENT_ID)"

        # Submit as hasan
        SUBMISSION=$(curl -s -X POST http://localhost:5000/api/v1/submissions \
          -H "Authorization: Bearer $HASAN_TOKEN" \
          -F "assignment_id=$ASSIGNMENT_ID" \
          -F "file=@/tmp/test-submissions/submission.js")

        SUBMISSION_ID=$(echo $SUBMISSION | python3 -c "import sys, json; data=json.load(sys.stdin); print(data.get('data', {}).get('submission', {}).get('id', data.get('data', {}).get('id', '')))" 2>/dev/null)

        if [ ! -z "$SUBMISSION_ID" ]; then
            echo "  ✅ Hasan submitted (Submission ID: $SUBMISSION_ID)"

            # Grade the submission
            GRADE=$(curl -s -X PUT "http://localhost:5000/api/v1/submissions/$SUBMISSION_ID/grade" \
              -H "Content-Type: application/json" \
              -H "Authorization: Bearer $GURU_TOKEN" \
              -d "{
                \"score\": $SCORE,
                \"feedback\": \"Good work! Score: $SCORE/100\"
              }")

            echo "  ✅ Graded with score: $SCORE/100"
        fi
    fi
}

# Create 3 assignments with different scores
create_and_submit $MODULE_FUND "Fundamental Assignment 1" 85
create_and_submit $MODULE_FUND "Fundamental Assignment 2" 92
create_and_submit $MODULE_INTER "Intermediate Assignment 1" 78
create_and_submit $MODULE_INTER "Intermediate Assignment 2" 88
create_and_submit $MODULE_ADV "Advance Assignment 1" 95

echo ""
echo "========================================="
echo "  Verifying Analytics Data"
echo "========================================="

# Test analytics API
curl -s -X GET "http://localhost:5000/api/v1/analytics/dashboard" \
  -H "Authorization: Bearer $GURU_TOKEN" | python3 -m json.tool

echo ""
echo "========================================="
echo "✅ Analytics data created successfully!"
echo "🌐 Open: http://localhost:8080/src/pages/assessor/analytics-sidebar.html"
echo "🔑 Login as: guru / guru123"
echo "📊 Data for student: hasan (5 submissions graded)"
echo "========================================="
