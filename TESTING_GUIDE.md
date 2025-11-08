# 🧪 CodeSmart LMS - Complete Testing Guide

## Pre-requisites

### 1. Servers Running

**Backend Server:**
```bash
cd backend
npm run dev
# Should run on http://localhost:5000
```

**Frontend Server:**
```bash
# From project root
python3 -m http.server 8080
# Should run on http://localhost:8080
```

### 2. Database Setup

Ensure Supabase database is:
- ✅ Connected
- ✅ Tables migrated
- ✅ Sample data seeded (optional)

---

## Testing by Role

### 👤 USER ROLE TESTING

#### Test Account Creation
1. Go to `http://localhost:8080/index.html`
2. Click "Register"
3. Fill form:
   - Name: Test User
   - Email: testuser@example.com
   - Username: testuser
   - Password: test123
4. Submit
5. ✅ Verify: Redirected to login page

#### Test Login
1. Go to login page
2. Enter credentials:
   - Username: testuser
   - Password: test123
3. Submit
4. ✅ Verify: Redirected to dashboard

#### Test Dashboard (Page 1/6)
1. **URL:** `/src/pages/user/dashboard-new.html`
2. **Checks:**
   - [ ] Welcome message shows user name
   - [ ] Statistics cards display
   - [ ] Enrolled modules section visible
   - [ ] Available modules section visible
   - [ ] Dark mode toggle works
   - [ ] Profile link works
   - [ ] Logout works

#### Test Profile (Page 2/6)
1. **URL:** `/src/pages/user/profile-new.html`
2. **Checks:**
   - [ ] Profile data loads correctly
   - [ ] Edit profile button works
   - [ ] Update name/email/phone works
   - [ ] Photo upload works (max 2MB)
   - [ ] Validation errors show correctly
   - [ ] Save profile updates database
   - [ ] Cancel button works

**Test Cases:**
- Upload valid image (JPG/PNG < 2MB) → ✅ Success
- Upload invalid file (PDF) → ❌ Error shown
- Upload too large file (> 2MB) → ❌ Error shown
- Update with invalid email → ❌ Validation error

#### Test Pretest (Page 3/6)
1. **URL:** `/src/pages/user/pretest-new.html`
2. **Checks:**
   - [ ] 10 questions display
   - [ ] Navigation between questions works
   - [ ] Answer selection works
   - [ ] Submit calculates score
   - [ ] Level assigned correctly:
     - 0-45% → Fundamental
     - 46-65% → Intermediate
     - 66-100% → Advance
   - [ ] Auto-enrollment triggered
   - [ ] Results page shows

**Test Scenarios:**
- Answer 0-4 correct → Fundamental level
- Answer 5-6 correct → Intermediate level
- Answer 7-10 correct → Advance level

#### Test Modules List (Page 4/6)
1. **URL:** `/src/pages/user/modules-new.html`
2. **Checks:**
   - [ ] All modules display
   - [ ] Filter by level works
   - [ ] Locked modules shown correctly
   - [ ] Enroll button works
   - [ ] Already enrolled badge shows
   - [ ] Click module navigates to class

**Access Control Test:**
- Fundamental user → Can see fundamental only
- Intermediate user → Can see fundamental + intermediate
- Advance user → Can see all modules

#### Test Class Detail (Page 5/6)
1. **URL:** `/src/pages/user/class-new.html?module=javascript-fundamentals`
2. **Checks:**
   - [ ] Module loads by slug
   - [ ] Sidebar shows all classes
   - [ ] Video player works
   - [ ] Mark complete button works
   - [ ] Progress updates
   - [ ] Next/Previous navigation works
   - [ ] Breadcrumb navigation works

**Test Flow:**
1. Select module from modules page
2. First class loads
3. Mark as complete
4. Click next → Goes to second class
5. Check sidebar → First class has checkmark

#### Test Assignments (Page 6/6)
1. **URL:** `/src/pages/user/assignment-new.html`
2. **Checks:**
   - [ ] Assignments list displays
   - [ ] Submit button opens modal
   - [ ] File upload works
   - [ ] File validation works (5MB limit)
   - [ ] Submission saves
   - [ ] Download submission works
   - [ ] Resubmit works
   - [ ] Grading status updates

**Test Cases:**
- Upload valid file (PDF/DOCX < 5MB) → ✅ Success
- Upload invalid file type → ❌ Error
- Upload too large file → ❌ Error
- Resubmit → ✅ Replaces old submission

---

### 👨‍💼 ADMIN ROLE TESTING

#### Admin Login
1. Go to login page
2. Use credentials:
   - Username: admin
   - Password: admin123
3. ✅ Verify: Redirected to admin dashboard

