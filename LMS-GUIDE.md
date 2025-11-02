# Learning Management System (LMS) Guide - CodeSmart

## 🎓 Professional LMS Platform

CodeSmart LMS adalah sistem manajemen pembelajaran lengkap yang memungkinkan user belajar dengan materi terstruktur, mengumpulkan tugas, dan berinteraksi dengan teman sekelas. Assessor dapat mengelola tugas, menilai submission, dan melacak progress siswa.

---

## 🌟 Fitur Utama LMS

### Untuk User (Siswa):
- ✅ **Materi Pembelajaran** - Konten terstruktur dengan code examples
- ✅ **Upload Tugas** - Drag & drop file submission
- ✅ **Teman Sekelas** - Lihat progress teman sekelas
- ✅ **Progress Tracking** - Monitor penyelesaian kelas
- ✅ **Nilai & Feedback** - Lihat hasil penilaian dari assessor
- ✅ **Navigasi Mudah** - Sidebar kelas & tab switching

### Untuk Assessor (Pengajar):
- ✅ **Kelola Tugas** - Create, edit, delete assignments
- ✅ **Penilaian** - Grade submissions dengan feedback
- ✅ **Progress Monitoring** - Track student progress per modul
- ✅ **Multi-Module** - Manage 3 modules (Fundamental, Intermediate, Advance)
- ✅ **Submission Management** - Review & grade all student work
- ✅ **Analytics** - View average scores & completion rates

---

## 📂 File Structure LMS

```
codesmart/
├── src/
│   ├── css/
│   │   └── lms.css                    # LMS-specific styles
│   ├── data/
│   │   └── database.js                # Extended with LMS data
│   └── pages/
│       └── modules/
│           ├── lms-user.html          # User learning interface
│           └── lms-assessor.html      # Assessor management interface
```

---

## 🗃️ Database Structure

### Extended Database Schema:

```javascript
Database = {
    users: [...],          // Existing users
    modules: [...],        // Existing modules with classes

    // NEW: Assignments
    assignments: [
        {
            id: 1,
            classId: 1,                    // Which class this belongs to
            title: 'Latihan Variabel',
            description: 'Buat 5 contoh variabel...',
            dueDate: '2025-12-01',
            maxScore: 100,
            fileRequired: true,
            createdBy: 2,                  // Assessor user ID
            createdAt: '2025-11-01'
        }
    ],

    // NEW: Submissions
    submissions: [
        {
            id: 1,
            assignmentId: 1,
            userId: 3,                     // Student user ID
            fileName: 'tugas-variabel.pdf',
            fileData: null,                // File reference/base64
            submittedAt: '2025-11-25',
            score: 85,                     // null if not graded yet
            feedback: 'Bagus! Tapi...',
            gradedBy: 2,                   // Assessor user ID
            gradedAt: '2025-11-26'
        }
    ],

    // NEW: Enrollments
    enrollments: [
        {
            id: 1,
            userId: 3,
            moduleId: 1,
            enrolledAt: '2025-11-01',
            completedClasses: [1, 2],      // Array of completed class IDs
            progress: 40                   // Percentage
        }
    ]
}
```

---

## 👨‍🎓 User LMS Interface

### URL Access:
```
/src/pages/modules/lms-user.html?level=fundamental
/src/pages/modules/lms-user.html?level=intermediate
/src/pages/modules/lms-user.html?level=advance
```

### Layout Structure:

```
┌─────────────────────────────────────────────────────────────┐
│  Dashboard > Fundamental JavaScript > Pengenalan JavaScript │
│                                                              │
│  [Breadcrumb Navigation]                                     │
└─────────────────────────────────────────────────────────────┘

┌──────────┬──────────────────────────────────┬──────────────┐
│          │  [Materi] [Tugas] [Diskusi]     │              │
│  SIDEBAR │                                  │  INFO PANEL  │
│          │                                  │              │
│  Class 1 │  === CONTENT AREA ===           │  Progress    │
│  Class 2 │                                  │   [85%]      │
│  Class 3 │  Materi pembelajaran dengan     │              │
│  Class 4 │  code examples, video, quiz     │  Classmates  │
│  Class 5 │                                  │  - John      │
│          │  [Prev] [Complete] [Next]       │  - Jane      │
│          │                                  │              │
└──────────┴──────────────────────────────────┴──────────────┘
```

