# Assessor vs Admin Pages Comparison

## Overview

Dokumen ini menjelaskan perbedaan fungsi dan fitur antara halaman Admin dan Assessor di CodeSmart.

**Last Updated:** November 26, 2025

---

## 📊 Pages Comparison Matrix

| Feature | Admin | Assessor | Notes |
|---------|-------|----------|-------|
| **Dashboard** | ✅ Full System Overview | ✅ Personal Teaching Overview | Admin sees all data, Assessor sees their classes only |
| **Users Management** | ✅ Full CRUD | ❌ Read-Only (Students) | Admin manages all users, Assessor only views students |
| **Classes Management** | ✅ Full CRUD | ✅ View + Assign | Admin creates/deletes classes, Assessor assigns content |
| **Modules Management** | ✅ Full CRUD | ✅ View + Content | Admin manages structure, Assessor adds materials |
| **Materials** | ✅ Full CRUD | ✅ Full CRUD | Both can manage learning materials |
| **Assignments** | ✅ Full CRUD | ✅ Full CRUD | Both can create and manage assignments |
| **Submissions** | ✅ View All | ✅ View + Grade | Admin views all, Assessor grades their students |
| **Discussions** | ✅ Full CRUD + Moderate | ✅ Full CRUD + Moderate | Both can moderate discussions |
| **Announcements** | ✅ Full CRUD + Global | ✅ Full CRUD + Targeted | Admin makes global announcements |
| **Analytics/Reports** | ✅ System-wide Reports | ✅ Class-specific Analytics | Different scope of data |

---

## 🎯 Detailed Feature Comparison

### 1. Dashboard

#### Admin Dashboard
**Purpose:** System-wide overview and management

**Features:**
- Total users (all roles)
- Total classes and modules
- System-wide statistics
- Recent activities across all users
- Server health metrics
- Database statistics

**Functionality:**
- View all system data
- Quick access to critical functions
- System alerts and notifications
- Performance monitoring

#### Assessor Dashboard
**Purpose:** Personal teaching overview

**Features:**
- My students count
- My pending submissions
- My classes assigned
- Graded this week (by me)
- Recent submissions (my classes only)
- My class performance

**Functionality:**
- View personal teaching data
- Quick access to grading tasks
- Student performance overview
- Upcoming deadlines

---

### 2. Users Management

#### Admin Users Page
**URL:** `/src/pages/admin/users-sidebar.html`

**Features:**
- ✅ Create new users (all roles)
- ✅ Edit user details
- ✅ Change user roles
- ✅ Activate/Deactivate users
- ✅ Delete users
- ✅ Reset passwords
- ✅ View all users (students, assessors, admins)

**Permissions:**
- Full CRUD operations
- Role assignment
- Status management

#### Assessor Students Page
**URL:** `/src/pages/assessor/students-sidebar.html`

**Features:**
- ✅ View students list
- ✅ View student profiles
- ✅ View student progress
- ✅ View submission history
- ✅ Export student data
- ❌ Cannot create/delete users
- ❌ Cannot change roles

**Permissions:**
- Read-only access to student data
- Can view progress and performance
- Cannot modify user accounts

---

### 3. Classes Management

#### Admin Classes Page
**URL:** `/src/pages/admin/classes-sidebar.html`

**Features:**
- ✅ Create new classes
- ✅ Edit class details (name, code, schedule)
- ✅ Assign assessors to classes
- ✅ Set class capacity
- ✅ Activate/Deactivate classes
- ✅ Delete classes
- ✅ View all classes system-wide

**Permissions:**
- Full CRUD operations
- Assessor assignment
- Enrollment management

#### Assessor Classes Page
**URL:** `/src/pages/assessor/classes-sidebar.html`

**Features:**
- ✅ View my assigned classes
- ✅ View enrolled students
- ✅ View class assignments
- ✅ Update class schedule/notes
- ✅ View class statistics
- ❌ Cannot create/delete classes
- ❌ Cannot assign other assessors

**Permissions:**
- View classes assigned to them
- Can update class information
- Cannot create/delete classes (admin function)
- Can manage class content

---

### 4. Modules Management

#### Admin Modules Page
**URL:** `/src/pages/admin/modules-sidebar.html`

**Features:**
- ✅ Create new modules
- ✅ Edit module structure
- ✅ Set module levels (Fundamental/Intermediate/Advanced)
- ✅ Activate/Deactivate modules
- ✅ Delete modules
- ✅ Organize module hierarchy
- ✅ Manage module prerequisites

**Permissions:**
- Full CRUD operations
- Curriculum structure control
- Module ordering and prerequisites

