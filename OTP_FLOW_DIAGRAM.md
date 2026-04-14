# OTP Registration Flow - Visual Diagram

## Complete Registration Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                    STEP 1: USER REGISTRATION                        │
└─────────────────────────────────────────────────────────────────────┘

User fills Registration Form:
├─ First Name
├─ Last Name
├─ Email
├─ Password (min 8 chars)
├─ Confirm Password
├─ Role (Student/Professor)
└─ Agree to Terms

           ↓ POST /api/otp/send

Backend OTPController::sendOTP():
├─ Validate input data
├─ Generate 6-digit OTP (random)
├─ Store in Cache:
│  ├─ Key: "otp_{email}"
│  ├─ TTL: 10 minutes
│  └─ Data: { otp, firstName, lastName, password, role_id }
├─ Log OTP to storage/logs/laravel.log
└─ Return: { success: true, message: "OTP sent successfully" }

           ↓ Transition to OTP Verification Page


┌─────────────────────────────────────────────────────────────────────┐
│              STEP 2: EMAIL VERIFICATION (OTP ENTRY)                 │
└─────────────────────────────────────────────────────────────────────┘

User receives Email with OTP Code
User enters 6-digit OTP in form

           ↓ POST /api/otp/verify

Backend OTPController::verifyOTP():
├─ Retrieve OTP data from Cache
├─ Validate OTP matches
│  └─ If mismatch: Return 400 error
│  └─ If expired: Return 400 error
│
├─ ✅ OTP Valid, Create User:
│  ├─ User::create({
│  │  ├─ id: UUID (auto-generated)
│  │  ├─ name: firstName + lastName
│  │  ├─ email: verified email
│  │  ├─ password: hashed
│  │  ├─ role_id: from initial request
│  │  ├─ status: "active"
│  │  ├─ email_verified_at: NOW()
│  │  ├─ avatar_url: Gravatar URL (from email)
│  │  └─ profile_completed: false ⚠️ IMPORTANT
│  │ })
│  ├─ Auth::login($user) - Auto-login user
│  ├─ Cache::forget("otp_{email}") - Clear OTP
│  └─ Return: {
│     ├─ success: true,
│     ├─ user: { ...user data... },
│     ├─ profile_completed: false,
│     └─ redirect: "complete-profile"
│     }
│
└─ Frontend receives profile_completed: false → Show Profile Modal

           ↓ Profile Completion Modal Appears


┌─────────────────────────────────────────────────────────────────────┐
│            STEP 3: PROFILE COMPLETION (MODAL)                       │
└─────────────────────────────────────────────────────────────────────┘

ProfileCompletionModal Display:
├─ Show: User's verified email
├─ Show: Gravatar profile picture
├─ Input: Phone number (required)
├─ Option: Skip for later
└─ Button: Complete Profile

User Action:
├─ Enter phone number (required)
└─ Click "Complete Profile"

           ↓ POST /api/profile/complete

Backend OTPController::completeProfile():
├─ Get authenticated user (from Auth::user())
├─ Update User:
│  ├─ phone: from request
│  └─ profile_completed: true ✅
│
├─ Create Role-Specific Profile:
│  ├─ If role == "student":
│  │  └─ Student::firstOrCreate({
│  │     ├─ user_id: user.id,
│  │     ├─ id: "STU_{user.id}",
│  │     └─ adviser_id: null
│  │     })
│  │
│  └─ If role == "teacher":
│     └─ Teacher::firstOrCreate({
│        ├─ user_id: user.id,
│        ├─ id: "TEA_{user.id}",
│        └─ department: null
│        })
│
└─ Return: {
   ├─ success: true,
   ├─ message: "Profile completed successfully!",
   ├─ user: { ...updated user... },
   └─ profile_completed: true ✅
   }

           ↓ Frontend receives profile_completed: true


┌─────────────────────────────────────────────────────────────────────┐
│                STEP 4: DASHBOARD REDIRECT                           │
└─────────────────────────────────────────────────────────────────────┘

useRegistrationFlow Hook Determines Route:
│
├─ if user.role.name === "student"
│  └─ Redirect to: /dashboard/student
│
├─ if user.role.name === "teacher"
│  └─ Redirect to: /dashboard/adviser
│
└─ else
   └─ Redirect to: /user

User Logged In & Profile Complete ✅
```

## Database State Transitions

```
BEFORE REGISTRATION:
└─ No record in database

AFTER OTP SENT:
└─ Cache entry created (temporary)
   └─ Data not yet in users table

AFTER OTP VERIFIED:
└─ users table:
   ├─ id: UUID
   ├─ email: verified_email
   ├─ name: first + last name
   ├─ password: hashed
   ├─ avatar_url: https://www.gravatar.com/avatar/... ✨
   ├─ profile_completed: FALSE ⚠️
   ├─ email_verified_at: TIMESTAMP
   └─ status: "active"

AFTER PROFILE COMPLETION:
└─ users table:
   ├─ (all above fields)
   ├─ phone: "+1234567890" (if entered)
   ├─ profile_completed: TRUE ✅
   
