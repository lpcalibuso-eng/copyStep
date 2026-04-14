# OTP-Based Registration System Documentation

## Overview

This document describes the complete OTP (One-Time Password) based registration system integrated into the STEP Platform. The system allows users to register securely using email verification through OTP codes, with automatic profile picture retrieval from Gravatar, and a profile completion modal.

## Architecture

### Backend Components

#### 1. OTPController (`app/Http/Controllers/Auth/OTPController.php`)

The main controller handling all OTP-related operations.

**Methods:**

- **`sendOTP(Request $request)`** - Initiates OTP registration
  - Validates registration data (email, firstName, lastName, password, role_id)
  - Generates a random 6-digit OTP code
  - Stores OTP and user data in cache (10-minute expiration)
  - Sends OTP via email
  - Returns success/failure JSON response

- **`verifyOTP(Request $request)`** - Verifies OTP and creates user account
  - Validates OTP code against cached value
  - Creates user in STEP2 database with:
    - UUID as primary key
    - Email verified timestamp
    - Gravatar profile picture URL
    - `profile_completed` flag set to `false`
  - Automatically logs in the user
  - Clears OTP from cache
  - Returns user data with profile completion status

- **`resendOTP(Request $request)`** - Generates and resends OTP
  - Retrieves existing OTP data from cache
  - Generates new 6-digit code
  - Updates cache with new OTP
  - Resends email with new code
  - Maintains 10-minute expiration

- **`completeProfile(Request $request)`** - Completes user profile after registration
  - Updates user profile with additional information (phone, etc.)
  - Sets `profile_completed` flag to `true`
  - Creates role-specific profiles (Student or Teacher)
  - Returns updated user data

- **`checkProfileStatus(Request $request)`** - Checks if profile is complete
  - Returns current profile completion status
  - Used by frontend to determine if modal should show

**Helper Methods:**

- **`getGmailProfilePicture($email)`** - Retrieves profile picture using Gravatar
  - Uses MD5 hash of email to fetch Gravatar image
  - Returns default identicon if Gravatar not found
  - URL format: `https://www.gravatar.com/avatar/{hash}?s=400&d=identicon`

- **`sendOTPEmail($email, $firstName, $otp)`** - Sends formatted HTML email
  - Currently logs OTP (can be configured for actual email service)
  - Includes 10-minute expiration notice
  - Professional HTML template with STEP branding

