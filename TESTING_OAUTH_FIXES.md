# Testing Google OAuth Fixes

**Date:** 2024
**Status:** Ready for Testing
**Purpose:** Verify that the two critical fixes work correctly:
1. Name and email display in navbar/profile after Google OAuth
2. Supabase user ID matches step2 DB user ID

---

## Changes Made

### 1. Frontend Changes (OAuthCallback.jsx)
**Problem:** Supabase user ID was not being sent to the backend.
**Solution:** Added `id: user.id` to the API request body.

```javascript
body: JSON.stringify({
  id: user.id,                    // ← NEW: Supabase user ID
  email: user.email,
  name: user.user_metadata?.full_name,
  avatar_url: user.user_metadata?.avatar_url,
}),
```

**File:** `resources/js/Pages/Auth/OAuthCallback.jsx` (lines 35-45)

---

### 2. Backend Changes (GoogleAuthController.php)

#### Change A: Accept Supabase ID
**Problem:** Backend wasn't accepting the Supabase user ID.
**Solution:** Added validation rule for ID parameter.

```php
$validated = $request->validate([
    'id' => 'required|string|uuid',  // ← NEW: Validate incoming Supabase ID
    'email' => 'required|email',
    'name' => 'required|string',
    'avatar_url' => 'nullable|string|url',
]);
```

**File:** `app/Http/Controllers/Auth/GoogleAuthController.php` (lines 39-45)

#### Change B: Use Supabase ID Instead of Generating New One
**Problem:** Backend was generating a new UUID instead of using Supabase's UUID.
**Solution:** Changed user creation to use passed Supabase ID.

```php
// ❌ BEFORE:
'id' => (string) Str::uuid(),  // Created different ID

// ✅ AFTER:
'id' => $supabaseId,  // Uses Supabase ID - SAME as Supabase user ID
```

**File:** `app/Http/Controllers/Auth/GoogleAuthController.php` (line 82)

#### Change C: Authenticate User in Laravel Session
**Problem:** User wasn't authenticated in Laravel session, so middleware returned null.
**Solution:** Call `Auth::login($user)` after creating/updating user.

```php
// Load the role relationship
$user->load('role');

// ✅ NEW: Authenticate the user in Laravel session
Auth::login($user);
Log::info('✅ User authenticated in Laravel session', [
    'user_id' => $user->id,
    'email' => $user->email,
]);
```

**File:** `app/Http/Controllers/Auth/GoogleAuthController.php` (lines 110-118)

---

## Step-by-Step Testing Guide

### Prerequisites
- Node.js development server running (if not: `npm run dev`)
- Laravel development server running (if not: `php artisan serve`)
- Laravel Tinker or Database client ready for verification

---

### Test 1: Name and Email Display in Navbar ✓

**Objective:** Verify that after Google OAuth login, the user's name and email appear in the navbar.

#### Steps:
1. **Stop your browser cache:**
   - Open DevTools (F12)
   - Go to Application tab
   - Clear all Cache Storage
   - Clear Cookies for localhost

2. **Clear Laravel session:**
   ```bash
   php artisan cache:clear
   php artisan session:clear
   ```

3. **Navigate to register page:**
   - Go to `http://localhost:5173/register`
   - You should see the Google OAuth button

4. **Click "Continue with Google":**
   - Click the Google button
   - Sign in with your @kld.edu.ph email (or test email)
   - Complete the Google authentication

5. **Verify navbar display:**
   - **Expected:** After authentication, navbar shows:
     - ✅ Your full name (e.g., "John Doe")
     - ✅ Your email (e.g., "john@kld.edu.ph")
     - ✅ Your profile avatar (Google picture)
   - **Actual:** Record what you see:
     - Name displayed: _______________
     - Email displayed: _______________
     - Avatar displayed: _______________

6. **Check browser console for debugging:**
   - Open DevTools Console (F12 → Console)
   - Look for logs like:
     ```
     ✅ Supabase user authenticated successfully
     Supabase user ID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
     ✅ User created/updated in step2 DB: { user object }
     ```
   - Record Supabase user ID from here: _______________

---

### Test 2: Check Server Logs for Authentication ✓

