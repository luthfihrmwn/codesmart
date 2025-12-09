# Quick EmailJS Setup Guide

## 🚀 5-Minute Setup

### Step 1: Create Account
```
🌐 https://www.emailjs.com/
📝 Sign up with any email
✅ Verify your email
```

### Step 2: Add Gmail Service
```
Dashboard → Email Services → Add New Service
Select: Gmail
Connect: luthfihrmwn26@gmail.com
Grant permissions
📋 Copy Service ID (e.g., service_abc123)
```

### Step 3: Create Template
```
Dashboard → Email Templates → Create New Template

Template Settings:
  Name: CodeSmart Contact Form
  To: luthfihrmwn26@gmail.com
  Subject: {{subject}} - Contact from {{from_name}}

Template Body:
  FROM: {{from_name}}
  EMAIL: {{from_email}}
  PHONE: {{phone}}
  SUBJECT: {{subject}}

  MESSAGE:
  {{message}}

📋 Copy Template ID (e.g., template_xyz789)
```

### Step 4: Get Public Key
```
Dashboard → Account → General
📋 Copy Public Key (e.g., a1B2c3D4e5F6g7H8i)
```

### Step 5: Update Code
```javascript
File: /home/luthfi/codesmart/index.html

Line 1430:
emailjs.init("YOUR_PUBLIC_KEY_HERE");

Line 1481:
const serviceID = 'YOUR_SERVICE_ID_HERE';

Line 1482:
const templateID = 'YOUR_TEMPLATE_ID_HERE';
```

### Step 6: Test
```
1. Open landing page
2. Fill contact form
3. Submit
4. ✅ Check email at luthfihrmwn26@gmail.com
```

---

## 🎯 Quick Alternative: FormSubmit (No Account Needed)

If EmailJS is too complicated, use FormSubmit:

### Replace form opening tag in index.html:

**Find** (Line 1358):
```html
<form id="contactForm" class="contact-form" onsubmit="sendEmail(event)">
```

**Replace with**:
```html
<form action="https://formsubmit.co/luthfihrmwn26@gmail.com" method="POST" class="contact-form">
```

**Add before submit button**:
```html
<input type="hidden" name="_subject" value="CodeSmart Contact Form">
<input type="hidden" name="_captcha" value="false">
<input type="hidden" name="_template" value="box">
```

**Remove** `onsubmit="sendEmail(event)"` and EmailJS scripts

✅ **Done! No account needed, works immediately**

---

## 📝 Credentials Checklist

- [ ] Public Key: `________________`
- [ ] Service ID: `________________`
- [ ] Template ID: `________________`
- [ ] Updated in code (line 1430, 1481, 1482)
- [ ] Tested and working

---

**Choose**: EmailJS (full control) OR FormSubmit (easiest)
