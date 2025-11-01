# Admin Dashboard Guide - CodeSmart

## 📊 Dashboard Admin Profesional

Admin Dashboard CodeSmart adalah sistem manajemen lengkap dengan sidebar profesional untuk mengelola seluruh aspek platform pembelajaran.

---

## 🎯 Fitur Utama

### 1. **Sidebar Navigation**
Menu navigasi lengkap di sebelah kiri dengan 7 sections:
- 📊 **Dashboard** - Overview & statistik
- 👥 **User Management** - Kelola semua user
- 📚 **Class Management** - Kelola kelas & modul
- 📝 **Pretest Results** - Hasil pretest semua user
- 📈 **Reports & Analytics** - Laporan & analisis
- ⚙️ **Settings** - Pengaturan sistem
- 🚪 **Logout** - Keluar dari admin

---

## 📊 Tab 1: Dashboard Overview

### Statistik Cards (4 Cards):

#### **1. Total Users**
- Menampilkan total semua user
- Breakdown by role:
  - 👑 Admin
  - 📚 Assessor
  - 👤 User
- **Data source**: `Database.users.length`

#### **2. Total Classes**
- Total kelas dari semua modul (15 kelas)
- Breakdown per modul:
  - Fundamental: 5 kelas
  - Intermediate: 5 kelas
  - Advance: 5 kelas
- **Data source**: Sum of all `module.classes.length`

#### **3. Pretest Completed**
- Jumlah user yang sudah pretest
- Completion rate (%)
- **Data source**: `users.filter(u => u.pretestCompleted).length`

#### **4. Average Score**
- Rata-rata skor pretest
- Min score - Max score
- **Data source**: Average of `user.pretestScore`

### Charts & Visualizations:

#### **Pie Chart: User Distribution by Role**
- Visual breakdown user berdasarkan role
- Colors:
  - Admin: Red
  - Assessor: Yellow
  - User: Green
- **Implementation**: CSS `conic-gradient`

#### **Bar Chart: Module Popularity**
- Berapa banyak user di setiap level modul
- Bars:
  - Fundamental (0-45)
  - Intermediate (46-65)
  - Advance (66-100)
- **Data**: Count users by `recommendedModule`

#### **Bar Chart: Pretest Score Distribution**
- Distribusi skor dalam 3 kategori
- Categories:
  - 0-45: Fundamental
  - 46-65: Intermediate
  - 66-100: Advance
- **Data**: Group users by score range

#### **Progress Bars: Module Completion**
- Completion rate per modul
- Shows percentage of users in each level
- Color-coded by module level

### Recent Activity:
- List 5 aktivitas terakhir
- Format: "User [name] completed pretest with score [score]"
- Sorted by most recent
- **Data**: Users who completed pretest

---

## 👥 Tab 2: User Management

### Features:

#### **Search & Filter:**
- **Search Bar**: Search by name, username, atau email
- **Role Filter**: Dropdown untuk filter by role
  - All (default)
  - Admin
  - Assessor
  - User

#### **User Table:**
Kolom:
- **ID**: User ID
- **Name**: Full name
- **Username**: Login username
- **Email**: Email address
- **Role**: Badge berwarna (Admin/Assessor/User)
- **Pretest Score**: Skor pretest (atau "-" jika belum)
- **Actions**: Edit & Delete buttons

#### **CRUD Operations:**

**Add New User:**
- Button: "Add New User"
- Modal dengan form:
  - Full Name
  - Username (unique)
  - Email (unique)
  - Password
  - Role (dropdown: admin/assessor/user)
- **Validation**: Check username & email uniqueness

**Edit User:**
- Click Edit button
- Modal dengan pre-filled data
- Can update: Name, Email, Role
- Password optional (kosongkan jika tidak ubah)

**Delete User:**
- Click Delete button
- Confirmation dialog
- **Action**: `Database.deleteUser(userId)`
- Auto refresh table

#### **Table Features:**
- Striped rows (alternate colors)
- Hover effect
- Responsive scrolling
- Badge colors by role

---

## 📚 Tab 3: Class Management

### Structure:
- **3 Sub-tabs** (Fundamental, Intermediate, Advance)
- Each tab shows 5 classes for that module

