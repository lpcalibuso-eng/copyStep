# 🔑 **Get Your REAL Supabase Service Role Key**

## **Current Problem**
The Service Role Key in `.env` is a placeholder/dummy key. Supabase rejects it with **"Invalid JWT"** error.

## **Solution: Get Real Key from Supabase**

### **Step 1: Go to Supabase Dashboard**
1. Open: **https://app.supabase.com**
2. Log in with your account
3. Click on your project: **step22** (or whatever your project name is)

### **Step 2: Find Your API Keys**
1. In the left sidebar, scroll down and click **Settings** (gear icon)
2. Click **API** in the left menu
3. You'll see a section that says **"Your API keys"**

### **Step 3: Copy Service Role Key**
- Look for the key labeled **"Service Role"** (NOT "Anon Key")
- It's a long JWT token that starts with something like: `eyJhbGciOiJIUzI1NiI...`
- Click the **copy icon** next to it
- The key should be around 200+ characters

### **Step 4: Replace in .env**

Open `/home/jimz/Documents/Capstone/step22/.env`

Find this line:
```
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmaWR1eWxkYmFsZ2Nqb2pvdmhxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxMDUyNjc1MCwiZXhwIjoxNzQyMDYyNzUwfQ.dP2_xMZ2Zy0LhMxW8K0qkWc5L5t2Q9R4N6M3P8V0W1s
```

Replace it with your REAL Service Role Key:
```
SUPABASE_SERVICE_ROLE_KEY=<PASTE_YOUR_REAL_KEY_HERE>
```

**Example** (this is what it looks like, but get your OWN):
```
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZjEyMzQ1Njc4OTAiLCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjU2MTU0MDAwLCJleHAiOjE2ODc2OTAwMDB9.QWxwaXNjaGVzLUhOX3dTbm1fVnJDYW5fdGhpcw...
```

### **Step 5: Save & Test**

1. **Save** the `.env` file
2. **Restart** your Laravel dev server:
   ```bash
   # Stop current server (Ctrl+C)
   # Then restart:
   php artisan serve
   ```
3. Test registration again at: **http://127.0.0.1:8000/register**

---

## **How to Know You Got the Right Key**

✅ **Correct Service Role Key:**
- Starts with: `eyJ...` (JWT format)
- Is 200+ characters long
- Located in Supabase **Settings > API** section
- Labeled as **"Service Role"** (NOT "Anon Key")

❌ **Wrong Keys (don't use these):**
- Anon key (starts with `sb_publishable_`)
- API Key (labeled as "Anonymous")
- Personal tokens

---

## **Where to Find It in Supabase**

```
Supabase Dashboard
    ↓
Settings (⚙️ icon, bottom left)
    ↓
API (left sidebar)
    ↓
"Your API keys" section
    ↓
"Service Role" key ← COPY THIS ONE
```

---

## **Checklist**

- [ ] Opened Supabase Dashboard
- [ ] Navigated to Settings > API
- [ ] Found "Service Role" key (NOT anon key)
- [ ] Copied the full key (should be long JWT)
- [ ] Replaced placeholder in `.env`
- [ ] Saved `.env` file
- [ ] Restarted Laravel dev server
- [ ] Tested registration again

---

**After you do this:**
1. OTP will be generated
2. Sent to Supabase Edge Function
3. Supabase will call Resend API
4. Email will arrive in your inbox ✅

If still not working, check logs:
```bash
tail -f storage/logs/laravel.log | grep "OTP\|Supabase"
```

Should see: `OTP Email sent successfully via Supabase` ✅
