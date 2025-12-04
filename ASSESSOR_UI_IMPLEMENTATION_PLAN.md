# Assessor UI Implementation Plan

## Objective
Implement admin-like UI design across all 9 assessor pages while maintaining role-appropriate functionality.

## Design Pattern from Admin

### 1. Structure
```html
<div class="admin-sidebar">
  <!-- Sidebar navigation -->
</div>

<div class="admin-main">
  <header class="admin-header">
    <!-- Page title, notifications, user menu -->
  </header>
  
  <div class="admin-content">
    <!-- Stats cards -->
    <!-- Toolbar (search, filters, actions) -->
    <!-- Main content (table/cards) -->
  </div>
</div>
```

### 2. CSS Files to Use
- `admin-sidebar.css` (main admin styles)
- `notification.css` (notification system)
- `modal-system.css` (modals)

### 3. Stats Cards Pattern
```html
<div class="stats-grid">
  <div class="stat-card">
    <div class="stat-icon [primary|success|warning|info]">
      <i class='bx bx-icon'></i>
    </div>
    <div class="stat-info">
      <h3 id="statValue">0</h3>
      <p>Stat Label</p>
    </div>
  </div>
</div>
```

### 4. Toolbar Pattern
```html
<div class="card">
  <div class="card-header">
    <div>
      <input type="text" id="searchInput" placeholder="Search...">
      <select id="filter1">...</select>
      <select id="filter2">...</select>
    </div>
    <div>
      <button onclick="refresh()">Refresh</button>
      <button onclick="create()">Create [Item]</button>
    </div>
  </div>
</div>
```

### 5. Table Pattern
```html
<div class="card">
  <table class="data-table">
    <thead>
      <tr>
        <th>COLUMN 1</th>
        <th>COLUMN 2</th>
        <th>ACTIONS</th>
      </tr>
    </thead>
    <tbody id="tableBody">
      <!-- Dynamic rows -->
    </tbody>
  </table>
</div>
```

## Implementation Checklist

### ✅ Page 1: Classes (classes-sidebar.html)
- [ ] Update CSS imports to match admin
- [ ] Use admin-sidebar class for sidebar
- [ ] Use admin-main for main content
- [ ] Add stats cards with proper icons
- [ ] Add toolbar with search & filters
- [ ] Use admin table styling
- [ ] Remove "Create Class" button (assessor can't create)
- [ ] Keep view/manage functionality

### ✅ Page 2: Students (students-sidebar.html)
- [ ] Update CSS imports
- [ ] Use admin layout structure
- [ ] Add stats cards (Total Students, By Level, Average Score, etc.)
- [ ] Add search & filter toolbar
- [ ] Use admin table styling
- [ ] Add view details functionality
- [ ] No create/delete buttons

### ✅ Page 3: Assignments (assignments-sidebar.html)
- [ ] Update CSS imports
- [ ] Use admin layout
- [ ] Add stats cards (Total, Pending Review, Completed, Avg Score)
- [ ] Add toolbar with create button
- [ ] Use admin table styling
- [ ] Keep full CRUD functionality

### ✅ Page 4: Submissions (submissions-sidebar.html)
- [ ] Update CSS imports
- [ ] Use admin layout
- [ ] Add stats cards (Pending, Graded, Average Score, Late)
- [ ] Add filter toolbar (by assignment, status, date)
- [ ] Use admin table styling
- [ ] Add grade button/modal

### ✅ Page 5: Materials (materials-sidebar.html)
- [ ] Update CSS imports
- [ ] Use admin layout
- [ ] Add stats cards (Total Materials, By Type, Total Size, Views)
- [ ] Add toolbar with upload button
- [ ] Use card grid or table
- [ ] Keep full CRUD for own materials

### ✅ Page 6: Discussions (discussions-sidebar.html)
- [ ] Update CSS imports
- [ ] Use admin layout
- [ ] Add stats cards (Total Topics, Active, Resolved, My Replies)
- [ ] Add toolbar with create button
- [ ] Use card/list layout
- [ ] Keep Pin/Lock/Solution features

### ✅ Page 7: Announcements (announcements-sidebar.html)
- [ ] Update CSS imports
- [ ] Use admin layout
- [ ] Add stats cards (Total, Active, By Priority, Views)
- [ ] Add toolbar with create button
- [ ] Use card grid layout
- [ ] Keep full CRUD functionality

### ✅ Page 8: Analytics (analytics-sidebar.html)
- [ ] Update CSS imports
- [ ] Use admin layout
- [ ] Add summary stats cards
- [ ] Add filter toolbar (date range, class, etc.)
- [ ] Keep charts and visualizations
- [ ] Add export button

### ✅ Page 9: Dashboard (dashboard-sidebar.html)
- [ ] Already has good layout
- [ ] Verify CSS consistency
- [ ] Ensure stats cards match admin style
- [ ] Add quick action cards

## Key Differences from Admin

### What to REMOVE for Assessor:
1. "Create Class" button (only admin can create classes)
2. "Delete User" functionality
3. "Assign Assessor" functionality
4. System-wide filters that don't apply

### What to KEEP for Assessor:
1. View own data
2. Create assignments, materials, announcements, discussions
3. Grade submissions
4. Moderate own discussions
5. Upload materials
6. View analytics for own classes

### What to ADJUST:
1. Stats cards - show "My" data not "Total System"
2. Filters - scope to own classes
3. Table data - only show own students/classes
4. Labels - change "All" to "My"

## Color Scheme

### Icon Colors (keep consistent):
- Primary: #667eea (purple-blue gradient)
- Success: #10b981 (green)
- Warning: #f59e0b (orange)
- Info: #3b82f6 (blue)
- Danger: #ef4444 (red)

## Implementation Order

1. Start with Classes (most critical)
2. Then Students (high visibility)
3. Then Assignments (heavy usage)
4. Then Submissions (grading workflow)
5. Then Materials, Discussions, Announcements
6. Finally Analytics and Dashboard refinements

## Testing Checklist

For each page:
- [ ] Layout matches admin style
- [ ] Stats cards display correctly
- [ ] Search works
- [ ] Filters work
- [ ] Table displays data
- [ ] Actions (edit/view/delete) work
- [ ] Modals open/close
- [ ] Responsive on mobile
- [ ] No console errors
- [ ] Data scoped to assessor

## File Changes Required

### CSS Updates:
Each HTML file needs to import:
```html
<link rel="stylesheet" href="../../css/admin-sidebar.css">
<link rel="stylesheet" href="../../css/notification.css">
<link rel="stylesheet" href="../../css/modal-system.css">
```

### JavaScript Updates:
- Update API calls to use assessor-scoped endpoints
- Add proper error handling
- Add loading states
- Add empty states

## Estimated Changes

- **9 HTML files** - Major layout updates
- **0 CSS files** - Use existing admin CSS
- **JavaScript** - Minor adjustments to data loading
- **New modals** - Some pages may need new modal forms

## Success Criteria

✅ All 9 pages have consistent admin-like layout
✅ All stats cards functional with real data
✅ All search/filter functionality works
✅ All CRUD operations work (where appropriate)
✅ Responsive design maintained
✅ No UI/UX regressions
✅ Data properly scoped to assessor role

---

**Status:** Ready to implement
**Start Date:** November 26, 2025
**Target:** Complete all 9 pages
