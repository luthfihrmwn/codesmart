# EmailJS Configuration Guide - Fixing "Account not found" Error

## Summary
The contact form is currently showing "Account not found" error when submitting. This is an EmailJS account configuration issue that needs to be fixed in the EmailJS dashboard to enable emails to successfully send to luthfihrmwn26@gmail.com.

## Current Configuration

### Code Settings (in index.html):
```javascript
// Public Key
emailjs.init("aAqEZxLGo3kHUPWzq");

// Service & Template IDs
const serviceID = 'service_zsykfqe';
const templateID = 'template_ouu5lxj';
```

### Target Email:
- **Recipient**: luthfihrmwn26@gmail.com

## Problem Diagnosis

### Error Message:
```
Error: Account not found
```

### What This Means:
The EmailJS public key, service ID, or template ID is not properly configured or doesn't exist in the EmailJS account.

### Possible Causes:
1. ❌ EmailJS account not created or verified
2. ❌ Public key is incorrect or expired
3. ❌ Service ID doesn't exist or is inactive
4. ❌ Template ID doesn't exist or is misconfigured
5. ❌ Email service (Gmail) not connected in EmailJS

## Solution: Setting Up EmailJS Correctly

### Step 1: Create/Verify EmailJS Account

1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Sign up or log in with your account
3. Verify your email address if not already verified

### Step 2: Add Email Service

1. In EmailJS Dashboard, go to **Email Services**
2. Click **Add New Service**
3. Select **Gmail** (recommended for luthfihrmwn26@gmail.com)
4. Click **Connect Account**
5. Sign in with **luthfihrmwn26@gmail.com**
6. Grant permissions to EmailJS
7. Copy the **Service ID** (e.g., `service_abc123xyz`)

### Step 3: Create Email Template

1. Go to **Email Templates**
2. Click **Create New Template**
3. Configure the template:

```
Template Name: CodeSmart Contact Form
Template ID: template_ouu5lxj (or create new)

To Email: luthfihrmwn26@gmail.com

Subject: {{subject}} - Contact from {{from_name}}

Body:
You have received a new message from CodeSmart contact form:

====================================
FROM: {{from_name}}
EMAIL: {{from_email}}
PHONE: {{phone}}
SUBJECT: {{subject}}
====================================

MESSAGE:
{{message}}

====================================
This email was sent via CodeSmart portfolio contact form.
Reply to: {{from_email}}
```

4. **Important**: Set the template to send to **luthfihrmwn26@gmail.com**
5. Save the template and copy the **Template ID**

### Step 4: Get Public Key

1. Go to **Account** → **General**
2. Find **Public Key** section
3. Copy your **Public Key** (e.g., `a1B2c3D4e5F6g7H8i`)

### Step 5: Update Code with New Credentials

After setting up EmailJS, update the code in [index.html](index.html) with the new credentials:

```javascript
// Update Public Key (line 1430)
emailjs.init("YOUR_NEW_PUBLIC_KEY");

// Update Service & Template IDs (lines 1481-1482)
const serviceID = 'YOUR_NEW_SERVICE_ID';
const templateID = 'YOUR_NEW_TEMPLATE_ID';
```

## HTML Form Requirements

The contact form MUST have these exact field names for EmailJS to work:

```html
<form id="contactForm" onsubmit="sendEmail(event)">
    <input type="text" name="from_name" required>      <!-- User's name -->
    <input type="email" name="from_email" required>    <!-- User's email -->
    <textarea name="message" required></textarea>      <!-- User's message -->
    <button type="submit">Send Message</button>
</form>
```

### Current Form Fields (Verified ✅):

Your contact form has these fields:
```html
<input type="text" name="from_name" placeholder="Full Name" required>
<input type="email" name="from_email" placeholder="Email Address" required>
<input type="tel" name="phone" placeholder="Mobile Number" required>
<input type="text" name="subject" placeholder="Email Subject" required>
<textarea name="message" rows="8" placeholder="Your Message" required></textarea>
```

Your EmailJS template should use these variables:
- `{{from_name}}` - User's full name
- `{{from_email}}` - User's email address
- `{{phone}}` - User's mobile number
- `{{subject}}` - Email subject
- `{{message}}` - User's message

