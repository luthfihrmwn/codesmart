# 🚀 Quick Integration Guide - Dashboard

## Problem
Dashboard.html masih menggunakan localStorage dan old Database object.

## Solution
Replace script section dengan integration baru.

---

## Step 1: Backup Original

```bash
cp src/pages/user/dashboard.html src/pages/user/dashboard.html.backup
```

---

## Step 2: Update dashboard.html

Cari section ini (around line 463):
```html
<!-- Load database and auth -->
<script src="../../data/database.js"></script>
<script src="../../js/auth.js"></script>
<script src="../../js/svm.js"></script>

<script>
    // ... old code here (lines 467-653)
</script>
```

Replace dengan:
```html
<!-- API Integration -->
<script src="/src/js/auth.js"></script>
<script src="/src/js/api-service.js"></script>
<script src="/src/js/user-dashboard.js"></script>
```

Hapus semua old `<script>` inline code (line 467-653).

---

## Step 3: Add Loading Spinner

Tambahkan sebelum closing `</body>`:

```html
<!-- Loading Spinner -->
<div id="pageLoader" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 9999; justify-content: center; align-items: center;">
    <div style="background: white; padding: 3rem; border-radius: 1rem; text-align: center;">
        <div style="border: 4px solid #f3f3f3; border-top: 4px solid var(--main-color); border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 0 auto 1rem;"></div>
        <p style="font-size: 1.6rem;">Loading...</p>
    </div>
</div>

<style>
@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
</style>
```

---

## Step 4: Test

1. Refresh dashboard page
2. Should load data from API
3. Check browser console for any errors

---

## If Errors Occur

Check:
1. Backend is running: `curl http://localhost:5000/health`
2. Frontend is running: `http://localhost:8080`
3. User is logged in
4. Browser console for errors

---

## Alternative: Use Simplified Dashboard

I can create a completely new, simplified dashboard.html that's fully integrated.

Would you prefer:
- **Option A**: Fix existing dashboard.html (keep all styling)
- **Option B**: Create new simplified dashboard.html (faster, cleaner)

Let me know and I'll proceed!
