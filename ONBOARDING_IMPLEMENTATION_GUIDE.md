# Onboarding Flow - Complete Implementation Guide

**Status:** ✅ IMPLEMENTATION COMPLETE

---

## Overview

This document describes the complete onboarding flow that triggers immediately after first-time Google Sign-In. The system guides new users through two sequential modals to set up their account with role-specific information.

---

## Architecture

### Flow Diagram

```
Google Sign-In
    ↓
OAuthCallback validates email (@kld.edu.ph)
    ↓
User created/updated in step2 DB
    ↓
Check: profile_completed = false?
    ├─ YES → Show Onboarding Flow
    │   ├─ Modal 1: Role Selection + Details (Mandatory)
    │   └─ Modal 2: Set Password (Skippable)
    │       ↓
    │   Redirect to /user dashboard
    │
    └─ NO → Redirect directly to /user dashboard
```

---

## Component Architecture

### 1. `OAuthCallback.jsx` (Entry Point)
**Location:** `resources/js/Pages/Auth/OAuthCallback.jsx`

**Responsibilities:**
- Validate email domain (@kld.edu.ph)
- Create/update user in step2 DB
- Check if `profile_completed` is false
- Show onboarding flow if needed
- Show loading/status UI

**Key Changes:**
- Imports `OnboardingFlow` component
- Calls `/api/oauth/google-login` endpoint
- Checks `data.user.profile_completed` flag
- Conditionally renders `<OnboardingFlow />` or redirects

---

### 2. `OnboardingFlow.jsx` (Orchestrator)
**Location:** `resources/js/Pages/Auth/OnboardingFlow.jsx`

**Responsibilities:**
- Manage onboarding step state
- Fetch courses and institutes dropdowns
- Orchestrate between Modal 1 and Modal 2
- Handle completion and redirect

**Props:**
```javascript
{
  userId: string (UUID),
  email: string,
  profileCompleted: boolean,
  onOnboardingComplete: function
}
```

**States:**
- `'onboarding'` - Show role selection modal
- `'password'` - Show password setup modal
- `'complete'` - Onboarding complete (unmount)

---

### 3. `OnboardingModal.jsx` (Step 1 - Mandatory)
**Location:** `resources/js/Pages/Auth/OnboardingModal.jsx`

**Features:**
- **Non-skippable:** Black backdrop prevents closing
- **Role Selection:** Student or Professor/Teacher radio buttons
- **Dynamic Fields Based on Role:**

**If Student:**
- Student ID (e.g., STU001)
- Course dropdown (fetched from API)

**If Professor:**
- Employee ID (e.g., EMP001)
- Institute dropdown (fetched from API)

**Shared:**
- Phone Number (optional)

**Validation:**
```
✓ Role selected
✓ Role-specific required fields filled
```

**Submission:**
```
POST /api/onboarding/complete
{
  "user_id": "uuid",
  "role": "student|professor",
  "student_id": "STU001" (if student),
  "course_id": "uuid" (if student),
  "employee_id": "EMP001" (if professor),
  "institute_id": "uuid" (if professor),
  "phone_number": "09xxxxxxxxx" (optional)
}
```

---

### 4. `SetPasswordModal.jsx` (Step 2 - Skippable)
**Location:** `resources/js/Pages/Auth/SetPasswordModal.jsx`

**Features:**
- **Skippable:** Users can skip password setup
- **Password Strength Indicator:** Visual feedback (Very Weak → Strong)
- **Password Confirmation:** Must match
- **Context Explanation:** Why setting password is useful

**Benefits Listed:**
- Access on shared devices
- No need to sign into Google Account
- Faster login for group sessions

**Submission:**
```
POST /api/onboarding/set-password
{
  "user_id": "uuid",
  "password": "password"
}
```

**Skip:**
- No API call
- Proceed directly to completion

---

## Backend Implementation

### OnboardingController
**Location:** `app/Http/Controllers/Auth/OnboardingController.php`

**Endpoints:**

#### 1. `POST /api/onboarding/complete`
Completes the first step of onboarding.

**Logic:**
```
1. Validate request (role, IDs, foreign keys)
2. Check if student or professor
3. IF STUDENT:
   a. Verify course exists
   b. Create/update student_csg_officers record
   c. Set student_id as foreign key reference
4. IF PROFESSOR:
   a. Verify institute exists
   b. Create/update teacher_adviser record
   c. Set institute_id as foreign key reference
5. Update users table: profile_completed = true
6. Return success + user data
```

**Error Handling:**
- 422: Validation error (missing fields, invalid UUID, role not supported)
- 404: User/Course/Institute not found
- 500: Database error

---

#### 2. `POST /api/onboarding/set-password`
Sets or updates user's STEP password.

**Logic:**
```
1. Validate request (user_id, password min 8 chars)
2. Hash password
3. Update users table
4. Return success
```

**Why Optional:**
- Google SSO makes password optional
- Allows shared device access
- Can be skipped and set up later

---

#### 3. `GET /api/onboarding/courses`
Fetches all active courses for dropdown.

