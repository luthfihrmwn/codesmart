# Assessor Class Assignment Feature

## 🎯 What Was Added

Added the ability to assign assessors to individual classes in the Manage Classes module. Admins can now select which assessor will be responsible for grading each class.

---

## ✨ New Features

### 1. **Assessor Column in Classes Table**

The "Manage Classes" modal now displays an "Assessor" column showing which assessor is assigned to each class.

**Table Structure:**
```
Class # | Title | Content | Order | Assessor | Published | Actions
```

**Display:**
- Shows assessor name if assigned
- Shows "No Assessor" in gray text if no assessor assigned

### 2. **Assessor Dropdown in Class Form**

When adding or editing a class, admins can select an assessor from a dropdown menu.

**Dropdown Features:**
- Lists all users with role = "assessor"
- Shows format: "Assessor Name (email@example.com)"
- Default option: "-- No Assessor --" (optional)
- Auto-populated from database

### 3. **Automatic Assessor Loading**

System automatically loads all assessors when the Modules page loads.

**Implementation:**
- Filters users by role = "assessor"
- Stores in `allAssessors` array
- Populates dropdown on page load
- Re-populates when opening class modal

---

## 📝 Technical Implementation

### Frontend Changes

#### File Modified: `/home/luthfi/codesmart/src/pages/admin/modules-sidebar.html`

**1. Added Assessor Column to Table Header** (Lines 217-227):
```html
<thead>
    <tr>
        <th>Class #</th>
        <th>Title</th>
        <th>Content</th>
        <th>Order</th>
        <th>Assessor</th>          <!-- NEW -->
        <th>Published</th>
        <th>Actions</th>
    </tr>
</thead>
```

**2. Added Assessor Dropdown to Form** (Lines 274-280):
```html
<div class="form-group">
    <label for="classAssessor">Assessor</label>
    <select id="classAssessor" class="form-input">
        <option value="">-- No Assessor --</option>
    </select>
    <small>Assign an assessor to grade this class (optional)</small>
</div>
```

**3. Added Global Variables** (Line 314):
```javascript
let allAssessors = [];
```

**4. Added Load Assessors Function** (Lines 317-329):
```javascript
async function loadAssessors() {
    try {
        const response = await apiService.getAllUsers();
        if (response.success) {
            const users = response.data.users || response.data || [];
            // Filter only users with role 'assessor'
            allAssessors = users.filter(user => user.role === 'assessor');
            populateAssessorDropdown();
        }
    } catch (error) {
        console.error('Error loading assessors:', error);
    }
}
```

**5. Added Populate Dropdown Function** (Lines 332-343):
```javascript
function populateAssessorDropdown() {
    const select = document.getElementById('classAssessor');
    // Keep the default "No Assessor" option
    select.innerHTML = '<option value="">-- No Assessor --</option>';
    // Add assessor options
    allAssessors.forEach(assessor => {
        const option = document.createElement('option');
        option.value = assessor.id;
        option.textContent = `${assessor.name} (${assessor.email})`;
        select.appendChild(option);
    });
}
```

**6. Updated renderClasses Function** (Lines 565-600):
```javascript
function renderClasses(classes) {
    // ...
    tbody.innerHTML = classes.map(cls => {
        // Find assessor name
        const assessor = cls.assessor_id ? allAssessors.find(a => a.id === cls.assessor_id) : null;
        const assessorName = assessor ? assessor.name : '<span style="color:#999;">No Assessor</span>';

        return `
        <tr>
            <td>${cls.class_number}</td>
            <td><strong>${cls.title}</strong></td>
            <td>${cls.description ? (cls.description.substring(0, 50) + '...') : 'No description'}</td>
            <td>${cls.order_index || cls.class_number}</td>
            <td>${assessorName}</td>  <!-- Display assessor -->
            <td><span class="badge badge-${cls.is_published ? 'success' : 'secondary'}">${cls.is_published ? 'Yes' : 'No'}</span></td>
            <td>...</td>
        </tr>
        `;
    }).join('');
}
```

**7. Updated saveClass Function** (Lines 643-678):
```javascript
async function saveClass(event) {
    event.preventDefault();

    const classId = document.getElementById('classId').value;
    const moduleSlug = document.getElementById('classModuleSlug').value;
    const assessorId = document.getElementById('classAssessor').value;  // NEW

    const classData = {
        class_number: parseInt(document.getElementById('classNumber').value),
        title: document.getElementById('classTitle').value,
        content: document.getElementById('classContent').value,
        order_number: parseInt(document.getElementById('classOrder').value),
        is_published: document.getElementById('classPublished').checked,
        assessor_id: assessorId ? parseInt(assessorId) : null  // NEW
    };
    // ... save logic
}
```

**8. Updated editClass Function** (Lines 619-636):
```javascript
function editClass(classId) {
    const cls = currentClasses.find(c => c.id === classId);
    if (!cls) return;

    // ... populate other fields
    
    // Set assessor dropdown value (NEW)
    document.getElementById('classAssessor').value = cls.assessor_id || '';
    
    document.getElementById('classModal').style.display = 'flex';
}
```