### Tab 1: Materi

**Content Includes:**
- Judul & deskripsi kelas
- Tujuan pembelajaran (bullet points)
- Materi lengkap dengan HTML formatting
- Code examples dengan syntax highlighting
- Video pembelajaran placeholder
- Latihan/quiz section

**Navigation:**
- Previous Class button
- Mark as Complete button
- Next Class button

**Features:**
- Auto-save progress
- Completion tracking
- Sequential learning flow

### Tab 2: Tugas (Assignments)

**Assignment Card Shows:**
- Title & description
- Deadline date
- Max score
- Status badge (Pending/Submitted/Graded)

**Click Assignment Opens Modal:**

**Upload Section:**
```
┌──────────────────────────────────────┐
│  📤 Klik untuk upload atau drag      │
│     & drop file                      │
│                                      │
│  Format: PDF, DOC, DOCX, PPT,       │
│  JPG, PNG, ZIP (Max 10MB)           │
└──────────────────────────────────────┘

Uploaded File:
📄 tugas-variabel.pdf (245 KB) [🗑️ Hapus]

[Kumpulkan Tugas]
```

**After Submission:**
- Status: "Menunggu Penilaian" (blue badge)
- Cannot re-upload until graded

**After Grading:**
- Score display: "85/100"
- Feedback from assessor
- Download submitted file

### Tab 3: Diskusi

**Currently:**
- Placeholder for future discussion feature
- Coming soon message

### Right Sidebar: Info Panel

**1. Progress Card:**
- Circular progress ring
- Percentage display (e.g., 60%)
- "X dari 5 kelas selesai"

**2. Classmates Card:**
- Avatar with initials
- Name
- Progress percentage

**3. Assignments Summary:**
- Pending count (yellow)
- Submitted count (blue)
- Graded count (green)

---

## 👨‍🏫 Assessor LMS Interface

### URL Access:
```
/src/pages/modules/lms-assessor.html
```

### Layout Structure:

```
┌──────────────────────────────────────────────────────────────┐
│  🎓 Learning Management System                               │
│  Dashboard / LMS Management                                  │
│  Kelola semua aspek pembelajaran modul Anda                  │
└──────────────────────────────────────────────────────────────┘

┌─────────────────┬─────────────────┬─────────────────┐
│ FUNDAMENTAL     │ INTERMEDIATE    │ ADVANCE         │
│ 5 Classes       │ 5 Classes       │ 5 Classes       │
│ 2 Tugas         │ 3 Tugas         │ 1 Tugas         │
│ 10 Siswa        │ 5 Siswa         │ 2 Siswa         │
└─────────────────┴─────────────────┴─────────────────┘

┌──────────┬──────────┬──────────────┬──────────┐
│ 📚 Kelas │ 📝 Tugas │ 📂 Pengumpul │ 👥 Siswa │
│ 5 kelas  │ 2 tugas  │ 3 pending    │ 10 siswa │
└──────────┴──────────┴──────────────┴──────────┘

=== MAIN CONTENT (switches based on tab) ===
```

### View 1: Kelas (Classes)

**Displays:**
- List of all 5 classes in selected module
- Class number badge
- Title & description
- Assignment count per class

**Info Shown:**
- Read-only view (manage via Assessor Dashboard)
- Quick overview of class structure

### View 2: Tugas (Assignments)

**Features:**
- **[+ Tambah Tugas Baru]** button

**Table Columns:**
| Kelas | Judul Tugas | Deadline | Nilai Maks | Pengumpulan | Aksi |
|-------|------------|----------|------------|-------------|------|
| Class 1 | Latihan Variabel | 01/12/2025 | 100 | 5 (3 dinilai) | [Edit] [Delete] |

**Add/Edit Assignment Modal:**
```
Form Fields:
- Kelas (dropdown)
- Judul Tugas
- Deskripsi
- Deadline (date picker)
- Nilai Maksimal (0-100)
- ☑ Upload file diperlukan

[Simpan] [Batal]
```

**Actions:**
- **Edit:** Modify assignment details
- **Delete:** Remove assignment (with confirmation)

### View 3: Pengumpulan (Submissions)

**Features:**
- Filter by Assignment (dropdown)
- Filter by Status (All/Pending/Graded)

