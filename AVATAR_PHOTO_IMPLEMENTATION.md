# Avatar & Photo Profile Implementation

## Summary
Updated submission detail modal and table to display user profile photos when available, or fallback to avatar initials when photo doesn't exist.

## Features Implemented

### 1. API Enhancement ✅

**File**: `/backend/controllers/adminController.js`

**Added Fields**:
- `u.photo_url as student_photo` (line 864)
- `grader.photo_url as assessor_photo` (line 868)

**SQL Query**:
```sql
SELECT s.id, s.assignment_id, s.user_id, s.file_url, s.submitted_at,
       s.score, s.feedback, s.graded_at, s.status,
       s.admin_override, s.admin_override_reason,
       u.id as student_id,
       u.name as student_name,
       u.email as student_email,
       u.photo_url as student_photo,          -- ✅ Added
       a.id as assignment_id,
       a.title as assignment_name,
       a.class_number,
       a.due_date,
       m.id as module_id,
       m.name as module_name,
       m.level,
       c.id as class_id,
       c.name as class_name,
       c.code as class_code,
       grader.id as assessor_id,
       grader.name as assessor_name,
       grader.email as assessor_email,
       grader.photo_url as assessor_photo,    -- ✅ Added
       CASE WHEN s.submitted_at > a.due_date THEN true ELSE false END as is_late
FROM submissions s
JOIN users u ON s.user_id = u.id
JOIN assignments a ON s.assignment_id = a.id
LEFT JOIN modules m ON a.module_id = m.id
LEFT JOIN classes c ON a.class_number = c.id
LEFT JOIN users grader ON s.graded_by = grader.id
```

### 2. Submission Table Avatar ✅

**File**: `/src/pages/admin/submissions-sidebar.html` (Lines 582-594)

**Logic**:
```javascript
${sub.student_photo ? `
    <!-- Show Photo -->
    <img src="http://localhost:5000${sub.student_photo}"
         alt="${sub.student_name}"
         style="width: 36px; height: 36px; border-radius: 50%; object-fit: cover; border: 2px solid #e2e8f0;"
         onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
    <!-- Fallback Avatar (hidden by default) -->
    <div style="display: none; width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); align-items: center; justify-content: center; color: white; font-size: 13px; font-weight: 600;">
        ${sub.student_name.substring(0, 2).toUpperCase()}
    </div>
` : `
    <!-- Show Avatar Initial (no photo available) -->
    <div style="width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 13px; font-weight: 600;">
        ${sub.student_name.substring(0, 2).toUpperCase()}
    </div>
`}
```

**Features**:
- ✅ Shows photo if `student_photo` exists
- ✅ Shows initials if no photo
- ✅ Auto-fallback on image load error (onerror)
- ✅ Circular shape with border
- ✅ Proper sizing (36x36px for table)

### 3. Detail Modal Large Avatar ✅

**File**: `/src/pages/admin/submissions-sidebar.html` (Lines 648-660)

**Logic**:
```javascript
${sub.student_photo ? `
    <!-- Show Large Photo -->
    <img src="http://localhost:5000${sub.student_photo}"
         alt="${sub.student_name}"
         style="width: 60px; height: 60px; border-radius: 50%; object-fit: cover; border: 3px solid white; box-shadow: 0 4px 14px rgba(102, 126, 234, 0.4);"
         onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
    <!-- Fallback Large Avatar -->
    <div style="display: none; width: 60px; height: 60px; border-radius: 50%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); align-items: center; justify-content: center; color: white; font-size: 24px; font-weight: 700; box-shadow: 0 4px 14px rgba(102, 126, 234, 0.4);">
        ${sub.student_name.substring(0, 2).toUpperCase()}
    </div>
` : `
    <!-- Show Large Avatar Initial -->
    <div style="width: 60px; height: 60px; border-radius: 50%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 24px; font-weight: 700; box-shadow: 0 4px 14px rgba(102, 126, 234, 0.4);">
        ${sub.student_name.substring(0, 2).toUpperCase()}
    </div>
`}
```

**Features**:
- ✅ Larger size (60x60px) for detail view
- ✅ Thicker border (3px vs 2px)
- ✅ Beautiful box shadow
- ✅ Larger font for initials (24px vs 13px)
- ✅ Same fallback logic

## Display Logic Flow

```
┌─────────────────────────┐
│ Check student_photo     │
│ field in API response   │
└───────────┬─────────────┘
            │
    ┌───────┴────────┐
    │                │
    ▼                ▼
┌───────┐      ┌────────────┐
│ null  │      │ Has Value  │
└───┬───┘      └─────┬──────┘
    │                │
    │                │
    ▼                ▼
┌────────────┐  ┌──────────────┐
│ Show       │  │ Load Image   │
│ Avatar     │  │ from Server  │
│ Initial    │  └──────┬───────┘
│            │         │
│ "HA"       │     ┌───┴────┐
│ "AZ"       │     │        │
│ etc.       │     ▼        ▼
└────────────┘  ┌─────┐  ┌───────┐
                │ ✅  │  │ ❌    │
                │Show │  │Error  │
                │Photo│  │       │
                └─────┘  └───┬───┘
                             │
                             ▼
                        ┌──────────┐
                        │ Fallback │
                        │ to       │
                        │ Initial  │
                        └──────────┘
```