**Response:**
```json
{
  "success": true,
  "courses": [
    {
      "id": "uuid",
      "name": "BSIS",
      "institute_id": "uuid"
    },
    {
      "id": "uuid",
      "name": "BSCS",
      "institute_id": "uuid"
    }
  ]
}
```

---

#### 4. `GET /api/onboarding/institutes`
Fetches all active institutes for dropdown.

**Response:**
```json
{
  "success": true,
  "institutes": [
    {
      "id": "uuid",
      "name": "CAS"
    },
    {
      "id": "uuid",
      "name": "CCS"
    }
  ]
}
```

---

## Database Models

### StudentCsgOfficer
**Table:** `student_csg_officers`

**Fields Used for Onboarding:**
- `id` (Student ID - Primary Key)
- `user_id` (Foreign Key → users.id)
- `course_id` (Foreign Key → course.id)
- `is_csg` (Boolean, defaults to false)
- `csg_is_active` (Boolean, defaults to true)

**Relationships:**
```php
$student->user();     // Belongs to User
$student->course();   // Belongs to Course (ADDED)
```

**Model Update:**
Added `course_id` to `$fillable` array and new `course()` relationship method.

---

### TeacherAdviser (NEW)
**Table:** `teacher_adviser`

**Fields Used for Onboarding:**
- `id` (Employee ID - Primary Key)
- `user_id` (Foreign Key → users.id)
- `institute_id` (Foreign Key → institute.id)
- `is_adviser` (Boolean, defaults to false)

**Relationships:**
```php
$teacher->user();        // Belongs to User
$teacher->institute();   // Belongs to Institute
```

**New Model Created:**
`app/Models/TeacherAdviser.php`

---

### Course Model
**Table:** `course`

**No changes needed** - already exists and properly configured

---

### Institute Model
**Table:** `institute`

**No changes needed** - already exists and properly configured

---

## Routes

**File:** `routes/auth.php`

**Added Routes:**
```php
Route::post('api/onboarding/complete', [OnboardingController::class, 'complete']);
Route::post('api/onboarding/set-password', [OnboardingController::class, 'setPassword']);
Route::get('api/onboarding/courses', [OnboardingController::class, 'getCourses']);
Route::get('api/onboarding/institutes', [OnboardingController::class, 'getInstitutes']);
```

**Protection:**
- All routes are in the `guest` middleware group (appropriate for OAuth)
- Password endpoint validated by user_id (user must own the password being set)

---

## User Flow Walkthrough

### Scenario 1: New Student (First Google Sign-In)

1. User clicks "Continue with Google"
2. Signs in with @kld.edu.ph email
3. OAuthCallback validates email
4. `/api/oauth/google-login` creates user (profile_completed = false)
5. OAuthCallback detects profile_completed = false
6. **Modal 1: OnboardingModal appears**
   - User selects "Student"
   - Fills in: Student ID (STU123), Course (BSIS), Phone (optional)
   - Clicks "Continue"
   - API POST to `/api/onboarding/complete`
   - student_csg_officers record created
   - users table: profile_completed = true
7. **Modal 2: SetPasswordModal appears**
   - User sees benefits of password setup
   - Option 1: Sets password → `/api/onboarding/set-password`
   - Option 2: Clicks "Skip for Now"
8. **Success and Redirect**
   - Redirected to `/user` dashboard
   - User is fully onboarded

### Scenario 2: Returning Student (Already Onboarded)

1. User clicks "Continue with Google"
2. Email validated
3. `/api/oauth/google-login` updates existing user (profile_completed = true)
4. OAuthCallback detects profile_completed = true
5. **Direct redirect to `/user` dashboard**
   - No modals shown
   - Seamless experience

### Scenario 3: Professor (First Google Sign-In)

1. Same steps 1-5 as Scenario 1
2. **Modal 1: OnboardingModal appears**
   - User selects "Professor/Teacher"
   - Fills in: Employee ID (EMP002), Institute (CCS), Phone (optional)
   - Clicks "Continue"
   - API POST to `/api/onboarding/complete`
   - teacher_adviser record created
   - users table: profile_completed = true
3. **Modal 2: SetPasswordModal appears**
   - Optional password setup
4. **Success and Redirect**
   - Redirected to `/user` dashboard

---

## Key Features

### 1. Non-Skippable First Modal
- Black backdrop (`bg-black/50`)
- No close button
- Only way forward is to complete form
- Ensures role and IDs are captured

### 2. Skippable Second Modal
- Clear "Skip for Now" button
- Password can be set later in account settings
- Reduces friction for first-time setup

### 3. Dynamic Fields
- Frontend shows/hides fields based on role selection
- Backend validates based on role in request
- Foreign key relationships enforced at DB level

### 4. Error Handling
- Validation errors shown in modal
- Field-specific error messages
- User can correct and retry
- Server-side validation (no trust on client)

### 5. Success Feedback
- Confirmation message on password setup
- Loading states during API calls
- Smooth redirect on completion

---

## Testing Checklist

