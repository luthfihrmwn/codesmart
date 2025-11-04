# 🔧 Fix Supabase IPv6 Issue

## Masalah

Supabase database Anda hanya accessible via IPv6, tapi sistem Anda tidak support IPv6 global.

**Error:**
```
connect ENETUNREACH 2406:da1c:f42:ae00:d6a0:6993:1916:1129:5432
Network is unreachable
```

---

## Solusi: Gunakan Supabase Connection Pooler

Supabase menyediakan **Transaction Mode Pooler** yang biasanya support IPv4.

### Step 1: Dapatkan Connection String Pooler

1. Buka Supabase Dashboard
2. Go to **Settings** → **Database**
3. Scroll ke **Connection string**
4. Copy **Connection pooling** string (bukan Direct connection!)

Format biasanya:
```
postgresql://postgres.PROJECT_REF:PASSWORD@aws-0-REGION.pooler.supabase.com:6543/postgres
```

Perhatikan:
- Port: **6543** (bukan 5432)
- Host: `*.pooler.supabase.com` (bukan db.*.supabase.co)

### Step 2: Update .env

Edit `backend/.env`:

```env
# Supabase Pooler Connection (IPv4 compatible)
DB_HOST=aws-0-ap-southeast-1.pooler.supabase.com
DB_PORT=6543
DB_NAME=postgres
DB_USER=postgres.YOUR_PROJECT_REF
DB_PASSWORD=YOUR_PASSWORD
```

**IMPORTANT:**
- Port adalah **6543**
- User adalah `postgres.YOUR_PROJECT_REF`
- Host adalah pooler, bukan db direct

---

## Alternatif: Gunakan Supabase REST API

Jika pooler juga tidak work, gunakan Supabase REST API instead of direct PostgreSQL.

### Install Supabase JS Client:

```bash
cd backend
npm install @supabase/supabase-js
```

### Create Supabase Client:

```javascript
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    'https://hbarocftztoyfjeymtah.supabase.co',
    'YOUR_ANON_KEY'
);
```

---

## Alternatif 2: Enable IPv6 on Your System

```bash
# Check if IPv6 is disabled
cat /proc/sys/net/ipv6/conf/all/disable_ipv6

# If returns 1, IPv6 is disabled. Enable it:
sudo sysctl -w net.ipv6.conf.all.disable_ipv6=0
sudo sysctl -w net.ipv6.conf.default.disable_ipv6=0

# Test connection again
```

---

## Alternatif 3: Use SQLite Instead

Jika semua gagal, kita bisa migrate ke SQLite untuk development:
- No network issues
- File-based
- Perfect for local dev

---

## Yang Mana?

**Paling mudah:** Gunakan **Connection Pooler** (port 6543)

Silakan:
1. Buka Supabase Dashboard
2. Copy **Connection pooling** string
3. Beri tahu saya, dan saya akan update config

**Atau:**
Enable IPv6 di sistem Anda dan retry.

**Atau:**
Kita migrate ke SQLite (paling reliable untuk local development).