#### Test Admin Dashboard (Page 1/5)
1. **URL:** `/src/pages/admin/dashboard-new.html`
2. **Checks:**
   - [ ] Statistics cards show correct counts
   - [ ] Recent activities display
   - [ ] User growth chart shows
   - [ ] Module statistics display
   - [ ] Quick action buttons work
   - [ ] Navigation to all admin pages works

#### Test User Management (Page 2/5)
1. **URL:** `/src/pages/admin/users-new.html`
2. **Checks:**
   - [ ] All users display in table
   - [ ] Search by name works
   - [ ] Search by email works
   - [ ] Filter by role works (Admin/Assessor/User)
   - [ ] Pending promotions section shows
   - [ ] Create user button works
   - [ ] Edit user button works
   - [ ] Delete user button works (with confirmation)
   - [ ] Approve promotion works
   - [ ] Reject promotion works

**CRUD Test:**

**Create:**
1. Click "Create New User"
2. Fill form:
   - Name: New Admin
   - Email: newadmin@test.com
   - Password: admin123
   - Role: Admin
   - Level: Advance
   - Status: Active
3. Submit
4. ✅ Verify: User appears in table

**Read:**
1. Search for "New Admin"
2. ✅ Verify: User found

**Update:**
1. Click edit on "New Admin"
2. Change role to Assessor
3. Submit
4. ✅ Verify: Role updated in table

**Delete:**
1. Click delete on "New Admin"
2. Confirm deletion
3. ✅ Verify: User removed from table

**Approve Promotion:**
1. User requests promotion (from user panel)
2. Go to pending approvals
3. Click "Approve"
4. ✅ Verify: User level updated, request removed

#### Test Module Management (Page 3/5)
1. **URL:** `/src/pages/admin/modules-new.html`
2. **Checks:**
   - [ ] All modules display
   - [ ] Search works
   - [ ] Filter by level works
   - [ ] Create module works
   - [ ] Edit module works
   - [ ] Delete module works (with cascade warning)
   - [ ] View classes button works
   - [ ] Module details section expands
   - [ ] Create class works
   - [ ] Edit class works
   - [ ] Delete class works

**Nested Management Test:**
1. Create module "React Basics"
2. View classes for "React Basics"
3. Add class "Introduction to React"
4. Add class "JSX Fundamentals"
5. Edit "Introduction to React"
6. Delete "JSX Fundamentals"
7. ✅ Verify: All operations successful

#### Test Assignment Management (Page 4/5)
1. **URL:** `/src/pages/admin/assignments-new.html`
2. **Checks:**
   - [ ] All assignments from all modules display
   - [ ] Search works
   - [ ] Filter by module works
   - [ ] Create assignment works
   - [ ] Module dropdown populates
   - [ ] Edit assignment works
   - [ ] Delete assignment works (with cascade warning)
   - [ ] Submission count displays

**Assignment Creation Test:**
1. Click "Create New Assignment"
2. Select module: "JavaScript Fundamentals"
3. Title: "Variables and Data Types Quiz"
4. Description: "Test your understanding..."
5. Due date: Next week
6. Submit
7. ✅ Verify: Assignment appears in list

#### Test Reports & Analytics (Page 5/5)
1. **URL:** `/src/pages/admin/reports-new.html`
2. **Checks:**
   - [ ] Overview statistics display (6 cards)
   - [ ] Users by role breakdown shows
   - [ ] Users by level distribution shows
   - [ ] Modules by level distribution shows
   - [ ] Submission statistics show
   - [ ] Recent activities feed displays
   - [ ] Export Users button downloads CSV
   - [ ] Export Submissions button downloads CSV
   - [ ] Refresh button updates data

**CSV Export Test:**
1. Click "Export Users"
2. ✅ Verify: users_export.csv downloads
3. Open in Excel/Sheets
4. ✅ Verify: Contains columns: id, name, email, role, level, status, created_at
5. Repeat for "Export Submissions"

---

### 👨‍🏫 ASSESSOR ROLE TESTING

#### Assessor Account Setup
**Option 1:** Use admin account (has assessor access)
**Option 2:** Create assessor via admin panel
1. Login as admin
2. Go to User Management
3. Create user with role "Assessor"

#### Test Assessor Dashboard (Page 1/3)
1. **URL:** `/src/pages/assessor/dashboard-new.html`
2. **Checks:**
   - [ ] Statistics display (4 cards)
   - [ ] Grading statistics show
   - [ ] Pass rate calculation correct
   - [ ] Recent activities display
   - [ ] Pending submissions table shows (top 10)
   - [ ] Quick grade button works
   - [ ] View all button works
   - [ ] Navigation buttons work

