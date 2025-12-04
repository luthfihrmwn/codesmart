# CodeSmart - Adaptive Learning Platform

Platform pembelajaran pemrograman adaptif dengan machine learning untuk personalisasi pengalaman belajar.

## 🎯 Overview

CodeSmart adalah platform pembelajaran yang menggunakan Support Vector Machine (SVM) untuk mengklasifikasikan tingkat kemampuan siswa dan memberikan rekomendasi pembelajaran yang disesuaikan.

**Status:** ✅ Production Ready
**Version:** 2.0.0
**Last Updated:** November 26, 2025

---

## ✨ Features

### For Students
- 📚 Adaptive learning paths berdasarkan pretest
- 📊 Real-time progress tracking
- 💬 Interactive discussion forum
- 📝 Assignment submission with code review
- 🎯 Personalized module recommendations
- 📈 Performance analytics

### For Assessors
- ✅ Full CRUD untuk Assignments, Materials, Announcements
- 📋 Dashboard dengan real-time statistics
- 🎓 Student progress monitoring
- ✍️ Grading system dengan rubric
- 💬 Discussion moderation (Pin/Lock/Solution marking)
- 📊 Analytics dengan ML predictions
- 📁 File upload untuk materials (PDF, PPT, Video)

### For Admins
- 👥 User management (Students, Assessors)
- 🏫 Module dan class management
- 📊 System-wide analytics
- 🔒 Role-based access control

---

## 🚀 Quick Start

### Prerequisites
- Node.js v16+
- Python 3.8+
- PostgreSQL (Supabase)

### Installation

1. **Clone repository**
```bash
git clone <repository-url>
cd codesmart
```

2. **Install dependencies**
```bash
cd backend
npm install
cd ..
```

3. **Start servers**
```bash
# Using deployment scripts (recommended)
./start-servers.sh

# Or check status
./status-servers.sh
```

4. **Access application**
- Frontend: http://localhost:8080
- Backend API: http://localhost:5000
- Login: http://localhost:8080/src/pages/auth/login.html

### Test Credentials

**Assessor:**
- Username: `guru`
- Password: `guru123`

---

## 📁 Project Structure

```
codesmart/
├── backend/                 # Node.js backend server
│   ├── controllers/        # API controllers
│   ├── routes/            # API routes
│   ├── config/            # Configuration files
│   ├── middleware/        # Express middleware
│   └── server.js          # Entry point
├── src/
│   ├── js/                # JavaScript modules
│   │   ├── api-service.js          # API client
│   │   ├── assessor-data-loader.js # Data loading service
│   │   ├── modal-service.js        # Modal system
│   │   └── user-profile-loader.js  # Profile management
│   ├── css/               # Stylesheets
│   │   ├── assessor-modern.css     # Modern UI styles
│   │   ├── modal-system.css        # Modal styles
│   │   └── assessor-override.css   # Override styles
│   └── pages/             # HTML pages
│       ├── auth/          # Authentication pages
│       ├── assessor/      # Assessor pages (9 pages)
│       └── admin/         # Admin pages
├── docs/                  # Documentation
├── start-servers.sh       # Start deployment script
├── stop-servers.sh        # Stop deployment script
├── status-servers.sh      # Server status script
└── README.md             # This file
```

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) | Complete deployment guide |
| [API_ENDPOINTS_GUIDE.md](API_ENDPOINTS_GUIDE.md) | API reference documentation |
| [DATABASE_INTEGRATION_SUMMARY.md](DATABASE_INTEGRATION_SUMMARY.md) | Database integration details |
| [INTEGRATION_COMPLETE.md](INTEGRATION_COMPLETE.md) | Integration testing guide |
| [CRUD_IMPLEMENTATION_COMPLETE.md](CRUD_IMPLEMENTATION_COMPLETE.md) | CRUD operations status |

---

## 🛠️ Technology Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL (Supabase)
- **Authentication:** JWT
- **File Upload:** Multer
- **Machine Learning:** scikit-learn (Python SVM)

### Frontend
- **Core:** Vanilla JavaScript (ES6+)
- **UI:** Custom CSS with modern design
- **Icons:** BoxIcons
- **Charts:** Chart.js
- **API Client:** Fetch API with service layer

---

## 🔌 API Endpoints

### Authentication
```
POST /api/v1/auth/login       # Login
POST /api/v1/auth/register    # Register
POST /api/v1/auth/logout      # Logout
```

