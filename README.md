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
- **Sidebar Navigation** - Menu lengkap dengan 7 sections
- **Dashboard Overview** - Statistik cards, charts, recent activity
- **User Management** - CRUD User dengan filter & search
- **Class Management** - Manage semua kelas di 3 modul
- **Pretest Results** - View & analyze hasil pretest semua user
- **Reports & Analytics** - Visualisasi data, module popularity, user growth
- **Settings** - System settings & admin profile
- **Charts & Visualizations** - Pie charts, bar charts, progress bars

### 5. **Dashboard Assessor**
- CRUD Modul (3 level: Fundamental, Intermediate, Advance)
- CRUD Kelas (5 kelas per modul)
- Manage konten pembelajaran
- Update deskripsi dan materi

### 6. **Modul Pembelajaran**
- 3 Level modul (Fundamental, Intermediate, Advance)
- 5 Kelas per modul
- Akses control berdasarkan hasil pretest
- Konten interaktif

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

### Untuk User Baru:
1. Buka `index.html` atau launch PWA
2. Klik tombol "Login" di navbar
3. Pilih "Daftar Sekarang" untuk registrasi
4. Setelah login, kerjakan **Pretest** (10 soal)
5. Sistem akan merekomendasikan modul sesuai skor Anda
6. Akses modul pembelajaran dari dashboard

### Untuk Admin:
1. Login dengan akun admin (admin/admin123)
2. Masuk ke **Admin Dashboard** (Professional Sidebar Layout)
3. **Dashboard Tab**: View statistik, charts, analytics
4. **User Management**: CRUD users, filter by role, search
5. **Class Management**: Manage semua kelas di 3 modul
6. **Pretest Results**: View semua hasil pretest & analytics
7. **Reports**: Lihat laporan lengkap, module popularity, user distribution

### Untuk Assessor:
1. Login dengan akun assessor (assessor/assessor123)
2. Masuk ke **Assessor Dashboard**
3. CRUD Modul dan Kelas (5 kelas per modul)

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

**Selamat Belajar JavaScript! 🚀**

CodeSmart © 2024 - Now available as PWA!