# CodeSmart - Platform Pembelajaran JavaScript

CodeSmart adalah platform pembelajaran interaktif yang dirancang untuk membantu siapa saja menguasai JavaScript dengan cara yang menarik. Platform ini dilengkapi dengan sistem pretest berbasis SVM (Support Vector Machine) untuk menentukan level pembelajaran yang sesuai.

## Fitur Utama

### 1. **Sistem Autentikasi**
- Login & Register
- Role-based access control (Admin, Assessor, User)
- Session management menggunakan localStorage

### 2. **Pretest dengan Algoritma SVM**
- 10 pertanyaan dengan tingkat kesulitan berbeda (easy, medium, hard)
- Sistem penilaian otomatis menggunakan metode SVM
- Rekomendasi modul berdasarkan hasil:
  - **0-45**: Fundamental JavaScript
  - **46-65**: Intermediate JavaScript
  - **66-100**: Advance JavaScript

### 3. **Dashboard User**
- Statistik pembelajaran
- Akses ke modul sesuai hasil pretest
- Progress tracking
- Profile management

### 4. **Dashboard Admin Profesional**
- **Sidebar Navigation** - Menu lengkap dengan 8 sections
- **Dashboard Overview** - Statistik cards, charts, recent activity
- **User Management** - CRUD User dengan filter & search
- **Class Management** - Manage semua kelas di 3 modul
- **Pretest Results** - View & analyze hasil pretest semua user
- **Reports & Analytics** - Visualisasi data, module popularity, user growth
- **LMS Management** - Centralized oversight of all LMS activities (NEW!)
- **Settings** - System settings & admin profile
- **Charts & Visualizations** - Pie charts, bar charts, progress bars

### 5. **Dashboard Assessor**
- CRUD Modul (3 level: Fundamental, Intermediate, Advance)
- CRUD Kelas (5 kelas per modul)
- Manage konten pembelajaran
- Update deskripsi dan materi

### 6. **LMS (Learning Management System) Profesional**
**User Interface:**
- **Materi Pembelajaran** - Konten terstruktur dengan code examples, video placeholder
- **Upload Tugas** - Drag & drop file submission (PDF, DOC, PPT, JPG, PNG, ZIP)
- **Teman Sekelas** - Lihat progress teman sekelas di modul yang sama
- **Progress Tracking** - Monitor penyelesaian kelas dengan circular progress
- **Nilai & Feedback** - Lihat hasil penilaian dari assessor
- **Tab Navigation** - Materi, Tugas, Diskusi (coming soon)
- **Sidebar Kelas** - Quick navigation antar kelas
- **Info Panel** - Progress, classmates, assignments summary

**Assessor Interface:**
- **Kelola Tugas** - Create, edit, delete assignments dengan deadline
- **Penilaian** - Grade submissions dengan score & feedback
- **Progress Monitoring** - Track student progress per modul
- **Multi-Module** - Manage 3 modules (Fundamental, Intermediate, Advance)
- **Submission Management** - Review & grade all student work
- **Analytics** - View average scores, completion rates
- **Student Cards** - Visual progress cards per student

**Admin LMS Management:**
- **Module Overview** - Monitor all 3 modules (Fundamental, Intermediate, Advance)
- **Cross-Module Stats** - Total assignments, pending reviews, graded submissions, enrollments
- **Quick Actions** - View all assignments, check pending grades, monitor progress, export data
- **Recent Assignments** - Table view of latest assignments across all modules
- **Recent Submissions** - Pending submissions requiring review
- **Inline Grading** - Quick grade feature directly from admin dashboard
- **Data Export** - Export complete LMS data to JSON for analysis
- **Module Navigation** - Quick access to detailed module management

### 7. **Modul Pembelajaran**
- 3 Level modul (Fundamental, Intermediate, Advance)
- 5 Kelas per modul
- Akses control berdasarkan hasil pretest
- Konten interaktif dengan rich material

## Demo Accounts

| Role     | Username  | Password    | Keterangan                           |
|----------|-----------|-------------|--------------------------------------|
| Admin    | admin     | admin123    | Full access, CRUD user               |
| Assessor | assessor  | assessor123 | CRUD modul dan kelas                 |
| User     | user1     | user123     | Belum pretest                        |
| User     | user2     | user123     | Sudah pretest (score: 55, intermediate) |

## Cara Menggunakan

