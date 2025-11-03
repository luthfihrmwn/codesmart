# 🚀 CodeSmart API Quick Reference

Quick reference untuk testing dan integrasi API CodeSmart.

---

## 🔑 Base URL

```
http://localhost:5000/api/v1
```

---

## 🧪 Quick Test Commands

### 1. Register & Login Flow

**Register User:**
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "password123",
    "name": "John Doe",
    "phone": "08123456789",
    "securityQuestion": "What is your favorite color?",
    "securityAnswer": "Blue"
  }'
```

**Login (Admin):**
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "username": "admin",
      "email": "admin@codesmart.com",
      "name": "Administrator",
      "role": "admin",
      "status": "active"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 2. User Pretest Flow

**Submit Pretest:**
```bash
curl -X POST http://localhost:5000/api/v1/users/pretest/submit \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "answers": ["a", "b", "c", "d", "a", "b", "c", "d", "a", "b"],
    "score": 75
  }'
```

**Get Pretest Result:**
```bash
curl http://localhost:5000/api/v1/users/pretest/result \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 3. Module & Enrollment Flow

**Get All Modules:**
```bash
curl http://localhost:5000/api/v1/modules
```

**Get Module Details:**
```bash
curl http://localhost:5000/api/v1/modules/html-css-fundamental \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Enroll in Module:**
```bash
curl -X POST http://localhost:5000/api/v1/users/enrollments \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "moduleId": 1
  }'
```

**Get User Enrollments:**
```bash
curl http://localhost:5000/api/v1/users/enrollments \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 4. Learning Materials Flow

**Get Module Materials:**
```bash
curl http://localhost:5000/api/v1/modules/html-css-fundamental/materials \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Get Specific Class:**
```bash
curl http://localhost:5000/api/v1/modules/html-css-fundamental/materials/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Mark Class as Complete:**
```bash
curl -X POST http://localhost:5000/api/v1/users/progress/class/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 5. Assignment & Submission Flow

**Get Module Assignments:**
```bash
curl http://localhost:5000/api/v1/assignments/module/html-css-fundamental \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Get My Assignments:**
```bash
curl http://localhost:5000/api/v1/assignments/user/my-assignments \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Submit Assignment (with file):**
```bash
curl -X POST http://localhost:5000/api/v1/submissions \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@/path/to/assignment.pdf" \
  -F "assignmentId=1" \
  -F "notes=My first assignment submission"
```

**Get My Submissions:**
```bash
curl http://localhost:5000/api/v1/submissions/my-submissions \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Download Submission:**
```bash
curl http://localhost:5000/api/v1/submissions/1/download \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -o downloaded-assignment.pdf
```

### 6. Admin Operations

**Get Pending Approvals:**
```bash
curl http://localhost:5000/api/v1/admin/users/pending/approvals \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

**Approve User:**
```bash
curl -X POST http://localhost:5000/api/v1/admin/users/2/approve \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

**Get All Users (with pagination & filter):**
```bash
curl "http://localhost:5000/api/v1/admin/users?page=1&limit=10&role=user&search=john" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

**Create Module:**
```bash
curl -X POST http://localhost:5000/api/v1/admin/modules \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "JavaScript Fundamental",
    "slug": "javascript-fundamental",
    "description": "Learn JavaScript basics",
    "level": "fundamental",
    "is_active": true
  }'
```

**Get Admin Statistics:**
```bash
curl http://localhost:5000/api/v1/admin/statistics \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

**Export Users:**
```bash
curl http://localhost:5000/api/v1/admin/export/users \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -o users_export.json
```

### 7. Assessor Operations

**Get Pending Submissions:**
```bash
curl http://localhost:5000/api/v1/assessor/submissions/pending \
  -H "Authorization: Bearer YOUR_ASSESSOR_TOKEN"
```

**Grade Submission:**
```bash
curl -X POST http://localhost:5000/api/v1/assessor/submissions/1/grade \
  -H "Authorization: Bearer YOUR_ASSESSOR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "score": 85,
    "feedback": "Good work! Keep it up.",
    "rubric_scores": {
      "code_quality": 20,
      "functionality": 25,
      "documentation": 15,
      "design": 25
    }
  }'
```

**Get Students List:**
```bash
curl http://localhost:5000/api/v1/assessor/students \
  -H "Authorization: Bearer YOUR_ASSESSOR_TOKEN"
```

**Get Student Progress:**
```bash
curl http://localhost:5000/api/v1/assessor/students/2/progress \
  -H "Authorization: Bearer YOUR_ASSESSOR_TOKEN"
```

**Get Pending Promotions:**
```bash
curl http://localhost:5000/api/v1/assessor/promotions/pending \
  -H "Authorization: Bearer YOUR_ASSESSOR_TOKEN"
```

**Approve Promotion:**
```bash
curl -X POST http://localhost:5000/api/v1/assessor/promotions/1/approve \
  -H "Authorization: Bearer YOUR_ASSESSOR_TOKEN"
```

---

## 📱 Frontend JavaScript Examples

### Authentication

```javascript
// Login
const loginResult = await apiService.login('admin', 'admin123');
if (loginResult.success) {
    console.log('Logged in as:', loginResult.data.user.name);
    console.log('Token:', loginResult.data.token);
}

// Get Current User
const userResult = await apiService.getMe();
console.log('Current user:', userResult.data.user);

// Logout
await apiService.logout();
```

