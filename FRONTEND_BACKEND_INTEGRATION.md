# Frontend-Backend Integration Guide

**Panduan Lengkap Integrasi Frontend CodeSmart dengan Backend API**

---

## 📋 Overview

Dokumen ini menjelaskan cara mengintegrasikan semua halaman frontend dengan backend API yang sudah dibuat.

### Files yang Sudah Dibuat:

1. ✅ **[src/js/api-service.js](src/js/api-service.js)** - API Service Layer (NEW)
2. ✅ **[src/js/auth.js](src/js/auth.js)** - Updated untuk menggunakan Backend API
3. ✅ **[backend/](backend/)** - Complete Backend API

---

## 🔧 Langkah 1: Include API Service di Semua Halaman

Setiap halaman HTML yang perlu berkomunikasi dengan backend harus include `api-service.js` **SEBELUM** file JavaScript lainnya:

```html
<!-- PENTING: Load api-service.js PERTAMA -->
<script src="/src/js/api-service.js"></script>

<!-- Kemudian load file lain -->
<script src="/src/data/database.js"></script>
<script src="/src/js/auth.js"></script>
```

### Halaman yang Perlu Diupdate:

**Authentication Pages:**
- `/src/pages/auth/login.html`
- `/src/pages/auth/register.html`

**User Pages:**
- `/src/pages/user/dashboard.html`
- `/src/pages/user/profile.html`
- `/src/pages/user/profile-enhanced.html`
- `/src/pages/user/pretest.html`

**Admin Pages:**
- `/src/pages/admin/dashboard.html`

**Assessor Pages:**
- `/src/pages/assessor/dashboard.html`
- `/src/pages/assessor/grading-enhanced.html`

**Module Pages:**
- `/src/pages/modules/lms-user.html`
- `/src/pages/modules/module-fundamental.html`
- `/src/pages/modules/module-intermediate.html`
- `/src/pages/modules/module-advance.html`

---

## 🔐 Langkah 2: Update Authentication Pages

### Login Page (`/src/pages/auth/login.html`)

**Tambahkan script sebelum `</body>`:**

```html
<!-- Load API Service FIRST -->
<script src="../../js/api-service.js"></script>

<!-- Load database and auth -->
<script src="../../data/database.js"></script>
<script src="../../js/auth.js"></script>

<script>
    // Check if already logged in
    if (authService.isLoggedIn()) {
        authService.redirectToDashboard();
    }

    const loginForm = document.getElementById('loginForm');
    const alertBox = document.getElementById('alert');

    function showAlert(message, type = 'error') {
        alertBox.textContent = message;
        alertBox.classList.remove('hidden', 'bg-red-100', 'text-red-800', 'border-red-300', 'bg-green-100', 'text-green-800', 'border-green-300');

        if (type === 'error') {
            alertBox.classList.add('bg-red-100', 'text-red-800', 'border', 'border-red-300');
        } else {
            alertBox.classList.add('bg-green-100', 'text-green-800', 'border', 'border-green-300');
        }

        setTimeout(() => {
            alertBox.classList.add('hidden');
        }, 5000);
    }

    // UPDATE: Make login function async
    loginForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Show loading
        const submitButton = e.target.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Loading...';
        submitButton.disabled = true;

        try {
            const result = await authService.login(username, password);

            if (result.success) {
                showAlert('Login berhasil! Mengalihkan...', 'success');

                setTimeout(() => {
                    authService.redirectToDashboard();
                }, 1000);
            } else {
                showAlert(result.message, 'error');
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }
        } catch (error) {
            showAlert('Terjadi kesalahan. Silakan coba lagi.', 'error');
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    });

    // UPDATE: Forgot password - make async
    async function sendResetLink() {
        const email = document.getElementById('resetEmail').value.trim();

        if (!email) {
            alert('Masukkan email Anda!');
            return;
        }

        try {
            const result = await authService.forgotPassword(email);

            if (result.success) {
                if (result.data.hasSecurityQuestion) {
                    // Show security question step
                    document.getElementById('securityQuestionLabel').textContent = result.data.securityQuestion;
                    document.getElementById('step1').classList.add('hidden');
                    document.getElementById('step2').classList.remove('hidden');
                } else {
                    // No security question, go to password reset
                    document.getElementById('step1').classList.add('hidden');
                    document.getElementById('step3').classList.remove('hidden');
                }
            } else {
                alert(result.message);
            }
        } catch (error) {
            alert('Terjadi kesalahan. Silakan coba lagi.');
        }
    }

    // UPDATE: Verify security answer - make async
    async function verifyAnswer() {
        const email = document.getElementById('resetEmail').value.trim();
        const answer = document.getElementById('securityAnswer').value.trim();

        if (!answer) {
            alert('Masukkan jawaban Anda!');
            return;
        }

        try {
            const result = await authService.verifySecurityAnswer(email, answer);

            if (result.success) {
                // Store reset token
                window.resetToken = result.data.resetToken;
                document.getElementById('step2').classList.add('hidden');
                document.getElementById('step3').classList.remove('hidden');
            } else {
                alert(result.message);
            }
        } catch (error) {
            alert('Jawaban salah! Silakan coba lagi.');
        }
    }

    // UPDATE: Reset password - make async
    async function resetPassword() {
        const email = document.getElementById('resetEmail').value.trim();
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (!newPassword || !confirmPassword) {
            alert('Masukkan password baru!');
            return;
        }

        if (newPassword.length < 6) {
            alert('Password minimal 6 karakter!');
            return;
        }

        if (newPassword !== confirmPassword) {
            alert('Password tidak cocok!');
            return;
        }

        try {
            const result = await authService.resetPassword(email, newPassword, window.resetToken || '');

            if (result.success) {
                document.getElementById('step3').classList.add('hidden');
                document.getElementById('step4').classList.remove('hidden');
            } else {
                alert(result.message);
            }
        } catch (error) {
            alert('Gagal reset password. Silakan coba lagi.');
        }
    }
</script>
```