#### Assessor Modules Page (If Created)
**Recommended Features:**
- ✅ View available modules
- ✅ View module content
- ✅ Add/Edit learning materials to modules
- ✅ Create class sessions based on modules
- ✅ Track module completion
- ❌ Cannot create/delete modules
- ❌ Cannot change module structure

**Recommended Permissions:**
- View all modules
- Add content to modules
- Cannot modify module structure

---

### 5. Materials Management

#### Admin Materials Page
**URL:** `/src/pages/admin/materials-sidebar.html`

**Features:**
- ✅ Upload all types of materials
- ✅ Edit material metadata
- ✅ Delete any material
- ✅ Organize materials
- ✅ View usage statistics
- ✅ Manage permissions

**Permissions:**
- Full CRUD for all materials
- Can delete any material
- System-wide material management

#### Assessor Materials Page
**URL:** `/src/pages/assessor/materials-sidebar.html`

**Features:**
- ✅ Upload learning materials (PDF, PPT, Video, Code)
- ✅ Edit own materials
- ✅ Delete own materials
- ✅ Organize by module
- ✅ Share with students
- ✅ Track material views
- ⚠️ Can only manage own materials

**Permissions:**
- Full CRUD for own materials
- Cannot delete others' materials
- Module-scoped management

---

### 6. Assignments Management

#### Admin Assignments Page
**URL:** `/src/pages/admin/assignments-sidebar.html`

**Features:**
- ✅ Create assignments for any module
- ✅ Edit any assignment
- ✅ Delete any assignment
- ✅ View all assignments system-wide
- ✅ Set assignment templates
- ✅ Configure rubrics

**Permissions:**
- Full CRUD for all assignments
- System-wide view
- Template management

#### Assessor Assignments Page
**URL:** `/src/pages/assessor/assignments-sidebar.html`

**Features:**
- ✅ Create assignments for my modules
- ✅ Edit my assignments
- ✅ Delete my assignments
- ✅ Set due dates and grading rubrics
- ✅ View submissions
- ✅ Configure auto-grading (if applicable)
- ⚠️ Can only manage assignments for my classes

**Permissions:**
- Full CRUD for own assignments
- Module-scoped (my classes only)
- Cannot modify others' assignments

---

### 7. Submissions Management

#### Admin Submissions Page
**URL:** `/src/pages/admin/submissions-sidebar.html`

**Features:**
- ✅ View ALL submissions system-wide
- ✅ View submission details
- ✅ Export submission data
- ✅ View grading statistics
- ✅ Monitor late submissions
- ❌ Typically don't grade (assessor responsibility)

**Permissions:**
- Read-only for all submissions
- System-wide monitoring
- Export and reporting

#### Assessor Submissions Page
**URL:** `/src/pages/assessor/submissions-sidebar.html`

**Features:**
- ✅ View submissions for my assignments
- ✅ Grade submissions
- ✅ Provide feedback
- ✅ Use grading rubrics
- ✅ Download submitted files
- ✅ Track grading progress
- ✅ Export grades
- ⚠️ Can only see/grade my students' submissions

**Permissions:**
- View submissions for my assignments
- Full grading capabilities
- Feedback and rubric scoring
- Cannot view other assessors' submissions

---

### 8. Discussions Management

#### Admin Discussions Page
**URL:** `/src/pages/admin/discussions-sidebar.html`

**Features:**
- ✅ View all discussions
- ✅ Pin important discussions
- ✅ Lock discussions
- ✅ Delete inappropriate content
- ✅ Moderate all discussions
- ✅ Create announcements via discussions

**Permissions:**
- Full moderation powers
- Can pin/unpin any discussion
- Can lock/unlock any discussion
- Can delete any post

#### Assessor Discussions Page
**URL:** `/src/pages/assessor/discussions-sidebar.html`

**Features:**
- ✅ View discussions in my modules
- ✅ Create discussion threads
- ✅ Reply to student questions
- ✅ Mark replies as solutions
- ✅ Pin important discussions (in my modules)
- ✅ Lock resolved discussions
- ⚠️ Can only moderate my module discussions

**Permissions:**
- Create and reply in discussions
- Moderate own module discussions
- Cannot delete (only admin can)
- Pin/lock within scope

---

### 9. Announcements Management

#### Admin Announcements Page
**URL:** `/src/pages/admin/announcements-sidebar.html`

**Features:**
- ✅ Create global announcements (all users)
- ✅ Target by role (students/assessors/admins)
- ✅ Target by level (fundamental/intermediate/advanced)
- ✅ Set priority (urgent/high/normal/low)
- ✅ Schedule announcements
- ✅ Edit/Delete any announcement

**Permissions:**
- Global announcement scope
- All targeting options
- Full CRUD for all announcements

#### Assessor Announcements Page
**URL:** `/src/pages/assessor/announcements-sidebar.html`