### Install as PWA:
1. Buka website di browser (Chrome, Edge, Safari)
2. Klik tombol **"Install App"** yang muncul
3. Atau di Chrome: Menu → Install CodeSmart
4. App akan muncul di home screen seperti native app
5. Bisa digunakan offline setelah install!

### Alur Aplikasi:
1. **Landing Page** (`index.html`) - Halaman utama untuk semua pengunjung
   - Jika sudah login → Auto-redirect ke dashboard sesuai role
   - Jika belum login → Tampilkan landing page dengan tombol Login
2. **Login** → Sistem akan redirect otomatis ke:
   - Admin → Admin Dashboard
   - Assessor → Assessor Dashboard
   - User → User Dashboard (atau Pretest jika belum selesai)
3. Setiap role memiliki dashboard terpisah dan fitur khusus

### Untuk User Baru:
1. Buka `index.html` atau launch PWA
2. Klik tombol "Login" di navbar
3. Pilih "Daftar Sekarang" untuk registrasi
4. Setelah login berhasil, **otomatis dialihkan** ke halaman Pretest
5. Kerjakan **Pretest** (10 soal)
6. Sistem akan merekomendasikan modul sesuai skor Anda
7. Akses modul pembelajaran dari User Dashboard

### Untuk Admin:
1. Buka `index.html` dan klik "Login"
2. Login dengan akun admin (admin/admin123)
3. **Otomatis dialihkan** ke **Admin Dashboard** (Professional Sidebar Layout)
4. **Dashboard Tab**: View statistik, charts, analytics
5. **User Management**: CRUD users, filter by role, search
6. **Class Management**: Manage semua kelas di 3 modul
7. **Pretest Results**: View semua hasil pretest & analytics
8. **Reports**: Lihat laporan lengkap, module popularity, user distribution
9. **LMS Management**: Monitor all LMS activities, grade submissions, export data

### Untuk Assessor:
1. Buka `index.html` dan klik "Login"
2. Login dengan akun assessor (assessor/assessor123)
3. **Otomatis dialihkan** ke **Assessor Dashboard**
4. Kelola LMS: Tugas, Penilaian, Progress Siswa

### Untuk User - LMS (Belajar):
1. Login sebagai user (user1/user123 atau user2/user123)
2. Kerjakan pretest jika belum
3. Dari dashboard, klik modul yang direkomendasikan
4. **LMS Interface** akan terbuka dengan:
   - **Sidebar Kiri**: List 5 kelas, klik untuk navigasi
   - **Content Tengah**: Materi, Tugas, Diskusi (tabs)
   - **Info Panel Kanan**: Progress, Teman Sekelas, Ringkasan Tugas
5. Baca materi di tab "Materi"
6. Klik "Tandai Selesai" setelah belajar
7. Buka tab "Tugas" untuk melihat assignments
8. **Upload Tugas**:
   - Klik assignment card
   - Drag & drop file atau klik untuk browse
   - Klik "Kumpulkan Tugas"
9. Lihat nilai & feedback setelah assessor menilai

### Untuk Assessor - LMS (Mengajar):
1. Login sebagai assessor (assessor/assessor123)
2. Dari dashboard assessor, klik "LMS" atau buka langsung `/src/pages/modules/lms-assessor.html`
3. **Pilih Module** (Fundamental/Intermediate/Advance)
4. **Tab Kelas**: Lihat semua kelas di modul
5. **Tab Tugas**:
   - Klik "+ Tambah Tugas Baru"
   - Isi form (kelas, judul, deskripsi, deadline, max score)
   - Simpan
   - Edit/Delete tugas yang ada
6. **Tab Pengumpulan**:
   - Lihat semua submissions
   - Filter by assignment atau status
   - Klik "Beri Nilai" pada submission
   - Masukkan score (0-100) & feedback
   - Simpan - siswa langsung bisa lihat nilai
7. **Tab Siswa**:
   - Lihat progress semua siswa
   - Monitor completion rate, assignments graded, average score

## Teknologi

- HTML5, CSS3, JavaScript (ES6+)
- **Progressive Web App (PWA)** - Installable, Offline-capable
- Service Worker untuk caching & offline support
- LocalStorage untuk data
- Boxicons, ScrollReveal, Swiper
- Dark Mode Support
- Responsive Design (Mobile-first)
- Touch-optimized UI
- Safe Area support untuk notched devices

## Struktur Folder

