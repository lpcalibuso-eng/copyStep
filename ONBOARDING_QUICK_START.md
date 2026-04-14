# Onboarding Flow - Quick Start Guide

**Implementation Status:** ✅ COMPLETE AND READY FOR TESTING

---

## What Was Built

A two-step onboarding modal system that appears after first-time Google Sign-In:

1. **Modal 1 (Mandatory):** Role Selection + Profile Details
   - Student: Student ID + Course selection
   - Professor: Employee ID + Institute selection
   - Shared: Phone number (optional)

2. **Modal 2 (Skippable):** Set STEP Account Password
   - Allows login on shared devices
   - Can be skipped and set up later

---

## Files Created

### React Components (Frontend)
```
resources/js/Pages/Auth/
├── OnboardingFlow.jsx       (Orchestrates the flow)
├── OnboardingModal.jsx      (Modal 1: Role + Details)
└── SetPasswordModal.jsx     (Modal 2: Password)
```

### Laravel Controller (Backend)
```
app/Http/Controllers/Auth/
└── OnboardingController.php  (4 endpoints)
```

### Models
```
app/Models/
├── TeacherAdviser.php        (NEW - Teacher records)
└── StudentCsgOfficer.php     (UPDATED - Added course relationship)
```

### Routes
```
routes/auth.php              (UPDATED - Added 4 onboarding routes)
```

### Modified Files
```
resources/js/Pages/Auth/OAuthCallback.jsx  (UPDATED - Integrated onboarding check)
```

---

## API Endpoints

### 1. Complete Onboarding (Step 1)
```
POST /api/onboarding/complete

Request:
{
  "user_id": "uuid",
  "role": "student" or "professor",
  "student_id": "STU001" (if student),
  "course_id": "uuid" (if student),
  "employee_id": "EMP001" (if professor),
  "institute_id": "uuid" (if professor),
  "phone_number": "09xxxxxxxxx" (optional)
}

Response (Success):
{
  "success": true,
  "message": "Student record created successfully",
  "student_record": {...},
  "user_onboarded": true
}
```

### 2. Set Password (Step 2)
```
POST /api/onboarding/set-password

Request:
{
  "user_id": "uuid",
  "password": "min-8-characters"
}

Response (Success):
{
  "success": true,
  "message": "Password set successfully",
  "user_id": "uuid"
}
```

### 3. Get Courses (For Dropdown)
```
GET /api/onboarding/courses

Response:
{
  "success": true,
  "courses": [
    { "id": "uuid", "name": "BSIS", "institute_id": "uuid" },
    { "id": "uuid", "name": "BSCS", "institute_id": "uuid" }
  ]
}
```

### 4. Get Institutes (For Dropdown)
```
GET /api/onboarding/institutes

Response:
{
  "success": true,
  "institutes": [
    { "id": "uuid", "name": "CAS" },
    { "id": "uuid", "name": "CCS" }
  ]
}
```

---

## Database Changes

### student_csg_officers table
**Added support for:**
- `course_id` foreign key
- Auto-populate course when onboarding as student

### teacher_adviser table
**Now populated on professor onboarding:**
- Employee ID as primary key
- User ID as foreign key
- Institute ID as foreign key

### users table
**Changes:**
- `profile_completed` set to true after onboarding
- `password` field populated if user sets password in Modal 2
- `phone` field updated if provided

---

## Testing Quick Checklist

```bash
# 1. Start servers
npm run dev              # Terminal 1
php artisan serve       # Terminal 2

# 2. Clear caches
php artisan cache:clear
```

### Test Student Onboarding
1. Go to http://localhost:5173/register
2. Click "Continue with Google"
3. Sign in with @kld.edu.ph email
4. **Modal 1 appears:**
   - Select "Student"
   - Enter Student ID (e.g., STU123)
   - Select Course from dropdown
   - (Optional) Enter phone
   - Click "Continue"
5. **Modal 2 appears:**
   - Enter password (min 8 chars)
   - Confirm password
   - Click "Set Password"
6. **Verify:**
   - Redirected to /user dashboard
   - Check DB: `SELECT * FROM student_csg_officers WHERE id = 'STU123';`
   - Should see new record with user_id and course_id

### Test Professor Onboarding
1. Same as Student, but:
   - Select "Professor/Teacher"
   - Enter Employee ID (e.g., EMP005)
   - Select Institute from dropdown
   - Click "Continue"
2. In Modal 2:
   - Click "Skip for Now"
3. **Verify:**
   - Redirected to /user dashboard
   - Check DB: `SELECT * FROM teacher_adviser WHERE id = 'EMP005';`
   - Should see new record with user_id and institute_id

### Test Return User
1. Sign in with Google using same email as before
2. **No modals appear**
3. **Direct redirect to /user dashboard**