**Table Columns:**
| Siswa | Tugas | File | Dikumpulkan | Nilai | Aksi |
|-------|-------|------|-------------|-------|------|
| John Doe | Latihan Variabel | 📥 tugas.pdf | 25/11/2025 | 85/100 | [Edit Nilai] |
| Jane Smith | Latihan Variabel | 📥 tugas.docx | 24/11/2025 | Belum Dinilai | [Beri Nilai] |

**Grading Modal:**
```
Informasi Pengumpulan:
- Siswa: John Doe
- Tugas: Latihan Variabel
- File: tugas-variabel.pdf
- Dikumpulkan: 25/11/2025

Form:
- Nilai (0-100): [____]
- Feedback: [___________]

[Simpan Nilai] [Batal]
```

**After Grading:**
- Score displays in table
- Student can see score & feedback in their LMS

### View 4: Siswa (Students)

**Grid View:**
```
┌─────────────────────────────────┐
│  [JD]  John Doe                 │
│        john@example.com         │
│                                 │
│  Progress Kelas      [█████] 60%│
│                                 │
│  2        3/5       85.5        │
│  Selesai  Dinilai   Rata-rata   │
└─────────────────────────────────┘
```

**Metrics per Student:**
- Avatar with initials
- Name & email
- Progress bar (class completion %)
- Classes completed count
- Assignments graded / total
- Average score

---

## 🎨 Design & Styling

### Color Palette:

```css
Primary: #754ef9 (Purple)
Background: #f5f5f5 (Light gray)
Cards: white with shadow
Borders: #e0e0e0

Status Colors:
- Pending: #fbbf24 (Yellow/Amber)
- Submitted: #3b82f6 (Blue)
- Graded: #10b981 (Green)
- Error: #ef4444 (Red)

Module Levels:
- Fundamental: #d1fae5 (Light Green)
- Intermediate: #fef3c7 (Light Yellow)
- Advance: #fee2e2 (Light Red)
```

### Responsive Breakpoints:

**Desktop (1200px+):**
```
Grid: [Sidebar 280px] [Content] [Info Panel 320px]
```

**Tablet (768px - 1199px):**
```
Grid: [Sidebar 250px] [Content]
Info Panel: Below content in 3-column grid
```

**Mobile (< 768px):**
```
Grid: Single column
Order: Content → Sidebar → Info Panel
Tabs: Horizontal scroll
Tables: Horizontal scroll
```

### Key UI Components:

**1. Upload Area (Drag & Drop)**
```css
- Dashed border (#754ef9)
- Large upload icon
- Hover effect (background change)
- Dragover effect (scale up)
- File validation (size & type)
```

**2. Progress Ring (SVG)**
```javascript
- 120x120px circle
- Stroke dasharray animation
- Percentage in center
- Color: var(--main-color)
```

**3. Assignment Cards**
```css
- Gradient background (purple)
- White text
- Metadata row (deadline, max score)
- Upload area integrated
```

**4. Student Cards**
```css
- Avatar circle with initials
- Progress bar with percentage
- 3-column metrics grid
- Hover effect (lift up)
```

---

## 📊 Data Flow & Functions

### User Flow:

**1. Access Module:**
```javascript
URL: lms-user.html?level=fundamental
→ Load module by level
→ Auto-enroll user
→ Load first class
```

**2. Navigate Classes:**
```javascript
loadClass(classId)
→ Update header & breadcrumb
→ Load material content
→ Load assignments for class
→ Update sidebar active state
```

**3. Submit Assignment:**
```javascript
User selects file
→ Validate size (<10MB) & type
→ Display file preview
→ Click "Kumpulkan Tugas"
→ Database.submitAssignment()
→ Save to localStorage
→ Update UI (status badge)
```

**4. Mark Class Complete:**
```javascript
Click "Tandai Selesai"
→ Database.markClassComplete()
→ Update completedClasses array
→ Recalculate progress %
→ Update UI (sidebar checkmark)
```

### Assessor Flow:

**1. Create Assignment:**
```javascript
Click "Tambah Tugas Baru"
→ Open modal with form
→ Fill details (class, title, etc.)
→ Submit form
→ Database.addAssignment()
→ Save to localStorage
→ Reload assignments view
```

**2. Grade Submission:**
```javascript
Click "Beri Nilai" on submission
→ Open grading modal
→ Enter score & feedback
→ Submit
→ Database.gradeSubmission()
→ Save to localStorage
→ Update table (show score)
```

