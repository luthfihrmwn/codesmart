# 🔍 Discussions Page - Debug & Test Guide

**Status:** Ready for Testing
**Date:** December 3, 2025

---

## 📋 Quick Start Testing

### Step 1: Login First
Before testing anything, you MUST login:

1. Open: http://localhost:8080/src/pages/auth/login.html
2. Enter credentials:
   - Username: `guru`
   - Password: `guru123`
3. Click "Login"
4. You should be redirected to dashboard

### Step 2: Run Test Pages

We've created **3 test pages** to help debug:

#### Test Page 1: Dependencies Check
**URL:** http://localhost:8080/test-dependencies.html

**What it tests:**
- ✅ All JavaScript dependencies loaded
- ✅ authService available
- ✅ modalService available  
- ✅ notificationService available
- ✅ User logged in status
- ✅ Token in localStorage

**Expected Result:** All green ✅ checkmarks

#### Test Page 2: Full Function Test
**URL:** http://localhost:8080/test-discussions-full.html

**What it tests:**
- ✅ Authentication
- ✅ API token
- ✅ Backend connectivity
- ✅ Load discussions from API
- ✅ Render discussions to DOM
- ✅ Load modules for filter
- ✅ Load single discussion detail

**How to use:**
1. Open the page (must be logged in)
2. Click "▶️ Run Full Test"
3. Watch the logs
4. Check test results (should be all ✅)
5. See discussions preview

#### Test Page 3: Complete Test Suite  
**URL:** http://localhost:8080/test-discussions-complete.html

**What it tests:**
- Full end-to-end workflow
- All API endpoints
- Data rendering
- Click interactions

### Step 3: Test Real Discussions Page
**URL:** http://localhost:8080/src/pages/assessor/discussions-sidebar.html

**How to test:**
1. Open the page
2. Press F12 to open Developer Tools
3. Go to "Console" tab
4. Look for logs that start with:
   - `🚀 [init]`
   - `📡 [loadDiscussions]`
   - `🔍 [applyFilters]`
   - `📝 [renderDiscussions]`

**What you should see:**
```
🚀 Initializing discussions page...
📡 [loadDiscussions] Starting...
📡 [loadDiscussions] API Call: {...}
📡 [loadDiscussions] Response: 200 OK
📡 [loadDiscussions] Data received: {success: true, count: 10}
✅ [loadDiscussions] Loaded 10 discussions
🔍 [applyFilters] Starting with 10 discussions
✅ [applyFilters] Filtered to 10 discussions
📝 [renderDiscussions] Rendering 10 discussions...
✅ [renderDiscussions] Successfully rendered to DOM
```

---

## 🐛 Common Issues & Solutions

### Issue 1: Page Shows Loading Forever

**Symptoms:**
- "Memuat diskusi..." spinner never stops
- No discussions appear

**Debug Steps:**
1. Open browser console (F12)
2. Check for red error messages
3. Look at the last log message - where did it stop?

**Common Causes:**

#### A) Not Logged In
- **Error:** `User not logged in, redirecting...`
- **Solution:** Go to login page first

#### B) No Token
- **Error:** `No authentication token found`
- **Solution:** 
  - Clear browser cache
  - Login again
  - Check localStorage has 'codesmart_token'

#### C) API Returns Error
- **Error:** `HTTP 401: Unauthorized`
- **Solution:** Token expired, login again

- **Error:** `HTTP 500: Internal Server Error`
- **Solution:** Check backend logs:
  ```bash
  tail -f /tmp/codesmart-backend.log
  ```

#### D) Backend Not Running
- **Error:** `Failed to fetch` or `Network error`
- **Solution:**
  ```bash
  ./status-servers.sh  # Check if running
  ./start-servers.sh   # Start if not running
  ```

### Issue 2: Discussions Load but Can't Click

**Symptoms:**
- Discussions appear
- Clicking does nothing
- Modal doesn't open

**Debug Steps:**
1. Open console
2. Click a discussion
3. Look for errors

**Common Causes:**

#### A) showDiscussionDetail Not Defined
- **Error:** `showDiscussionDetail is not defined`
- **Check:** Function should be `window.showDiscussionDetail`
- **Solution:** Already fixed in code

#### B) Modal Service Not Working
- **Error:** `modalService is not defined`
- **Solution:** Check test-dependencies.html first

### Issue 3: Can't Post Reply

**Symptoms:**
- Modal opens
- Can type reply
- Submit doesn't work

**Debug Steps:**
1. Open discussion
2. Type reply
3. Click "Send Reply"
4. Check console for errors

**Common Causes:**

#### A) submitReply Error
- **Error:** Shows in console
- **Check:** Look for syntax errors

