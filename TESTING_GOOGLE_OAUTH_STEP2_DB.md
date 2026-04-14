# 🧪 Testing Google OAuth + step2 DB Storage

**Testing Date:** April 14, 2026
**Feature:** Google OAuth user storage in step2 DB
**Duration:** ~10 minutes

---

## ✅ Pre-Testing Checklist

- [ ] Laravel server running (`php artisan serve`)
- [ ] npm dev server running (`npm run dev`)
- [ ] Database connected (MySQL/Supabase)
- [ ] Supabase Google OAuth configured
- [ ] Have a @kld.edu.ph Google account ready

---

## 🧪 Test 1: New User Registration (5 min)

### Step 1.1: Navigate to Register Page
```
URL: http://127.0.0.1:8000/register
Expected: Register form with "Continue with Google" button
```

### Step 1.2: Click "Continue with Google"
```
Click the blue button: "Continue with Google"
Expected: Redirected to Google login
```

### Step 1.3: Sign in with @kld.edu.ph Email
```
Email: john@kld.edu.ph (or your test account)
Expected: Google asks for permission
```

### Step 1.4: Grant Permission
```
Click "Allow" or "Continue"
Expected: Redirected back to OAuthCallback page
```

### Step 1.5: Verify OAuthCallback Page
```
Expected state: "Verifying Credentials" loading page
Then: Redirects to /user dashboard
Timing: ~3-5 seconds
```

### Step 1.6: Verify User in Dashboard
```
Navigate to: http://127.0.0.1:8000/user
Expected:
  ✅ Logged in (navbar shows your name)
  ✅ Name matches Google account
  ✅ Avatar shows (from Google)
  ✅ Email matches
```

### Step 1.7: Check Browser Console
```
Open: F12 → Console tab
Look for:
  ✅ "📝 Calling Google OAuth endpoint..."
  ✅ "✅ User created/updated in step2 DB"
  ✅ User object printed (id, name, email, etc)
```

### Step 1.8: Check Database
```bash
# SSH into MySQL or use database client
mysql -u root -p step2

# Query:
SELECT * FROM users WHERE email = 'john@kld.edu.ph';

# Expected columns to verify:
┌───────────────────────────────────────────────┐
│ id        │ UUID (auto-generated)             │
│ role_id   │ student-role-id                   │
│ name      │ "John Doe" (from Google)          │
│ email     │ "john@kld.edu.ph"                │
│ avatar_url│ "https://lh3.googleusercontent..." │
│ status    │ "active"                          │
│ profile_  │ 0 (false - needs completion)      │
│ completed │                                   │
│ email_    │ "2026-04-14 10:30:00"            │
│ verified_ │                                   │
│ at        │                                   │
│ created_at│ "2026-04-14 10:30:00"            │
│ updated_at│ "2026-04-14 10:30:00"            │
└───────────────────────────────────────────────┘
```

### Step 1.9: Check Role Assignment
```bash
# Verify Student role was assigned
SELECT u.id, u.name, u.email, r.name as role_name 
FROM users u 
JOIN roles r ON u.role_id = r.id 
WHERE u.email = 'john@kld.edu.ph';

# Expected output:
┌──────────┬──────────┬──────────────────┬───────────┐
│ id       │ name     │ email            │ role_name │
├──────────┼──────────┼──────────────────┼───────────┤
│ <uuid>   │ John Doe │ john@kld.edu.ph  │ Student   │
└──────────┴──────────┴──────────────────┴───────────┘
```

### ✅ Test 1 Complete
If all steps passed: **NEW USER REGISTRATION WORKS!**

---

## 🧪 Test 2: Existing User Login (3 min)

### Step 2.1: Logout from Dashboard
```
Click: Profile dropdown → Logout
Expected: Logged out, redirected to /login
```

### Step 2.2: Navigate to Login Page
```
URL: http://127.0.0.1:8000/login
Expected: Login form with "Continue with Google" button
```

