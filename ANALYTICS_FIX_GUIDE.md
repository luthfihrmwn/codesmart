# Panduan Memperbaiki Error Analytics Page

## Masalah yang Sering Terjadi

1. **"Session Expired" atau "Unauthorized" saat membuka halaman Analytics**
   - Token JWT di browser sudah expired atau invalid
   - Browser cache masih menyimpan token lama

2. **Data tidak tampil / Loading terus-menerus**
   - Token tidak valid
   - Backend server belum siap
   - Data dummy belum ada di database

## Solusi Step-by-Step

### Opsi 1: Logout dan Login Ulang (Paling Mudah) ✅

1. Buka halaman Analytics: http://localhost:8080/src/pages/assessor/analytics-sidebar.html
2. Jika muncul error "Session Expired", klik link **"login again"**
3. Atau klik menu user (pojok kanan atas) → **Logout**
4. Login kembali dengan kredensial:
   ```
   Username: guru
   Password: guru123
   ```
5. Setelah login, buka halaman Analytics lagi
6. Data akan tampil dengan benar

### Opsi 2: Hard Refresh Browser

1. Buka halaman Analytics
2. Tekan `Ctrl + Shift + R` (Windows/Linux) atau `Cmd + Shift + R` (Mac)
3. Jika masih error, lakukan Opsi 1

### Opsi 3: Clear Browser Cache

1. Buka DevTools (F12)
2. Buka tab "Application" atau "Storage"
3. Klik "Local Storage" → `http://localhost:8080`
4. Hapus semua data (klik kanan → Clear)
5. Refresh halaman (F5)
6. Login ulang

## Verifikasi Data Real Sudah Ada

Jalankan perintah ini untuk memastikan data dummy sudah ada di database:

```bash
cd /home/luthfi/codesmart/backend
node scripts/create-submissions-for-analytics.js
```

Output yang benar:
```
✅ Using Assessor ID: 6, Student ID: 5
✅ Found 5 assignments
✅ Created submission for "Fundamental Assignment 1" - Score: 85/100
✅ Created submission for "Fundamental Assignment 2" - Score: 92/100
...
✅ Total Graded Submissions: 10
✅ Average Score: 88.60
```

## Test API Langsung

Untuk memastikan backend berfungsi dengan baik:

```bash
cd /home/luthfi/codesmart
./test-analytics-api.sh
```

Output yang benar:
```json
{
    "success": true,
    "data": {
        "overview": {
            "graded_this_week": "5",
            "graded_this_month": "5",
            "average_score": "87.60",
            "total_assignments": "12"
        }
    }
}
```

## Data yang Harus Tampil di Analytics

Setelah login dengan benar, halaman Analytics akan menampilkan:

### Stats Cards (Bagian Atas)
- **Total Students**: 0 (karena belum ada enrollment)
- **Avg Performance**: 0%
- **Completion Rate**: 0%
- **Active Classes**: 0

### Dashboard Overview
- **Graded This Week**: 5 submissions
- **Graded This Month**: 5 submissions
- **Average Score**: 87.60
- **Total Assignments**: 12
- **Total Discussions**: 10

### Grade Distribution Chart
- A (90-100): 4 students - Avg 94.25
- B (80-89): 5 students - Avg 86.20
- C (70-79): 1 student - Avg 78.00

### Statistics
- Total Graded: 10
- Average Score: 88.60
- Min Score: 78
- Max Score: 96
- Std Deviation: 5.74

### SVM Predictions Analytics
- Total Predictions: 1
- Level distribution untuk user hasan

## Troubleshooting

### Error: "Connection timeout"
- **Penyebab**: Database Supabase tidak merespons
- **Solusi**: Tunggu beberapa detik dan refresh

### Error: "Invalid token"
- **Penyebab**: Token JWT expired atau tidak valid
- **Solusi**: Logout dan login ulang

### Data tidak tampil meski sudah login
- **Penyebab**: Backend server belum siap atau data belum ada
- **Solusi**:
  1. Check backend server: `curl http://localhost:5000/health`
  2. Jalankan script insert data: `node backend/scripts/create-submissions-for-analytics.js`
  3. Refresh halaman

## File-file yang Sudah Diperbaiki

1. `/home/luthfi/codesmart/backend/controllers/analyticsController.js`
   - Fixed: `s.grade` → `s.score`
   - Fixed: GROUP BY with CASE statement

2. `/home/luthfi/codesmart/src/pages/assessor/analytics-sidebar.html`
   - Added: Better error handling for 401
   - Added: Comprehensive logging
   - Fixed: Logout function syntax error

3. `/home/luthfi/codesmart/backend/scripts/create-submissions-for-analytics.js`
   - Created: Script untuk insert dummy data
   - Uses: User hasan (ID: 5) as student

## Kontak Support

Jika masih ada masalah setelah mengikuti panduan ini:
1. Check console browser (F12) untuk error details
2. Check backend logs: `tail -50 /tmp/codesmart-backend.log`
3. Restart servers: `./stop-servers.sh && ./start-servers.sh`
