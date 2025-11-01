# CodeSmart - Project Structure

## 📁 Final Clean Structure

```
codesmart/
│
├── 📄 index.html              # Landing page utama
├── 📄 manifest.json           # PWA manifest configuration
├── 📄 sw.js                   # Service Worker untuk offline & caching
├── 📄 generate-icons.html     # Tool untuk generate PWA icons
├── 📄 README.md               # Dokumentasi utama
├── 📄 PWA-SETUP.md           # Panduan setup PWA
├── 📄 STRUCTURE.md           # File ini - struktur project
├── 📄 .gitignore             # Git ignore configuration
│
└── 📂 src/                    # Source files
    │
    ├── 📂 css/                # Stylesheets
    │   ├── index.css         # Main styles (754KB lines)
    │   ├── pwa.css           # PWA & mobile optimization
    │   ├── module.css        # Module page styles
    │   └── admin.css         # Admin dashboard styles
    │
    ├── 📂 js/                 # JavaScript files
    │   ├── auth.js           # Authentication & session management
    │   ├── svm.js            # SVM algorithm untuk rekomendasi
    │   ├── pwa.js            # PWA manager (install, update, offline)
    │   ├── index.js          # Landing page scripts
    │   ├── module.js         # Module page scripts
    │   └── admin.js          # Admin dashboard scripts
    │
    ├── 📂 data/               # Data & Database
    │   └── database.js       # Mock database + helper functions
    │
    ├── 📂 images/             # Assets & Icons
    │   ├── JS-LOGO.png       # JavaScript logo
    │   ├── .gitkeep          # Ensures folder is tracked
    │   └── icon-*.png        # PWA icons (to be generated)
    │       ├── icon-72x72.png
    │       ├── icon-96x96.png
    │       ├── icon-128x128.png
    │       ├── icon-144x144.png
    │       ├── icon-152x152.png
    │       ├── icon-192x192.png
    │       ├── icon-384x384.png
    │       └── icon-512x512.png
    │
    └── 📂 pages/              # HTML Pages
        │
        ├── 📂 auth/           # Authentication pages
        │   ├── login.html    # Login page
        │   └── register.html # Registration page
        │
        ├── 📂 user/           # User pages
        │   ├── dashboard.html # User dashboard
        │   ├── profile.html   # User profile & settings
        │   └── pretest.html   # Pretest dengan SVM
        │
        ├── 📂 admin/          # Admin pages
        │   └── dashboard.html # Admin dashboard (CRUD users)
        │
        ├── 📂 assessor/       # Assessor pages
        │   └── dashboard.html # Assessor dashboard (CRUD modules)
        │
        └── 📂 modules/        # Learning modules
            ├── module-fundamental.html
            ├── module-intermediate.html
            └── module-advance.html
```

---

## 📊 File Statistics

### Total Files by Type:
- **HTML**: 11 files (1 landing + 10 pages)
- **CSS**: 4 files
- **JavaScript**: 6 files
- **JSON**: 1 file (manifest)
- **Markdown**: 3 files (docs)
- **Service Worker**: 1 file (sw.js)
- **Tools**: 1 file (generate-icons.html)

### Total Size Estimation:
- **HTML Files**: ~150 KB
- **CSS Files**: ~30 KB
- **JavaScript Files**: ~50 KB
- **Documentation**: ~25 KB
- **Total (without images)**: ~255 KB

---

## 📝 File Descriptions

### Root Level Files

#### `index.html`
- Landing page dengan hero section
- Module overview
- Contact form
- Responsive navbar
- PWA meta tags & splash screen

#### `manifest.json`
- PWA configuration
- App name, colors, icons
- Display mode: standalone
- Shortcuts untuk quick actions

#### `sw.js`
- Service Worker
- Cache strategy: cache-first
- Offline fallback
- Auto-update mechanism
- Push notification support

#### `generate-icons.html`
- Icon generator tool
- Creates 8 sizes of PWA icons
- One-click download all
- Custom CodeSmart branding

---

### CSS Files (`src/css/`)

#### `index.css` (Main)
- Base styles & CSS variables
- Typography (Poppins font)
- Layout components
- Sections: home, about, modules, contact
- Dark mode support
- Responsive breakpoints
- **Size**: ~25 KB

#### `pwa.css` (PWA Optimization)
- Mobile-first optimizations
- Safe area insets (notched devices)
- Touch-friendly buttons (44x44px min)
- iOS & Android specific fixes
- Landscape mode adjustments
- Display mode specific styles
- Loading states & animations
- **Size**: ~5 KB

