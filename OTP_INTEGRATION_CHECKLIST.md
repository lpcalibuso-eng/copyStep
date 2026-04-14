# OTP Registration System - Integration Checklist

## Pre-Implementation

- [ ] Review all documentation files
- [ ] Backup current database
- [ ] Ensure Laravel version is 11+
- [ ] Check all dependencies installed
- [ ] Clear Laravel cache: `php artisan cache:clear`

## Database Setup

- [ ] Run migration: `php artisan migrate`
- [ ] Verify columns added to users table:
  ```sql
  SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_NAME = 'users' AND COLUMN_NAME IN ('avatar_url', 'profile_completed');
  ```
- [ ] Ensure roles table has entries for 'student' and 'teacher'

## Backend Verification

- [ ] Check OTPController.php syntax: `php -l app/Http/Controllers/Auth/OTPController.php`
- [ ] Verify routes registered: `php artisan route:list | grep otp`
- [ ] Clear route cache: `php artisan route:clear`
- [ ] Check User model fillable attributes updated
- [ ] Verify import statements in OTPController

## Frontend Setup

- [ ] Components created:
  - [ ] ProfileCompletionModal.jsx
  - [ ] useRegistrationFlow.js hook
- [ ] Register.jsx updated with `/api/otp/send`
- [ ] VerifyOTP.jsx updated with `/api/otp/verify` and `/api/otp/resend`
- [ ] Clear browser cache
- [ ] Rebuild frontend assets if needed: `npm run build`

## API Testing

### Test OTP Send
```bash
curl -X POST http://localhost:8000/api/otp/send \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "password": "Password123",
    "role_id": "059f4170-235d-11f1-9647-10683825ce81"
  }'
```
- [ ] Returns 200 OK
- [ ] Response has `success: true`
- [ ] Check OTP in logs: `tail -f storage/logs/laravel.log | grep "OTP Email"`

### Test OTP Verify
```bash
# Get OTP from logs first
curl -X POST http://localhost:8000/api/otp/verify \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "otp": "123456"
  }'
```
- [ ] Returns 200 OK
- [ ] Response includes user data
- [ ] Response includes `profile_completed: false`
- [ ] Verify user created in database

### Test OTP Resend
```bash
curl -X POST http://localhost:8000/api/otp/resend \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
```
- [ ] Returns 200 OK
- [ ] Response has `success: true`
- [ ] New OTP generated in logs

### Test Profile Completion (Authenticated)
```bash
# After OTP verification, user is logged in
curl -X POST http://localhost:8000/api/profile/complete \
  -H "Content-Type: application/json" \
  -d '{"phone": "+1234567890"}' \
  -b "LARAVEL_SESSION=..." # Cookie from OTP verify
```
- [ ] Returns 200 OK
- [ ] Response includes `profile_completed: true`
- [ ] Phone number updated in database
- [ ] Student/Teacher profile created if applicable

## Database Verification

### Check Users Table
```sql
SELECT id, name, email, avatar_url, profile_completed, email_verified_at 
FROM users 
WHERE email = 'test@example.com';
```
- [ ] avatar_url contains Gravatar URL
- [ ] profile_completed is TRUE after profile completion
- [ ] email_verified_at is set after OTP verification

### Check Role-Specific Profiles
```sql
-- For students
SELECT * FROM student_csg_officers WHERE user_id = 'user-uuid';

-- For teachers
SELECT * FROM teacher_adviser WHERE user_id = 'user-uuid';
```
- [ ] Record exists for created user
- [ ] user_id foreign key relationship is correct

## Frontend Testing (Browser)

### Registration Page
- [ ] Go to `/register`
- [ ] Fill registration form:
  - [ ] First Name
  - [ ] Last Name
  - [ ] Valid email
  - [ ] Password (8+ chars)
  - [ ] Confirm password match
  - [ ] Select role (Student or Professor)
  - [ ] Check terms agreement
- [ ] Click Register

### OTP Verification Page
- [ ] Transitions to OTP verification page
- [ ] Shows email address
- [ ] Copy OTP from logs: `tail -f storage/logs/laravel.log | grep "OTP Email"`
- [ ] Enter 6-digit OTP
- [ ] Click Verify

### Profile Completion Modal
- [ ] Modal appears automatically
- [ ] Shows email address
- [ ] Shows Gravatar profile picture
- [ ] Profile picture loads correctly from Gravatar
- [ ] Phone number field visible (required)
- [ ] Skip button visible
- [ ] Enter phone number

### Profile Completion Submit
- [ ] Click "Complete Profile"
- [ ] Modal closes
- [ ] Redirects to appropriate dashboard:
  - [ ] Student → `/dashboard/student`
  - [ ] Teacher → `/dashboard/adviser`
- [ ] User name shows in header (logged in)

### Skip Profile Completion
- [ ] Modal appears
- [ ] Click "Skip for Now"
- [ ] Still redirects to dashboard
- [ ] Can complete profile later

## Cache Verification

### Check Cache Configuration
- [ ] `.env` has `CACHE_DRIVER` set (file, redis, memcached, etc.)
- [ ] Cache driver is working: `php artisan cache:clear`