└─ student_csg_officers OR teacher_adviser table:
   └─ New record created with user_id reference
```

## API Response Flow

```
POST /api/otp/send
│
└─ 200 OK
   └─ { success: true, message: "OTP sent successfully" }
   
OR

└─ 422 Unprocessable Entity (validation error)
   └─ { success: false, errors: {...} }
   
OR

└─ 500 Server Error
   └─ { success: false, message: "error details" }


POST /api/otp/verify
│
└─ 200 OK
   ├─ { success: true, user: {...}, profile_completed: false }
   └─ Frontend → Show ProfileCompletionModal
   
OR

└─ 400 Bad Request (invalid/expired OTP)
   └─ { success: false, message: "Invalid OTP code" }
   
OR

└─ 500 Server Error
   └─ { success: false, message: "error details" }


POST /api/profile/complete
│
└─ 200 OK
   ├─ { success: true, user: {...}, profile_completed: true }
   └─ Frontend → Redirect to Dashboard
   
OR

└─ 422 Unprocessable Entity (validation error)
   └─ { success: false, errors: {...} }
   
OR

└─ 401 Unauthorized (not logged in)
   └─ { success: false, message: "Unauthorized" }
```

## Cache Management

```
Cache Key Format: "otp_{email_address}"

CACHE LIFECYCLE:

1. SendOTP: Cache CREATED
   └─ Cache::put("otp_test@example.com", {
      ├─ otp: "123456",
      ├─ firstName: "John",
      ├─ lastName: "Doe",
      ├─ password: "hashed_password",
      └─ role_id: "role-uuid"
      }, 10 minutes TTL)

2. VerifyOTP: OTP VALIDATED & Cache CLEARED
   └─ Cache::forget("otp_test@example.com")
   
3. After 10 minutes: Cache EXPIRED automatically
   └─ If OTP not verified within 10 min → Expired
   └─ User must request new OTP via ResendOTP

ResendOTP: Cache UPDATED (new OTP)
└─ Cache updated with new OTP code
└─ 10-minute TTL reset
```

## Gravatar Profile Picture Integration

```
User Email: john.doe@example.com

1. MD5 Hash Email (lowercase + trimmed):
   └─ md5("john.doe@example.com") = "ab1c2d3e4f5g6h7i8j9k0l1m2n3o4p5q"

2. Construct Gravatar URL:
   └─ https://www.gravatar.com/avatar/ab1c2d3e4f5g6h7i8j9k0l1m2n3o4p5q
      └─ Size: ?s=400
      └─ Default: ?d=identicon (if not found)

3. Full URL:
   └─ https://www.gravatar.com/avatar/ab1c2d3e4f5g6h7i8j9k0l1m2n3o4p5q?s=400&d=identicon

4. Store in Database:
   └─ users.avatar_url = URL
   └─ Loaded whenever user data retrieved

5. Display in Frontend:
   └─ <img src={user.avatar_url} alt={user.name} />
```

## Error Scenarios

```
SCENARIO 1: Invalid Email Format
POST /api/otp/send
Request: { email: "invalid-email", ... }
Response: 422 → { success: false, errors: { email: ["invalid"] } }

SCENARIO 2: Email Already Exists
POST /api/otp/send
Request: { email: "existing@example.com", ... }
Response: 422 → { success: false, errors: { email: ["unique"] } }

SCENARIO 3: OTP Expired (after 10 min)
POST /api/otp/verify
Request: { email: "test@example.com", otp: "123456" }
Response: 400 → { success: false, message: "OTP expired or invalid" }
Action: User clicks Resend → New OTP generated

SCENARIO 4: Wrong OTP Code
POST /api/otp/verify
Request: { email: "test@example.com", otp: "000000" }
Response: 400 → { success: false, message: "Invalid OTP code" }
Action: User can try again or request new OTP

SCENARIO 5: Missing Phone Number
POST /api/profile/complete
Request: { phone: "" }
Response: 422 → { success: false, errors: { phone: ["required"] } }
Action: User must fill phone field

SCENARIO 6: Not Authenticated
GET /api/profile/status (when not logged in)
Response: 401 → { success: false, message: "Unauthorized" }
```

## Frontend State Management

```
useRegistrationFlow Hook State:

currentUser:
├─ Initial: null
├─ After OTP Verify: { id, name, email, avatar_url, role, ... }
└─ After Profile Complete: { profile_completed: true, ... }

showProfileModal:
├─ Initial: false
├─ After OTP Verify: true (if profile_completed === false)
├─ After Profile Complete: false → Redirect
└─ On Skip: false → Redirect

Registration Component State:

showOTPPage:
├─ Initial: false
├─ After sendOTP: true → Show VerifyOTP
└─ On Back: false → Show Register Form

pendingEmail:
├─ Stores email during OTP verification
└─ Passed to VerifyOTP component
```

---

This diagram shows the complete flow from user registration through profile completion!