### Step 2.3: Click "Continue with Google"
```
Click: "Continue with Google"
Expected: Redirected to Google (may auto-login if still signed in)
```

### Step 2.4: Sign in Again
```
Use same email: john@kld.edu.ph
Expected: Instant redirect (Google knows you)
```

### Step 2.5: Verify Redirect
```
Expected: OAuthCallback → Dashboard (2-3 seconds)
```

### Step 2.6: Check last_login_at Updated
```bash
mysql step2

SELECT id, email, last_login_at FROM users 
WHERE email = 'john@kld.edu.ph';

# Expected:
┌──────────┬──────────────────┬──────────────────────────┐
│ id       │ email            │ last_login_at            │
├──────────┼──────────────────┼──────────────────────────┤
│ <uuid>   │ john@kld.edu.ph  │ 2026-04-14 10:35:00      │ ← UPDATED!
└──────────┴──────────────────┴──────────────────────────┘
```

### Step 2.7: Check Backend Logs
```bash
tail -f storage/logs/laravel.log | grep -i "updating existing"

# Expected:
[2026-04-14 10:35:00] production.INFO: 📝 Updating existing Google user {"email":"john@kld.edu.ph"}
```

### ✅ Test 2 Complete
If last_login_at updated: **EXISTING USER LOGIN WORKS!**

---

## 🧪 Test 3: Invalid Email Domain (2 min)

### Step 3.1: Sign Out
```
Click: Logout
```

### Step 3.2: Go to Login
```
URL: http://127.0.0.1:8000/login
```

### Step 3.3: Click "Continue with Google"
```
Click: "Continue with Google"
```

### Step 3.4: Use Non-KLD Email
```
Sign in with: gmail@gmail.com or any non-@kld.edu.ph email
Expected: Login with different account
```

### Step 3.5: Verify Error Message
```
Expected state: OAuthCallback shows red error
Message: "Email must be a valid KLD school email (@kld.edu.ph)"
```

### Step 3.6: Verify Redirect
```
Expected: After 3 seconds, redirects to /login
Expected: User NOT created in database
```

### Step 3.7: Confirm No User Created
```bash
mysql step2

SELECT * FROM users WHERE email = 'gmail@gmail.com';

# Expected: EMPTY (no results)
```

### ✅ Test 3 Complete
If error shown and user NOT created: **EMAIL VALIDATION WORKS!**

---

## 🧪 Test 4: Avatar Display (2 min)

### Step 4.1: Login with Google Again
```
Use: john@kld.edu.ph (your Google account with profile pic)
Expected: Dashboard loads
```

### Step 4.2: Check Navbar Avatar
```
Location: Top-right of navbar
Expected: 
  ✅ Avatar image shows (circular)
  ✅ Comes from Google (profile picture)
  ✅ Not a placeholder/initial
```

### Step 4.3: Check Profile Dropdown
```
Click: Avatar in navbar
Expected: Dropdown shows
  ✅ Large avatar image
  ✅ Name below avatar
  ✅ Email below name
```

### Step 4.4: Go to Profile Page
```
Click: "Profile" in dropdown
URL: http://127.0.0.1:8000/profile
Expected:
  ✅ Avatar displays in profile
  ✅ Name filled in
  ✅ Email filled in
  ✅ Role shows as "Student"
```

### Step 4.5: Verify Avatar URL in Database
```bash
SELECT avatar_url FROM users 
WHERE email = 'john@kld.edu.ph';

# Expected:
┌──────────────────────────────────────────────────┐
│ avatar_url                                       │
├──────────────────────────────────────────────────┤
│ https://lh3.googleusercontent.com/a-/... │
└──────────────────────────────────────────────────┘
```

### ✅ Test 4 Complete
If avatar shows in navbar and profile: **AVATAR STORAGE WORKS!**

---

## 📊 Test Summary