### User Operations

```javascript
// Submit Pretest
const pretestResult = await apiService.submitPretest({
    answers: ['a', 'b', 'c', 'd', 'a'],
    score: 75
});
console.log('Level assigned:', pretestResult.data.level);

// Enroll in Module
const enrollResult = await apiService.enrollInModule(1);
console.log('Enrolled:', enrollResult.success);

// Get User Progress
const progressResult = await apiService.getUserProgress();
console.log('Progress:', progressResult.data.progress);
```

### Assignments

```javascript
// Get Module Assignments
const assignments = await apiService.getModuleAssignments('html-css-fundamental');
console.log('Assignments:', assignments.data.assignments);

// Submit Assignment with File
const formData = new FormData();
formData.append('file', fileInput.files[0]);
formData.append('assignmentId', 1);
formData.append('notes', 'My submission');

const submitResult = await apiService.submitAssignment(formData);
console.log('Submitted:', submitResult.success);
```

### Admin Operations

```javascript
// Get Pending Approvals
const pending = await apiService.getPendingApprovals();
console.log('Pending users:', pending.data.pendingUsers);

// Approve User
await apiService.approveUser(2);

// Get Statistics
const stats = await apiService.getAdminStatistics();
console.log('Statistics:', stats.data);
```

### Assessor Operations

```javascript
// Get Pending Submissions
const submissions = await apiService.getPendingSubmissions();
console.log('Pending submissions:', submissions.data.submissions);

// Grade Submission
const gradeResult = await apiService.gradeSubmission(1, {
    score: 85,
    feedback: 'Great work!',
    rubric_scores: {
        code_quality: 20,
        functionality: 25,
        documentation: 15,
        design: 25
    }
});
console.log('Graded:', gradeResult.success);
```

---

## 🔐 Token Management

### Store Token After Login

```javascript
// Automatically handled by apiService.login()
const result = await apiService.login(username, password);
// Token stored in: localStorage.getItem('codesmart_token')
// Refresh token in: localStorage.getItem('codesmart_refresh_token')
```

### Include Token in Request (Manual)

```javascript
const response = await fetch('http://localhost:5000/api/v1/users/profile', {
    headers: {
        'Authorization': `Bearer ${localStorage.getItem('codesmart_token')}`,
        'Content-Type': 'application/json'
    }
});
```

### Auto Token Refresh

```javascript
// apiService automatically refreshes expired tokens
// No manual action needed - handled in apiService.request()
```

---

## ❌ Common Errors & Solutions

### 401 Unauthorized
```json
{
  "success": false,
  "message": "No token provided"
}
```
**Solution:** Include Authorization header with Bearer token

### 403 Forbidden
```json
{
  "success": false,
  "message": "Access denied. Admin role required"
}
```
**Solution:** User doesn't have required role (admin/assessor)

### 404 Not Found
```json
{
  "success": false,
  "message": "Module not found"
}
```
**Solution:** Check if resource ID/slug is correct

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation errors",
  "errors": [
    {
      "field": "email",
      "message": "Please include a valid email"
    }
  ]
}
```
**Solution:** Fix validation errors in request body

---

## 📊 Response Formats

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data here
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message here",
  "errors": [] // Optional validation errors
}
```

### Pagination Response
```json
{
  "success": true,
  "data": {
    "users": [...],
    "pagination": {
      "total": 100,
      "page": 1,
      "limit": 10,
      "totalPages": 10
    }
  }
}
```

---

## 🎯 Level System

| Score Range | Level | Description |
|-------------|-------|-------------|
| 0 - 45 | fundamental | Beginner level modules |
| 46 - 65 | intermediate | Intermediate level modules |
| 66 - 100 | advance | Advanced level modules |

**Automatic Features:**
- User is auto-assigned level based on pretest score
- User is auto-enrolled in first module of their level
- User can request promotion after completing module

---

## 🔄 Common Workflows

### New User Registration Flow
1. User registers → Status: `pending`
2. Admin approves → Status: `active`
3. User takes pretest → Gets level assigned
4. User auto-enrolled in starting module
5. User can access learning materials

### Assignment Submission Flow
1. User views module assignments
2. User submits assignment with file
3. Assessor grades submission
4. User can view grade and feedback
5. User can resubmit if needed

### Level Promotion Flow
1. User completes module
2. User requests promotion
3. Assessor reviews progress
4. Assessor approves promotion
5. User level upgraded
6. User can access next level modules

---

## 🛠️ Development Tips

### Enable CORS for Testing
Backend already configured for `http://localhost:8000`

### Check Server Logs
```bash
npm run dev
# Watch console for request logs
```

### Test with Postman
Import this curl command to Postman:
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### Debug Token Issues
```javascript
// Check token in console
console.log(localStorage.getItem('codesmart_token'));

// Check token expiration
const token = localStorage.getItem('codesmart_token');
const payload = JSON.parse(atob(token.split('.')[1]));
console.log('Token expires:', new Date(payload.exp * 1000));
```

---

**Happy Coding! 🚀**

For full documentation, see [BACKEND_IMPLEMENTATION_COMPLETE.md](BACKEND_IMPLEMENTATION_COMPLETE.md)