---

## Key Features

| Feature | Details |
|---------|---------|
| **Modal 1 Non-Skippable** | Black backdrop, no close button, must complete |
| **Modal 2 Skippable** | "Skip for Now" button available |
| **Role-Based Fields** | Different inputs for Student vs Professor |
| **Dropdown Data** | Courses and Institutes fetched from DB |
| **Password Strength** | Visual indicator (Weak → Strong) |
| **Error Handling** | Field-level validation and error messages |
| **Foreign Key Support** | course_id and institute_id validated |
| **Profile Tracking** | profile_completed flag ensures flow only runs once |

---

## Architecture Overview

```
Google Sign-In
    ↓
OAuthCallback.jsx
    ├─ Validates @kld.edu.ph email
    ├─ Calls /api/oauth/google-login
    └─ Checks: profile_completed = false?
        ├─ YES → Show OnboardingFlow.jsx
        │   ├─ Fetch courses & institutes
        │   ├─ Show OnboardingModal (Step 1)
        │   ├─ POST /api/onboarding/complete
        │   ├─ Show SetPasswordModal (Step 2)
        │   ├─ POST /api/onboarding/set-password (optional)
        │   └─ Redirect to /user
        └─ NO → Redirect to /user
```

---

## Database Schema References

### student_csg_officers
```sql
id (varchar) - Primary Key, Student ID (e.g., STU001)
user_id (char) - FK → users.id
course_id (char) - FK → course.id
is_csg (tinyint) - Default 0
csg_is_active (tinyint) - Default 1
```

### teacher_adviser
```sql
id (varchar) - Primary Key, Employee ID (e.g., EMP001)
user_id (char) - FK → users.id
institute_id (char) - FK → institute.id
is_adviser (tinyint) - Default 0
```

### course
```sql
id (char) - Primary Key, UUID
institute_id (char) - FK → institute.id
name (varchar) - e.g., "BSIS"
```

### institute
```sql
id (char) - Primary Key, UUID
name (varchar) - e.g., "CAS"
```

### users
```sql
id (char) - Primary Key, UUID
role_id (char) - FK → roles.id
email (varchar)
phone (varchar)
password (varchar)
profile_completed (tinyint) - 0 or 1
```

---

## Error Messages & Solutions

### "Email must be a valid KLD school email"
- **Cause:** Email is not @kld.edu.ph
- **Solution:** Use @kld.edu.ph email address

### Modal fields not showing
- **Cause:** API failed to load courses/institutes
- **Solution:** Check `/api/onboarding/courses` and `/api/onboarding/institutes` in Network tab

### "Validation error" when submitting
- **Cause:** Missing required fields or invalid UUID
- **Solution:** Fill all required fields, verify IDs are valid

### "Selected course/institute does not exist"
- **Cause:** Foreign key validation failed
- **Solution:** Select from the dropdown, don't manually enter IDs

### Record not appearing in database
- **Cause:** API succeeded but DB not updated
- **Solution:** Check Laravel logs: `tail -f storage/logs/laravel.log`

---

## File Locations Reference

| Purpose | Location |
|---------|----------|
| Main entry | `resources/js/Pages/Auth/OAuthCallback.jsx` |
| Flow logic | `resources/js/Pages/Auth/OnboardingFlow.jsx` |
| Role/Details modal | `resources/js/Pages/Auth/OnboardingModal.jsx` |
| Password modal | `resources/js/Pages/Auth/SetPasswordModal.jsx` |
| Backend logic | `app/Http/Controllers/Auth/OnboardingController.php` |
| Teacher model | `app/Models/TeacherAdviser.php` |
| Student model | `app/Models/StudentCsgOfficer.php` |
| Routes | `routes/auth.php` |

---

## Next Steps

1. **Test the implementation:**
   - Follow the testing checklist above
   - Verify both student and professor flows work
   - Check database records are created correctly

2. **Monitor logs:**
   - Check `storage/logs/laravel.log` for any errors
   - Browser console for JavaScript errors

3. **Verify database:**
   - Confirm student_csg_officers records created
   - Confirm teacher_adviser records created
   - Verify profile_completed flag set to true

4. **Deploy when ready:**
   - Run tests in staging environment
   - Deploy to production

---

## Additional Documentation

For detailed information, see:
- `ONBOARDING_IMPLEMENTATION_GUIDE.md` - Complete technical guide
- `TESTING_OAUTH_FIXES.md` - Testing procedures
- `CODE_CHANGES_SUMMARY.md` - Code changes from previous OAuth fixes

---

**Status:** ✅ Ready for Testing
**Components Created:** 4 (3 React + 1 Controller)
**Endpoints Added:** 4
**Models Created/Updated:** 2
**Lines of Code:** ~1,500+ lines

Start testing now! 🚀