### Register Page (`/src/pages/auth/register.html`)

**Update script section:**

```html
<!-- Load API Service FIRST -->
<script src="../../js/api-service.js"></script>

<!-- Load database and auth -->
<script src="../../data/database.js"></script>
<script src="../../js/auth.js"></script>

<script>
    // Check if already logged in
    if (authService.isLoggedIn()) {
        authService.redirectToDashboard();
    }

    const registerForm = document.getElementById('registerForm');
    const alertBox = document.getElementById('alert');

    function showAlert(message, type = 'error') {
        alertBox.textContent = message;
        alertBox.classList.remove('hidden', 'bg-red-100', 'text-red-800', 'border-red-300', 'bg-green-100', 'text-green-800', 'border-green-300');

        if (type === 'error') {
            alertBox.classList.add('bg-red-100', 'text-red-800', 'border', 'border-red-300');
        } else {
            alertBox.classList.add('bg-green-100', 'text-green-800', 'border', 'border-green-300');
        }

        setTimeout(() => {
            alertBox.classList.add('hidden');
        }, 5000);
    }

    // UPDATE: Make register function async
    registerForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        // Validate password match
        if (password !== confirmPassword) {
            showAlert('Password dan konfirmasi password tidak cocok!', 'error');
            return;
        }

        // Validate password length
        if (password.length < 6) {
            showAlert('Password minimal 6 karakter!', 'error');
            return;
        }

        // Validate username length
        if (username.length < 4) {
            showAlert('Username minimal 4 karakter!', 'error');
            return;
        }

        // Show loading
        const submitButton = e.target.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Loading...';
        submitButton.disabled = true;

        try {
            const result = await authService.register({
                name: name,
                email: email,
                username: username,
                password: password
            });

            if (result.success) {
                showAlert(result.message || 'Registrasi berhasil! Akun Anda menunggu persetujuan administrator.', 'success');

                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 3000);
            } else {
                showAlert(result.message, 'error');
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }
        } catch (error) {
            showAlert('Terjadi kesalahan. Silakan coba lagi.', 'error');
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    });
</script>
```

---

## 👤 Langkah 3: Update User Dashboard

### User Dashboard (`/src/pages/user/dashboard.html`)

**Key changes needed:**

1. **Add API service script**
2. **Update enrollment fetching**
3. **Update module access checking**
4. **Update pretest check**

**Add before closing `</body>`:**