## Testing the Setup

### Test Checklist:

1. ✅ EmailJS account created and verified
2. ✅ Gmail service connected with luthfihrmwn26@gmail.com
3. ✅ Email template created with correct variables ({{from_name}}, {{from_email}}, {{message}})
4. ✅ Template configured to send to luthfihrmwn26@gmail.com
5. ✅ Public key, service ID, and template ID updated in code
6. ✅ Form field names match template variables
7. ✅ Test submission sends email successfully

### How to Test:

1. Open the landing page in browser
2. Fill out the contact form with test data:
   - Name: Test User
   - Email: test@example.com
   - Message: This is a test message
3. Click **Send Message**
4. Check for success modal (not error modal)
5. Check luthfihrmwn26@gmail.com inbox for the test email
6. If successful: ✅ EmailJS is working!
7. If failed: Check browser console for specific error

## Alternative Solutions (If EmailJS Continues to Fail)

### Option 1: FormSubmit (No Account Required)

FormSubmit is a free service that doesn't require account setup:

```html
<form action="https://formsubmit.co/luthfihrmwn26@gmail.com" method="POST">
    <input type="text" name="name" required>
    <input type="email" name="email" required>
    <textarea name="message" required></textarea>
    <input type="hidden" name="_subject" value="New Contact Form Submission">
    <input type="hidden" name="_captcha" value="false">
    <input type="hidden" name="_template" value="box">
    <button type="submit">Send</button>
</form>
```

**Pros**:
- No account needed
- No API keys
- Simple setup
- Free forever

**Cons**:
- No custom success modal (redirects to FormSubmit page)
- Less control over email format

### Option 2: Web3Forms (API-based)

```html
<form action="https://api.web3forms.com/submit" method="POST">
    <input type="hidden" name="access_key" value="YOUR_ACCESS_KEY">
    <input type="text" name="name" required>
    <input type="email" name="email" required>
    <textarea name="message" required></textarea>
    <button type="submit">Send</button>
</form>
```

### Option 3: Backend API (Most Control)

Create a simple backend API (Node.js, PHP, Python) that sends emails using:
- Nodemailer (Node.js)
- PHPMailer (PHP)
- smtplib (Python)

## Current Error Handling (Already Implemented)

Your code already has excellent error handling that shows alternatives if EmailJS fails:

```javascript
if (error.text && error.text.includes('Account not found')) {
    errorMessageEl.innerHTML = '
        <strong>Konfigurasi email sedang dalam perbaikan.</strong><br>
        Silakan hubungi kami melalui:<br><br>
        📧 <a href="mailto:luthfihrmwn26@gmail.com">luthfihrmwn26@gmail.com</a><br>
        📱 Instagram: <a href="https://www.instagram.com/luthfihrmwn_/">@luthfihrmwn_</a>
    ';
}
```

This means users can still contact you via:
- Direct email link (opens email client)
- Instagram DM link

## Recommended Action Plan

### Immediate Fix (5 minutes):

1. Go to [emailjs.com](https://www.emailjs.com/)
2. Sign up/login
3. Add Gmail service with luthfihrmwn26@gmail.com
4. Create email template
5. Copy Public Key, Service ID, Template ID
6. Update code with new credentials
7. Test the form

### Alternative (If EmailJS doesn't work):

I can help you implement FormSubmit or another alternative that doesn't require EmailJS account setup.

## Need Help?

If you're having trouble with EmailJS setup, let me know and I can:
1. Help implement FormSubmit (no account needed)
2. Create a backend API for email sending
3. Set up Web3Forms
4. Debug specific EmailJS errors

## Files to Update

Once you have the correct EmailJS credentials:

1. **`/home/luthfi/codesmart/index.html`**
   - Line 1430: Update public key
   - Line 1481: Update service ID
   - Line 1482: Update template ID

---

**Created**: 2025-12-09
**Status**: ⚠️ AWAITING EMAILJS CONFIGURATION
**Next Step**: Set up EmailJS account or choose alternative email solution
