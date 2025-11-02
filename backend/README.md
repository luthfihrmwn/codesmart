# CodeSmart Backend API

Backend RESTful API untuk CodeSmart Learning Management System menggunakan Node.js, Express.js, dan PostgreSQL.

## 📋 Daftar Isi

- [Teknologi Stack](#teknologi-stack)
- [Fitur](#fitur)
- [Instalasi](#instalasi)
- [Konfigurasi](#konfigurasi)
- [Database Setup](#database-setup)
- [Menjalankan Server](#menjalankan-server)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [Role-Based Access](#role-based-access)
- [File Upload](#file-upload)
- [Testing](#testing)

---

## 🚀 Teknologi Stack

- **Runtime**: Node.js (v16+)
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **File Upload**: Multer
- **Email**: Nodemailer
- **Validation**: express-validator
- **Security**: Helmet, CORS, Rate Limiting

---

## ✨ Fitur

### Authentication & Authorization
- ✅ User Registration (dengan approval system)
- ✅ Login dengan JWT tokens
- ✅ Refresh token mechanism
- ✅ Password reset dengan security questions
- ✅ Role-based access control (Admin, Assessor, User)
- ✅ Session management

### Admin Features
- ✅ User management (CRUD)
- ✅ User approval system
- ✅ Module management
- ✅ Learning materials management
- ✅ Assignment management
- ✅ Statistics dashboard
- ✅ Data export/import

### Assessor Features
- ✅ View pending submissions
- ✅ Grade assignments dengan rubrics
- ✅ Student progress tracking
- ✅ Promotion request approval
- ✅ Assignment creation

### User Features
- ✅ Pretest submission & scoring
- ✅ Module enrollment
- ✅ Learning progress tracking
- ✅ Assignment submission
- ✅ View grades & feedback
- ✅ Level promotion requests
- ✅ Profile management

### Security
- ✅ Password encryption (bcrypt)
- ✅ JWT authentication
- ✅ Rate limiting
- ✅ CORS protection
- ✅ Helmet security headers
- ✅ Input validation
- ✅ SQL injection protection (parameterized queries)

---

## 📦 Instalasi

### Prerequisites

Pastikan sudah terinstall:
- Node.js (v16 atau lebih tinggi)
- PostgreSQL (v13 atau lebih tinggi)
- npm atau yarn

### Langkah Instalasi

1. **Clone repository**
```bash
cd /home/luthfi/codesmart/backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment variables**
```bash
cp .env.example .env
```

Edit file `.env` dengan konfigurasi Anda:
```env
# Server
PORT=5000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=codesmart_db
DB_USER=postgres
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE=7d

# Email (Gmail example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# Frontend URL
FRONTEND_URL=http://localhost:8000
```

---

## 🗄️ Database Setup

### 1. Buat Database PostgreSQL

```bash
# Login ke PostgreSQL
psql -U postgres

# Buat database
CREATE DATABASE codesmart_db;

# Exit psql
\q
```

### 2. Run Migration (Create Tables)

```bash
# Jalankan schema SQL
psql -U postgres -d codesmart_db -f migrations/schema.sql
```

### 3. Seed Database (Optional - untuk data testing)

Buat file `migrations/seed.sql` atau gunakan script Node.js untuk insert data awal:

```bash
npm run seed
```

---

## 🚀 Menjalankan Server

### Development Mode

```bash
npm run dev
```

Server akan berjalan di `http://localhost:5000` dengan auto-reload (nodemon).

### Production Mode

```bash
npm start
```

### Health Check

Cek apakah server berjalan:
```bash
curl http://localhost:5000/health
```

Response:
```json
{
  "status": "OK",
  "timestamp": "2025-11-03T10:00:00.000Z",
  "uptime": 120.5,
  "environment": "development",
  "version": "v1"
}
```

---

## 📚 API Endpoints

Base URL: `http://localhost:5000/api/v1`

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|--------------|
| POST | `/auth/register` | Register new user | No |
| POST | `/auth/login` | Login user | No |
| POST | `/auth/refresh` | Refresh access token | No |
| POST | `/auth/logout` | Logout user | Yes |
| GET | `/auth/me` | Get current user | Yes |
| PUT | `/auth/update-details` | Update user details | Yes |
| PUT | `/auth/update-password` | Change password | Yes |
| POST | `/auth/forgot-password` | Request password reset | No |
| POST | `/auth/verify-security-answer` | Verify security answer | No |
| POST | `/auth/reset-password` | Reset password | No |

### User Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|--------------|
| GET | `/users/profile` | Get user profile | Yes |
| PUT | `/users/profile` | Update profile | Yes |
| POST | `/users/pretest/submit` | Submit pretest | Yes |
| GET | `/users/pretest/result` | Get pretest result | Yes |
| GET | `/users/enrollments` | Get enrollments | Yes |
| POST | `/users/enrollments` | Enroll in module | Yes |
| GET | `/users/progress` | Get learning progress | Yes |
| POST | `/users/promotion/request` | Request promotion | Yes |

### Module Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|--------------|
| GET | `/modules` | Get all modules | Optional |
| GET | `/modules/:slug` | Get module details | Yes |
| GET | `/modules/:slug/materials` | Get module materials | Yes |
| GET | `/modules/:slug/materials/:classNumber` | Get specific class | Yes |

### Assignment Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|--------------|
| GET | `/assignments/module/:moduleSlug` | Get module assignments | Yes |
| GET | `/assignments/:id` | Get assignment details | Yes |
| GET | `/assignments/user/my-assignments` | Get user assignments | Yes |

### Submission Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|--------------|
| POST | `/submissions` | Submit assignment | Yes |
| GET | `/submissions/my-submissions` | Get user submissions | Yes |
| GET | `/submissions/:id` | Get submission details | Yes |
| PUT | `/submissions/:id` | Resubmit assignment | Yes |

### Admin Endpoints (Admin Only)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/users` | Get all users |
| GET | `/admin/users/:id` | Get user by ID |
| POST | `/admin/users` | Create user |
| PUT | `/admin/users/:id` | Update user |
| DELETE | `/admin/users/:id` | Delete user |
| GET | `/admin/users/pending/approvals` | Get pending approvals |
| POST | `/admin/users/:id/approve` | Approve user |
| POST | `/admin/users/:id/reject` | Reject user |
| GET | `/admin/modules` | Get all modules |
| POST | `/admin/modules` | Create module |
| PUT | `/admin/modules/:id` | Update module |
| DELETE | `/admin/modules/:id` | Delete module |
| POST | `/admin/materials` | Create learning material |
| POST | `/admin/assignments` | Create assignment |
| GET | `/admin/statistics` | Get statistics |
| GET | `/admin/export/users` | Export users data |
| GET | `/admin/export/submissions` | Export submissions |

### Assessor Endpoints (Assessor/Admin Only)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/assessor/submissions/pending` | Get pending submissions |
| GET | `/assessor/submissions/graded` | Get graded submissions |
| GET | `/assessor/submissions/:id` | Get submission details |
| POST | `/assessor/submissions/:id/grade` | Grade submission |
| PUT | `/assessor/submissions/:id/grade` | Update grade |
| GET | `/assessor/students` | Get students list |
| GET | `/assessor/students/:id/progress` | Get student progress |
| GET | `/assessor/promotions/pending` | Get promotion requests |
| POST | `/assessor/promotions/:id/approve` | Approve promotion |
| POST | `/assessor/promotions/:id/reject` | Reject promotion |
| GET | `/assessor/statistics` | Get statistics |
| POST | `/assessor/assignments` | Create assignment |

---

## 🔐 Authentication

### Register

**POST** `/api/v1/auth/register`

```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123",
  "name": "John Doe",
  "phone": "+62812345678"
}
```

Response:
```json
{
  "success": true,
  "message": "Registration successful. Your account is pending admin approval.",
  "data": {
    "user": {
      "id": 1,
      "username": "john_doe",
      "email": "john@example.com",
      "name": "John Doe",
      "role": "user",
      "status": "pending"
    }
  }
}
```

### Login

**POST** `/api/v1/auth/login`

```json
{
  "username": "admin",
  "password": "admin123"
}
```

Response:
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

### Using JWT Token

Include token in Authorization header for protected routes:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

Example dengan curl:
```bash
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
     http://localhost:5000/api/v1/auth/me
```

---

## 👥 Role-Based Access

### Roles

1. **admin** - Full system access
2. **assessor** - Can grade assignments, view student progress
3. **user** - Regular student, can enroll, submit assignments

### Role Permissions

| Feature | User | Assessor | Admin |
|---------|------|----------|-------|
| Register/Login | ✅ | ✅ | ✅ |
| Take Pretest | ✅ | ❌ | ❌ |
| Enroll in Modules | ✅ | ❌ | ✅ |
| Submit Assignments | ✅ | ❌ | ❌ |
| Grade Assignments | ❌ | ✅ | ✅ |
| Approve Promotions | ❌ | ✅ | ✅ |
| User Management | ❌ | ❌ | ✅ |
| Module Management | ❌ | Limited | ✅ |
| System Statistics | ❌ | Limited | ✅ |

---

## 📤 File Upload

### Upload Assignment File

**POST** `/api/v1/submissions`

Content-Type: `multipart/form-data`

```
file: <file>
assignment_id: 1
submission_text: "My submission description"
code_content: "console.log('hello world');"
```

### Allowed File Types
- `.pdf`
- `.doc`, `.docx`
- `.zip`
- `.js`, `.html`, `.css`
- `.txt`

### Maximum File Size
5 MB (configurable via `MAX_FILE_SIZE` env variable)

### Upload Directory
Files stored in: `backend/uploads/submissions/`

---

## 🧪 Testing

### Run Tests

```bash
npm test
```

### Test Coverage

```bash
npm test -- --coverage
```

### Manual API Testing dengan curl

**Register:**
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

**Get User Profile:**
```bash
TOKEN="your_jwt_token_here"
curl -H "Authorization: Bearer $TOKEN" \
     http://localhost:5000/api/v1/auth/me
```

---

## 📂 Struktur Project

```
backend/
├── config/
│   └── database.js          # Database connection config
├── controllers/
│   └── authController.js    # Authentication logic
├── middleware/
│   ├── auth.js              # JWT authentication middleware
│   ├── errorHandler.js      # Global error handler
│   ├── notFound.js          # 404 handler
│   └── validator.js         # Validation middleware
├── migrations/
│   └── schema.sql           # Database schema
├── models/                  # Database models (TODO)
├── routes/
│   ├── admin.js             # Admin routes
│   ├── assessor.js          # Assessor routes
│   ├── assignments.js       # Assignment routes
│   ├── auth.js              # Auth routes
│   ├── modules.js           # Module routes
│   ├── submissions.js       # Submission routes
│   └── users.js             # User routes
├── uploads/                 # File uploads directory
├── utils/
│   └── email.js             # Email utility
├── .env                     # Environment variables
├── .env.example             # Environment template
├── .gitignore               # Git ignore rules
├── package.json             # Dependencies
├── server.js                # Main server file
└── README.md                # This file
```

---

## 🔧 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `5000` |
| `DB_HOST` | PostgreSQL host | `localhost` |
| `DB_PORT` | PostgreSQL port | `5432` |
| `DB_NAME` | Database name | `codesmart_db` |
| `DB_USER` | Database user | `postgres` |
| `DB_PASSWORD` | Database password | - |
| `JWT_SECRET` | JWT secret key | - |
| `JWT_EXPIRE` | JWT expiration | `7d` |
| `JWT_REFRESH_EXPIRE` | Refresh token expiration | `30d` |
| `EMAIL_HOST` | SMTP host | - |
| `EMAIL_PORT` | SMTP port | `587` |
| `EMAIL_USER` | SMTP username | - |
| `EMAIL_PASSWORD` | SMTP password | - |
| `FRONTEND_URL` | Frontend URL | `http://localhost:8000` |
| `MAX_FILE_SIZE` | Max upload size (bytes) | `5242880` (5MB) |
| `BCRYPT_ROUNDS` | Bcrypt salt rounds | `10` |
| `RATE_LIMIT_WINDOW` | Rate limit window (minutes) | `15` |
| `RATE_LIMIT_MAX` | Max requests per window | `100` |

---

## 🐛 Common Issues

### Database Connection Error

**Problem:** `Error: connect ECONNREFUSED 127.0.0.1:5432`

**Solution:**
1. Pastikan PostgreSQL sudah berjalan
2. Cek konfigurasi di `.env`
3. Test connection: `psql -U postgres -d codesmart_db`

### JWT Secret Not Set

**Problem:** `Error: JWT_SECRET is not defined`

**Solution:**
Set `JWT_SECRET` di file `.env`:
```env
JWT_SECRET=your_very_long_random_secret_key_here
```

### Email Not Sending

**Problem:** Email tidak terkirim

**Solution:**
1. Cek konfigurasi SMTP di `.env`
2. Untuk Gmail, gunakan **App Password**, bukan password biasa
3. Enable "Less secure app access" atau gunakan OAuth2

---

## 📝 TODO / Next Steps

### Implementasi Lengkap Controllers

Saat ini routes sudah dibuat dengan stub responses. Langkah selanjutnya:

1. **Implement User Controllers**
   - Pretest submission & scoring logic
   - Enrollment management
   - Progress tracking

2. **Implement Module Controllers**
   - Module CRUD
   - Learning materials management

3. **Implement Submission Controllers**
   - File handling
   - Submission workflow

4. **Implement Grading Controllers**
   - Rubric-based scoring
   - Feedback system

5. **Implement Admin Controllers**
   - User approval system
   - Statistics generation
   - Data export/import

6. **Implement Assessor Controllers**
   - Grading workflow
   - Promotion approval

### Additional Features

- [ ] Real-time notifications (WebSocket)
- [ ] Email verification
- [ ] Two-factor authentication (2FA)
- [ ] Audit logging
- [ ] API documentation (Swagger/OpenAPI)
- [ ] Unit tests & integration tests
- [ ] Docker containerization
- [ ] CI/CD pipeline

---

## 📞 Support

Untuk pertanyaan atau masalah:
- Buat issue di repository
- Email: support@codesmart.com

---

## 📄 License

MIT License - Copyright (c) 2025 CodeSmart Team

---

**Status:** ✅ Backend Structure Complete - Ready for Controller Implementation

**Last Updated:** November 3, 2025
