# ⚠️ **ISSUE: Supabase Edge Function Can't Access RESEND_API_KEY**

## **Current Problem**

Even after adding RESEND_API_KEY to Supabase Secrets and redeploying the Edge Function, it still returns:
```
500 "Email service not configured"
```

This means the function **cannot read the RESEND_API_KEY secret**.

---

## **Possible Causes:**

1. **Secret name mismatch** - Function expects `RESEND_API_KEY` but secret is named differently
2. **Secret not accessible** - Permissions issue in Supabase
3. **Function syntax issue** - Way function accesses the secret is wrong
4. **Supabase cache** - Edge Functions have a cache, might need more time

---

## **Quick Solutions to Try:**

### **Option 1: Wait & Retry**
Sometimes Supabase takes time to sync secrets:
1. Wait 5 minutes
2. Try registration again
3. Check logs

### **Option 2: Check Secret Name in Dashboard**
1. Go to Supabase > Edge Functions > Secrets
2. Verify the secret is named EXACTLY: `RESEND_API_KEY`
3. Check it says "Active"

### **Option 3: Use Fallback Email System**

Instead of Supabase Edge Function, use Laravel's built-in mail system:

Update `OTPController.php` to use Laravel Mailer instead:

```php
// Fallback email using Laravel Mail
try {
    Mail::to($email)->send(new OTPMail($firstName, $otp));
    Log::info("OTP sent via Laravel Mail to: $email");
} catch (\Exception $e) {
    Log::error("Laravel Mail failed: " . $e->getMessage());
}
```

---

## **Recommended: Simple Fix**

**Delete the Supabase Edge Function approach and use Laravel Mail directly:**

1. Get your Gmail/email credentials
2. Add to `.env`:
   ```
   MAIL_MAILER=smtp
   MAIL_HOST=smtp.gmail.com
   MAIL_PORT=587
   MAIL_USERNAME=your-email@gmail.com
   MAIL_PASSWORD=your-app-password
   MAIL_FROM_ADDRESS=your-email@gmail.com
   MAIL_FROM_NAME=STEP Platform
   ```
3. Create a Mailable class for OTP emails
4. Send directly from Laravel

This bypasses the Supabase complexity entirely!

---

## **What You Should Do:**

Choose one path:

**Path A: Fix Supabase** (complex)
- Debug why secrets aren't accessible
- Check function syntax
- Verify Resend API key is correct

**Path B: Use Laravel Mail** (simple & reliable)
- Use built-in Laravel email system
- Direct connection to Gmail/email provider
- No Supabase dependency

---

**I recommend Path B** - it's faster, more reliable, and doesn't depend on Supabase's Edge Functions.

Would you like me to implement the Laravel Mail solution?