#### `module.css`
- Module page specific styles
- Class cards
- Progress bars
- Modal overlays
- **Size**: Variable

#### `admin.css`
- Admin dashboard styles
- Tables & forms
- CRUD modals
- Statistics cards
- **Size**: Variable

---

### JavaScript Files (`src/js/`)

#### `auth.js` (Authentication)
**Size**: ~3 KB
**Functions**:
- `login(username, password)` - User authentication
- `logout()` - Clear session
- `register(userData)` - New user registration
- `requireAuth()` - Route protection
- `requireRole(role)` - Role-based access
- `canAccessModule(level)` - Module access check
- `redirectToDashboard()` - Smart redirect

#### `svm.js` (SVM Algorithm)
**Size**: ~2.5 KB
**Functions**:
- `calculateScore(answers, questions)` - Score calculation
- `recommendModule(score)` - SVM classification
- `analyzeResults(answers, questions)` - Detailed analysis
- `getLearningPath(score)` - Learning path suggestion
- Score boundaries: 0-45, 46-65, 66-100

#### `pwa.js` (PWA Manager)
**Size**: ~7.8 KB
**Functions**:
- `registerServiceWorker()` - SW registration
- `setupInstallPrompt()` - Install UI
- `promptInstall()` - Trigger install
- `showUpdateNotification()` - Update alerts
- `updateApp()` - Apply updates
- `setupOfflineDetection()` - Network status
- `requestNotificationPermission()` - Push setup

#### `index.js` (Landing Page)
**Size**: ~1.5 KB
**Functions**:
- Menu toggle
- Scroll active links
- Sticky navbar
- Dark mode toggle
- ScrollReveal animations
- Swiper initialization

#### `module.js`
**Size**: ~1 KB
**Functions**:
- Module navigation
- Class loading
- Progress tracking

#### `admin.js`
**Size**: ~1 KB
**Functions**:
- Admin utilities
- Table operations

---

### Data (`src/data/`)

#### `database.js`
**Size**: ~15 KB
**Contains**:
- Users array (4 demo users)
- Modules array (3 modules)
- Classes array (15 classes total, 5 per module)
- Pretest questions (10 questions)

**Helper Functions**:
- User CRUD operations
- Module/Class CRUD operations
- LocalStorage sync
- Authentication helpers

---

### Pages (`src/pages/`)

#### Auth Pages (`auth/`)
- **login.html**: 8.2 KB - Login form with validation
- **register.html**: 8.9 KB - Registration form

#### User Pages (`user/`)
- **dashboard.html**: 16.7 KB - User dashboard with stats & modules
- **profile.html**: 17.3 KB - Profile edit & pretest results
- **pretest.html**: 18.5 KB - 10 question pretest with SVM

#### Admin Pages (`admin/`)
- **dashboard.html**: 26 KB - CRUD users, filter, search

#### Assessor Pages (`assessor/`)
- **dashboard.html**: 26.1 KB - CRUD modules & classes (5 per module)

#### Module Pages (`modules/`)
- **module-fundamental.html**: 11.2 KB - 5 classes
- **module-intermediate.html**: 11.2 KB - 5 classes
- **module-advance.html**: 11.2 KB - 5 classes

---

## 🎯 Feature Map

### Pages by User Role:

#### 👤 **Guest (Not Logged In)**
```
index.html
└── auth/login.html
    └── auth/register.html
```

#### 👨‍💼 **User (After Login)**
```
user/pretest.html (mandatory first time)
└── user/dashboard.html
    ├── user/profile.html
    ├── modules/module-fundamental.html (if score 0-45)
    ├── modules/module-intermediate.html (if score 46-65)
    └── modules/module-advance.html (if score 66-100)
```

#### 👑 **Admin**
```
admin/dashboard.html (all features)
```

#### 📚 **Assessor**
```
assessor/dashboard.html (manage all modules & classes)
```

---

## 🔄 Data Flow

### Authentication Flow:
```
index.html
    ↓ Click Login
auth/login.html
    ↓ Submit credentials
auth.js → database.js
    ↓ Success
Check pretestCompleted?
    ↓ No → user/pretest.html
    ↓ Yes → user/dashboard.html
```

### Pretest Flow:
```
user/pretest.html
    ↓ Answer 10 questions
svm.js → calculateScore()
    ↓
svm.js → recommendModule()
    ↓ Update user data
database.js → saveToLocalStorage()
    ↓
user/dashboard.html (modules unlocked)
```

