# Testing Guide - After Fixes Applied

## Pre-Test Checklist

### 1. Clear Browser Cache
```
Chrome DevTools → Application → Storage → Clear site data
OR
Hard refresh: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)
```

### 2. Verify Laravel Server is Running
```bash
# Terminal 1 - Check if running on port 8000 or 8001
lsof -i :8000
# OR
lsof -i :8001
```

### 3. Verify Frontend Server is Running
```bash
# Terminal 2 - Check if running on port 5173
lsof -i :5173
```

### 4. Verify Cache Cleared
```bash
# Terminal 3
cd /home/jimz/Documents/Capstone/step22
php artisan cache:clear
php artisan route:cache
```

---

## Test 1: Quick API Endpoint Test

### Method A: Using curl
```bash
curl -X POST http://127.0.0.1:8000/api/oauth/google-login \
  -H "Content-Type: application/json" \
  -d '{
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "test@kld.edu.ph",
    "name": "Test User",
    "avatar_url": null
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "test@kld.edu.ph",
    "name": "Test User",
    "profile_completed": false,
    ...
  },
  "message": "User created successfully"
}
```

**NOT Expected:**
```
419 Unauthorized (CSRF token mismatch)
<!DOCTYPE html>...</html>
```

### Method B: Using Browser Console
```javascript
// Open DevTools → Console
// Copy and paste this:

fetch('http://127.0.0.1:8000/api/oauth/google-login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    id: '550e8400-e29b-41d4-a716-446655440000',
    email: 'test@kld.edu.ph',
    name: 'Test User'
  })
})
.then(r => {
  console.log('Status:', r.status, r.statusText);
  return r.json();
})
.then(data => console.log('Response:', data))
.catch(err => console.error('Error:', err));
```

**Expected Console Output:**
```
Status: 200 OK
Response: {success: true, user: {...}, message: "User created successfully"}
```

---

## Test 2: Full Google OAuth Flow

### Steps:

#### 1. Navigate to Login
```
Open: http://localhost:5173/login
(or http://localhost:5173/register)
```

#### 2. Click "Continue with Google"
- Button should be visible
- Click it

#### 3. Supabase Auth Modal Opens
- Google sign-in dialog appears
- Sign in with `@kld.edu.ph` email account
- Example: `jttamayo@kld.edu.ph`

#### 4. Monitor Browser Console
**Open DevTools → Console tab**

Watch for these logs (in order):

```javascript
// 1. Callback starts
📝 Calling Google OAuth endpoint to create/update user in step2 DB
🆔 Supabase User ID: [some-uuid]

// 2. API request sent
POST http://127.0.0.1:8000/api/oauth/google-login

// 3. Response received
✅ User created/updated in step2 DB: {id: '[uuid]', email: '[email]', ...}

// 4. Onboarding check
📋 Profile incomplete, showing onboarding flow
(OR: ✅ Profile already completed, redirecting to dashboard)
```

**Should NOT see:**
```javascript
419 (unknown status)
Unexpected token '<'
SyntaxError
```

#### 5. Check Network Tab
**DevTools → Network tab**

Look for `POST` to `/api/oauth/google-login`:
- **Status:** `200` ✅ (NOT 419 ❌)
- **Response:** Valid JSON ✅ (NOT HTML ❌)
- **Size:** Should show response data

#### 6. Verify Onboarding Modal Appears (if new user)
```
Modal should show:
- "Let's complete your profile" heading
- Role selection dropdown
- Role-specific fields appear
```

OR

#### 6. Verify Redirect to Dashboard (if returning user)
```
Should redirect to: /user
No modals shown
```

---

## Test 3: Database Verification (After Step 2)

### Using Tinker (Interactive Shell)
```bash
php artisan tinker

# Check if user was created/updated
$user = User::where('email', 'jttamayo@kld.edu.ph')->first();
echo $user;

# Should show:
# - id: matches Supabase user ID
# - profile_completed: false (new) or true (returning)
# - avatar_url: should have value
# - created_at: recent timestamp
```

### Using Raw MySQL
```bash
# If you prefer direct SQL
mysql -u root -p step2

SELECT id, name, email, profile_completed, created_at 
FROM users 
WHERE email = 'jttamayo@kld.edu.ph' 
ORDER BY created_at DESC 
LIMIT 1;
```

**Expected Result:**
```
+--------------------------------------+-------------------+---------------------+------------------+---------+
| id                                   | name              | email               | profile_completed | created |
+--------------------------------------+-------------------+---------------------+------------------+---------+
| 550e8400-e29b-41d4-a716-446655440000 | JAMES TORILLAS... | jttamayo@kld.edu.ph | 0                 | 2026... |
+--------------------------------------+-------------------+---------------------+------------------+---------+
```

---

## Test 4: Onboarding Flow (if profile not complete)

