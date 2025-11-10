# Assessor Data Seeding Script

## Overview

The `seed-assessor-data.js` script populates the database with comprehensive sample data for the assessor dashboard, including learning materials, submissions, and additional assignments.

## What it Seeds

### 1. Learning Materials (13 samples)
- **Class 6-10 for Fundamental Module**: Functions, Error Handling, Strings, Arrays, Best Practices
- **Class 6-8 for Intermediate Module**: Event Handling, Storage API, Form Validation
- **Class 6-10 for Advance Module**: Async Patterns, Modules, WeakMap/WeakSet, Generators, Testing

Each learning material includes:
- Title and description
- Rich content with theory and code examples
- Video URLs (YouTube links)
- Resource links (PDFs, PPTs, Code Examples, Documents)
- Duration and order information
- Published status

### 2. Additional Assignments (10 samples)
Distributed across all three modules with:
- Varied class numbers (6-10)
- Different deadline days (5-16 days)
- Mix of active/inactive status
- Detailed requirements (arrays)
- Comprehensive rubrics (JSON objects)
- Past, present, and future due dates

### 3. Submissions (15-20 samples)
Realistic submission data including:
- **Statuses**: pending, graded, returned
- **For graded submissions**:
  - Scores (70-99)
  - Detailed feedback messages
  - Rubric scores breakdown
  - Graded dates
- **All submissions include**:
  - File URLs and names
  - Code content (actual JavaScript code)
  - Submission text
  - Timestamps (random within last 30 days)

## Features

### Production-Ready Design
- **Transaction Management**: Uses BEGIN/COMMIT/ROLLBACK for data integrity
- **Error Handling**: Graceful error handling with detailed logging
- **Duplicate Prevention**: ON CONFLICT clauses prevent duplicate entries
- **Data Validation**: Checks for required data before inserting
- **Progress Logging**: Clear console messages for each step

### Smart Data Generation
- Randomly distributes materials across modules
- Generates realistic submission dates
- Creates varied rubric scores (70-100% of max points)
- Associates submissions with existing users and assignments
- Handles missing users gracefully

### Safety Features
- Checks if modules exist before proceeding
- Skips duplicate entries without failing
- Rolls back all changes if any error occurs
- Doesn't overwrite existing data
- Warns about missing dependencies

## Prerequisites

1. Database must be set up and migrated
2. Run `seed-database.js` first to create modules
3. Environment variables must be configured:
   ```env
   DB_HOST=your_host
   DB_PORT=5432
   DB_NAME=codesmart_db
   DB_USER=postgres
   DB_PASSWORD=your_password
   ```

## Usage

### Basic Usage
```bash
node backend/scripts/seed-assessor-data.js
```

### From Project Root
```bash
npm run seed:assessor
```

### Expected Output
```
Starting assessor data seeding...

Fetching existing modules...
Found 3 modules: fundamental, intermediate, advance

Adding learning materials...
Existing learning materials: 15
Added 13 new learning materials

Adding additional assignments...
Existing assignments: 15
Added 10 new assignments

Preparing submission data...
Adding submissions...
Existing submissions: 0
Added 18 new submissions

============================================================
Assessor data seeding completed successfully!
============================================================
Summary:
  Learning Materials: 13 added (28 total)
  Assignments: 10 added (25 total)
  Submissions: 18 added (18 total)
============================================================

You can now view the assessor dashboard with comprehensive data!
```

## Script Behavior

### Idempotent Design
- Safe to run multiple times
- Won't create duplicate entries
- Skips conflicts gracefully
- Only adds new data

### Data Distribution
- Learning materials distributed evenly across modules
- Submissions created for random assignment-user combinations
- Mix of graded and pending submissions (weighted toward graded)
- Realistic date ranges (last 30 days for submissions)

### Rollback on Failure
If any error occurs:
1. All changes are rolled back
2. Database remains in original state
3. Error is logged with stack trace
4. Process exits with code 1

## File Structure

```javascript
/home/luthfi/codesmart/backend/scripts/seed-assessor-data.js
│
├── Learning Materials Data (13 items)
│   ├── Content with theory and examples
│   ├── Video URLs
│   └── Resource links
│
├── Additional Assignments (10 items)
│   ├── Requirements arrays
│   ├── Rubric objects
│   └── Deadline configurations
│
├── Submission Generator Function
│   ├── Status randomization
│   ├── Score generation
│   ├── Feedback templates
│   └── Code examples
│
└── Main Seeding Function
    ├── Transaction management
    ├── Module fetching
    ├── Material insertion
    ├── Assignment insertion
    ├── Submission generation
    └── Summary reporting
```

## Code Examples

### Sample Learning Material Content
```json
{
  "theory": "Functions are fundamental building blocks...",
  "examples": [
    {
      "title": "Function Declaration",
      "code": "function add(a, b) { return a + b; }"
    }
  ],
  "video_url": "https://www.youtube.com/watch?v=...",
  "resources": [
    {
      "type": "PDF",
      "url": "https://example.com/guide.pdf",
      "title": "Complete Guide"
    }
  ]
}
```

### Sample Assignment Rubric
```json
{
  "Functionality": {
    "points": 40,
    "description": "All functions work correctly"
  },
  "Code Organization": {
    "points": 25,
    "description": "Functions are well-organized"
  },
  "Documentation": {
    "points": 25,
    "description": "Clear JSDoc comments"
  },
  "Testing": {
    "points": 15,
    "description": "Adequate test coverage"
  }
}
```

## Troubleshooting

### Error: "No modules found"
**Solution**: Run `seed-database.js` first
```bash
node backend/scripts/seed-database.js
```

### Error: "SASL: client password must be a string"
**Solution**: Check `.env` file has correct DB_PASSWORD
```env
DB_PASSWORD=your_actual_password
```

### Error: "No active users found"
**Solution**: Create users first or the script will skip submissions (non-critical)

### Duplicate Warnings
**Normal behavior**: Script skips existing entries and logs warnings

## Database Schema Compatibility

Works with schema version from `/home/luthfi/codesmart/backend/migrations/schema.sql`

### Tables Used
- `modules` (read)
- `users` (read)
- `learning_materials` (write)
- `assignments` (write)
- `submissions` (write)

### Required Fields
All required fields per schema are populated:
- Learning materials: module_id, class_number, title, content
- Assignments: module_id, title, description, requirements, rubric
- Submissions: assignment_id, user_id, status

## Integration with Application

After running this script, the assessor dashboard will show:
- Diverse learning materials across all modules
- Multiple assignments in different states
- Realistic submission data with scores and feedback
- Proper date distributions for reporting
- Complete rubric breakdowns for grading

## Maintenance

### To Add More Data
1. Edit the arrays in the script:
   - `learningMaterialsData`
   - `additionalAssignments`
   - `feedbackTemplates`
   - `codeExamples`

2. Run the script again (idempotent)

### To Reset Data
```sql
-- WARNING: This deletes all data
TRUNCATE submissions, assignments, learning_materials CASCADE;
```

Then run both seed scripts:
```bash
node backend/scripts/seed-database.js
node backend/scripts/seed-assessor-data.js
```

## Support

For issues or questions:
1. Check the console output for detailed error messages
2. Verify database connection settings
3. Ensure all prerequisites are met
4. Review the transaction log in PostgreSQL if needed