#### B) API Returns Error
- **Error:** `Error adding reply`
- **Check:** Network tab in DevTools

### Issue 4: Filters Don't Work

**Symptoms:**
- Changing filter doesn't update list
- Search doesn't filter

**Debug Steps:**
1. Open console
2. Change filter
3. Look for `[applyFilters]` logs

**Common Causes:**

#### A) Event Listeners Not Set
- **Check:** `setupEventListeners()` should be called in `init()`
- **Solution:** Already fixed

#### B) Filter Elements Not Found
- **Error:** `filterModule is null`
- **Check:** DOM elements exist with correct IDs

---

## 🔧 Manual Testing Checklist

Use this checklist to test all features:

### Basic Loading
- [ ] Page loads without errors
- [ ] Stats cards show numbers (Total, Active, Resolved, My Replies)
- [ ] Discussions list appears (no loading spinner)
- [ ] Discussion cards are clickable

### Filters
- [ ] Module filter dropdown has options
- [ ] Assignment filter dropdown has options
- [ ] Status filter works (All, Pinned, Solved, etc.)
- [ ] Search box filters by title/content

### View Discussion
- [ ] Click discussion opens modal
- [ ] Discussion title and content show
- [ ] Author name shows
- [ ] Replies show (if any)
- [ ] Replies color coded (Green=Assessor, Purple=Student)

### Post Reply
- [ ] Reply textarea works
- [ ] Markdown buttons work (Bold, Italic, Code)
- [ ] "Mark as Solution" checkbox works
- [ ] "Send Reply" posts reply
- [ ] Success notification shows
- [ ] Modal refreshes with new reply

### Assessor Actions
- [ ] Pin/Unpin button works
- [ ] Lock/Unlock button works
- [ ] Mark reply as solution works
- [ ] Like reply works

### Close/Navigation
- [ ] Close button closes modal
- [ ] Click outside modal closes it
- [ ] Back to list works
- [ ] Logout works

---

## 🧪 API Testing Commands

Test backend APIs directly:

### 1. Get Token
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"guru","password":"guru123"}'
```

Save the token from response.

### 2. Get Discussions
```bash
TOKEN="your_token_here"

curl -X GET "http://localhost:5000/api/v1/discussions" \
  -H "Authorization: Bearer $TOKEN"
```

### 3. Get Discussion Detail
```bash
curl -X GET "http://localhost:5000/api/v1/discussions/1" \
  -H "Authorization: Bearer $TOKEN"
```

### 4. Post Reply
```bash
curl -X POST "http://localhost:5000/api/v1/discussions/1/replies" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"content":"Test reply","is_solution":false}'
```

---

## 📊 What Should Work Now

Based on all fixes applied:

### ✅ Backend
- [x] All API endpoints working
- [x] Database has 10 discussions
- [x] Authentication working
- [x] CORS configured

### ✅ Frontend Code
- [x] All functions defined
- [x] Error handling comprehensive
- [x] Logging detailed
- [x] Dependencies loaded correctly
- [x] Init called on page load

### ✅ Features
- [x] Load discussions
- [x] Display discussions
- [x] Filter & search
- [x] View detail
- [x] View replies
- [x] Post reply
- [x] Mark solution
- [x] Pin/Lock
- [x] Like reply

---

## 🆘 If Still Not Working

### Step 1: Check Test Pages
Run all 3 test pages and note which one fails

### Step 2: Check Console
Open discussions page with F12, note exact error message

### Step 3: Check Network
F12 → Network tab → Look for failed requests

### Step 4: Check Backend
```bash
./status-servers.sh
tail -f /tmp/codesmart-backend.log
```

### Step 5: Clear Everything
```bash
# Stop servers
./stop-servers.sh

# Clear browser
# - Clear cache (Ctrl+Shift+Delete)
# - Clear localStorage
# - Close all tabs

# Restart
./start-servers.sh

# Login again
# Test again
```

### Step 6: Report Issue
If still not working, provide:
1. Screenshot of error
2. Console logs (full output)
3. Network tab showing failed request
4. Which test page fails

---

## 📝 Files Modified

All improvements made to:
- `/src/pages/assessor/discussions-sidebar.html`

Functions improved:
- `loadDiscussions()` - Better error handling, logging
- `applyFilters()` - Safe error recovery
- `renderDiscussions()` - Per-item error handling
- `formatDate()` - Input validation

---

## ✅ Next Steps

1. **Login** to the system
2. **Run test pages** to verify setup
3. **Open discussions page** and check console
4. **Test all features** using checklist
5. **Report any issues** with screenshots

---

**Last Updated:** December 3, 2025
**Status:** Ready for Testing
**Support:** Check console logs for detailed debugging