### Module Access Flow:
```
user/dashboard.html
    ↓ Click module
auth.js → canAccessModule(level)
    ↓ Check score boundary
    ↓ Allowed → modules/module-*.html
    ↓ Denied → Alert message
```

---

## 🎨 Styling Architecture

### CSS Variables (Theming):
```css
:root {
    --bg-color: #fdfdfd;
    --text-color: #333;
    --main-color: #754ef9;
    --white-color: #fdfdfd;
    --shadow-color: rgba(0, 0, 0, .2);
}

.dark-mode {
    --bg-color: #0b061f;
    --text-color: #fdfdfd;
    --shadow-color: rgba(0, 0, 0, .7);
}
```

### Responsive Breakpoints:
- **1200px**: Desktop large
- **1024px**: Desktop / Tablet landscape
- **991px**: Tablet
- **768px**: Mobile landscape / Tablet portrait
- **450px**: Mobile small

---

## 🔌 External Dependencies

### CDN Resources:
1. **Boxicons** - Icon library
   - URL: `https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css`
   - Size: ~100 KB

2. **ScrollReveal** - Scroll animations
   - URL: `https://unpkg.com/scrollreveal`
   - Size: ~20 KB

3. **Swiper** - Carousel/slider
   - URL: `https://cdn.jsdelivr.net/npm/swiper@9/swiper-bundle.min.css`
   - URL: `https://cdn.jsdelivr.net/npm/swiper@9/swiper-bundle.min.js`
   - Size: ~150 KB combined

4. **Google Fonts** - Poppins
   - URL: `https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900`
   - Size: ~50 KB

**Total External**: ~320 KB

---

## 💾 Data Storage

### LocalStorage Keys:
```javascript
'codesmart_users'      // Users array
'codesmart_modules'    // Modules & classes array
'codesmart_session'    // Current user session
'darkMode'             // Dark mode preference ('enabled' | 'disabled')
```

### Cache Storage (Service Worker):
```javascript
'codesmart-v1'         // Static cache (precache)
'codesmart-runtime-v1' // Runtime cache (dynamic)
```

---

## 🚀 Performance Optimization

### Implemented:
- ✅ Service Worker caching
- ✅ CSS variables (no recalculation)
- ✅ Minimal DOM manipulation
- ✅ Lazy event listeners
- ✅ Debounced scroll events
- ✅ CSS animations (GPU accelerated)
- ✅ Image lazy loading ready

### To Implement (Optional):
- [ ] Minify CSS/JS
- [ ] Image optimization (WebP)
- [ ] Code splitting
- [ ] Critical CSS inline
- [ ] Preload fonts
- [ ] Defer non-critical scripts

---

## 📱 PWA Checklist

### ✅ Completed:
- [x] manifest.json configured
- [x] Service Worker registered
- [x] Meta tags all pages
- [x] Icons ready (need generation)
- [x] Offline support
- [x] Install prompt
- [x] Update mechanism
- [x] Safe area support
- [x] Touch optimization
- [x] HTTPS ready

### ⚠️ Pending:
- [ ] Generate 8 icon sizes
- [ ] Deploy to HTTPS
- [ ] Lighthouse audit
- [ ] Cross-browser test

---

## 🔧 Maintenance Guide

### Adding New Page:
1. Create HTML in appropriate `src/pages/` subfolder
2. Add PWA meta tags (copy from existing)
3. Link to `../../css/index.css` and `../../css/pwa.css`
4. Add `<script src="/src/js/pwa.js"></script>` before `</body>`
5. Add route to `database.js` if needed
6. Update this STRUCTURE.md

### Adding New Module Level:
1. Copy existing module HTML
2. Update module level variable
3. Add to `database.js` modules array
4. Update SVM boundaries in `svm.js`
5. Update user dashboard access logic

### Updating Styles:
1. Main styles → `src/css/index.css`
2. Mobile/PWA → `src/css/pwa.css`
3. Use CSS variables for colors
4. Test dark mode
5. Check responsive breakpoints

---

## 📞 Support Files

### Documentation:
- **README.md** - Main documentation
- **PWA-SETUP.md** - PWA setup guide
- **STRUCTURE.md** - This file
- **.gitignore** - Git exclusions

### Tools:
- **generate-icons.html** - Icon generator
- **sw.js** - Service Worker
- **manifest.json** - PWA config

---

**Project Structure Complete! ✅**

Clean, organized, dan production-ready! 🎉
