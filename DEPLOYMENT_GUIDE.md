# 🚀 CodeSmart Deployment Guide

## Overview

Panduan lengkap untuk deploy dan mengelola aplikasi CodeSmart (Backend + Frontend).

**Last Updated:** November 26, 2025
**Status:** ✅ PRODUCTION READY

---

## 📋 Prerequisites

### System Requirements
- **OS:** Linux (Ubuntu 20.04+ atau compatible)
- **Node.js:** v16.x atau lebih baru
- **Python:** 3.8+ (untuk frontend server)
- **Database:** PostgreSQL (Supabase)
- **Memory:** Minimum 2GB RAM
- **Storage:** Minimum 1GB free space

### Required Software
```bash
# Check installed versions
node --version    # Should be v16.x or higher
npm --version     # Should be 8.x or higher
python3 --version # Should be 3.8 or higher
```

---

## 🎯 Quick Start

### 1. Clone & Setup (First Time Only)

```bash
# Navigate to project directory
cd /home/luthfi/codesmart

# Install backend dependencies
cd backend
npm install
cd ..
```

### 2. Start Servers

#### Option A: Using Deployment Scripts (Recommended)

```bash
# Start both servers
./start-servers.sh

# Check server status
./status-servers.sh

# Stop all servers
./stop-servers.sh
```

#### Option B: Manual Start

**Terminal 1 - Backend:**
```bash
cd /home/luthfi/codesmart/backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd /home/luthfi/codesmart
python3 -m http.server 8080
```

---

## 📁 Deployment Scripts

### start-servers.sh

Script untuk memulai backend dan frontend server secara otomatis.

**Usage:**
```bash
./start-servers.sh
```

**Features:**
- ✅ Checks if servers already running
- ✅ Installs dependencies if needed
- ✅ Starts backend on port 5000
- ✅ Starts frontend on port 8080
- ✅ Logs output to /tmp files
- ✅ Saves PIDs for management

### stop-servers.sh

Script untuk menghentikan semua server yang berjalan.

**Usage:**
```bash
./stop-servers.sh
```

### status-servers.sh

Script untuk mengecek status server dan koneksi.

**Usage:**
```bash
./status-servers.sh
```

---

## 🌐 Access URLs

### Production URLs

| Service | URL | Purpose |
|---------|-----|---------|
| **Backend API** | http://localhost:5000 | API server |
| **Frontend** | http://localhost:8080 | Web application |
| **Health Check** | http://localhost:5000/health | API health status |
| **API Docs** | http://localhost:5000/api/v1 | API endpoints |

### Application Pages

| Page | URL |
|------|-----|
| **Login** | http://localhost:8080/src/pages/auth/login.html |
| **Dashboard** | http://localhost:8080/src/pages/assessor/dashboard-sidebar.html |
| **Profile** | http://localhost:8080/src/pages/assessor/profile.html |
| **Students** | http://localhost:8080/src/pages/assessor/students-sidebar.html |
| **Assignments** | http://localhost:8080/src/pages/assessor/assignments-sidebar.html |
| **Submissions** | http://localhost:8080/src/pages/assessor/submissions-sidebar.html |
| **Materials** | http://localhost:8080/src/pages/assessor/materials-sidebar.html |
| **Discussions** | http://localhost:8080/src/pages/assessor/discussions-sidebar.html |
| **Announcements** | http://localhost:8080/src/pages/assessor/announcements-sidebar.html |
| **Analytics** | http://localhost:8080/src/pages/assessor/analytics-sidebar.html |

---

## 🔑 Test Credentials

### Assessor Account
```
URL:      http://localhost:8080/src/pages/auth/login.html
Username: guru
Password: guru123
Role:     assessor
```

---

## 🧪 Testing Deployment

### 1. Test Backend Health

```bash
curl http://localhost:5000/health
```

### 2. Test Backend API (Login)

```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"guru","password":"guru123"}'
```

### 3. Test Frontend Accessibility

```bash
curl -I http://localhost:8080/src/pages/assessor/dashboard-sidebar.html
```

---

## 📊 Server Management

### View Server Logs

**Backend logs:**
```bash
tail -f /tmp/codesmart-backend.log
```

**Frontend logs:**
```bash
tail -f /tmp/codesmart-frontend.log
```

### Check Running Processes

```bash
# Check backend process
ps aux | grep "node server.js"

# Check frontend process
ps aux | grep "python3 -m http.server"
```

### Restart Servers

```bash
# Stop all servers
./stop-servers.sh

# Wait a moment
sleep 2

# Start all servers
./start-servers.sh
```

---

## 🐛 Troubleshooting

### Issue 1: Port Already in Use

**Solution:**
```bash
# Kill process on port 5000 or 8080
./stop-servers.sh
```

### Issue 2: Backend Won't Start

**Check:**
1. Database connection in `.env` file
2. Node.js version (must be 16+)
3. Dependencies installed (`npm install`)

### Issue 3: Profile Photo Not Loading

✅ **Already fixed!** All photo URLs now use port 5000.

### Issue 4: API Returns 404

✅ **Already fixed!** All endpoints updated to correct routes.
See [API_ENDPOINTS_GUIDE.md](API_ENDPOINTS_GUIDE.md) for reference.

---

## 📝 Support & Documentation

- **API Reference:** [API_ENDPOINTS_GUIDE.md](API_ENDPOINTS_GUIDE.md)
- **Integration Details:** [DATABASE_INTEGRATION_SUMMARY.md](DATABASE_INTEGRATION_SUMMARY.md)
- **Testing Guide:** [INTEGRATION_COMPLETE.md](INTEGRATION_COMPLETE.md)
- **CRUD Status:** [CRUD_IMPLEMENTATION_COMPLETE.md](CRUD_IMPLEMENTATION_COMPLETE.md)

---

**Generated:** November 26, 2025
**Version:** 1.0.0
**Status:** ✅ PRODUCTION READY

🚀 **Happy Coding!** 🚀