**Objective:** Verify that Laravel authenticated the user in the session.

#### Steps:
1. **Check Laravel logs:**
   ```bash
   tail -f storage/logs/laravel.log
   ```

2. **After logging in with Google, you should see:**
   ```
   [timestamp] INFO 🔐 Google OAuth Login Handler - Start
   [timestamp] INFO ✨ Creating new Google user (or 📝 Updating existing Google user)
   [timestamp] INFO ✅ Google user created in step2 DB (or updated)
   [timestamp] INFO ✅ User authenticated in Laravel session
   ```

3. **Verify logs show:**
   - ✅ Google OAuth handler started
   - ✅ User created or updated
   - ✅ User authenticated in session

---

### Test 3: Verify ID Consistency in Database ✓

**Objective:** Verify that the step2 DB user ID matches the Supabase user ID.

#### Steps:
1. **Using Tinker (easiest method):**
   ```bash
   php artisan tinker
   ```

2. **In the Tinker shell:**
   ```php
   // Get the user you just created (replace with your email)
   $user = App\Models\User::where('email', 'your-email@kld.edu.ph')->first();
   
   // Display the ID
   $user->id
   
   // Should output: a UUID string like: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
   ```
   
   **Record step2 DB user ID:** _______________

3. **Using Database client (alternative):**
   ```sql
   SELECT id, email, name FROM users WHERE email = 'your-email@kld.edu.ph';
   ```

4. **Compare IDs:**
   - Supabase user ID (from browser console): _______________
   - step2 DB user ID (from Tinker/SQL): _______________
   - **Are they identical?** ☐ YES ☐ NO

---

### Test 4: Verify User Data in Middleware ✓

**Objective:** Verify that the middleware properly loads and shares user data to frontend.

#### Steps:
1. **Add debug middleware (temporary):**
   Edit `app/Http/Middleware/HandleInertiaRequests.php`
   
   After line 47 (where it loads user), add logging:
   ```php
   if ($user) {
       Log::info('📋 User data shared to frontend', [
           'user_id' => $user->id,
           'email' => $user->email,
           'name' => $user->name,
           'role' => $user->role?->name,
       ]);
   }
   ```

2. **Refresh the page after login:**
   - Go to dashboard or any page
   - Check Laravel logs for the debug message

3. **Verify logs show user data:**
   - ✅ user_id (matches step2 DB)
   - ✅ email
   - ✅ name
   - ✅ role (e.g., "student")

---

### Test 5: Verify Profile Page Display ✓

**Objective:** Verify that the profile page displays all user information.

#### Steps:
1. **After logging in with Google:**
   - Click on your profile/avatar in navbar
   - Navigate to `/user` or student profile page

2. **Verify profile page shows:**
   - ✅ Full Name: _______________ (should match Google name)
   - ✅ Email: _______________ (should match Google email)
   - ✅ Avatar: _______________ (should show Google picture)
   - ✅ Role: _______________ (should be "student")
   - ✅ Status: _______________ (should be "active")

---

### Test 6: Verify Session Persistence ✓

**Objective:** Verify that authentication persists across page refreshes.

#### Steps:
1. **After logging in with Google:**
   - Refresh the page (Ctrl+R or Cmd+R)
   - **Expected:** You remain logged in, navbar still shows your info

2. **Verify:**
   - Name still displayed: ☐ YES ☐ NO
   - Email still displayed: ☐ YES ☐ NO
   - Avatar still displayed: ☐ YES ☐ NO

3. **Navigate around:**
   - Go to dashboard
   - Go to courses
   - Go to profile
   - **Expected:** Logged in on all pages

---

### Test 7: Verify Logout Works ✓

**Objective:** Verify that logout properly clears session.

#### Steps:
1. **After logging in:**
   - Click logout button in navbar/profile dropdown

2. **Verify logout:**
   - ✅ Redirected to login page
   - ✅ Navbar shows "Guest User" or no user info
   - ✅ Cannot access protected routes

3. **Try to access protected route:**
   ```
   Go to: http://localhost:5173/dashboard
   ```
   - **Expected:** Redirected to login page

---

## Debugging Checklist

If tests fail, check the following:

### Issue: Name/Email Not Showing in Navbar

**Check these in order:**

1. **Clear browser cache:**
   ```bash
   # In DevTools Application tab: Clear all storage and cookies
   ```

2. **Check OAuthCallback.jsx is sending ID:**
   - Open DevTools Console
   - Check for log: `console.log('Supabase user ID:', user.id)`
   - Should show UUID string

3. **Check GoogleAuthController received the ID:**
   - Look for log: `🔐 Google OAuth Login Handler - Start`
   - Check if 'id' field is logged

4. **Check user was authenticated:**
   - Look for log: `✅ User authenticated in Laravel session`
   - If missing, Auth::login() wasn't called

5. **Check middleware receives user:**
   - Look for user data in middleware logs
   - If null, check if Auth::login() was called

### Issue: IDs Don't Match

**Check these:**

1. **Verify OAuthCallback sends user.id:**
   ```javascript
   // In OAuthCallback.jsx, before fetch:
   console.log('Sending ID to backend:', user.id);
   ```

2. **Verify GoogleAuthController uses it:**
   - Check log for: `'supabase_id' => $supabaseId`
   - Should show the UUID that was sent

3. **Check step2 DB:**
   ```php
   // In Tinker
   $user = App\Models\User::first();
   $user->id  // Should match Supabase ID
   ```

### Issue: Session Not Persisting

**Check:**

1. **Session storage:**
   ```bash
   ls -la storage/framework/sessions/
   ```
   - Should have session files

2. **Auth middleware:**
   - Check if `Auth::login($user)` is being called
   - Check logs for authentication message

3. **Cookie settings:**
   - Check DevTools → Application → Cookies
   - Should have Laravel session cookie

---

## Success Criteria

✅ All tests passed when:

1. **Navbar Display:**
   - [ ] Name displays after Google OAuth login
   - [ ] Email displays after Google OAuth login
   - [ ] Avatar displays after Google OAuth login

2. **ID Consistency:**
   - [ ] Supabase user ID = step2 DB user ID
   - [ ] UUID format is valid on both sides
   - [ ] Database query confirms ID match

3. **Session Persistence:**
   - [ ] User remains logged in after page refresh
   - [ ] User data persists across navigation
   - [ ] Logout properly clears authentication

4. **Data Availability:**
   - [ ] Middleware receives user data
   - [ ] Frontend props.auth.user populated
   - [ ] Profile page displays all info

---

## Files Modified

| File | Change | Lines |
|------|--------|-------|
| `resources/js/Pages/Auth/OAuthCallback.jsx` | Add `id: user.id` to request | 35-45 |
| `app/Http/Controllers/Auth/GoogleAuthController.php` | Add UUID validation | 39-45 |
| `app/Http/Controllers/Auth/GoogleAuthController.php` | Use Supabase ID instead of Str::uuid() | 82 |
| `app/Http/Controllers/Auth/GoogleAuthController.php` | Add Auth import | 10 |
| `app/Http/Controllers/Auth/GoogleAuthController.php` | Add Auth::login() call | 110-118 |

---

## Next Steps After Testing

1. **If all tests pass:**
   - Remove debug logging from middleware
   - Update documentation with confirmation
   - Consider caching the solution

2. **If tests fail:**
   - Review logs from Laravel (storage/logs/laravel.log)
   - Check browser console for JavaScript errors
   - Verify database connections
   - Review implementation against this guide

3. **Performance considerations:**
   - Monitor Auth::login() performance
   - Check if role loading is necessary each time
   - Consider caching user role

---

## Support Contact

If you encounter issues:

1. **Check logs first:**
   - `tail -f storage/logs/laravel.log` (Laravel)
   - Browser DevTools Console (JavaScript)

2. **Verify file modifications:**
   - Ensure all changes were applied (use grep if needed)

3. **Clear caches:**
   ```bash
   php artisan cache:clear
   php artisan session:clear
   npm run dev  # Restart frontend
   php artisan serve  # Restart backend
   ```

---

**Test Date:** _______________
**Tester:** _______________
**Result:** ☐ PASS ☐ FAIL
**Notes:** _______________________________________________________________
