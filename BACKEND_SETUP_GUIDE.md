# 🚀 CodeSmart Backend Setup Guide

**Panduan Lengkap Setup Backend untuk CodeSmart Learning Management System**

---

## 📋 Apa yang Sudah Dibuat?

Backend lengkap untuk CodeSmart telah dibuat dengan struktur sebagai berikut:

### ✅ Struktur Project Backend

```
backend/
├── config/
│   └── database.js              # Konfigurasi koneksi PostgreSQL
├── controllers/
│   └── authController.js        # Authentication logic (LENGKAP)
├── middleware/
│   ├── auth.js                  # JWT authentication & authorization
│   ├── errorHandler.js          # Global error handler
│   ├── notFound.js              # 404 handler
│   └── validator.js             # Validation middleware
├── migrations/
│   ├── schema.sql               # Database schema (LENGKAP)
│   └── migrate.js               # Migration script
├── routes/
│   ├── admin.js                 # Admin API endpoints
│   ├── assessor.js              # Assessor API endpoints
│   ├── assignments.js           # Assignment API endpoints
│   ├── auth.js                  # Authentication routes (LENGKAP)
│   ├── modules.js               # Module API endpoints
│   ├── submissions.js           # Submission API endpoints (with file upload)
│   └── users.js                 # User API endpoints
├── utils/
│   └── email.js                 # Email service utility
├── uploads/                     # Directory untuk file uploads
├── .env.example                 # Template environment variables
├── .gitignore                   # Git ignore rules
├── package.json                 # Dependencies & scripts
├── server.js                    # Main server file (LENGKAP)
└── README.md                    # Dokumentasi lengkap API
```

---

## 🎯 Fitur Backend yang Sudah Dibuat

### 1. Authentication System ✅ LENGKAP
- ✅ User Registration (dengan approval system)
- ✅ Login dengan JWT tokens
- ✅ Refresh token mechanism
- ✅ Forgot password dengan security questions
- ✅ Password reset
- ✅ Update profile & password
- ✅ Role-based access control (Admin, Assessor, User)

**File:**
- `controllers/authController.js` - **FULLY IMPLEMENTED**
- `routes/auth.js` - **FULLY IMPLEMENTED**
- `middleware/auth.js` - **FULLY IMPLEMENTED**

### 2. Database Schema ✅ LENGKAP
**8 Tables dengan relasi lengkap:**
- `users` - User accounts dengan roles
- `refresh_tokens` - JWT refresh token storage
- `modules` - Learning modules (Fundamental/Intermediate/Advance)
- `learning_materials` - 15 class materials per module
- `assignments` - Assignments dengan rubrics
- `enrollments` - User enrollment & progress tracking
- `submissions` - Assignment submissions dengan file upload
- `audit_logs` - Security audit logging

**File:**
- `migrations/schema.sql` - **FULLY IMPLEMENTED**
- `migrations/migrate.js` - **FULLY IMPLEMENTED**

### 3. API Routes Structure ✅ READY
**7 Route Files:**
- `routes/auth.js` - 10 authentication endpoints
- `routes/users.js` - User profile, pretest, enrollments, progress
- `routes/modules.js` - Module listing & learning materials
- `routes/assignments.js` - Assignment management
- `routes/submissions.js` - Submission dengan file upload (Multer)
- `routes/admin.js` - 20+ admin endpoints
- `routes/assessor.js` - 15+ assessor endpoints

**Status:** Routes structure complete, **ready for controller implementation**

### 4. Security Features ✅ LENGKAP
- ✅ Helmet security headers
- ✅ CORS protection
- ✅ Rate limiting (100 requests per 15 minutes)
- ✅ bcrypt password hashing
- ✅ JWT authentication
- ✅ Input validation (express-validator)
- ✅ SQL injection protection (parameterized queries)
- ✅ File upload validation

### 5. File Upload System ✅ READY
- ✅ Multer configuration untuk file uploads
- ✅ File type validation (.pdf, .doc, .docx, .zip, .js, .html, .css)
- ✅ File size limit (5MB, configurable)
- ✅ Secure file naming
- ✅ Upload directory structure

**File:** `routes/submissions.js`

### 6. Email Service ✅ READY
- ✅ Nodemailer integration
- ✅ Email templates (welcome, approval, grading, promotion)
- ✅ SMTP configuration

**File:** `utils/email.js`

---

## 🚀 Cara Setup Backend

### Step 1: Install Dependencies

```bash
cd /home/luthfi/codesmart/backend
npm install
```

**Dependencies yang akan diinstall:**
- express - Web framework
- pg - PostgreSQL client
- bcryptjs - Password hashing
- jsonwebtoken - JWT authentication
- dotenv - Environment variables
- cors - CORS middleware
- multer - File upload
- express-validator - Input validation
- helmet - Security headers
- express-rate-limit - Rate limiting
- morgan - HTTP logging
- nodemailer - Email service
- compression - Response compression
- nodemon - Development auto-reload