### Cache Entry Testing
```bash
php artisan tinker
> Cache::get("otp_test@example.com")
# Should show array with otp, firstName, lastName, password, role_id
```
- [ ] Cache entry created after sendOTP
- [ ] Cache cleared after verifyOTP
- [ ] New cache entry created after resendOTP

## Email Configuration (Optional)

If implementing actual email sending:

- [ ] Update `.env`:
  ```
  MAIL_DRIVER=smtp
  MAIL_HOST=smtp.gmail.com
  MAIL_PORT=587
  MAIL_USERNAME=your-email@gmail.com
  MAIL_PASSWORD=your-app-password
  MAIL_ENCRYPTION=tls
  MAIL_FROM_ADDRESS=noreply@stepplatform.com
  ```

- [ ] Update `sendOTPEmail()` in OTPController to use Mail::raw()
- [ ] Test email sending:
  ```bash
  php artisan tinker
  > Mail::raw('Test', function($m) { $m->to('test@example.com')->subject('Test'); });
  ```
- [ ] [ ] Check spam folder for test email

## Error Handling Tests

### Test Invalid Email
```json
POST /api/otp/send
{
  "email": "invalid-email",
  "firstName": "John",
  "lastName": "Doe",
  "password": "Password123",
  "role_id": "role-uuid"
}
```
- [ ] Returns 422 validation error
- [ ] Error message indicates invalid email

### Test Duplicate Email
```bash
# Send OTP once, then try again with same email
```
- [ ] Returns 422 validation error
- [ ] Error indicates email already registered

### Test Expired OTP
- [ ] Wait 11 minutes after sendOTP
- [ ] Try to verifyOTP
- [ ] Returns 400 "OTP expired or invalid"

### Test Wrong OTP
- [ ] Send OTP
- [ ] Enter wrong 6-digit code
- [ ] Returns 400 "Invalid OTP code"
- [ ] User can try again without requesting new OTP

### Test Missing Required Fields
- [ ] Send OTP without firstName
- [ ] Returns 422 with field errors

## Security Verification

- [ ] CSRF tokens checked: `grep -n "X-CSRF-TOKEN" resources/js/Components/ProfileCompletionModal.jsx`
- [ ] Passwords hashed: `php artisan tinker` → `User::first()->password` shows hash, not plain text
- [ ] OTP not visible in frontend network requests
- [ ] OTP only in logs, never in database
- [ ] Email verified before account creation
- [ ] User auto-logged in only after OTP verification

## Performance Testing

### Response Times
- [ ] sendOTP: < 500ms
- [ ] verifyOTP: < 500ms (user creation)
- [ ] completeProfile: < 500ms
- [ ] Gravatar image load: < 2s

### Load Testing (Optional)
```bash
# Install ab or use Apache Bench
ab -n 100 -c 10 http://localhost:8000/api/profile/status
```
- [ ] No errors under load
- [ ] Response times acceptable

## Documentation Verification

- [ ] OTP_REGISTRATION_DOCUMENTATION.md is accurate
- [ ] OTP_SETUP_GUIDE.md tested and working
- [ ] OTP_FLOW_DIAGRAM.md reflects actual implementation
- [ ] OTP_REGISTRATION_SUMMARY.md is complete
- [ ] Code comments are clear and helpful

## Production Deployment

- [ ] All tests passed
- [ ] Code review completed
- [ ] Database backup created
- [ ] Migration tested on staging
- [ ] Email service configured (if applicable)
- [ ] Monitoring/logging configured
- [ ] Error notifications setup
- [ ] Documentation deployed
- [ ] Team trained on new system
- [ ] Deploy to production
- [ ] Monitor logs for errors
- [ ] Test registration in production

## Post-Deployment

- [ ] Monitor new user registrations
- [ ] Check error logs for issues
- [ ] Monitor email queue (if applicable)
- [ ] Track profile completion rate
- [ ] Get user feedback
- [ ] Fix any bugs discovered
- [ ] Document any issues/resolutions

## Rollback Plan (If Needed)

If issues found post-deployment:

```bash
# Rollback migration
php artisan migrate:rollback --step=1

# Revert code changes
git revert <commit-hash>

# Clear cache
php artisan cache:clear

# Notify users
# (Manual notification required)
```

- [ ] Rollback steps documented
- [ ] Backup database available
- [ ] Previous version code available
- [ ] Communication plan prepared

## Success Criteria

All of the following should be true:

- [ ] Users can register with email
- [ ] OTP received via email/logs
- [ ] Email verified with OTP
- [ ] User account created in database
- [ ] Profile completion modal shows
- [ ] Gravatar picture displays
- [ ] Profile completion works
- [ ] User redirected to correct dashboard
- [ ] All error cases handled gracefully
- [ ] No console errors in browser
- [ ] No errors in Laravel logs
- [ ] Documentation is complete
- [ ] Team understands the system

## Sign-Off

When all items checked, system is ready for production:

- **Tested By:** _________________
- **Date:** _________________
- **Status:** ☐ Ready for Production

---

**Notes:**
- Use this checklist for each implementation
- Modify as needed for your environment
- Keep records for compliance/audit
- Update checklist with team feedback

**Last Updated:** April 12, 2026
