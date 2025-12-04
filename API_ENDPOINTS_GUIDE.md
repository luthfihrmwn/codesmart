# CodeSmart API Endpoints Guide

## Base URL
```
http://localhost:5000/api/v1
```

## Authentication
All assessor endpoints require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

---

## Assessor API Endpoints

### Dashboard & Statistics

#### Get Assessor Statistics
```
GET /assessor/statistics
```

**Response:**
```json
{
  "success": true,
  "data": {
    "grading": {
      "total_graded": 45,
      "graded_last_week": 12,
      "graded_last_month": 28,
      "average_score_given": 85.5
    },
    "pending": {
      "total_pending": 8,
      "overdue_submissions": 2
    },
    "performanceByLevel": [
      {
        "level": "fundamental",
        "total_submissions": 20,
        "average_score": 82.5,
        "total_students": 15
      }
    ],
    "recentActivity": [...]
  }
}
```

**Used in:** `dashboard-sidebar.html`

---

### Submissions Management

#### Get Pending Submissions
```
GET /assessor/submissions/pending
Query params: ?moduleId=1&level=fundamental
```

**Response:**
```json
{
  "success": true,
  "data": {
    "submissions": [
      {
        "id": 1,
        "submitted_at": "2025-11-26T10:00:00Z",
        "student_name": "John Doe",
        "assignment_title": "JavaScript Basics",
        "module_name": "Fundamental JavaScript",
        "level": "fundamental",
        "file_url": "/uploads/submission-123.pdf"
      }
    ],
    "count": 5
  }
}
```

**Used in:** `dashboard-sidebar.html`, `submissions-sidebar.html`

#### Get Graded Submissions
```
GET /assessor/submissions/graded
Query params: ?moduleId=1&level=fundamental&gradedBy=1
```

**Response:** Same format as pending submissions

**Used in:** `submissions-sidebar.html`

#### Get Submission Details
```
GET /assessor/submissions/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "submission": {
      "id": 1,
      "status": "submitted",
      "student_name": "John Doe",
      "assignment_title": "JavaScript Basics",
      "file_url": "/uploads/submission-123.pdf",
      "submitted_at": "2025-11-26T10:00:00Z"
    },
    "submissionHistory": [...]
  }
}
```

**Used in:** `submissions-sidebar.html` (detail view)

#### Grade Submission
```
POST /assessor/submissions/:id/grade
Body: {
  "score": 85,
  "feedback": "Great work!",
  "rubric_scores": { "code_quality": 9, "functionality": 8 }
}
```

**Used in:** `submissions-sidebar.html` (grading form)

---

### Student Management

#### Get All Students
```
GET /assessor/students
Query params: ?level=fundamental&search=john
```

**Response:**
```json
{
  "success": true,
  "data": {
    "students": [
      {
        "id": 1,
        "username": "john_doe",
        "name": "John Doe",
        "email": "john@example.com",
        "current_level": "fundamental",
        "pretest_score": 75,
        "total_submissions": 10,
        "graded_submissions": 8,
        "average_score": 82.5
      }
    ],
    "count": 25
  }
}
```

**Used in:** `students-sidebar.html`, `dashboard-sidebar.html`

#### Get Student Progress
```
GET /assessor/students/:id/progress
```

**Response:**
```json
{
  "success": true,
  "data": {
    "student": {...},
    "moduleProgress": [...],
    "submissions": [...],
    "enrollments": [...]
  }
}
```

**Used in:** `students-sidebar.html` (detail view)

---

### Assignment Management

#### Get All Assignments
```
GET /assessor/assignments
```

**Response:**
```json
{
  "success": true,
  "data": {
    "assignments": [
      {
        "id": 1,
        "title": "JavaScript Variables",
        "description": "Learn about variables",
        "module_name": "Fundamental JavaScript",
        "module_level": "fundamental",
        "due_date": "2025-12-01T23:59:59Z",
        "total_submissions": 20,
        "pending_submissions": 5,
        "graded_submissions": 15
      }
    ],
    "count": 10
  }
}
```

**Used in:** `assignments-sidebar.html`, `dashboard-sidebar.html`

---

### Discussions

#### Get All Discussions
```
GET /discussions
Query params: ?module_id=1&assignment_id=1&limit=10&offset=0
```

**Response:**
```json
{
  "success": true,
  "data": {
    "discussions": [
      {
        "id": 1,
        "title": "How to use variables?",
        "content": "I don't understand...",
        "author_name": "John Doe",
        "created_at": "2025-11-26T10:00:00Z",
        "replies_count": 5,
        "is_pinned": false,
        "is_locked": false
      }
    ],
    "count": 15
  }
}
```

