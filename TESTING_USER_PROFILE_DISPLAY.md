# 🧪 Testing User Profile Display

## Quick Test - 5 Minutes

### Step 1: Register New User
```
Go to: http://127.0.0.1:8000/register
Fill form:
- First Name: Test
- Last Name: User
- Email: test-display@gmail.com
- Password: TestPassword123
- Role: Student
Click "Create Account"
```

### Step 2: Verify OTP & Complete Profile
```
Check email for OTP code
Enter code
Complete profile with:
- Department/Institute: Any
- Phone: 09XX-XXXX-XXXX
Save profile
Redirect to /user dashboard
```

### Step 3: Check Navbar
```
Look at top right of page
Should see:
✅ Your name (e.g., "Test User")
✅ "Student" role label (not just "500 pts")
Click on profile dropdown
Should show:
✅ Your full name at top
✅ Your email address
✅ "Student" role
✅ Links to View Profile, Notifications, Logout
```

### Step 4: Check Profile Page
```
Click "View Profile" in dropdown
Or go to: http://127.0.0.1:8000/user/profile
Should see:
✅ Your name in header
✅ Your email in header
✅ "Student" badge (actual role, not hardcoded)
✅ Account Information section showing:
   - Full Name: Test User
   - Email: test-display@gmail.com
   - Role: Student (actual database role)
   - Phone: (what you entered)
   - Account Created: (today's date/time)
   - Status: active
```

### Expected Result
✅ All user data from database displays correctly  
✅ Role shows actual value from roles table  
✅ No errors in browser console  
✅ Avatar shows initials or placeholder  

---

## What Should Display in Navbar

**Before (Old):**
```
[Avatar] Name
         500 pts
[Dropdown arrow]
```

**After (New):**
```
[Avatar] Test User
         Student
[Dropdown arrow]
```

When dropdown opens:
```
┌────────────────────────────────┐
│ [Avatar] Test User             │
│          test-display@gmail.com│
│          Student               │
├────────────────────────────────┤
│ View Profile                   │
│ Notifications                  │
│ Logout                         │
└────────────────────────────────┘
```

---

## What Should Display in Profile

### Profile Header
```
[Large Avatar or Initials]
Test User
test-display@gmail.com
[Student] [✓ Email Verified] [✓ Profile Complete]
```

### Account Information
```
👤 Full Name
   Test User

✉️ Email
   test-display@gmail.com

🎓 Role
   Student (or actual role)

📞 Phone
   09XX-XXXX-XXXX (or "Not provided")

📅 Account Created
   April 14, 2026 (today's date)
   2:30:45 PM (time)

👤 Status
   active
```

---

## Test with Google OAuth (Optional)

### Step 1: Login with Google
```
Go to: http://127.0.0.1:8000/login
Click "Sign in with Google"
Use Google account
```

### Step 2: Check Navbar
```
Should show:
✅ Your Google account name
✅ Google account email
✅ Google account avatar (if available)
✅ Your role (Student/Professor based on registration)
```

### Step 3: Check Profile
```
Go to profile page
Should show:
✅ Google account name
✅ Google account email
✅ Google avatar (if stored)
✅ Role from database (not Google data)
✅ All database fields
```

---

## Troubleshooting

### Navbar not showing role
**Check:**
- [ ] Logged in? (Should see "Test User" not "Student")
- [ ] Role is Student/Professor? (Check database)
- [ ] Refresh page (Ctrl+F5)

### Profile page empty
**Check:**
- [ ] Logged in? (Should have `props.auth.user`)
- [ ] Try going to: /user/profile
- [ ] Check browser console for errors (F12)

### Avatar showing initials instead of picture
**Expected if:**
- avatar_url is empty (shows initials - this is OK!)
- Not using Google OAuth (Google OAuth may populate avatar_url)

### Wrong role displays
**Check:**
- [ ] What role did you select during registration?
- [ ] Check database: `SELECT * FROM users WHERE email='test@gmail.com'`
- [ ] Check roles table: `SELECT * FROM roles`

---

## Browser Console Check

Open browser console (F12) and check for errors:

### ✅ Should NOT see errors like:
```
❌ Cannot read property 'name' of undefined
❌ props.auth is not defined
❌ user.role is null
```

### ✅ Should see props being used:
Look at network tab or React DevTools:
```
props.auth.user = {
  id: "uuid",
  name: "Test User",
  email: "test@gmail.com",
  avatar_url: null,
  phone: "09XX-XXXX-XXXX",
  status: "active",
  role: {
    id: "uuid",
    name: "Student",
    slug: "student"
  }
}
```

---

## Success Checklist

- [ ] Registered successfully
- [ ] Completed profile
- [ ] Navbar shows name
- [ ] Navbar shows role
- [ ] Navbar shows email in dropdown
- [ ] Profile page loads
- [ ] Profile shows all info from database
- [ ] No console errors
- [ ] Avatar shows (initials or picture)
- [ ] Role matches what you selected

---

## If Something Doesn't Work

1. **Hard refresh:** Ctrl+F5 (or Cmd+Shift+R on Mac)
2. **Check Laravel logs:**
   ```bash
   tail -f storage/logs/laravel.log | grep -i "user\|role\|profile"
   ```
3. **Check database:**
   ```bash
   mysql -u root -pstep2 step2
   SELECT id, name, email, role_id FROM users LIMIT 5;
   ```
4. **Restart Laravel:** 
   ```bash
   php artisan serve
   ```

---

## What Data Comes From Step2 Database

This implementation uses these fields from the step2 database:

| Field | Table | Use |
|-------|-------|-----|
| name | users | Display in navbar & profile |
| email | users | Display in navbar & profile |
| avatar_url | users | Display profile picture |
| phone | users | Display in profile |
| status | users | Display in profile |
| email_verified_at | users | Show verification badge |
| profile_completed | users | Show completion badge |
| created_at | users | Show account creation date |
| role_id | users | Link to roles table |
| role.name | roles | Display actual role |
| role.slug | roles | Identify role type |

---

## Expected Database State After Registration

```sql
-- In users table
INSERT INTO users (
  id, name, email, role_id, avatar_url, 
  phone, status, email_verified_at, 
  profile_completed, created_at
) VALUES (
  'uuid-1234', 
  'Test User', 
  'test-display@gmail.com', 
  '059f4170-235d-11f1-9647-10683825ce81', -- Student role ID
  NULL, -- Will be set when/if avatar uploaded
  '09XX-XXXX-XXXX', -- From profile completion
  'active', 
  NOW(), -- Set during OTP verification
  true, -- Set after profile completion
  NOW()
);

-- In roles table (should already exist)
SELECT * FROM roles WHERE id = '059f4170-235d-11f1-9647-10683825ce81';
-- Should return: name='Student', slug='student', ...
```

---

## Time Estimate

- Registration: 2 minutes
- OTP verification: 1 minute
- Profile completion: 1 minute
- Visual verification: 1 minute
- **Total: ~5 minutes**

---

**Ready? Start testing!** 🚀

Report any issues or unexpected behavior and I'll fix it immediately.