### Assessor Endpoints
```
GET  /api/v1/assessor/statistics         # Dashboard stats
GET  /api/v1/assessor/submissions/pending # Pending submissions
GET  /api/v1/assessor/students           # Students list
GET  /api/v1/assessor/assignments        # Assignments list
POST /api/v1/assessor/assignments        # Create assignment
PUT  /api/v1/assessor/assignments/:id    # Update assignment
DELETE /api/v1/assessor/assignments/:id  # Delete assignment
```

See [API_ENDPOINTS_GUIDE.md](API_ENDPOINTS_GUIDE.md) for complete reference.

---

## 🎨 Pages Overview

### Assessor Module (9 Pages)

| Page | Route | CRUD Status | Description |
|------|-------|-------------|-------------|
| Dashboard | `/dashboard-sidebar.html` | Read Only | Overview statistics |
| Students | `/students-sidebar.html` | Read Only | Student list & progress |
| Assignments | `/assignments-sidebar.html` | Full CRUD | Assignment management |
| Submissions | `/submissions-sidebar.html` | Read + Update | Grading submissions |
| Materials | `/materials-sidebar.html` | Full CRUD | Learning materials |
| Discussions | `/discussions-sidebar.html` | Full CRUD+ | Forum with Pin/Lock |
| Announcements | `/announcements-sidebar.html` | Full CRUD | Announcement system |
| Classes | `/classes-sidebar.html` | Read Only | Module list |
| Analytics | `/analytics-sidebar.html` | Read Only | ML analytics |

---

## 🧪 Testing

### Manual Testing

1. **Start servers:**
```bash
./start-servers.sh
```

2. **Run test suite:**
```bash
cd backend
npm test
```

3. **Browser testing:**
- Login with test credentials
- Navigate through all pages
- Test CRUD operations
- Check console for errors
- Verify API responses in Network tab

See [INTEGRATION_COMPLETE.md](INTEGRATION_COMPLETE.md) for detailed testing guide.

---

## 🔒 Security Features

- ✅ JWT authentication with token refresh
- ✅ Role-based access control (RBAC)
- ✅ Input sanitization & HTML escaping
- ✅ File upload validation (type, size)
- ✅ SQL injection prevention (parameterized queries)
- ✅ CORS configuration
- ✅ Rate limiting (planned)
- ✅ Password hashing (bcrypt)

---

## 📊 Database Schema

### Key Tables
- `users` - User accounts (students, assessors, admins)
- `modules` - Learning modules/courses
- `materials` - Learning materials (PDF, video, etc)
- `assignments` - Assignment definitions
- `submissions` - Student submissions
- `discussions` - Forum discussions
- `announcements` - System announcements
- `enrollments` - Student enrollments
- `progress` - Learning progress tracking

---

## 🚀 Deployment

### Development
```bash
./start-servers.sh
```

### Production (Recommended)

1. **Use PM2 for backend:**
```bash
npm install -g pm2
cd backend
pm2 start server.js --name codesmart-backend
pm2 startup
pm2 save
```

2. **Use Nginx for frontend:**
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /home/luthfi/codesmart;
    
    location /api {
        proxy_pass http://localhost:5000;
    }
}
```

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed deployment instructions.

---

## 📝 Scripts

| Script | Command | Description |
|--------|---------|-------------|
| Start Servers | `./start-servers.sh` | Start backend + frontend |
| Stop Servers | `./stop-servers.sh` | Stop all running servers |
| Check Status | `./status-servers.sh` | View server status |

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👥 Authors

- **Development Team** - Initial work
- **Contributors** - See contributors list

---

## 📞 Support

For support and questions:
- Check documentation in `/docs`
- Review [API_ENDPOINTS_GUIDE.md](API_ENDPOINTS_GUIDE.md)
- Check [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)

---

## ✅ Implementation Status

### Completed Features
- ✅ Full API integration with PostgreSQL
- ✅ 9 assessor pages with real data
- ✅ CRUD operations for 5 pages
- ✅ JWT authentication system
- ✅ File upload system
- ✅ Modal system for forms
- ✅ Responsive design
- ✅ Profile photo management (fixed port issue)
- ✅ API endpoint corrections
- ✅ Comprehensive documentation

### Ready for Production
- ✅ Backend server tested
- ✅ Frontend tested
- ✅ API endpoints verified
- ✅ Database integration confirmed
- ✅ Deployment scripts created

---

**Built with ❤️ for adaptive learning**

🚀 **Happy Learning!** 🚀
