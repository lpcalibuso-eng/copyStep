# 🚨 **URGENT FIX: "Email service not configured" Error**

## **Current Status**
- ✅ Service Role Key is now set in `.env`
- ✅ Supabase Edge Function exists
- ❌ **Resend API Key is NOT set in Supabase Secrets**
- ❌ This causes: **500 Error - "Email service not configured"**

---

## **Solution: Add Resend API Key to Supabase Secrets**

### **STEP 1: Get Resend API Key**

1. Go to: **https://resend.com**
2. Log in (or create account if needed)
3. Click **API Keys** (in left sidebar)
4. Copy your **API Key** (looks like: `re_...`)

### **STEP 2: Add Secret to Supabase**

1. Go to: **https://app.supabase.com**
2. Select your project
3. Click **Edge Functions** (left sidebar)
4. Click **Secrets** tab    
5. Click **New Secret**
6. Fill in:
   - **Name:** `RESEND_API_KEY`
   - **Value:** Paste your Resend API key (from Step 1)
7. Click **Save**

### **STEP 3: Verify Edge Function**

1. Go to **Edge Functions** section
2. Click **send-email** function
3. Make sure it's **Deployed** (green status)
4. The function code should have access to the secret

### **STEP 4: Test**

Go to: **http://127.0.0.1:8000/register**

Fill form and register. Check:
1. **Email inbox** - OTP should arrive ✅
2. **Logs** - Should see: `OTP Email sent successfully via Supabase`

---

## **Why This Error Happens**

```
User clicks Register
    ↓
Laravel generates OTP
    ↓
Laravel sends to Supabase Edge Function ✅
    ↓
Supabase receives request ✅
    ↓
Supabase tries to load RESEND_API_KEY from secrets ❌ NOT FOUND!
    ↓
Function returns: 500 "Email service not configured"
    ↓
Email NOT sent ❌
```

---

## **Checklist**

- [ ] Do you have a Resend account? (https://resend.com)
- [ ] Did you copy your Resend API key?
- [ ] Is the key set as `RESEND_API_KEY` in Supabase Secrets?
- [ ] Is it under **Edge Functions > Secrets** (NOT in .env)?
- [ ] Is the `send-email` function deployed?
- [ ] Did you restart Laravel after changes?

---

## **Expected Flow After Fix**

```
Register Form
    ↓
✅ OTP Generated: 123456
    ↓
✅ Sent to Supabase Edge Function
    ↓
✅ Supabase loads RESEND_API_KEY from Secrets
    ✅ Function calls Resend API
    ✓
✅ Resend sends email
    ↓
✅ You receive OTP in inbox! 📧
```

---

## **If Still Not Working**

Check in Supabase:
1. **Edge Functions > send-email > Logs** - Check function execution logs
2. **Edge Functions > Secrets** - Verify RESEND_API_KEY is there
3. **Edge Functions > send-email > Deploy Status** - Should be "Deployed"

---

## **Quick Reference**

| Item | Where |
|------|-------|
| Resend API Key | https://resend.com > API Keys |
| Supabase Secrets | https://app.supabase.com > Edge Functions > Secrets |
| Service Role Key | Supabase > Settings > API > Service Role |
| Edge Function | Supabase > Edge Functions > send-email |

---

**Bottom Line:**
The Resend API key must be in **Supabase Secrets**, not in Laravel .env file!