**9. Call loadAssessors() on Init** (Line 1000):
```javascript
// Initialize
loadModules();
loadAssessors();  // NEW
```

---

## 🎨 User Experience Flow

### Assigning Assessor to New Class:

1. Admin clicks "Manage Classes" for a module
2. Clicks "Add Class" button
3. Fills in class details (number, title, content, order)
4. **Selects an assessor from dropdown** (new feature)
5. Clicks "Save Class"
6. Class is created with assigned assessor

### Editing Assessor Assignment:

1. Admin clicks "Manage Classes" for a module
2. Sees assessor name in "Assessor" column
3. Clicks "Edit" button on a class
4. **Assessor dropdown shows currently assigned assessor** (pre-selected)
5. Can change to different assessor or remove assignment
6. Clicks "Save Class"
7. Assessor assignment updated

### Viewing Assessor Assignments:

1. Admin opens "Manage Classes" modal
2. **"Assessor" column shows who is assigned to each class**
3. Classes without assessor show "No Assessor" in gray

---

## 🧪 Testing Instructions

### Test 1: Assign Assessor to New Class

1. Go to Modules page
2. Click "Manage Classes" on any module
3. Click "Add Class"
4. Fill in class details
5. Select an assessor from dropdown
6. Click "Save Class"
7. **Expected Result**: 
   - Class created successfully
   - Assessor name appears in "Assessor" column

### Test 2: Edit Assessor Assignment

1. Open "Manage Classes" modal
2. Click "Edit" on a class
3. Change the assessor selection
4. Click "Save Class"
5. **Expected Result**:
   - Class updated
   - New assessor name appears in table

### Test 3: Remove Assessor Assignment

1. Open "Manage Classes" modal
2. Click "Edit" on a class with assessor
3. Select "-- No Assessor --"
4. Click "Save Class"
5. **Expected Result**:
   - Class updated
   - "No Assessor" appears in gray

### Test 4: Assessor Dropdown Loading

1. Go to Modules page
2. Click "Manage Classes"
3. Click "Add Class"
4. Check assessor dropdown
5. **Expected Result**:
   - Dropdown contains all users with role = "assessor"
   - Format: "Name (email)"
   - First option is "-- No Assessor --"

---

## ✅ Benefits

1. **Clear Assignment**: Admins can see at a glance which assessor handles each class
2. **Easy Management**: Assign or change assessors directly in the class form
3. **Flexible**: Assessor assignment is optional (can leave unassigned)
4. **Organized**: Better workload distribution among assessors
5. **Transparent**: Everyone knows who is responsible for grading

---

## 📊 Data Flow

```
User Action → Frontend (select assessor) → API Call → Backend → Database
                ↓
        Save assessor_id with class data
                ↓
        Load classes with assessor_id
                ↓
        Display assessor name in table
```

### Database Field:
- **Field Name**: `assessor_id`
- **Type**: Integer (foreign key to users table)
- **Nullable**: Yes (assessor assignment is optional)
- **References**: `users.id` where `role = 'assessor'`

---

## 🔧 Backend Requirements

The backend API should support the `assessor_id` field in:

### Create Class Endpoint:
```
POST /api/v1/modules/:slug/classes
Body: {
    class_number: 1,
    title: "Class Title",
    content: "Class content...",
    order_number: 1,
    is_published: true,
    assessor_id: 5  // NEW - assessor user ID or null
}
```

### Update Class Endpoint:
```
PUT /api/v1/modules/:slug/classes/:id
Body: {
    // ... other fields
    assessor_id: 5  // NEW - can update assessor assignment
}
```

### Get Classes Endpoint:
```
GET /api/v1/modules/:slug/classes
Response: {
    success: true,
    data: {
        classes: [
            {
                id: 1,
                class_number: 1,
                title: "Class Title",
                assessor_id: 5,  // NEW - returns assessor ID
                // ... other fields
            }
        ]
    }
}
```

---

## 📁 Files Modified

1. **`/home/luthfi/codesmart/src/pages/admin/modules-sidebar.html`**
   - Added Assessor column to table (line 223)
   - Added Assessor dropdown to form (lines 274-280)
   - Added `allAssessors` variable (line 314)
   - Added `loadAssessors()` function (lines 317-329)
   - Added `populateAssessorDropdown()` function (lines 332-343)
   - Updated `renderClasses()` function (lines 565-600)
   - Updated `saveClass()` function (lines 643-678)
   - Updated `editClass()` function (lines 619-636)
   - Added `loadAssessors()` call on init (line 1000)

---

## 🚀 Future Enhancements

Potential improvements for this feature:

1. **Assessor Dashboard**: Show classes assigned to each assessor
2. **Workload Balance**: Display number of classes per assessor
3. **Notification**: Notify assessor when assigned to a class
4. **Batch Assignment**: Assign one assessor to multiple classes at once
5. **Assessor Filter**: Filter classes by assigned assessor
6. **Permission Control**: Allow assessors to only see their assigned classes

---

**Version**: 1.0.0  
**Date**: 2025-11-09  
**Status**: ✅ Complete and Ready for Testing  
**Impact**: Admins can now assign assessors to individual classes for better organization
