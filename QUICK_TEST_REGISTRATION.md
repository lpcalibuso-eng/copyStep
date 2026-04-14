# 🚀 Quick Start - Test Registration Now

## What's Ready ✅

- ✅ OTP emails sending via Gmail SMTP
- ✅ Registration form working
- ✅ Supabase Auth users auto-created
- ✅ Dashboard accessible
- ✅ All errors fixed

---

## 1-Minute Test

### Step 1: Go to Registration
```
http://127.0.0.1:8000/register
```

### Step 2: Fill Form
```
First Name: Test
Last Name: User
Email: your-email@gmail.com  (real email!)
Password: TestPassword123
Confirm: TestPassword123
Role: Student
☑️ Check terms
```

### Step 3: Click "Create Account"
- Wait for "OTP sent" message
- Check your email for 6-digit code

### Step 4: Enter OTP Code
- Paste the code from email
- Wait for "Email verified" message
- You'll be redirected to profile completion

### Step 5: Complete Profile
- Add your details
- Click "Complete Profile"
- Done! You're in the dashboard

---

## Expected Outcomes

✅ Email arrives in 5-10 seconds
✅ OTP is 6-digit code (example: 044290)
✅ Code expires in 10 minutes
✅ Can enter code once
✅ Redirected to complete profile
✅ Profile completion works
✅ Dashboard loads

---

## Check Logs

If something doesn't work:

```bash
cd /home/jimz/Documents/Capstone/step22
tail -f storage/logs/laravel.log | grep -i "otp\|mail\|email"
```

Look for:
- ✅ "OTP Email sent successfully" = Email sent OK
- ❌ "Failed to send OTP email" = Email issue
- ✅ "OTP Email sent successfully to:" = Check recipient

---

## Verify Supabase User Created

After registration completes:

1. Go to https://app.supabase.com
2. Select your project
3. Authentication → Users
4. Look for your test email
5. Click on it to see metadata:
   - firstName: Test
   - lastName: User
   - full_name: Test User

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Email not arriving | Check spam folder, verify Gmail is working |
| "OTP expired" | Code expires in 10 minutes, request new one |
| "Invalid OTP" | Copy code exactly as shown in email |
| 500 error on dashboard | Check logs for notification model errors |
| "Email already exists" | Use a new email address for each test |

---

## Files to Know About

- **OTP Sending:** `app/Http/Controllers/Auth/OTPController.php` (sendOTP method)
- **OTP Email Template:** `resources/views/emails/otp.blade.php` (what user sees)
- **OTP Verification:** `app/Http/Controllers/Auth/OTPController.php` (verifyOTP method)
- **Supabase User Creation:** `app/Http/Controllers/Auth/OTPController.php` (createSupabaseAuthUser method)
- **Mail Config:** `.env` file (MAIL_* settings)

---

## All Set! 🎉

Registration flow is complete and tested. Everything should work end-to-end.

**Try it now:** http://127.0.0.1:8000/register