**3. View Student Progress:**
```javascript
Switch to "Siswa" tab
→ Get all enrollments for module
→ Calculate metrics per student:
  - Progress %
  - Completed classes
  - Average score
→ Display in grid cards
```

---

## 🔧 Helper Functions

### Database Functions:

```javascript
// Assignments
getAssignmentsByClassId(classId)
addAssignment(assignmentData)
updateAssignment(assignmentId, updates)
deleteAssignment(assignmentId)

// Submissions
getSubmissionsByAssignmentId(assignmentId)
getSubmissionsByUserId(userId)
getUserSubmission(assignmentId, userId)
submitAssignment(submissionData)
gradeSubmission(submissionId, score, feedback, gradedBy)

// Enrollments
getEnrollmentByUserId(userId, moduleId)
enrollUser(userId, moduleId)
markClassComplete(userId, moduleId, classId)

// Classmates & Progress
getClassmates(userId, moduleId)
getUserProgress(userId)
```

### Calculations:

**Progress Percentage:**
```javascript
progress = (completedClasses.length / totalClasses) * 100
```

**Average Score:**
```javascript
gradedSubmissions = submissions.filter(s => s.score !== null)
avgScore = gradedSubmissions.reduce((sum, s) => sum + s.score, 0)
           / gradedSubmissions.length
```

**Circular Progress Ring:**
```javascript
circumference = 2 * Math.PI * radius
offset = circumference - (progress / 100) * circumference
circle.style.strokeDashoffset = offset
```

---

## 📱 Mobile Optimization

### Touch-Friendly Features:
- Min button size: 44x44px
- Large tap targets for cards
- Swipe-friendly tab navigation
- Responsive grids (1 column on mobile)

### Mobile-Specific Adjustments:
- Sidebar becomes collapsible/bottom
- Tables scroll horizontally
- Upload area larger on mobile
- Modal fullscreen on small devices

---

## 🚀 Usage Examples

### Scenario 1: Student Learning Journey

1. **User logs in** → redirected to pretest (if not completed)
2. **Completes pretest** → score 55 → recommended "intermediate"
3. **Opens intermediate module** → auto-enrolled
4. **Navigates to Class 1** → reads material
5. **Clicks "Tandai Selesai"** → progress 20% (1/5)
6. **Opens Tab: Tugas** → sees 2 assignments
7. **Clicks assignment** → modal opens
8. **Drags file** → uploads tugas.pdf
9. **Clicks "Kumpulkan"** → status: "Menunggu Penilaian"
10. **Assessor grades** → score 90, feedback "Excellent!"
11. **User refreshes** → sees score 90/100 with feedback

### Scenario 2: Assessor Managing Module

1. **Assessor logs in** → opens LMS Assessor
2. **Selects "Intermediate" module** → sees 5 classes
3. **Clicks "Tugas" tab** → creates new assignment
4. **Fills form:**
   - Kelas: Class 2 - Array dan Object
   - Judul: Latihan Manipulasi Array
   - Deadline: 2025-12-10
   - Max Score: 100
5. **Saves** → assignment appears in list
6. **Clicks "Pengumpulan" tab** → sees 3 submissions
7. **Filters: "Belum Dinilai"** → sees 1 submission from Jane
8. **Clicks "Beri Nilai"** → opens grading modal
9. **Enters score 95** → feedback: "Perfect understanding!"
10. **Saves** → Jane can now see her score
11. **Clicks "Siswa" tab** → sees Jane's progress increased

---

## ⚡ Performance Tips

### Optimization Strategies:

**1. Lazy Loading:**
- Load material content only when class selected
- Load assignments only when tab opened
- Defer non-critical resources

**2. Caching:**
- LocalStorage for all data
- Service Worker for offline access
- Pre-cache LMS pages on install

**3. Efficient Rendering:**
- Use template literals for dynamic HTML
- Minimize DOM manipulations
- Update only changed elements

**4. File Handling:**
- Validate files before upload
- Show progress indicators
- Limit file size to 10MB
- Accept common formats only

---

## 🐛 Troubleshooting

### Common Issues:

**1. Files not uploading:**
- Check file size (max 10MB)
- Verify file type (PDF, DOC, DOCX, PPT, JPG, PNG, ZIP)
- Browser may block drag & drop on some devices
- Solution: Use file picker button

