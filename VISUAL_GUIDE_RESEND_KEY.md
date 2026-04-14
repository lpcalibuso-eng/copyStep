# 📸 **Visual Step-by-Step: Add Resend API Key**

## **STEP 1: Get Resend API Key**

```
1. Go to: https://resend.com
2. Log in to your account
3. Click "API Keys" in the left menu
4. You'll see a key like: re_abc123def456...
5. Click the COPY button
6. (You now have it copied to clipboard)
```

---

## **STEP 2: Open Supabase**

```
1. Go to: https://app.supabase.com
2. Click on your project (cfiduyldbalgcjojovhq)
3. Wait for dashboard to load
```

---

## **STEP 3: Find Edge Functions Secrets**

```
Left Sidebar in Supabase:
├── Project Settings
├── SQL Editor
├── Auth
├── Database
├── Storage
├── Vectors
├── Edge Functions     ← CLICK THIS
│   ├── Functions
│   ├── Logs
│   └── Secrets        ← Then click this tab

OR look for "Secrets" tab at the top after clicking Edge Functions
```

---

## **STEP 4: Add New Secret**

```
After clicking Edge Functions > Secrets:

You should see a blue button "New Secret"
Click it

A form will appear:
┌─────────────────────────────┐
│ Name:  RESEND_API_KEY       │ ← Type this exactly
│                             │
│ Value: re_abc123def456...   │ ← Paste your Resend key here
│                             │
│  [Save]  [Cancel]           │
└─────────────────────────────┘

1. Type "RESEND_API_KEY" in Name field
2. Paste your Resend key in Value field  
3. Click Save
```

---

## **STEP 5: Verify**

```
After clicking Save:

You should see in the Secrets list:
┌──────────────────────┐
│ RESEND_API_KEY       │  ← Your new secret
│ Status: Active ✅    │
└──────────────────────┘
```

---

## **STEP 6: Test OTP Email**

```
1. Go to http://127.0.0.1:8000/register
2. Fill the form:
   - First Name: Test
   - Last Name: User
   - Email: your-email@gmail.com
   - Password: (any password)
   - Role: Student
3. Click "Register"
4. Check your email inbox (wait 5-10 seconds)
5. You should see an email with OTP code ✅
```

---

## **Checklist**

- [ ] Copied Resend API key from https://resend.com
- [ ] Opened https://app.supabase.com
- [ ] Found Edge Functions > Secrets
- [ ] Added new secret with Name: RESEND_API_KEY
- [ ] Pasted Resend key in Value field
- [ ] Clicked Save
- [ ] Verified secret shows as "Active"
- [ ] Tested registration at http://127.0.0.1:8000/register
- [ ] Checked email inbox for OTP code ✅

---

## **Still Not Working?**

Check this:
1. Is the secret name EXACTLY "RESEND_API_KEY"? (case sensitive)
2. Is the value your actual Resend API key? (should start with `re_`)
3. Does it show "Active" status in Supabase?
4. Did you wait 10 seconds after registering before checking email?

---

## **Example: What Success Looks Like**

Terminal logs should show:
```
[2026-04-14 XX:XX:XX] local.INFO: OTP Email sent successfully via Supabase to: your-email@gmail.com
```

Email inbox should have:
```
From: noreply@stepplatform.com
Subject: STEP Platform - Email Verification Code
Body: Your OTP code is: 123456
```
