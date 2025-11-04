# 🚀 Setup Supabase PostgreSQL - CodeSmart

## Step 1: Masukkan Password Supabase

Edit file `.env`:

```bash
cd /home/luthfi/codesmart/backend
nano .env
```

Ubah baris ini dengan password Supabase Anda:
```
DB_PASSWORD=YOUR_SUPABASE_PASSWORD_HERE
```

Ganti `YOUR_SUPABASE_PASSWORD_HERE` dengan password database Supabase Anda.

Save: `Ctrl+X`, `Y`, `Enter`

---

## Step 2: Test Koneksi

```bash
cd /home/luthfi/codesmart/backend
node -e "
const { Pool } = require('pg');
const pool = new Pool({
    host: 'db.hbarocftztoyfjeymtah.supabase.co',
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password: process.env.DB_PASSWORD || 'YOUR_PASSWORD',
    ssl: { rejectUnauthorized: false }
});

pool.query('SELECT version()')
    .then(result => {
        console.log('✅ Supabase connection successful!');
        console.log('PostgreSQL:', result.rows[0].version.substring(0, 60));
        pool.end();
    })
    .catch(err => {
        console.error('❌ Connection failed:', err.message);
        pool.end();
        process.exit(1);
    });
"
```

---

## Step 3: Update Database Config (SSL Required)

Supabase memerlukan SSL connection. File `backend/config/database.js` perlu di-update.

---

## Step 4: Run Migration

```bash
npm run migrate
```

---

## Step 5: Start Backend

```bash
npm run dev
```

---

## Step 6: Start Frontend

```bash
cd /home/luthfi/codesmart
python3 -m http.server 8080
```

---

## Step 7: Test Login

Buka: http://localhost:8080/src/pages/auth/login.html

Login:
- Username: `admin`
- Password: `admin123`

---

**Setelah ini saya akan:**
1. Update database config untuk support SSL
2. Run migration
3. Integrate semua 14 halaman frontend yang tersisa