```html
<!-- Load API Service FIRST -->
<script src="../../js/api-service.js"></script>
<script src="../../data/database.js"></script>
<script src="../../js/auth.js"></script>
<script src="../../js/svm.js"></script>

<script>
    // Check authentication
    if (!authService.requireAuth()) {
        window.location.href = '../auth/login.html';
    }

    // Check if user is actually a user role
    if (!authService.isUser()) {
        authService.redirectToDashboard();
    }

    const currentUser = authService.getCurrentUser();

    // UPDATE: Check pretest completion with async
    async function checkPretestCompletion() {
        if (!authService.hasCompletedPretest()) {
            window.location.href = 'pretest.html';
            return;
        }

        // Load dashboard data
        await loadDashboard();
    }

    // UPDATE: Load dashboard data from API
    async function loadDashboard() {
        try {
            // Get user enrollments from API
            const enrollmentsResponse = await apiService.getUserEnrollments();

            if (enrollmentsResponse.success) {
                displayEnrollments(enrollmentsResponse.data.enrollments);
            }

            // Get user progress
            const progressResponse = await apiService.getUserProgress();

            if (progressResponse.success) {
                displayProgress(progressResponse.data.progress);
            }

        } catch (error) {
            console.error('Failed to load dashboard:', error);
        }
    }

    // Display user info
    document.getElementById('userName').textContent = currentUser.name || 'User';
    document.getElementById('userRole').textContent = 'Student';

    if (currentUser.name) {
        const avatar = document.getElementById('userAvatar');
        if (avatar) {
            avatar.textContent = currentUser.name.charAt(0).toUpperCase();
        }
    }

    // Initialize
    checkPretestCompletion();
</script>
```

---

## 🎓 Langkah 4: Update Pretest Page

### Pretest Page (`/src/pages/user/pretest.html`)

**Update submission handling:**

```html
<!-- Load API Service FIRST -->
<script src="../../js/api-service.js"></script>
<script src="../../data/database.js"></script>
<script src="../../js/auth.js"></script>
<script src="../../js/svm.js"></script>

<script>
    // Check authentication
    if (!authService.requireAuth()) {
        window.location.href = '../auth/login.html';
    }

    const currentUser = authService.getCurrentUser();

    // Check if pretest already completed
    if (authService.hasCompletedPretest()) {
        window.location.href = 'dashboard.html';
    }

    // UPDATE: Submit pretest with API
    async function submitPretest() {
        // ... existing answer collection code ...

        try {
            // Calculate score using SVM
            const score = calculateSVMScore(answers);

            // Submit to backend API
            const result = await apiService.submitPretest({
                answers: answers,
                score: score
            });

            if (result.success) {
                // Update local user data
                await authService.refreshUser();

                // Show result and redirect
                showResult(score);

                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 3000);
            } else {
                alert('Gagal menyimpan hasil pretest. Silakan coba lagi.');
            }

        } catch (error) {
            console.error('Pretest submission error:', error);
            alert('Terjadi kesalahan. Silakan coba lagi.');
        }
    }
</script>
```

---

## 👨‍💼 Langkah 5: Update Admin Dashboard

### Admin Dashboard (`/src/pages/admin/dashboard.html`)

**Add API calls for admin operations:**

```javascript
// Load API Service
// <script src="../../js/api-service.js"></script>

// UPDATE: Load all users from API
async function loadUsers() {
    try {
        const response = await apiService.getAllUsers();

        if (response.success) {
            displayUsers(response.data.users);
        }
    } catch (error) {
        console.error('Failed to load users:', error);
    }
}

// UPDATE: Approve user
async function approveUser(userId) {
    try {
        const response = await apiService.approveUser(userId);

        if (response.success) {
            alert('User berhasil disetujui!');
            await loadPendingApprovals();
            await loadUsers();
        } else {
            alert(response.message || 'Gagal menyetujui user');
        }
    } catch (error) {
        console.error('Approve user error:', error);
        alert('Terjadi kesalahan');
    }
}

// UPDATE: Load pending approvals
async function loadPendingApprovals() {
    try {
        const response = await apiService.getPendingApprovals();

        if (response.success) {
            displayPendingApprovals(response.data.users);
        }
    } catch (error) {
        console.error('Failed to load pending approvals:', error);
    }
}

// UPDATE: Load statistics
async function loadStatistics() {
    try {
        const response = await apiService.getAdminStatistics();

        if (response.success) {
            displayStatistics(response.data.statistics);
        }
    } catch (error) {
        console.error('Failed to load statistics:', error);
    }
}
```

