# ✅ **Fix OTP Email - Action Plan**

## **Current Status**
- ✅ Service Role Key is set (219 characters)
- ❌ But Supabase rejects it as "Invalid JWT"
- ❌ OTP is generated but NOT sent
- ❌ OTP is logged as fallback (visible in logs)

## **Root Cause**
The Service Role Key in your `.env` is **STILL NOT THE REAL ONE** from your Supabase project.

---

## **How to Get the REAL Key (5 Minutes)**

### **Step 1: Open Supabase Dashboard**
Go to: **https://app.supabase.com**

### **Step 2: Select Your Project**
Look for your project. You have one project:
- **Supabase URL:** https://cfiduyldbalgcjojovhq.supabase.co
- This means your project ID is: **cfiduyldbalgcjojovhq**

Click on your project to open it.

### **Step 3: Find Settings**
- Bottom left sidebar, find **Settings** (gear icon ⚙️)
- Click it

### **Step 4: Find API Section**
- Left sidebar should show: **Configuration**
- Under that, click **API**

### **Step 5: Copy Service Role Key**
You should see a section like this:

```
Your API keys

Anon Key: sb_publishable_1XvhHdzFMDSsnDi6pPjhyQ_tjhaXcQt

Service Role: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSI...
```

- Find the **Service Role** key
- Click the copy button (📋 icon) next to it
- This should be a LONG JWT token (200+ characters)

### **Step 6: Update .env**
1. Open: `/home/jimz/Documents/Capstone/step22/.env`
2. Find this line:
   ```
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmaWR1eWxkYmFsZ2Nqb2pvdmhxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxMDUyNjc1MCwiZXhwIjoxNzQyMDYyNzUwfQ.dP2_xMZ2Zy0LhMxW8K0qkWc5L5t2Q9R4N6M3P8V0W1s
   ```

3. **Delete everything after the `=` sign**
4. **Paste your real key** that you copied from Supabase
5. **Save the file**

### **Step 7: Restart Laravel**
In your terminal:
```bash
# Stop current server (Ctrl+C)
# Wait 2 seconds
# Then:
php artisan serve
```

### **Step 8: Test**
Go to: **http://127.0.0.1:8000/register**
1. Fill the form
2. Click **Register**
3. **Check your email** (wait 5 seconds)

---

## **Where to Find Each Component**

| Component | Where | What It Is |
|-----------|-------|-----------|
| Service Role Key | Supabase > Settings > API | Long JWT token |
| Resend API Key | Supabase > Edge Functions > Secrets | Should be set |
| Edge Function | Supabase > Edge Functions > send-email | Should be deployed |

---

## **Debug: Check What You Currently Have**

Run this in terminal:
```bash
cd /home/jimz/Documents/Capstone/step22
grep "SUPABASE_SERVICE_ROLE_KEY=" .env
```

Output should look like:
```
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3M...
```

---

## **If You're Confused About Which Key**

| Key | Starts With | Used For | Example |
|-----|-------------|----------|---------|
| Anon Key | `sb_publishable_` | Frontend/public | ❌ NOT this |
| Service Role | `eyJ...` (JWT) | Backend server | ✅ **USE THIS** |

---

## **Important Note**

⚠️ **Do NOT share your Service Role Key with anyone!**
- It's like a password for your database
- Keep it secret
- If leaked, regenerate it in Supabase Settings > API

---

## **Quick Test After Update**

After updating `.env` and restarting Laravel, check logs:
```bash
tail -f storage/logs/laravel.log | grep "OTP Email sent successfully"
```

If you see this, it works! ✅

---

**Still need help?** Check:
1. Is the key from **Service Role** section? (not Anon Key)
2. Is it a JWT starting with `eyJ...`?
3. Did you restart Laravel after changing `.env`?
4. Is Resend API key set in Supabase Secrets?
5. Is Edge Function deployed?
