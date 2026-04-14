# 📧 **Supabase Email Function Setup Guide**

## **IMPORTANT: Your OTP code is being generated but NOT SENT**

The OTP is **logged as fallback** in `storage/logs/laravel.log`, but you need to set up Supabase Email Function for it to be sent to users' emails.

---

## **Step 1: Sign Up for Resend (Email Service)**

1. Go to: **https://resend.com**
2. Sign up with your email
3. Go to **API Keys** section
4. Copy your API key (starts with `re_`)

---

## **Step 2: Create Supabase Edge Function**

1. Go to **https://app.supabase.com**
2. Select your project: `cfiduyldbalgcjojovhq`
3. Click **Edge Functions** (left sidebar)
4. Click **Create New Function**
5. Name: `send-email`
6. Language: TypeScript
7. Replace all code with this:

```typescript
import { serve } from "https://deno.land/std@0.131.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

interface EmailRequest {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const { to, subject, html, from = "noreply@stepplatform.com" } =
      (await req.json()) as EmailRequest;

    if (!to || !subject || !html) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "Email service not configured" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from,
        to,
        subject,
        html,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Resend API error:", error);
      return new Response(
        JSON.stringify({ error: "Failed to send email", details: error }),
        { status: response.status, headers: { "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
```

---

## **Step 3: Set Environment Secret**

1. In **Edge Functions** settings
2. Click **Secrets**
3. Click **New Secret**
4. **Name:** `RESEND_API_KEY`
5. **Value:** Paste your Resend API key
6. Click **Save**

---

## **Step 4: Deploy Function**

1. Click **Deploy** button
2. Wait for success message

---

## **Step 5: Test in Supabase Dashboard**

1. Open your `send-email` function
2. Click **Test**
3. Paste this JSON:

```json
{
  "to": "jamesttamayo0604@gmail.com",
  "subject": "Test Email",
  "html": "<p>Congrats on sending your <strong>first email</strong>!</p>",
  "from": "onboarding@resend.dev"
}

```

4. Click **Execute**
5. Check your email

---

## **Step 6: Test Full Registration Flow**

1. Go to **http://127.0.0.1:8000/register**
2. Fill in the form
3. Click **Register**
4. Check your email for OTP code
5. Enter OTP to verify
6. Complete profile

---

## **Troubleshooting**

### **Issue: "Requested function was not found"**
- Function not deployed yet
- Function name is not `send-email`
- Check Edge Functions section shows the function

### **Issue: "RESEND_API_KEY not configured"**
- Secret not saved in Supabase
- Refresh page and check Secrets again

### **Issue: Email not receiving**
- Check spam/junk folder
- Verify Resend API key is valid
- Check logs: `tail -f storage/logs/laravel.log`

### **Where to Find OTP if Email Fails**
- **Laravel logs:** `storage/logs/laravel.log`
- Search for: `OTP (fallback log)`
- The 6-digit code will be logged there for testing

---

## **Your Configuration**

✅ **Supabase URL:** `https://cfiduyldbalgcjojovhq.supabase.co`
✅ **Anon Key:** Already set in `.env`
✅ **Laravel Email Function:** Already configured
⏳ **Needs Setup:** Supabase Edge Function + Resend API

---

## **After Setup, Your Flow Will Be:**

```
User Registration
    ↓
OTP Generated (6 digits)
    ↓
Sent to Supabase Edge Function
    ↓
Supabase forwards to Resend API
    ↓
Resend sends email to user
    ↓
User receives OTP in inbox ✅
    ↓
User enters OTP
    ↓
Account created + Profile completed
```

---

**Need Help?**
- Resend Docs: https://resend.com/docs
- Supabase Edge Functions: https://supabase.com/docs/guides/functions