```
codesmart/
├── index.html              # Landing page
├── manifest.json          # PWA manifest
├── sw.js                  # Service Worker
├── generate-icons.html    # Icon generator
├── README.md
└── src/
    ├── css/
    │   ├── index.css     # Main styles
    │   ├── pwa.css       # PWA & mobile styles
    │   ├── module.css
    │   └── admin.css
    ├── js/
    │   ├── pwa.js        # PWA manager
    │   ├── auth.js       # Authentication
    │   ├── svm.js        # SVM algorithm
    │   ├── index.js
    │   ├── module.js
    │   └── admin.js
    ├── data/
    │   └── database.js   # Mock database
    ├── images/
    │   ├── icon-*.png    # PWA icons (72-512px)
    │   └── JS-LOGO.png
    └── pages/
        ├── auth/         # Login, Register
        ├── user/         # Dashboard, Profile, Pretest
        ├── admin/        # Admin Dashboard
        ├── assessor/     # Assessor Dashboard
        └── modules/      # Module pages

```

---

## 📱 PWA (Progressive Web App)

CodeSmart sekarang adalah **Progressive Web App** yang bisa di-install dan digunakan offline!

### Fitur PWA:
- ✅ **Installable** - Install ke home screen seperti native app
- ✅ **Offline Mode** - Berfungsi tanpa internet
- ✅ **Fast Loading** - Service Worker caching
- ✅ **Auto Update** - Deteksi update otomatis
- ✅ **Push Notifications** - Support notifikasi
- ✅ **Responsive** - Mobile & desktop optimized

### Setup PWA:
Lihat panduan lengkap di **[PWA-SETUP.md](PWA-SETUP.md)** untuk:
- Cara install PWA
- Generate icons
- Deploy ke production
- Testing checklist

### Quick Start:
1. Buka `generate-icons.html` di browser
2. Download semua icons dan simpan ke `/src/images/`
3. Buka website di browser
4. Klik tombol "Install App"
5. Done! 🎉

---

## 📚 Dokumentasi

Untuk panduan lengkap, lihat file-file berikut:

- **[README.md](README.md)** - Dokumentasi utama (file ini)
- **[STRUCTURE.md](STRUCTURE.md)** - Struktur project lengkap
- **[ADMIN-GUIDE.md](ADMIN-GUIDE.md)** - Panduan Admin Dashboard
- **[PWA-SETUP.md](PWA-SETUP.md)** - Setup & deploy PWA
- **[LMS-GUIDE.md](LMS-GUIDE.md)** - Panduan lengkap Learning Management System

---

## 🎯 Quick Access Links

### User Pages:
- **Landing Page**: `/index.html`
- **Login**: `/src/pages/auth/login.html`
- **User Dashboard**: `/src/pages/user/dashboard.html`
- **Pretest**: `/src/pages/user/pretest.html`
- **LMS User**: `/src/pages/modules/lms-user.html?level=fundamental`

### Assessor Pages:
- **Assessor Dashboard**: `/src/pages/assessor/dashboard.html`
- **LMS Assessor**: `/src/pages/modules/lms-assessor.html`

### Admin Pages:
- **Admin Dashboard**: `/src/pages/admin/dashboard.html`

---

## 🆕 What's New in LMS v2.0

**User Features:**
- 🎓 Professional learning interface dengan 3-column layout
- 📝 Assignment submission dengan drag & drop file upload
- 👥 Classmates view - lihat teman sekelas & progress mereka
- 📊 Circular progress tracker per module
- ✅ Mark class as complete functionality
- 💯 View grades & assessor feedback
- 📱 Full responsive untuk mobile & tablet

**Assessor Features:**
- 📋 Assignment management (CRUD)
- ✏️ Grade submissions dengan score & feedback
- 👨‍🎓 Student progress cards dengan visual metrics
- 📈 Analytics: average scores, completion rates
- 🎯 Filter submissions by assignment atau status
- 🔄 Multi-module support (manage 3 modules)

**Technical Improvements:**
- 💾 Extended database schema (assignments, submissions, enrollments)
- 🎨 New LMS CSS dengan modern design
- ⚡ Service Worker v2 dengan improved caching
- 🗂️ File upload support (max 10MB, multiple formats)
- 📊 Progress calculation algorithms
- 🔄 Auto-enrollment system

---

**Selamat Belajar JavaScript! 🚀**

CodeSmart LMS © 2024 - Professional Learning Management System