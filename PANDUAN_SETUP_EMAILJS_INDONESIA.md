# Panduan Setup EmailJS - Bahasa Indonesia

## 📌 Penting!
**Contact form SUDAH bisa digunakan tanpa login!** Tidak ada pengecekan login di kode. Siapa saja bisa mengisi form dan mengirim pesan.

Yang perlu diperbaiki hanya: **Setup akun EmailJS** agar email benar-benar terkirim ke luthfihrmwn26@gmail.com

## 🚀 Langkah-Langkah Setup (5-10 Menit)

### Langkah 1: Buat Akun EmailJS

1. Buka browser, kunjungi: **https://www.emailjs.com/**
2. Klik **"Sign Up"** (Daftar)
3. Isi form pendaftaran:
   - Email: Bisa pakai email apa saja (misalnya luthfihrmwn26@gmail.com atau email lain)
   - Password: Buat password yang kuat
4. Klik **"Sign Up"**
5. **Cek email Anda** dan klik link verifikasi
6. Login ke dashboard EmailJS

### Langkah 2: Tambahkan Gmail Service

1. Setelah login, di dashboard EmailJS, klik **"Email Services"** di menu kiri
2. Klik tombol **"Add New Service"**
3. Pilih **"Gmail"** dari daftar email services
4. Klik **"Connect Account"**
5. **PENTING**: Login dengan akun Gmail **luthfihrmwn26@gmail.com**
6. Google akan minta izin akses - klik **"Allow"** atau **"Izinkan"**
7. Setelah berhasil terkoneksi, Anda akan melihat **Service ID**
8. **COPY Service ID** ini (contoh: `service_abc123xyz`)
   - Simpan di notepad untuk nanti
9. Klik **"Create Service"**

### Langkah 3: Buat Email Template

1. Di dashboard EmailJS, klik **"Email Templates"** di menu kiri
2. Klik tombol **"Create New Template"**
3. Isi form template:

**Template Name:**
```
CodeSmart Contact Form
```

**Template ID:** (biarkan default atau ganti dengan `template_ouu5lxj`)

**To Email:** (isi dengan)
```
luthfihrmwn26@gmail.com
```

**Subject:** (copy paste ini)
```
{{subject}} - Pesan dari {{from_name}}
```

**Content/Body:** (copy paste ini)
```
Anda mendapat pesan baru dari CodeSmart Contact Form:

====================================
DARI: {{from_name}}
EMAIL: {{from_email}}
TELEPON: {{phone}}
SUBJEK: {{subject}}
====================================

PESAN:
{{message}}

====================================
Email ini dikirim melalui CodeSmart portfolio contact form.
Balas ke: {{from_email}}
```

4. **PENTING**: Di bagian **"To Email"**, pastikan isi dengan **luthfihrmwn26@gmail.com**
5. Klik **"Save"**
6. **COPY Template ID** yang muncul (contoh: `template_xyz789`)
   - Simpan di notepad

### Langkah 4: Dapatkan Public Key

1. Di dashboard EmailJS, klik nama akun Anda (pojok kanan atas)
2. Pilih **"Account"** atau **"General"**
3. Scroll ke bawah, cari bagian **"API Keys"** atau **"Public Key"**
4. **COPY Public Key** Anda (contoh: `a1B2c3D4e5F6g7H8i`)
   - Simpan di notepad

### Langkah 5: Update Kode di index.html

Sekarang Anda punya 3 kredensial:
- ✅ Public Key: `_________________`
- ✅ Service ID: `_________________`
- ✅ Template ID: `_________________`

Buka file `/home/luthfi/codesmart/index.html` dan update 3 baris ini:

**Baris 1430** - Ganti Public Key:
```javascript
// SEBELUM:
emailjs.init("aAqEZxLGo3kHUPWzq");

// SESUDAH:
emailjs.init("PUBLIC_KEY_BARU_ANDA");
```

**Baris 1481** - Ganti Service ID:
```javascript
// SEBELUM:
const serviceID = 'service_zsykfqe';

// SESUDAH:
const serviceID = 'SERVICE_ID_BARU_ANDA';
```

**Baris 1482** - Ganti Template ID:
```javascript
// SEBELUM:
const templateID = 'template_ouu5lxj';

// SESUDAH:
const templateID = 'TEMPLATE_ID_BARU_ANDA';
```

### Langkah 6: Test Contact Form

1. Save file index.html
2. Buka landing page di browser
3. Scroll ke bagian **Contact**
4. Isi form contact dengan data test:
   - Full Name: `Test User`
   - Email Address: `test@example.com`
   - Mobile Number: `081234567890`
   - Email Subject: `Test Email`
   - Your Message: `Ini adalah pesan test dari contact form`
5. Klik **"Send Message"**
6. Tunggu loading...
7. **Jika berhasil**: Muncul modal hijau "Pesan Terkirim!"
8. **Cek email** luthfihrmwn26@gmail.com - seharusnya ada email masuk dari EmailJS