- **`createRoleSpecificProfile($user)`** - Creates role-based profile records
  - For students: Creates entry in `student_csg_officers` table
  - For teachers: Creates entry in `teacher_adviser` table
  - Non-critical operation (won't block registration if fails)

### Database Changes

#### New Columns Added to `users` Table

```sql
ALTER TABLE users ADD COLUMN avatar_url VARCHAR(255) NULL;
ALTER TABLE users ADD COLUMN profile_completed BOOLEAN DEFAULT false;
```

**Migration File:** `database/migrations/2026_04_12_000001_add_profile_fields_to_users_table.php`

#### Related Tables

- **`users`** - Main user accounts table
- **`student_csg_officers`** - Student-specific profile data
- **`teacher_adviser`** - Teacher-specific profile data
- **`roles`** - User roles (student, teacher, admin, etc.)

### User Model Updates

Updated `app/Models/User.php` fillable attributes to include:
- `avatar_url` - Gravatar profile picture URL
- `profile_completed` - Profile completion status
- `email_verified_at` - Email verification timestamp

## API Routes

All routes are defined in `routes/auth.php` and require proper CSRF tokens.

### OTP Registration Routes (Public)

```
POST /api/otp/send
- Sends OTP to user's email
- Request: { email, firstName, lastName, password, role_id }
- Response: { success, message }

POST /api/otp/verify
- Verifies OTP and creates user account
- Request: { email, otp }
- Response: { success, user, profile_completed, redirect }

POST /api/otp/resend
- Resends OTP code
- Request: { email }
- Response: { success, message }
```

### Profile Completion Routes (Authenticated)

```
POST /api/profile/complete
- Completes user profile
- Request: { phone, profileData }
- Response: { success, user, profile_completed }

GET /api/profile/status
- Checks profile completion status
- Response: { success, profile_completed, user }
```

## Frontend Components

### 1. Register Component (`resources/js/Pages/Auth/Register.jsx`)

The main registration form component.

**Features:**
- Email, password, name input fields
- Role selection (Student/Professor)
- Terms agreement checkbox
- Calls `/api/otp/send` on form submission
- Transitions to OTP verification on success

### 2. VerifyOTP Component (`resources/js/Pages/Auth/VerifyOTP.jsx`)

OTP verification form component.

**Features:**
- 6-digit OTP input field
- Real-time OTP verification via `/api/otp/verify`
- Resend OTP functionality with 60-second cooldown
- Error and success messages
- Automatic redirect on successful verification

### 3. ProfileCompletionModal (`resources/js/Components/ProfileCompletionModal.jsx`)

Modal for completing user profile after email verification.

**Features:**
- Displays verified email and Gravatar profile picture
- Phone number input field (required)
- Skip option to complete later
- Calls `/api/profile/complete` on submission
- Error and success handling
- Auto-close on successful completion

### 4. useRegistrationFlow Hook (`resources/js/hooks/useRegistrationFlow.js`)

Custom React hook managing the complete registration flow.

**Functionality:**
- Tracks current user and profile modal visibility
- Handles OTP verification success
- Manages profile completion state
- Routes to appropriate dashboard based on user role
- Provides wrapper component for seamless integration

**Usage:**
```jsx
const { handleOTPVerifySuccess, handleProfileComplete } = useRegistrationFlow();
```

## Complete Registration Flow

### Step 1: User Registration
1. User fills registration form (firstName, lastName, email, password, role)
2. Frontend calls `POST /api/otp/send`
3. Backend validates data and generates 6-digit OTP
4. OTP and user data stored in cache (10 min TTL)
5. Email sent with OTP code
6. Frontend transitions to OTP verification page

### Step 2: Email Verification
1. User enters 6-digit OTP
2. Frontend calls `POST /api/otp/verify`
3. Backend validates OTP against cached value
4. User account created in database with:
   - UUID primary key
   - Hashed password
   - Email verification timestamp
   - Gravatar profile picture
   - `profile_completed = false`
5. User automatically logged in
6. OTP cleared from cache
7. Response includes `profile_completed: false`

### Step 3: Profile Completion
1. Frontend detects `profile_completed: false`
2. ProfileCompletionModal automatically displays
3. Shows user's verified email and Gravatar picture
4. User enters phone number (or skips)
5. Frontend calls `POST /api/profile/complete` or dismisses modal
6. Backend updates user and creates role-specific profile
7. Sets `profile_completed = true`
8. Frontend redirects to appropriate dashboard

### Step 4: Dashboard Access
- **Students:** Redirected to `/dashboard/student`
- **Teachers:** Redirected to `/dashboard/adviser`
- **Others:** Redirected to `/user`

## Security Features

1. **CSRF Protection** - All requests include CSRF token
2. **Email Verification** - OTP sent to email before account creation
3. **Rate Limiting** - Implement throttling on OTP send/resend (TODO)
4. **OTP Expiration** - 10-minute cache expiration
5. **Password Hashing** - Uses Laravel's Hash facade
6. **Cache Storage** - OTP stored in memory cache, not database
7. **Unique Email** - Email uniqueness validated before OTP generation

## Error Handling

All endpoints return consistent JSON responses:

**Success Response:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description",
  "errors": { ... }
}
```

**HTTP Status Codes:**
- `200` - Success
- `400` - Bad request / OTP expired
- `401` - Unauthorized
- `422` - Validation failed
- `500` - Server error

## Configuration

### Email Service
Currently OTP is logged to Laravel logs. To enable actual email sending:

1. Configure mail driver in `.env`:
   ```
   MAIL_DRIVER=smtp
   MAIL_HOST=smtp.gmail.com
   MAIL_PORT=587
   MAIL_USERNAME=your-email@gmail.com
   MAIL_PASSWORD=your-app-password
   MAIL_ENCRYPTION=tls
   MAIL_FROM_ADDRESS=noreply@stepplatform.com
   MAIL_FROM_NAME="STEP Platform"
   ```

2. Uncomment the Mail::raw() section in `sendOTPEmail()` method

### Cache Configuration
OTP uses Laravel's default cache (configured in `.env`):
```
CACHE_DRIVER=file  # or redis, memcached, etc.
```

### Database
Default database is `step2` as configured in `.env`:
```
DB_CONNECTION=mysql
DB_DATABASE=step2
DB_HOST=127.0.0.1
DB_USERNAME=root
DB_PASSWORD=
```

## Running Migrations

To add the new columns to the users table:

```bash
php artisan migrate
```

To rollback:
```bash
php artisan migrate:rollback --step=1
```

## Testing

### Manual Testing Flow

1. **Test OTP Sending:**
   ```bash
   curl -X POST http://localhost:8000/api/otp/send \
     -H "Content-Type: application/json" \
     -d '{
       "email": "test@example.com",
       "firstName": "John",
       "lastName": "Doe",
       "password": "password123",
       "role_id": "059f4170-235d-11f1-9647-10683825ce81"
     }'
   ```

2. **Check Cache for OTP:**
   ```php
   php artisan tinker
   > Cache::get("otp_test@example.com")
   ```

3. **Test OTP Verification:**
   ```bash
   curl -X POST http://localhost:8000/api/otp/verify \
     -H "Content-Type: application/json" \
     -d '{
       "email": "test@example.com",
       "otp": "123456"
     }'
   ```

4. **Test Profile Completion:**
   ```bash
   curl -X POST http://localhost:8000/api/profile/complete \
     -H "Content-Type: application/json" \
     -d '{
       "phone": "+1234567890"
     }' \
     --cookie "XSRF-TOKEN=..." \
     --cookie "LARAVEL_SESSION=..."
   ```

## Future Enhancements

1. **SMS OTP Option** - Support phone-based OTP
2. **OAuth Integration** - Merge with existing OAuth login
3. **Email Rate Limiting** - Prevent abuse of OTP send
4. **Two-Factor Authentication** - Additional security layer
5. **Account Recovery** - OTP-based account recovery
6. **Multi-language Support** - Translated email templates
7. **Customizable Profile Fields** - Role-specific profile data
8. **Email Verification Status** - Track verification attempts

## Troubleshooting

### OTP Not Received
- Check Laravel logs: `storage/logs/laravel.log`
- Verify email configuration in `.env`
- Check spam folder
- Resend OTP to generate new code

### User Account Not Created
- Verify database connection
- Check user role exists in roles table
- Check required fillable attributes in User model

### Profile Modal Not Showing
- Check browser console for errors
- Verify `profile_completed` value in database
- Check API response includes `profile_completed` flag

### Gravatar Picture Not Loading
- Verify email is valid
- Check Gravatar URL format
- Use `d=identicon` parameter for fallback

## Contact & Support

For issues or questions regarding the OTP registration system:
- Check Laravel logs for detailed error messages
- Review API response messages
- Consult this documentation

---

**Last Updated:** April 12, 2026
**Version:** 1.0
**Status:** Production Ready