**2. Progress not updating:**
- Click "Tandai Selesai" button
- Refresh page to see changes
- Check localStorage in DevTools
- Clear cache if stuck

**3. Assignments not showing:**
- Ensure assignment created for correct class
- Check classId matches
- Verify localStorage data
- Re-save via Database functions

**4. Grades not visible:**
- Assessor must click "Simpan Nilai"
- Check submission.score is not null
- Reload page for updates
- Verify user viewing correct assignment

**5. Classmates not showing:**
- Other users must be enrolled in same module
- Check enrollments array
- Add demo users for testing
- Verify moduleId matches

---

## 📈 Future Enhancements

### Planned Features:

- [ ] **Real-time Notifications** - Push alerts for new assignments, grades
- [ ] **Discussion Forum** - Thread-based class discussions
- [ ] **Live Chat** - Real-time messaging between students/assessor
- [ ] **File Storage** - Cloud storage integration for files
- [ ] **Quiz System** - Interactive quizzes with auto-grading
- [ ] **Video Integration** - Embed YouTube/Vimeo videos
- [ ] **Certificate Generation** - Auto-generate completion certificates
- [ ] **Analytics Dashboard** - Advanced charts & insights
- [ ] **Bulk Operations** - Grade multiple submissions at once
- [ ] **Export Reports** - PDF/Excel export for grades
- [ ] **Calendar View** - Assignment deadlines calendar
- [ ] **Peer Review** - Students review each other's work
- [ ] **Gamification** - Badges, points, leaderboards
- [ ] **Mobile App** - Native iOS/Android apps

---

## 🔒 Security Considerations

### Current Implementation:

**Authentication:**
- RequireAuth() checks on all pages
- Role-based access (user vs assessor views)
- Session stored in localStorage

**Data Validation:**
- File size limits (10MB)
- File type whitelist
- Input sanitization on forms
- Score range validation (0-100)

### Production Recommendations:

**1. Backend Integration:**
- Replace localStorage with API calls
- Use JWT or session tokens
- Server-side validation

**2. File Security:**
- Virus scanning on uploads
- Secure file storage (S3, Cloud Storage)
- Access control per file
- Encrypted file transfer

**3. Data Protection:**
- HTTPS only in production
- CSRF protection
- XSS prevention
- SQL injection prevention (if using DB)

**4. User Privacy:**
- Hide sensitive student data
- Assessor can only see their module students
- Admin can see all, but with audit logs

---

## 📞 Support & Resources

### Documentation Files:
- **README.md** - Main project documentation
- **STRUCTURE.md** - File organization
- **ADMIN-GUIDE.md** - Admin dashboard guide
- **PWA-SETUP.md** - PWA installation guide
- **LMS-GUIDE.md** - This file

### Demo Accounts:

**User:**
```
Username: user1
Password: user123
Access: LMS User Interface
```

**Assessor:**
```
Username: assessor
Password: assessor123
Access: LMS Assessor Interface
```

**Admin:**
```
Username: admin
Password: admin123
Access: All features
```

### Quick Links:

- **User LMS:** `/src/pages/modules/lms-user.html?level=fundamental`
- **Assessor LMS:** `/src/pages/modules/lms-assessor.html`
- **Admin Dashboard:** `/src/pages/admin/dashboard.html`

---

## 🎯 Best Practices

### For Users (Students):

1. **Complete pretest first** - Ensures proper module recommendation
2. **Follow class sequence** - Learn in order 1→2→3→4→5
3. **Mark classes complete** - Helps track your progress
4. **Submit assignments on time** - Check deadlines regularly
5. **Read assessor feedback** - Improve based on comments

### For Assessors:

1. **Create clear assignments** - Detailed descriptions & requirements
2. **Set realistic deadlines** - Give students adequate time
3. **Grade promptly** - Students await feedback
4. **Provide constructive feedback** - Help students improve
5. **Monitor student progress** - Identify struggling students early

### For Admins:

1. **Regular backups** - Export localStorage data
2. **Monitor user activity** - Check enrollment & completion rates
3. **Review assessor performance** - Ensure timely grading
4. **Update content regularly** - Keep materials current
5. **Support users** - Respond to questions/issues

---

**CodeSmart LMS - Professional Learning Platform! 🎓**

Sistem pembelajaran modern dengan fitur lengkap untuk user dan assessor. Happy Learning! 🚀