---

## 👨‍🏫 Langkah 6: Update Assessor Dashboard

### Assessor Dashboard (`/src/pages/assessor/dashboard.html`)

**Add API calls for assessor operations:**

```javascript
// Load API Service
// <script src="../../js/api-service.js"></script>

// UPDATE: Load pending submissions
async function loadPendingSubmissions() {
    try {
        const response = await apiService.getPendingSubmissions();

        if (response.success) {
            displayPendingSubmissions(response.data.submissions);
        }
    } catch (error) {
        console.error('Failed to load pending submissions:', error);
    }
}

// UPDATE: Grade submission
async function gradeSubmission(submissionId, gradeData) {
    try {
        const response = await apiService.gradeSubmission(submissionId, gradeData);

        if (response.success) {
            alert('Submission berhasil dinilai!');
            await loadPendingSubmissions();
        } else {
            alert(response.message || 'Gagal menilai submission');
        }
    } catch (error) {
        console.error('Grade submission error:', error);
        alert('Terjadi kesalahan');
    }
}

// UPDATE: Load pending promotions
async function loadPendingPromotions() {
    try {
        const response = await apiService.getPendingPromotions();

        if (response.success) {
            displayPendingPromotions(response.data.promotions);
        }
    } catch (error) {
        console.error('Failed to load pending promotions:', error);
    }
}

// UPDATE: Approve promotion
async function approvePromotion(promotionId) {
    try {
        const response = await apiService.approvePromotion(promotionId);

        if (response.success) {
            alert('Promosi berhasil disetujui!');
            await loadPendingPromotions();
        } else {
            alert(response.message || 'Gagal menyetujui promosi');
        }
    } catch (error) {
        console.error('Approve promotion error:', error);
        alert('Terjadi kesalahan');
    }
}
```

---

## 📚 Langkah 7: Update Module & LMS Pages

### LMS User Page (`/src/pages/modules/lms-user.html`)

**Update to fetch materials from API:**

```javascript
// Load API Service
// <script src="../../js/api-service.js"></script>

// UPDATE: Load module materials from API
async function loadModuleMaterials(moduleSlug) {
    try {
        const response = await apiService.getModuleMaterials(moduleSlug);

        if (response.success) {
            displayMaterials(response.data.materials);
        }
    } catch (error) {
        console.error('Failed to load materials:', error);
    }
}

// UPDATE: Get specific class material
async function loadClassMaterial(moduleSlug, classNumber) {
    try {
        const response = await apiService.getClassMaterial(moduleSlug, classNumber);

        if (response.success) {
            displayClassMaterial(response.data.material);
        }
    } catch (error) {
        console.error('Failed to load class material:', error);
    }
}

// UPDATE: Mark class as complete
async function markClassComplete(classId) {
    try {
        const response = await apiService.markClassComplete(classId);

        if (response.success) {
            alert('Class ditandai sebagai selesai!');
            // Update progress indicator
            updateProgressIndicator();
        }
    } catch (error) {
        console.error('Failed to mark class complete:', error);
    }
}
```

---

## 📤 Langkah 8: File Upload (Assignment Submission)

**Example untuk submit assignment dengan file:**

```javascript
async function submitAssignment(assignmentId) {
    const fileInput = document.getElementById('fileInput');
    const submissionText = document.getElementById('submissionText').value;
    const codeContent = document.getElementById('codeContent').value;

    // Create FormData
    const formData = new FormData();
    formData.append('assignment_id', assignmentId);
    formData.append('submission_text', submissionText);
    formData.append('code_content', codeContent);

    // Add file if selected
    if (fileInput.files.length > 0) {
        formData.append('file', fileInput.files[0]);
    }

    try {
        const response = await apiService.submitAssignment(formData);

        if (response.success) {
            alert('Assignment berhasil disubmit!');
            window.location.href = 'dashboard.html';
        } else {
            alert(response.message || 'Gagal submit assignment');
        }
    } catch (error) {
        console.error('Submit assignment error:', error);
        alert('Terjadi kesalahan saat submit assignment');
    }
}
```

---

## 🔄 Langkah 9: Migration from LocalStorage to API

### Before (LocalStorage):
```javascript
loadFromLocalStorage();
const users = Database.users;
saveToLocalStorage();
```