#### Test Grade Submissions (Page 2/3)
1. **URL:** `/src/pages/assessor/grade-submissions-new.html`
2. **Checks:**
   - [ ] Pending submissions display
   - [ ] Graded submissions display
   - [ ] Filter toggle works (Pending/Graded)
   - [ ] View button opens modal
   - [ ] Grade button opens modal
   - [ ] File download works
   - [ ] Score input validates (0-100)
   - [ ] Auto-status works:
     - Score ≥70 → Suggests "Passed"
     - Score <70 → Suggests "Failed"
   - [ ] Feedback textarea works
   - [ ] Submit grade works
   - [ ] Update grade works
   - [ ] URL parameter works (?id=123)

**Grading Flow Test:**
1. Go to pending submissions
2. Click "Grade" on first submission
3. Download file and review
4. Enter score: 85
5. ✅ Verify: Status auto-set to "Passed"
6. Add feedback: "Good work!"
7. Submit
8. ✅ Verify: Submission moves to graded list
9. ✅ Verify: Student can see grade

**Update Grade Test:**
1. Filter to "Graded"
2. Click "Edit Grade" on graded submission
3. Change score from 85 to 90
4. Update feedback
5. Submit
6. ✅ Verify: Grade updated

#### Test Student Progress (Page 3/3)
1. **URL:** `/src/pages/assessor/student-progress-new.html`
2. **Checks:**
   - [ ] All students display
   - [ ] Search by name works
   - [ ] Search by email works
   - [ ] Filter by level works
   - [ ] Completion rate displays
   - [ ] Color coding works:
     - ≥80% → Green
     - ≥50% → Yellow
     - <50% → Red
   - [ ] View progress button works
   - [ ] Student modal opens
   - [ ] Student info displays
   - [ ] Statistics display (4 cards)
   - [ ] Enrollments table shows
   - [ ] Submissions table shows

**Progress Tracking Test:**
1. Search for "Test User"
2. Click "View Progress"
3. ✅ Verify: Modal opens
4. ✅ Verify: Shows all enrollments
5. ✅ Verify: Shows all submissions
6. ✅ Verify: Statistics are correct

---

## Cross-Role Testing

### Role-Based Access Control

**Test Unauthorized Access:**

1. **User accessing Admin pages:**
   - Login as regular user
   - Try to go to `/src/pages/admin/users-new.html`
   - ✅ Verify: Redirected with "Access denied" message

2. **User accessing Assessor pages:**
   - Login as regular user
   - Try to go to `/src/pages/assessor/dashboard-new.html`
   - ✅ Verify: Redirected with "Access denied" message

3. **Assessor accessing Admin pages:**
   - Login as assessor
   - Try to go to `/src/pages/admin/users-new.html`
   - ✅ Verify: Redirected with "Access denied" message

4. **Admin accessing all pages:**
   - Login as admin
   - Go to user pages → ✅ Access granted
   - Go to admin pages → ✅ Access granted
   - Go to assessor pages → ✅ Access granted

---

## Integration Testing

### End-to-End Workflows

#### Workflow 1: Student Learning Journey
1. Register new account
2. Login
3. Take pretest → Get level assignment
4. Browse modules
5. Enroll in module matching level
6. Complete first class → Mark complete
7. Complete all classes in module
8. Submit assignment
9. Wait for grading
10. Check grade and feedback

**Success Criteria:**
- ✅ All steps complete without errors
- ✅ Progress tracked correctly
- ✅ Grade received and visible

#### Workflow 2: Admin Management Cycle
1. Login as admin
2. Create new module
3. Add 3 classes to module
4. Create assignment for module
5. Create assessor account
6. Approve a pending user promotion
7. Export users data
8. View analytics

**Success Criteria:**
- ✅ Module created successfully
- ✅ Classes added correctly
- ✅ Assignment linked to module
- ✅ Assessor can login
- ✅ Promotion approved
- ✅ CSV export works
- ✅ Analytics display correctly

#### Workflow 3: Assessor Grading Cycle
1. Login as assessor
2. View dashboard statistics
3. Check pending submissions
4. Grade 5 submissions
5. Provide feedback on each
6. View student progress
7. Check average scores

**Success Criteria:**
- ✅ All submissions graded
- ✅ Students receive grades
- ✅ Statistics update
- ✅ Progress tracking accurate

---

## Performance Testing

### Page Load Times
Target: < 2 seconds

**Test:**
1. Clear browser cache
2. Measure load time for each page
3. ✅ Verify: All pages load under 2 seconds

### API Response Times
Target: < 500ms

**Test:**
1. Open browser DevTools
2. Check Network tab
3. ✅ Verify: API calls complete under 500ms

### Concurrent Users
Target: 10+ simultaneous users