### Setup
- [ ] Run `npm run dev` (frontend dev server)
- [ ] Run `php artisan serve` (Laravel backend)
- [ ] Clear caches: `php artisan cache:clear`

### Test Scenario 1: Student Onboarding
- [ ] Click "Continue with Google"
- [ ] Sign in with @kld.edu.ph email
- [ ] Modal 1 appears with role selection
- [ ] Select "Student"
- [ ] Fill Student ID: STU123
- [ ] Select Course from dropdown
- [ ] (Optional) Enter phone number
- [ ] Click "Continue"
- [ ] Verify student_csg_officers record created in DB
- [ ] Modal 2 appears for password setup
- [ ] Set a password
- [ ] Click "Set Password"
- [ ] Verify users table: password hashed, profile_completed = true
- [ ] Redirected to `/user` dashboard

### Test Scenario 2: Professor Onboarding
- [ ] Click "Continue with Google"
- [ ] Sign in with new @kld.edu.ph email
- [ ] Modal 1 appears
- [ ] Select "Professor/Teacher"
- [ ] Fill Employee ID: EMP005
- [ ] Select Institute from dropdown
- [ ] (Optional) Enter phone number
- [ ] Click "Continue"
- [ ] Verify teacher_adviser record created in DB
- [ ] Modal 2 appears
- [ ] Click "Skip for Now"
- [ ] Redirected to `/user` dashboard
- [ ] Verify no password hash in users table

### Test Scenario 3: Return User
- [ ] Click "Continue with Google"
- [ ] Sign in with previously used @kld.edu.ph email
- [ ] **No modals appear**
- [ ] Directly redirected to `/user` dashboard

### Test Scenario 4: Error Cases
- [ ] Invalid email domain (not @kld.edu.ph):
  - User signed out
  - Error message shown
  - Redirected to login
- [ ] Missing required fields in modal:
  - Error message appears
  - User cannot proceed
  - User corrects and tries again
- [ ] Invalid course/institute ID:
  - 422 error returned
  - User sees error message in modal

---

## Database Verification

### Verify Student Record
```sql
SELECT * FROM student_csg_officers 
WHERE id = 'STU123' AND user_id = '[user-uuid]';
```

**Expected Output:**
| id | user_id | course_id | is_csg | csg_is_active |
|---|---|---|---|---|
| STU123 | [uuid] | [course-uuid] | 0 | 1 |

### Verify Professor Record
```sql
SELECT * FROM teacher_adviser 
WHERE id = 'EMP005' AND user_id = '[user-uuid]';
```

**Expected Output:**
| id | user_id | institute_id | is_adviser |
|---|---|---|---|
| EMP005 | [uuid] | [institute-uuid] | 0 |

### Verify User Onboarded
```sql
SELECT id, email, profile_completed, password 
FROM users 
WHERE email = 'user@kld.edu.ph';
```

**Expected Output:**
| id | email | profile_completed | password |
|---|---|---|---|
| [uuid] | user@kld.edu.ph | 1 | [hashed] or NULL |

---

## File Summary

| File | Type | Purpose |
|------|------|---------|
| `OAuthCallback.jsx` | Component | Modified - Integrates onboarding check |
| `OnboardingFlow.jsx` | Component | New - Orchestrates flow |
| `OnboardingModal.jsx` | Component | New - Role selection + details |
| `SetPasswordModal.jsx` | Component | New - Password setup (skippable) |
| `OnboardingController.php` | Controller | New - Backend logic |
| `TeacherAdviser.php` | Model | New - Teacher/Adviser model |
| `StudentCsgOfficer.php` | Model | Modified - Added course relationship |
| `routes/auth.php` | Routes | Modified - Added 4 onboarding routes |

---

## Future Enhancements

1. **Email Verification:**
   - Verify email before allowing onboarding

2. **Profile Completion Tracking:**
   - Track what fields are completed
   - Show progress bar in modal

3. **Role Change:**
   - Allow users to change role later
   - Update student_csg_officers or teacher_adviser records

4. **Phone Verification:**
   - Validate phone numbers
   - Send OTP for verification

5. **Document Upload:**
   - Allow users to upload student/faculty ID documents
   - Verification workflow

6. **Academic Calendar Integration:**
   - Auto-fill course based on academic calendar
   - Suggest appropriate course/institute

---

## Troubleshooting

### Modal Not Appearing
**Check:**
1. Is `profile_completed` false in users table?
2. Is OnboardingFlow component imported in OAuthCallback?
3. Check browser console for errors

### Courses/Institutes Not Displaying
**Check:**
1. Are courses/institutes active in DB (archive = 0)?
2. Check Network tab for API response from `/api/onboarding/courses` and `/api/onboarding/institutes`
3. Check server logs for errors

### Record Not Created in Database
**Check:**
1. Are foreign keys valid (course_id/institute_id exist)?
2. Check Laravel logs for validation errors
3. Verify modal submitted correct data

### Password Not Being Set
**Check:**
1. Is password at least 8 characters?
2. Are passwords matching?
3. Check server logs for errors

---

**Status:** ✅ READY FOR TESTING
**Last Updated:** 2024