### Step 2: Setup PostgreSQL Database

**Install PostgreSQL** (jika belum):
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# Start PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

**Buat Database:**
```bash
# Login sebagai postgres user
sudo -u postgres psql

# Buat database
CREATE DATABASE codesmart_db;

# Buat user (optional, atau gunakan postgres user)
CREATE USER codesmart_user WITH ENCRYPTED PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE codesmart_db TO codesmart_user;

# Exit
\q
```

### Step 3: Configure Environment Variables

```bash
cd /home/luthfi/codesmart/backend
cp .env.example .env
```

**Edit file `.env`:**
```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=codesmart_db
DB_USER=postgres
DB_PASSWORD=your_postgres_password_here

# JWT Configuration
JWT_SECRET=replace_with_random_secret_minimum_32_characters
JWT_EXPIRE=7d
JWT_REFRESH_EXPIRE=30d

# Email Configuration (Gmail example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
EMAIL_FROM=CodeSmart <noreply@codesmart.com>

# Frontend URL
FRONTEND_URL=http://localhost:8000

# Admin Default Account
ADMIN_EMAIL=admin@codesmart.com
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
ADMIN_NAME=Administrator
```

**Generate JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

**Gmail App Password:**
1. Buka Google Account Settings
2. Security → 2-Step Verification (enable)
3. App Passwords → Generate new password
4. Copy dan paste ke `EMAIL_PASSWORD`

### Step 4: Run Database Migration

```bash
cd /home/luthfi/codesmart/backend
npm run migrate
```

Ini akan:
- ✅ Membuat semua tables
- ✅ Membuat default admin user
- ✅ Setup indexes & triggers

**Output yang diharapkan:**
```
🚀 Starting database migration...
📖 Reading schema.sql...
✅ Database schema created successfully!
👤 Creating default admin user...
✅ Admin user created!
🎉 Migration completed successfully!

📝 Default Admin Credentials:
   Username: admin
   Password: admin123
```

### Step 5: Start Backend Server