**Features:**
- ✅ Create announcements for my students
- ✅ Target specific classes/modules
- ✅ Set priority levels
- ✅ Edit/Delete my announcements
- ⚠️ Announcements scoped to my students only

**Permissions:**
- Create announcements for own students
- Module/class-scoped targeting
- Full CRUD for own announcements

---

### 10. Analytics/Reports

#### Admin Reports Page
**URL:** `/src/pages/admin/reports-sidebar.html`

**Features:**
- ✅ System-wide analytics
- ✅ User growth reports
- ✅ Course completion rates
- ✅ Revenue/enrollment reports
- ✅ Performance metrics across all assessors
- ✅ Export comprehensive reports

**Permissions:**
- Access to all system data
- Cross-assessor comparisons
- Financial/business metrics

#### Assessor Analytics Page
**URL:** `/src/pages/assessor/analytics-sidebar.html`

**Features:**
- ✅ My students' performance analytics
- ✅ Class completion rates
- ✅ Average scores per assignment
- ✅ Student progress tracking
- ✅ ML predictions for student performance
- ✅ Grade distribution charts
- ⚠️ Only my classes data

**Permissions:**
- View own class analytics
- Student performance tracking
- Cannot see other assessors' data

---

## 🔐 Permission Summary

### Admin Capabilities
- **Scope:** System-wide
- **Users:** Full CRUD for all users
- **Content:** Full CRUD for all content
- **Classes:** Full CRUD + Assessor assignment
- **Data:** Access to all data
- **Moderation:** Full moderation powers

### Assessor Capabilities
- **Scope:** My classes/modules only
- **Users:** Read-only for students
- **Content:** Full CRUD for my content
- **Classes:** View + manage content
- **Data:** Access to my students' data
- **Moderation:** Moderate my discussions

---

## 📋 Recommendations for Assessor Pages

Based on the admin page structure shown in the screenshot, here are recommendations for assessor pages:

### 1. Keep Similar Layout
- Same sidebar navigation structure
- Same card-based statistics
- Same table design
- Same filter/search controls

### 2. Adjust Functionality
- **Remove:** Create/Delete class functionality
- **Keep:** View classes, View students, Manage content
- **Add:** Quick grading actions
- **Add:** Student progress shortcuts

### 3. Data Scoping
- **All data filtered to:** Current assessor's classes
- **Students:** Only enrolled in my classes
- **Submissions:** Only for my assignments
- **Analytics:** Only my teaching performance

### 4. UI Indicators
- Badge showing "My Classes" vs "All Classes"
- Clear indication of scope (e.g., "3 classes assigned to you")
- Different color scheme if needed

---

## ✅ Implementation Status

| Page | Admin | Assessor | Notes |
|------|-------|----------|-------|
| Dashboard | ✅ Complete | ✅ Complete | Different data scope |
| Users/Students | ✅ Complete | ✅ Complete | Assessor read-only |
| Classes | ✅ Complete | ✅ Complete | Assessor view-only |
| Modules | ✅ Complete | ⚠️ Content Only | Via materials page |
| Materials | ✅ Complete | ✅ Complete | Own materials only |
| Assignments | ✅ Complete | ✅ Complete | Own assignments only |
| Submissions | ✅ Complete | ✅ Complete | Grading enabled |
| Discussions | ✅ Complete | ✅ Complete | Module-scoped |
| Announcements | ✅ Complete | ✅ Complete | Student-scoped |
| Reports/Analytics | ✅ Complete | ✅ Complete | Own classes only |

---

## 🎨 Design Consistency

Both Admin and Assessor pages should maintain:

1. **Visual Consistency**
   - Same color scheme
   - Same typography
   - Same component styles
   - Same icons (BoxIcons)

2. **Layout Consistency**
   - Sidebar navigation
   - Header with user menu
   - Stats cards at top
   - Table-based data display
   - Modal forms for CRUD

3. **UX Consistency**
   - Same interaction patterns
   - Same keyboard shortcuts
   - Same notification system
   - Same loading states

---

## 📝 Key Differences Summary

### What Admin Can Do That Assessor Cannot:
1. Create/Delete classes
2. Assign assessors to classes
3. Manage user accounts (create/delete)
4. Change user roles
5. Access system-wide data
6. Modify module structure
7. Delete any content
8. View financial/business metrics

### What Both Can Do:
1. Create and manage assignments
2. Upload and manage materials
3. Grade submissions
4. Moderate discussions (in scope)
5. Create announcements (scoped differently)
6. View analytics (different scope)

### What Only Assessor Focuses On:
1. Day-to-day grading
2. Student progress tracking
3. Direct student interaction
4. Teaching content creation
5. Class-specific analytics

---

**Document Version:** 1.0
**Date:** November 26, 2025
**Status:** ✅ COMPLETE