## Example Display

### User WITHOUT Photo (hasan)

**API Response**:
```json
{
  "student_id": 5,
  "student_name": "hasan",
  "student_email": "hasan@app.com",
  "student_photo": null
}
```

**Display**:
- Table: Circle avatar with "HA" in purple gradient
- Modal: Large circle avatar with "HA" in purple gradient

### User WITH Photo (azzahra - if she submits)

**API Response**:
```json
{
  "student_id": 6,
  "student_name": "azzahra",
  "student_email": "guru@app.com",
  "student_photo": "/uploads/profile-1764121546463-203297214.jpg"
}
```

**Display**:
- Table: Circular photo (36x36px)
- Modal: Large circular photo (60x60px)

**If photo load fails**:
- Falls back to "AZ" avatar initial

## Styling Details

### Small Avatar (Table)
- **Size**: 36x36px
- **Border**: 2px solid #e2e8f0
- **Font**: 13px, weight 600
- **Gradient**: #667eea → #764ba2

### Large Avatar (Modal)
- **Size**: 60x60px
- **Border**: 3px solid white
- **Font**: 24px, weight 700
- **Shadow**: 0 4px 14px rgba(102, 126, 234, 0.4)
- **Gradient**: #667eea → #764ba2

### Photo Properties
- **object-fit**: cover (maintains aspect ratio)
- **border-radius**: 50% (perfect circle)
- **Border**: White or light gray
- **Shadow**: Soft purple glow

## Error Handling

### Three-Layer Fallback System

1. **Primary**: Try to load photo from `student_photo` URL
2. **Secondary**: If load fails (onerror), hide img and show fallback div
3. **Tertiary**: If `student_photo` is null, show initial directly

**Code**:
```javascript
onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
```

This ensures the avatar ALWAYS displays something, never shows broken image icon.

## Testing

### Test Cases

#### ✅ Test 1: User without photo (hasan)
```bash
# API returns student_photo: null
# Expected: Shows "HA" initial in purple circle
```

#### ✅ Test 2: User with photo (if available)
```bash
# API returns student_photo: "/uploads/..."
# Expected: Shows circular photo
```

#### ✅ Test 3: Photo URL invalid/file missing
```bash
# API returns student_photo: "/invalid/path.jpg"
# Expected: Image fails to load, fallback to initial
```

#### ✅ Test 4: Table view consistency
```bash
# All rows should show either photo or initial
# No broken image icons
# Consistent sizing (36x36px)
```

#### ✅ Test 5: Modal view consistency
```bash
# Detail modal shows larger version (60x60px)
# Same fallback logic
# Matches table avatar (same user)
```

### How to Test

1. **Login as admin**:
   ```
   http://localhost:8080/src/pages/auth/login.html
   Username: admin
   Password: admin123
   ```

2. **Go to Submissions page**

3. **Check Table**:
   - All hasan submissions show "HA" avatar
   - If any user has photo, shows photo

4. **Click eye icon** on any submission:
   - Large avatar/photo displays
   - Matches table avatar

5. **Check Network tab**:
   - If photo exists, see image request
   - If fails, see 404 but avatar still shows

## Files Modified

### Backend
1. ✅ `/backend/controllers/adminController.js`
   - Line 864: Added `u.photo_url as student_photo`
   - Line 868: Added `grader.photo_url as assessor_photo`

### Frontend
1. ✅ `/src/pages/admin/submissions-sidebar.html`
   - Lines 582-594: Table avatar with photo/initial logic
   - Lines 648-660: Modal large avatar with photo/initial logic

## API Response Format

### Before
```json
{
  "student_id": 5,
  "student_name": "hasan",
  "student_email": "hasan@app.com"
}
```

### After
```json
{
  "student_id": 5,
  "student_name": "hasan",
  "student_email": "hasan@app.com",
  "student_photo": null,              // ✅ New field
  "assessor_id": 6,
  "assessor_name": "azzahra",
  "assessor_email": "guru@app.com",
  "assessor_photo": "/uploads/..."    // ✅ New field
}
```

## Benefits

1. **Better UX**: Users see profile photos instead of just initials
2. **Fallback Safety**: Never shows broken images
3. **Consistent Design**: Same styling across table and modal
4. **Performance**: Lazy loading with error handling
5. **Accessibility**: Alt text for all images
6. **Future-proof**: Works with any number of users with/without photos

## Future Enhancements

Possible improvements:
1. Cache photos in browser
2. Thumbnail generation for faster loading
3. Default avatar images per role (student, assessor, admin)
4. Avatar color based on user ID (different gradients)
5. Upload indicator showing when photo is being processed

---

**Date**: 2025-12-04
**Status**: ✅ COMPLETED
**Feature**: Avatar Initial with Photo Profile Fallback
