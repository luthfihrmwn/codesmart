# CodeSmart - Troubleshooting Guide

## Halaman Assessor Tidak Berfungsi / Tidak Bisa Diklik

### Masalah yang Diperbaiki (Version 2.7.1)

#### 1. Authentication Check yang Tidak Proper
**Masalah**: Authentication check berjalan langsung tanpa error handling yang baik, menyebabkan script tetap berjalan meskipun user tidak authorized.

**Solusi**:
```javascript
// BEFORE
if (!currentUser || currentUser.role !== 'assessor') {
    alert('Akses ditolak! Halaman ini hanya untuk Assessor.');
    window.location.href = '../auth/login.html';
}

// AFTER
const currentUser = authService.getCurrentUser();

if (!currentUser || currentUser.role !== 'assessor') {
    alert('Akses ditolak! Halaman ini hanya untuk Assessor.');
    window.location.href = '/index.html';
    throw new Error('Unauthorized access'); // Stop script execution
}
```

**File**: `/src/pages/assessor/dashboard.html` (line 984-991)

#### 2. Redirect URL yang Tidak Konsisten
**Masalah**: Menggunakan relative path `../auth/login.html` yang bisa menyebabkan masalah navigation.

**Solusi**: Menggunakan absolute path `/index.html` untuk redirect.

### Cara Testing Halaman Assessor

#### Langkah 1: Start HTTP Server
```bash
cd /home/luthfi/codesmart
python3 -m http.server 8000
```

#### Langkah 2: Buka Browser
Akses: `http://localhost:8000`

#### Langkah 3: Login sebagai Assessor
1. Klik tombol "Login" di homepage
2. Gunakan credentials:
   - **Username**: `assessor`
   - **Password**: `assessor123`
3. Sistem akan otomatis redirect ke Assessor Dashboard

#### Langkah 4: Verify Functionality
Pastikan semua fitur berikut berfungsi:
- ✅ Sidebar navigation (LMS Management, Profile, Settings)
- ✅ Menu toggle untuk mobile view
- ✅ Dark mode toggle
- ✅ Profile photo upload
- ✅ Phone number field
- ✅ Profile form submission
- ✅ LMS module selector
- ✅ Submission grading interface
- ✅ Export/Import data

### Debugging dengan Browser Console

Jika masih ada masalah, buka Developer Console (F12) dan cek:

1. **JavaScript Errors**:
   ```
   Console > Cek error messages berwarna merah
   ```

2. **Network Issues**:
   ```
   Network Tab > Cek apakah semua file JS/CSS ter-load dengan status 200
   ```

3. **Element Inspection**:
   ```
   Elements Tab > Cek apakah semua element dengan ID yang direferensikan ada:
   - menuToggle
   - sidebar
   - pageTitle
   - profilePhotoPreview
   - profilePhotoInput
   ```

4. **LocalStorage Session**:
   ```javascript
   // Di Console, jalankan:
   console.log(localStorage.getItem('codesmart_session'));

   // Harus mengembalikan object dengan role: 'assessor'
   ```

### Masalah Umum dan Solusi

#### Masalah: "Element not found" Error
**Penyebab**: Script mencoba mengakses elemen sebelum DOM selesai dimuat.

**Solusi**: Pastikan semua initialization code berada di dalam `window.onload`:
```javascript
window.onload = () => {
    // Initialization code here
};
```

#### Masalah: Event Listener Tidak Berfungsi
**Penyebab**: Element tidak ditemukan atau script error sebelum listener terpasang.

**Solusi**:
1. Cek console untuk error messages
2. Verify element exists dengan `document.getElementById('elementId')`
3. Pastikan script dijalankan setelah DOM ready

#### Masalah: File JS Tidak Ter-load
**Penyebab**: Path relatif yang salah atau file missing.

**Solusi**: Verify semua file yang dibutuhkan ada:
```bash
ls -la src/data/database.js
ls -la src/js/auth.js
ls -la src/js/utils.js
ls -la src/js/export-import.js
ls -la src/js/pwa.js
```

#### Masalah: LocalStorage Tidak Persist
**Penyebab**: Browser privacy mode atau browser settings.

**Solusi**:
1. Nonaktifkan private/incognito mode
2. Allow cookies dan local storage di browser settings
3. Clear cache dan reload

### Testing Checklist

Setelah perbaikan, test semua fungsi berikut:

- [ ] Login sebagai Assessor berhasil
- [ ] Redirect ke dashboard berhasil
- [ ] Sidebar menu bisa diklik
- [ ] Tab navigation berfungsi (LMS, Profile, Settings)
- [ ] Menu toggle untuk mobile view works
- [ ] Dark mode toggle works
- [ ] Profile photo upload works
- [ ] Phone number validation works
- [ ] Profile form submission works
- [ ] Profile completion indicator muncul
- [ ] LMS module selector berfungsi
- [ ] Submission list ter-load
- [ ] Grading interface berfungsi
- [ ] Export data works
- [ ] Import data works
- [ ] Logout works

### File yang Dimodifikasi (Version 2.7.1)

1. `/src/pages/assessor/dashboard.html` (line 984-991)
   - Improved authentication check
   - Added error throw to stop script execution
   - Changed redirect URL to absolute path

### Changelog

#### Version 2.7.1 (2025-11-02)
**Fixed**:
- Authentication check di assessor dashboard yang menyebabkan halaman tidak berfungsi
- Redirect URL yang tidak konsisten
- Script execution yang berlanjut setelah unauthorized access

**Files Modified**:
- `/src/pages/assessor/dashboard.html`

---

## Kontak

Jika masih mengalami masalah, silakan:
1. Cek console error messages
2. Verify semua file requirements
3. Test dengan browser yang berbeda
4. Clear cache dan cookies

**Testing Environment**:
- Python HTTP Server: `python3 -m http.server 8000`
- Browser: Chrome, Firefox, atau Edge (latest version)
- LocalStorage enabled
- JavaScript enabled