### For Student Role:
1. Modal appears with "Let's complete your profile"
2. Select **Student** from Role dropdown
3. Fields appear:
   - Student ID (required): `STU001`
   - Course (required): select from dropdown
   - Phone (optional): can leave blank
4. Click **Continue**
5. Second modal appears for password
6. Either:
   - **Option A:** Set password and click Submit
   - **Option B:** Click "Skip for Now"
7. Should redirect to `/user` dashboard

### For Professor/Teacher Role:
1. Modal appears with "Let's complete your profile"
2. Select **Professor** from Role dropdown
3. Fields appear:
   - Employee ID (required): `EMP001`
   - Institute (required): select from dropdown
   - Phone (optional): can leave blank
4. Click **Continue**
5. Second modal appears for password
6. Either:
   - **Option A:** Set password and click Submit
   - **Option B:** Click "Skip for Now"
7. Should redirect to `/user` dashboard

### Verification After Onboarding:
```bash
php artisan tinker

# For Student:
$student = StudentCsgOfficer::where('user_id', '[user-uuid]')->first();
echo $student;

# For Professor:
$teacher = TeacherAdviser::where('user_id', '[user-uuid]')->first();
echo $teacher;

# Check user flag updated:
$user = User::find('[user-uuid]');
echo $user->profile_completed; // Should be true (1)
```

---

## Test 5: Returning User (Skip Onboarding)

### Steps:
1. Sign out from dashboard
2. Go back to login page
3. Click "Continue with Google"
4. Sign in with SAME email as Test 2
5. Should redirect directly to `/user` dashboard
6. No onboarding modals should appear

### Database Check:
```bash
php artisan tinker
$user = User::where('email', 'jttamayo@kld.edu.ph')->first();
echo $user->profile_completed; // Should be 1 (true)
```

---

## Troubleshooting

### Problem: Still Getting 419 Error

**Solution:**
```bash
# Completely clear route cache
php artisan route:clear

# Rebuild cache
php artisan route:cache

# Restart server
# Kill current artisan serve process and start new one
php artisan serve
```

### Problem: Getting HTML Response (<!DOCTYPE)

**Solution:**
1. Check Laravel logs: `tail -f storage/logs/laravel.log`
2. Look for error message
3. Common causes:
   - Model not found
   - Role not found (check roles table)
   - Database connection issue
4. Run: `php artisan migrate:refresh` (if safe) or check DB connection

### Problem: Onboarding Modal Not Appearing

**Solution:**
1. Check DevTools console for errors
2. Verify `profile_completed` is `false` in database
3. Check if `OnboardingFlow.jsx` is loaded:
   - DevTools → Sources → check for OnboardingFlow.jsx
4. Verify `courses` and `institutes` are fetched:
   - Network tab → `/api/onboarding/courses` (should be 200)
   - Network tab → `/api/onboarding/institutes` (should be 200)

### Problem: Courses/Institutes Dropdown Empty

**Solution:**
```bash
php artisan tinker

# Check if courses exist
Course::where('archive', 0)->count();

# Check if institutes exist
Institute::where('archive', 0)->count();

# If count is 0, create test data:
Course::create(['name' => 'Test Course', 'institute_id' => '[uuid]']);
Institute::create(['name' => 'Test Institute']);
```

---

## Success Criteria

### Test 1: API Endpoint Test
- ✅ curl/fetch returns status 200
- ✅ Response is valid JSON
- ✅ Response includes user data with `profile_completed` field

### Test 2: Google OAuth Flow
- ✅ Can sign in with Google
- ✅ No 419 errors in console
- ✅ Console shows success messages
- ✅ Network tab shows 200 response for `/api/oauth/google-login`
- ✅ Either onboarding modal appears OR redirects to dashboard

### Test 3: Database
- ✅ User record created/updated with correct email
- ✅ User ID matches Supabase ID
- ✅ `profile_completed` flag correct
- ✅ `avatar_url` populated from Google

### Test 4: Onboarding
- ✅ Student path creates `student_csg_officers` record
- ✅ Professor path creates `teacher_adviser` record
- ✅ `profile_completed` updated to `true`
- ✅ Password optional (can skip)
- ✅ Redirects to `/user` dashboard

### Test 5: Returning User
- ✅ Second login skips onboarding
- ✅ Direct redirect to `/user`
- ✅ No modals appear

---

## Summary

| Test | Expected Result | Pass/Fail |
|------|---|---|
| API Endpoint | Status 200, valid JSON | |
| Google OAuth | No 419 errors, modal/redirect appears | |
| Database | User created with correct data | |
| Onboarding | Correct record created, role handled | |
| Returning User | Skips onboarding, goes to dashboard | |

---

**Ready?** Start with Test 1 (API Endpoint) to verify the fixes are working!

**Documentation:** 
- Full details: `OAUTH_FIXES_APPLIED.md`
- CSRF explanation: `CSRF_FIX.md`
- Architecture: `ONBOARDING_IMPLEMENTATION_GUIDE.md`
