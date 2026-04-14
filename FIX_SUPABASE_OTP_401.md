# 🔧 **Supabase OTP Fix - 401 Error**

## **Problem**
Getting `401 - Invalid Token or Protected Header formatting` when trying to send OTP.

## **Root Cause**
Using the **anon key** instead of **service role key** for backend requests.
- ❌ Anon key = Frontend/public access only
- ✅ Service role key = Backend server access

## **Solution**

### **Step 1: Get Service Role Key**

1. Go to: **https://app.supabase.com**
2. Select your project
3. Click **Settings** (gear icon, bottom left)
4. Click **API** in the left sidebar
5. Under **Your API keys**, copy the **Service Role Key** (long JWT token)

### **Step 2: Update .env File**

Add this line to your `.env` file:

```
SUPABASE_SERVICE_ROLE_KEY=<YOUR_SERVICE_ROLE_KEY_HERE>
```

Replace `<YOUR_SERVICE_ROLE_KEY_HERE>` with the key you copied.

**Example:**
```
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3M...
```

### **Step 3: Test**

1. Go to **http://127.0.0.1:8000/register**
2. Fill in form and click **Register**
3. Check your email for OTP code

### **How It Works Now**

```
User clicks Register
    ↓
Laravel generates OTP (6 digits)
    ↓
Laravel uses Service Role Key to authenticate with Supabase
    ↓
Supabase Edge Function receives request
    ↓
Function calls Resend API to send email
    ↓
Email arrives in user's inbox ✅
    ↓
User enters OTP to verify email
    ↓
Account created!
```

## **If Still Not Working**

Check logs:
```bash
tail -f storage/logs/laravel.log | grep -i "otp\|supabase"
```

Look for the response status:
- **200** = Success ✅
- **401** = Wrong key
- **404** = Function doesn't exist
- **500** = Resend API error (check Resend API key in Supabase)

## **Key Differences**

| Key | Purpose | Backend? | Frontend? |
|-----|---------|----------|-----------|
| Anon Key | Public frontend access | ❌ No | ✅ Yes |
| Service Key | Secure backend access | ✅ Yes | ❌ No |

**Always use Service Role Key on your backend!**

---

## **Checklist**

- [ ] Have you added `SUPABASE_SERVICE_ROLE_KEY` to `.env`?
- [ ] Did you use the **Service Role Key** (not anon key)?
- [ ] Is the key pasted correctly with no extra spaces?
- [ ] Have you restarted Laravel dev server after changing `.env`?
- [ ] Is Supabase Edge Function `send-email` deployed?
- [ ] Is Resend API key set in Supabase secrets?

---

Still having issues? Check:
1. **Supabase Project Settings** → **API** → Copy Service Role Key
2. **Laravel .env** → Add `SUPABASE_SERVICE_ROLE_KEY`
3. **Supabase Edge Functions** → `send-email` → Deploy status
4. **Supabase Secrets** → `RESEND_API_KEY` → Set correctly