### After (API):
```javascript
const response = await apiService.getAllUsers();
const users = response.data.users;
// No need to save, backend handles it
```

### Key Differences:

1. **All operations are now async** - Use `async/await`
2. **No need to manually save** - Backend handles data persistence
3. **Error handling required** - Use try/catch blocks
4. **Response structure** - Always check `response.success`

---

## ✅ Checklist Update untuk Setiap Halaman

Untuk setiap halaman HTML, pastikan:

- [ ] Include `api-service.js` sebelum script lain
- [ ] Update function calls menjadi async/await
- [ ] Replace localStorage operations dengan API calls
- [ ] Add error handling (try/catch)
- [ ] Add loading states untuk UX yang lebih baik
- [ ] Update response handling (check `response.success`)
- [ ] Test authentication flow
- [ ] Test data fetching
- [ ] Test data submission

---

## 🚀 Testing Integration

### 1. Start Backend Server

```bash
cd /home/luthfi/codesmart/backend
npm run dev
```

Backend berjalan di `http://localhost:5000`

### 2. Start Frontend Server

```bash
cd /home/luthfi/codesmart
python -m http.server 8000
```

Frontend berjalan di `http://localhost:8000`

### 3. Test Login

1. Buka `http://localhost:8000/src/pages/auth/login.html`
2. Login dengan default admin:
   - Username: `admin`
   - Password: `admin123`
3. Cek Network tab di DevTools
4. Lihat request ke `http://localhost:5000/api/v1/auth/login`
5. Cek response dan JWT token

### 4. Test Registration

1. Buka `http://localhost:8000/src/pages/auth/register.html`
2. Register user baru
3. Cek database PostgreSQL untuk user baru
4. Cek status = 'pending'

### 5. Test Dashboard

1. Login sebagai admin
2. Navigate ke admin dashboard
3. Check API calls di Network tab
4. Verify data loading dari backend

---

## 🐛 Common Issues & Solutions

### Issue 1: CORS Error

**Error:**
```
Access to fetch at 'http://localhost:5000/api/v1/auth/login' from origin 'http://localhost:8000' has been blocked by CORS policy
```

**Solution:**
Backend sudah configured untuk CORS. Pastikan `FRONTEND_URL` di `.env`:
```env
FRONTEND_URL=http://localhost:8000
```

### Issue 2: 401 Unauthorized

**Error:** API returns 401 status

**Solution:**
- Token expired atau invalid
- Call `authService.validateSession()` untuk refresh
- Or logout dan login ulang

### Issue 3: apiService is not defined

**Error:** `ReferenceError: apiService is not defined`

**Solution:**
Pastikan `api-service.js` di-load SEBELUM file JavaScript lainnya:
```html
<script src="/src/js/api-service.js"></script> <!-- FIRST -->
<script src="/src/js/auth.js"></script> <!-- AFTER -->
```

### Issue 4: Connection Refused

**Error:** `Failed to fetch` atau `Connection refused`

**Solution:**
- Pastikan backend server running di `http://localhost:5000`
- Check dengan `curl http://localhost:5000/health`
- Verify database connection

---

## 📝 Summary

**Yang Sudah Dibuat:**
- ✅ API Service Layer (`api-service.js`)
- ✅ Updated Auth Service (`auth.js`)
- ✅ Complete Backend API
- ✅ Integration Guide (dokumen ini)

**Yang Perlu Dilakukan:**
- ⚠️ Update setiap halaman HTML untuk include `api-service.js`
- ⚠️ Update setiap JavaScript function menjadi async
- ⚠️ Replace localStorage calls dengan API calls
- ⚠️ Test semua functionality

**Estimated Time per Page:** 15-30 minutes

**Total Pages to Update:** 16 halaman

**Total Estimated Time:** 4-8 hours

---

## 🎯 Next Steps

1. **Start Backend Server**
   ```bash
   cd backend && npm run dev
   ```

2. **Update Authentication Pages First**
   - login.html
   - register.html

3. **Test Authentication Flow**
   - Register → Login → Dashboard

4. **Update Dashboard Pages One by One**
   - User dashboard
   - Admin dashboard
   - Assessor dashboard

5. **Update Module Pages**
   - LMS pages
   - Module pages

6. **Comprehensive Testing**

---

**Last Updated:** November 3, 2025
**Status:** ✅ Ready for Integration Implementation