| Test | Feature | Status |
|------|---------|--------|
| Test 1 | New User Registration | [ ] Pass / [ ] Fail |
| Test 2 | Existing User Login | [ ] Pass / [ ] Fail |
| Test 3 | Email Validation | [ ] Pass / [ ] Fail |
| Test 4 | Avatar Display | [ ] Pass / [ ] Fail |

---

## 🔍 Debugging Commands

### View All Google Users
```bash
mysql step2

SELECT id, name, email, role_id, avatar_url, created_at 
FROM users 
ORDER BY created_at DESC 
LIMIT 5;
```

### View User with Role
```bash
SELECT u.id, u.name, u.email, r.name as role, u.avatar_url 
FROM users u 
JOIN roles r ON u.role_id = r.id 
WHERE u.email = 'john@kld.edu.ph';
```

### Check Last 20 Log Entries
```bash
tail -n 20 storage/logs/laravel.log
```

### Filter Google OAuth Logs
```bash
grep -i "google\|oauth" storage/logs/laravel.log | tail -n 10
```

### Monitor Live Logs
```bash
tail -f storage/logs/laravel.log | grep -i "google"
```

---

## ✅ Success Criteria

All tests pass if:

✅ **Test 1 - Registration**
- User created in step2 DB
- role_id set to student
- avatar_url populated
- email_verified_at = now()
- Browser console shows success message

✅ **Test 2 - Login**
- User NOT duplicated
- last_login_at timestamp updated
- Backend log shows "Updating existing Google user"

✅ **Test 3 - Email Validation**
- Non-@kld.edu.ph email shows error
- User NOT created in database
- Redirects to /login after 3 seconds

✅ **Test 4 - Avatar**
- Avatar displays in navbar
- Avatar displays in profile page
- avatar_url URL is valid (starts with https://lh3.googleusercontent)

---

## 🐛 Troubleshooting

### Issue: "User not created/updated" error
**Solution:**
1. Check browser console for exact error message
2. Check Laravel logs: `tail -f storage/logs/laravel.log`
3. Verify @kld.edu.ph email domain
4. Verify Student role exists: `SELECT * FROM roles WHERE slug='student';`

### Issue: Avatar not showing
**Solution:**
1. Check avatar_url in database: `SELECT avatar_url FROM users WHERE email='...';`
2. Verify URL is valid (click it in browser)
3. Check if CORS issues (browser console errors)
4. Verify Google account has profile picture

### Issue: User created twice (duplicate)
**Solution:**
1. Check for database constraints
2. Verify email uniqueness: `SELECT COUNT(*) FROM users WHERE email='john@kld.edu.ph';`
3. Clear browser cache and cookies
4. Try again with same email

### Issue: Redirect loop
**Solution:**
1. Clear browser cookies
2. Check localStorage (F12 → Application → localStorage)
3. Clear all STEP-related cookies
4. Try in incognito window

---

## 📝 Test Report Template

```
Google OAuth + step2 DB - Test Report
Date: ___________________
Tester: ___________________

Test Results:
- Test 1 (New Registration): [ ] PASS [ ] FAIL
- Test 2 (Existing Login): [ ] PASS [ ] FAIL
- Test 3 (Email Validation): [ ] PASS [ ] FAIL
- Test 4 (Avatar Display): [ ] PASS [ ] FAIL

Overall: [ ] ALL PASS [ ] SOME FAILURES

Issues Found:
1. ___________________
2. ___________________
3. ___________________

Notes:
___________________
```

---

## 🎉 Ready to Test!

Everything is configured and ready. Run the tests above and verify that Google OAuth users appear in step2 DB! 

**Expected outcome:** When users click "Continue with Google", they should:
1. ✅ Authenticate with Supabase
2. ✅ Be created in step2 DB users table
3. ✅ Get default Student role
4. ✅ Have avatar stored from Google
5. ✅ Be redirected to dashboard

**Happy Testing!** 🚀