### Class Table:
Kolom:
- **Order**: Class sequence (1-5)
- **Title**: Class name
- **Description**: Brief description
- **Actions**: Edit & Delete buttons

### CRUD Operations:

**Add New Class:**
- Button: "Add New Class"
- Modal form:
  - Title
  - Description
  - Content (textarea - learning material)
  - Order (auto-set to next number)
- **Action**: `Database.addClass(moduleId, classData)`

**Edit Class:**
- Click Edit button
- Modal dengan pre-filled data
- Update semua field
- **Action**: `Database.updateClass(classId, updates)`

**Delete Class:**
- Click Delete button
- Confirmation dialog
- **Action**: `Database.deleteClass(classId)`

### Features:
- Tab switching between modules
- Auto-sort by order number
- Class count badge per tab
- Color-coded module tabs

---

## 📝 Tab 4: Pretest Results

### Statistics Cards:

#### **Average Score**
- Overall average pretest score
- Formula: `sum(scores) / total`

#### **Pass Rate**
- Percentage of users with score ≥ 60
- Formula: `(users >= 60) / total * 100`

#### **Highest Score**
- Best pretest score achieved
- Show user name

#### **Lowest Score**
- Lowest pretest score
- Show user name

### Filter & Search:

**Level Filter:**
- All Results (default)
- Fundamental (0-45)
- Intermediate (46-65)
- Advance (66-100)

**Search:**
- Search by user name
- Real-time filtering

### Results Table:
Kolom:
- **User Name**: Full name
- **Score**: Pretest score (0-100)
- **Level**: Badge dengan warna
  - Fundamental: Cyan
  - Intermediate: Yellow
  - Advance: Red
- **Recommendation**: Module name
- **Status**: "Completed"

### Actions:
- **Export to CSV** button (prepared for implementation)
- Sortable columns (click header)
- Pagination (if many results)

---

## 📈 Tab 5: Reports & Analytics

### Metrics Cards:

#### **Total Registered Users**
- Total users in system
- Growth indicator

#### **Completed Pretests**
- Number of finished pretests
- Completion percentage

#### **Most Popular Module**
- Module dengan user terbanyak
- Show percentage

#### **Overall Success Rate**
- Percentage of users with passing scores
- Based on 60% threshold

### Visualizations:

#### **1. Module Distribution (Pie Chart)**
- Visual representation of users per module
- Colors:
  - Fundamental: #06b6d4
  - Intermediate: #fbbf24
  - Advance: #ef4444
- Shows percentage & count

#### **2. User Growth (Bar Chart)**
- Monthly user registration (dummy data)
- Last 6 months
- Bar heights represent user count

#### **3. Performance Metrics**
Per module progress bars showing:
- Fundamental: X users (X%)
- Intermediate: X users (X%)
- Advance: X users (X%)

#### **4. Role Distribution**
Progress bars for:
- Admin: X users (X%)
- Assessor: X users (X%)
- User: X users (X%)

### Key Insights:

**Module Popularity:**
- Calculate which module has most users
- Show percentage distribution
- Identify trends

**Success Rate:**
- Overall pass rate
- Pass rate per module level
- Score distribution

**User Activity:**
- Total active users
- Pretest completion rate
- Module enrollment rate

---

## ⚙️ Tab 6: Settings

### Admin Profile:
Form to edit admin info:
- Full Name
- Email
- Username
- Password (optional)

**Actions:**
- Save Changes button
- Cancel button

### System Settings:
Checkboxes untuk:
- ✅ Email Notifications
- ✅ Auto Backup Database
- ⚠️ Maintenance Mode

**Note**: Settings saved to localStorage

---

## 🎨 Design & Styling

### Color Scheme:
```css
Primary: #754ef9 (Purple)
Background: #fdfdfd (Light) / #0b061f (Dark)
Text: #333 (Light) / #fdfdfd (Dark)
Sidebar: var(--main-color)
```

### Role Badges:
- **Admin**: Red background
- **Assessor**: Yellow background
- **User**: Green background