**Test:**
1. Open 10 browser tabs
2. Login with different accounts
3. Perform various actions
4. ✅ Verify: No slowdown or errors

---

## Browser Compatibility Testing

### Desktop Browsers
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

### Mobile Browsers
- [ ] Chrome Mobile
- [ ] Safari Mobile
- [ ] Firefox Mobile

### Test Cases per Browser:
1. Login/logout
2. Navigation
3. Form submission
4. File upload
5. Dark mode toggle
6. Responsive design

---

## Security Testing

### Authentication Tests

**Test Invalid Login:**
1. Use wrong password
2. ✅ Verify: Error message shown, no access

**Test Session Expiry:**
1. Login
2. Delete JWT token from localStorage
3. Try to access protected page
4. ✅ Verify: Redirected to login

**Test Token Refresh:**
1. Login
2. Wait for access token to expire
3. Perform action
4. ✅ Verify: Refresh token used, action succeeds

### Authorization Tests

**Test Role Enforcement:**
1. Login as user
2. Try to access admin API directly (e.g., via Postman)
3. ✅ Verify: 403 Forbidden error

### Input Validation Tests

**SQL Injection Test:**
- Input: `'; DROP TABLE users; --`
- ✅ Verify: No database damage, input sanitized

**XSS Test:**
- Input: `<script>alert('XSS')</script>`
- ✅ Verify: Script not executed, displayed as text

---

## Accessibility Testing

### Keyboard Navigation
- [ ] All pages navigable with Tab key
- [ ] Forms submittable with Enter key
- [ ] Modals closable with Escape key

### Screen Reader Compatibility
- [ ] All images have alt text
- [ ] Forms have proper labels
- [ ] ARIA attributes where needed

### Color Contrast
- [ ] All text meets WCAG AA standards
- [ ] Dark mode also meets standards

---

## Error Handling Testing

### Network Errors

**Test Offline Scenario:**
1. Login
2. Disconnect internet
3. Try to load data
4. ✅ Verify: User-friendly error message shown

**Test Slow Network:**
1. Throttle network to "Slow 3G"
2. Load pages
3. ✅ Verify: Loading spinner shows, page eventually loads

### Validation Errors

**Test Form Validation:**
1. Try to submit empty required fields
2. ✅ Verify: Validation errors show
3. Try to submit invalid email format
4. ✅ Verify: Email validation error shows
5. Try to upload oversized file
6. ✅ Verify: File size error shows

### Server Errors

**Test 500 Error:**
1. Simulate server error (stop backend)
2. Try to perform action
3. ✅ Verify: Error message shown, app doesn't crash

---

## Regression Testing Checklist

After any code changes, verify:

**User Pages:**
- [ ] Dashboard loads
- [ ] Profile edit works
- [ ] Pretest assigns level
- [ ] Module enrollment works
- [ ] Class completion tracks
- [ ] Assignment submission works

**Admin Pages:**
- [ ] User CRUD works
- [ ] Module CRUD works
- [ ] Assignment CRUD works
- [ ] Reports generate
- [ ] CSV export works

**Assessor Pages:**
- [ ] Dashboard shows stats
- [ ] Grading works
- [ ] Progress tracking works

**Cross-cutting:**
- [ ] Auth still works
- [ ] Dark mode works
- [ ] Responsive design intact
- [ ] No console errors

---

## Bug Reporting Template

When you find a bug, report it with:

```
**Title:** Brief description

**Environment:**
- Browser: Chrome 120
- OS: Windows 11
- User Role: Admin

**Steps to Reproduce:**
1. Login as admin
2. Go to users page
3. Click create user
4. Submit empty form

**Expected Result:**
Validation errors should show

**Actual Result:**
Page crashes with console error

**Screenshots:**
[Attach screenshots]

**Console Errors:**
[Copy console errors]

**Severity:**
Critical / High / Medium / Low

**Priority:**
P0 / P1 / P2 / P3
```

---

## Test Completion Criteria

System is ready for production when:

✅ All 14 pages load without errors
✅ All CRUD operations work correctly
✅ All role-based access controls enforced
✅ All forms validate properly
✅ All file uploads work within limits
✅ All exports generate valid CSVs
✅ All grading workflows complete
✅ All search/filter functions work
✅ Dark mode works on all pages
✅ Responsive design works on mobile
✅ No console errors on any page
✅ All API calls complete successfully
✅ Authentication/authorization secure
✅ Performance meets targets
✅ Browser compatibility confirmed

---

## Final Sign-off

**Tested By:** _________________
**Date:** _________________
**Status:** Pass / Fail
**Notes:** _________________

---

**Happy Testing! 🧪**

All pages are ready for comprehensive testing before production deployment!
