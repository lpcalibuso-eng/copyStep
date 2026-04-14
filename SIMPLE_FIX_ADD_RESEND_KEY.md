# ⚡ **SIMPLE FIX: Add Resend API Key to Supabase (2 Minutes)**

## **Current Problem**
Logs show: **500 "Email service not configured"**
= Resend API Key is missing from Supabase

## **SOLUTION - Do This NOW:**

### **Step 1: Get Your Resend API Key**

1. Open: https://resend.com
2. Log in
3. In left sidebar, click **API Keys**
4. Copy the key (starts with `re_`)
5. Keep it in your clipboard

### **Step 2: Add It to Supabase**

1. Open: https://app.supabase.com
2. Click on your project
3. In left sidebar, scroll down and find **Edge Functions**
4. Click on **Edge Functions**
5. Look for **Secrets** tab at the top (next to Overview, Functions, etc.)
6. Click **Secrets**
7. Click **New Secret** button
8. In the form:
   - **Name field:** Type: `RESEND_API_KEY`
   - **Value field:** Paste your Resend key from Step 1
9. Click **Save**

### **Step 3: Verify It's There**

1. Still in **Edge Functions > Secrets**
2. You should see `RESEND_API_KEY` in the list
3. Status should show "Active"

### **Step 4: Test**

1. Open: http://127.0.0.1:8000/register
2. Fill out the form
3. Click **Register**
4. **Check your email inbox** (wait 10 seconds)
5. **You should receive the OTP code!** ✅

---

## **Visual Guide**

```
Supabase Dashboard
    ↓
Left sidebar > Edge Functions
    ↓
Click "Secrets" tab
    ↓
Click "New Secret"
    ↓
Name: RESEND_API_KEY
Value: re_... (your Resend key)
    ↓
Click Save
    ↓
Done! ✅
```

---

## **Where Things Go**

| Item | Location |
|------|----------|
| Resend API Key | https://resend.com > API Keys |
| Must go to | Supabase > Edge Functions > Secrets |
| NOT in | .env file |

---

## **If You Can't Find Secrets Tab**

Try this path:
```
Supabase > Your Project
    ↓
Left sidebar > Edge Functions (expand if needed)
    ↓
At the top, you should see tabs: Overview | Functions | Logs | Secrets
    ↓
Click Secrets
```

---

## **After You Do This**

✅ OTP will be generated
✅ Sent to Supabase Edge Function  
✅ Supabase will read RESEND_API_KEY from Secrets
✅ Function will call Resend API
✅ Email arrives in your inbox! 📧

---

**This is the ONLY thing stopping emails from working!**
Once you add the Resend API Key to Supabase Secrets, everything will work.