### Level Badges:
- **Fundamental**: Cyan (#06b6d4)
- **Intermediate**: Yellow (#fbbf24)
- **Advance**: Red (#ef4444)

### Responsive Design:
- **Desktop**: Sidebar 260px, always visible
- **Tablet**: Sidebar collapsible
- **Mobile**: Hamburger menu, overlay sidebar

### Dark Mode:
- Auto-detect system preference
- Toggle available
- All charts adapt to theme

---

## 🔢 Data Calculations

### Formulas:

**Total Users:**
```javascript
const totalUsers = Database.users.length;
const admins = users.filter(u => u.role === 'admin').length;
const assessors = users.filter(u => u.role === 'assessor').length;
const regularUsers = users.filter(u => u.role === 'user').length;
```

**Average Score:**
```javascript
const completedTests = users.filter(u => u.pretestCompleted);
const avgScore = completedTests.reduce((sum, u) => sum + u.pretestScore, 0) / completedTests.length;
```

**Module Distribution:**
```javascript
const fundamental = users.filter(u => u.recommendedModule === 'fundamental').length;
const intermediate = users.filter(u => u.recommendedModule === 'intermediate').length;
const advance = users.filter(u => u.recommendedModule === 'advance').length;
```

**Pass Rate:**
```javascript
const passed = users.filter(u => u.pretestScore >= 60).length;
const passRate = (passed / completedTests.length) * 100;
```

---

## 🚀 Usage Tips

### Best Practices:

1. **User Management:**
   - Regularly review user list
   - Remove inactive users
   - Monitor role distribution

2. **Class Management:**
   - Keep content up-to-date
   - Maintain consistent ordering
   - Regular content review

3. **Pretest Monitoring:**
   - Check average scores
   - Identify difficult questions
   - Adjust boundaries if needed

4. **Analytics:**
   - Review module popularity monthly
   - Track user growth trends
   - Monitor success rates

### Keyboard Shortcuts:
- `Ctrl + F`: Focus search box
- `Esc`: Close modal
- `Tab`: Navigate through form fields

### Quick Actions:
- Click table row to view details
- Double-click to edit (in development)
- Right-click for context menu (in development)

---

## 📊 Chart Implementations

### Pure CSS Charts:

**Pie Chart:**
```css
background: conic-gradient(
    red 0deg 120deg,
    yellow 120deg 240deg,
    green 240deg 360deg
);
```

**Bar Chart:**
```html
<div class="bar" style="height: calc(X% of max-height)"></div>
```

**Progress Bar:**
```html
<div class="progress-bar">
    <div class="fill" style="width: X%"></div>
</div>
```

---

## 🔒 Security

### Access Control:
- `requireRole('admin')` check on page load
- Redirect non-admin users
- Session validation

### Data Protection:
- Never expose passwords in UI
- Validate all inputs
- Sanitize user inputs

### Best Practices:
- Regular backups
- Monitor suspicious activity
- Review access logs

---

## 🐛 Troubleshooting

### Common Issues:

**Charts not showing:**
- Check if users have pretests completed
- Verify data calculations
- Check browser console for errors

**Search not working:**
- Clear localStorage
- Reload page
- Check search input value

**Modal not closing:**
- Click backdrop
- Press Escape
- Check for JavaScript errors

**Data not updating:**
- Call `loadFromLocalStorage()`
- Call `saveToLocalStorage()` after changes
- Refresh page

---

## 📱 Mobile Optimization

### Mobile Features:
- Collapsible sidebar
- Touch-friendly buttons (44x44px min)
- Horizontal scrolling tables
- Responsive cards (stack vertically)
- Bottom navigation alternative

### Tablet Features:
- 2-column card grid
- Partial sidebar collapse
- Optimized chart sizes

---

## 🎯 Future Enhancements

### Planned Features:
- [ ] Real-time data updates
- [ ] Export reports to PDF
- [ ] Email notifications
- [ ] Advanced filtering
- [ ] Bulk user operations
- [ ] Activity timeline
- [ ] Custom date ranges
- [ ] Comparison charts
- [ ] User permissions management
- [ ] Audit logs

---

## 📞 Support

### Resources:
- **Main Docs**: README.md
- **PWA Guide**: PWA-SETUP.md
- **Structure**: STRUCTURE.md
- **This Guide**: ADMIN-GUIDE.md

### Demo Login:
```
Username: admin
Password: admin123
```

---

**Admin Dashboard Complete! 🎉**

Professional, feature-rich, dan production-ready!