## ✅ Checklist Setup

- [ ] Akun EmailJS sudah dibuat dan terverifikasi
- [ ] Gmail service sudah dikoneksikan dengan luthfihrmwn26@gmail.com
- [ ] Email template sudah dibuat dengan variabel yang benar
- [ ] Template sudah diset kirim ke luthfihrmwn26@gmail.com
- [ ] Public Key sudah dicopy
- [ ] Service ID sudah dicopy
- [ ] Template ID sudah dicopy
- [ ] 3 kredensial sudah diupdate di index.html (baris 1430, 1481, 1482)
- [ ] File index.html sudah disave
- [ ] Contact form sudah ditest
- [ ] Email masuk ke luthfihrmwn26@gmail.com

## 🎯 Poin Penting

### Siapa Saja Bisa Kirim Pesan (Tanpa Login)

Kode contact form **TIDAK ADA pengecekan login sama sekali**:

```javascript
function sendEmail(event) {
    event.preventDefault();
    // Langsung kirim, tidak ada if(isLoggedIn) atau sessionCheck
    emailjs.sendForm(serviceID, templateID, '#contactForm')
        .then(function(response) {
            // Success
        })
        .catch(function(error) {
            // Error
        });
}
```

**Artinya:**
- ✅ Pengunjung yang tidak login bisa isi form
- ✅ Pengunjung yang tidak login bisa submit form
- ✅ Pengunjung yang tidak login bisa kirim email
- ✅ Tidak ada batasan akses sama sekali

### Email Akan Terkirim ke luthfihrmwn26@gmail.com

Setelah setup EmailJS benar:
1. User mengisi contact form
2. User klik "Send Message"
3. EmailJS mengirim email ke **luthfihrmwn26@gmail.com**
4. Anda akan terima email dengan:
   - Nama user
   - Email user
   - Nomor telepon user
   - Subject yang diisi user
   - Pesan yang diisi user

## 🔧 Troubleshooting

### Error: "Account not found"
**Solusi**: Anda belum setup EmailJS account atau kredensial salah
- Ikuti Langkah 1-5 di atas
- Pastikan 3 kredensial sudah diupdate dengan benar

### Error: "Template ID not found"
**Solusi**: Template ID salah atau belum dibuat
- Buat template baru di EmailJS dashboard
- Pastikan Template ID di kode sama dengan di dashboard

### Error: "Service not found"
**Solusi**: Service ID salah atau Gmail belum dikoneksikan
- Koneksikan Gmail luthfihrmwn26@gmail.com di EmailJS
- Pastikan Service ID di kode sama dengan di dashboard

### Email tidak masuk ke inbox
**Solusi**:
- Cek folder **Spam** di luthfihrmwn26@gmail.com
- Pastikan template EmailJS sudah set "To Email" ke luthfihrmwn26@gmail.com
- Tunggu 1-2 menit (kadang ada delay)

### Browser console error
**Solusi**:
- Buka Developer Tools (F12)
- Lihat tab Console
- Screenshot error dan hubungi support

## 📧 Contoh Email yang Akan Diterima

Setelah setup benar, Anda akan terima email seperti ini:

```
From: EmailJS <noreply@emailjs.com>
To: luthfihrmwn26@gmail.com
Subject: Test Email - Pesan dari Test User

Anda mendapat pesan baru dari CodeSmart Contact Form:

====================================
DARI: Test User
EMAIL: test@example.com
TELEPON: 081234567890
SUBJEK: Test Email
====================================

PESAN:
Ini adalah pesan test dari contact form

====================================
Email ini dikirim melalui CodeSmart portfolio contact form.
Balas ke: test@example.com
```

## 🎉 Selesai!

Setelah semua langkah dilakukan:
- ✅ Siapa saja bisa mengisi contact form (tanpa login)
- ✅ Email akan terkirim ke luthfihrmwn26@gmail.com
- ✅ Anda akan terima notifikasi email setiap ada yang kirim pesan
- ✅ Modal success/error akan muncul dengan animasi modern

---

**Dibuat**: 2025-12-09
**Status**: Panduan setup EmailJS untuk CodeSmart
**Tujuan**: Email dikirim ke luthfihrmwn26@gmail.com tanpa perlu login

## 💡 Tips

1. **Simpan kredensial EmailJS** di tempat aman (notepad, password manager)
2. **Jangan share Public Key** di repository public
3. **Test berkala** untuk memastikan email masih terkirim
4. **Cek spam folder** jika email tidak masuk ke inbox
5. **EmailJS free tier** limit 200 email/bulan - cukup untuk portfolio

## 🆘 Butuh Bantuan?

Jika masih error setelah setup, kirim:
1. Screenshot error modal yang muncul
2. Screenshot browser console (F12 → Console tab)
3. Konfirmasi bahwa 3 kredensial sudah diupdate

Saya siap membantu! 🚀