**Development mode (auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

**Output yang diharapkan:**
```
===========================================
🚀 CodeSmart Backend Server
===========================================
Environment: development
Server running on port 5000
API Base URL: http://localhost:5000/api/v1
Health Check: http://localhost:5000/health
===========================================
✅ Database connected successfully
```

### Step 6: Test API

**Health check:**
```bash
curl http://localhost:5000/health
```

**Test login:**
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

**Expected response:**
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

---

## 🔌 Menghubungkan Frontend ke Backend

### Update Frontend JavaScript

Edit file `/home/luthfi/codesmart/src/js/auth.js`:

```javascript
// API Configuration
const API_BASE_URL = 'http://localhost:5000/api/v1';

// Replace existing authService.login function
async login(username, password) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (data.success) {
            // Store token and user data
            localStorage.setItem('codesmart_token', data.data.token);
            localStorage.setItem('codesmart_refresh_token', data.data.refreshToken);
            localStorage.setItem('codesmart_session', JSON.stringify(data.data.user));

            return { success: true, user: data.data.user };
        } else {
            return { success: false, message: data.message };
        }
    } catch (error) {
        console.error('Login error:', error);
        return { success: false, message: 'Network error. Please try again.' };
    }
}

// Add token to all API requests
async function apiRequest(endpoint, options = {}) {
    const token = localStorage.getItem('codesmart_token');

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers
    });

    const data = await response.json();

    // Handle token expiration
    if (data.expired) {
        // Refresh token logic
        await refreshAuthToken();
        // Retry request
    }

    return data;
}
```

### Enable CORS pada Frontend

Backend sudah dikonfigurasi untuk menerima request dari `http://localhost:8000`.

Jalankan frontend dengan HTTP server:
```bash
cd /home/luthfi/codesmart
python -m http.server 8000
```

---

## 📚 API Endpoints Lengkap

### Authentication
- POST `/api/v1/auth/register` - Register user baru
- POST `/api/v1/auth/login` - Login
- POST `/api/v1/auth/refresh` - Refresh token
- POST `/api/v1/auth/logout` - Logout
- GET `/api/v1/auth/me` - Get current user
- PUT `/api/v1/auth/update-details` - Update profile
- PUT `/api/v1/auth/update-password` - Change password
- POST `/api/v1/auth/forgot-password` - Forgot password
- POST `/api/v1/auth/reset-password` - Reset password

### Users (⚠️ Need controller implementation)
- GET `/api/v1/users/profile`
- PUT `/api/v1/users/profile`
- POST `/api/v1/users/pretest/submit`
- GET `/api/v1/users/enrollments`
- GET `/api/v1/users/progress`

### Admin (⚠️ Need controller implementation)
- GET `/api/v1/admin/users`
- POST `/api/v1/admin/users`
- POST `/api/v1/admin/users/:id/approve`
- GET `/api/v1/admin/modules`
- GET `/api/v1/admin/statistics`

### Assessor (⚠️ Need controller implementation)
- GET `/api/v1/assessor/submissions/pending`
- POST `/api/v1/assessor/submissions/:id/grade`
- GET `/api/v1/assessor/students`
- POST `/api/v1/assessor/promotions/:id/approve`

**Full API documentation:** `backend/README.md`

---

## ⚠️ Yang Masih Perlu Diimplementasi

### Controllers yang Perlu Dibuat

Semua routes sudah dibuat, tetapi masih berupa **stub responses**. Perlu implementasi controller:

1. **userController.js** - User-specific operations
2. **moduleController.js** - Module CRUD
3. **assignmentController.js** - Assignment management
4. **submissionController.js** - Submission handling
5. **adminController.js** - Admin operations
6. **assessorController.js** - Grading & student management

### Migration dari localStorage ke API

Frontend saat ini menggunakan `localStorage` untuk data. Perlu migrasi ke API calls:

1. **Login/Register** - Sudah ada endpoint, tinggal integrate
2. **User Profile** - Need implementation
3. **Pretest Submission** - Need implementation
4. **Module Enrollment** - Need implementation
5. **Assignment Submission** - Endpoint ready (dengan file upload)
6. **Grading System** - Need implementation

---

## 🐛 Troubleshooting

### Port Already in Use

**Error:** `EADDRINUSE: address already in use :::5000`

**Solution:**
```bash
# Find process using port 5000
lsof -i :5000

# Kill process
kill -9 <PID>

# Or use different port in .env
PORT=5001
```

### Database Connection Error

**Error:** `connect ECONNREFUSED 127.0.0.1:5432`

**Solution:**
1. Check PostgreSQL is running:
```bash
sudo systemctl status postgresql
```

2. Start if not running:
```bash
sudo systemctl start postgresql
```

3. Verify credentials in `.env`

### JWT Secret Error

**Error:** `JWT_SECRET is not defined`

**Solution:**
Set JWT_SECRET in `.env` file:
```bash
JWT_SECRET=your_random_64_character_secret_here
```

---

## 📊 Status Backend

| Component | Status | Implementation |
|-----------|--------|----------------|
| **Database Schema** | ✅ Complete | 100% |
| **Authentication API** | ✅ Complete | 100% |
| **JWT Middleware** | ✅ Complete | 100% |
| **File Upload** | ✅ Complete | 100% |
| **Email Service** | ✅ Ready | 100% |
| **Admin Routes** | ⚠️ Stub | 20% |
| **Assessor Routes** | ⚠️ Stub | 20% |
| **User Routes** | ⚠️ Stub | 20% |
| **Module Routes** | ⚠️ Stub | 20% |
| **Assignment Routes** | ⚠️ Stub | 20% |
| **Submission Routes** | ⚠️ Stub | 30% |

**Overall Backend Status:** **60% Complete**

**Next Steps:**
1. Implement remaining controllers
2. Add unit tests
3. Complete API documentation
4. Frontend integration
5. Production deployment

---

## 📝 Quick Start Commands

```bash
# 1. Install dependencies
cd /home/luthfi/codesmart/backend
npm install

# 2. Setup environment
cp .env.example .env
# Edit .env dengan konfigurasi Anda

# 3. Create database
sudo -u postgres psql
CREATE DATABASE codesmart_db;
\q

# 4. Run migrations
npm run migrate

# 5. Start server
npm run dev

# 6. Test API
curl http://localhost:5000/health
```

---

## 🎯 Kesimpulan

Backend CodeSmart telah dibuat dengan:

✅ **Struktur lengkap** - 25+ files organized
✅ **Database schema** - 8 tables dengan relasi
✅ **Authentication system** - Fully working JWT auth
✅ **Security features** - Helmet, CORS, Rate limiting, bcrypt
✅ **File upload** - Multer dengan validation
✅ **Email service** - Nodemailer dengan templates
✅ **API routes** - 60+ endpoints (stub ready)
✅ **Documentation** - Comprehensive README

**Siap untuk:**
- ✅ Development & testing
- ✅ Controller implementation
- ✅ Frontend integration

**Perlu dilanjutkan:**
- ⚠️ Implement controllers untuk non-auth routes
- ⚠️ Unit testing
- ⚠️ Frontend API integration
- ⚠️ Production deployment

---

**Last Updated:** November 3, 2025
**Status:** ✅ **Backend Foundation Complete - Ready for Development**