**Used in:** `discussions-sidebar.html`

#### Get Discussion by ID
```
GET /discussions/:id
```

**Used in:** `discussions-sidebar.html` (detail view)

#### Create Discussion
```
POST /discussions
Body: {
  "module_id": 1,
  "assignment_id": 1,
  "title": "Question about variables",
  "content": "How do I declare variables?"
}
```

#### Create Reply
```
POST /discussions/:discussion_id/replies
Body: {
  "content": "You can use let or const",
  "is_solution": false
}
```

---

### Announcements

#### Get All Announcements
```
GET /announcements
Query params: ?limit=10&offset=0&is_active=true
```

**Response:**
```json
{
  "success": true,
  "data": {
    "announcements": [
      {
        "id": 1,
        "title": "Welcome to CodeSmart",
        "content": "Welcome message...",
        "author_name": "Admin",
        "created_at": "2025-11-26T10:00:00Z",
        "priority": "high",
        "is_active": true
      }
    ],
    "count": 5
  }
}
```

**Used in:** `announcements-sidebar.html`

#### Create Announcement
```
POST /announcements
Body: {
  "title": "Important Update",
  "content": "Please note...",
  "target_role": "student",
  "target_level": "fundamental",
  "priority": "high",
  "is_active": true
}
```

**Used in:** `announcements-sidebar.html` (create form)

---

### Modules & Classes

#### Get All Modules
```
GET /modules
```

**Response:**
```json
{
  "success": true,
  "data": {
    "modules": [
      {
        "id": 1,
        "name": "Fundamental JavaScript",
        "slug": "fundamental-javascript",
        "level": "fundamental",
        "description": "Learn the basics",
        "is_active": true,
        "total_classes": 10,
        "total_assignments": 5
      }
    ]
  }
}
```

**Used in:** `classes-sidebar.html`, `dashboard-sidebar.html`

#### Get Module Classes
```
GET /modules/:slug/materials
```

**Response:**
```json
{
  "success": true,
  "data": {
    "materials": [
      {
        "id": 1,
        "title": "Introduction to JavaScript",
        "content": "...",
        "class_number": 1,
        "is_active": true
      }
    ]
  }
}
```

**Used in:** `classes-sidebar.html`, `materials-sidebar.html`

---

## Error Responses

All endpoints return errors in this format:
```json
{
  "success": false,
  "message": "Error message here",
  "errors": [] // Optional validation errors
}
```

Common HTTP Status Codes:
- `200` - Success
- `400` - Bad Request (validation error)
- `401` - Unauthorized (no token or invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

---

## Frontend API Service Usage

### Using apiService methods:

```javascript
// Get assessor statistics
const stats = await apiService.getAssessorStatistics();

// Get pending submissions
const submissions = await apiService.getPendingSubmissions();

// Get students
const students = await apiService.getStudents();

// Get assignments
const assignments = await apiService.getAssessorAssignments();

// Get discussions
const discussions = await apiService.request('/discussions', 'GET');

// Get announcements
const announcements = await apiService.getAnnouncements();

// Get modules
const modules = await apiService.getModules();
```

### Response handling:

```javascript
try {
  const response = await apiService.getStudents();

  if (response.success) {
    const students = response.data.students || response.data || [];
    // Process students data
  } else {
    console.error('Failed to load students');
  }
} catch (error) {
  console.error('Error:', error);
}
```

---

## Page-Endpoint Mapping

| Page | Primary Endpoints |
|------|-------------------|
| `dashboard-sidebar.html` | `/assessor/statistics`, `/assessor/submissions/pending`, `/assessor/students`, `/modules` |
| `students-sidebar.html` | `/assessor/students`, `/assessor/students/:id/progress` |
| `assignments-sidebar.html` | `/assessor/assignments` |
| `submissions-sidebar.html` | `/assessor/submissions/pending`, `/assessor/submissions/:id`, `/assessor/submissions/:id/grade` |
| `discussions-sidebar.html` | `/discussions`, `/discussions/:id`, `/discussions/:id/replies` |
| `announcements-sidebar.html` | `/announcements` |
| `classes-sidebar.html` | `/modules`, `/modules/:slug/materials` |
| `materials-sidebar.html` | `/modules/:slug/materials`, `/assessor/materials` |

---

**Last Updated:** 2025-11-26
**API Version:** v1
