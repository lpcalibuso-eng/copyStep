# ⚡ **Quick Start: OTP Email Setup (5 Minutes)**

## **All Code is Done ✅**

No more coding needed. Just add your Gmail credentials.

---

## **What to Do:**

### **1. Get Gmail App Password (2 min)**

```
Go to: https://myaccount.google.com
→ Security
→ App passwords
→ Select: Mail, Windows Computer
→ Copy the 16-character password
```

### **2. Update .env (1 min)**

Open: `/home/jimz/Documents/Capstone/step22/.env`

Find the mail section and add/update:

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=paste-16-char-password-here
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=your-email@gmail.com
MAIL_FROM_NAME="STEP Platform"
```

### **3. Test (2 min)**

1. Go to: http://127.0.0.1:8000/register
2. Fill with your email
3. Click Register
4. Check inbox ✅

---

## **That's It!**

If email arrives → **You're done!** 🎉

If email doesn't arrive → Check: `tail -f storage/logs/laravel.log | grep OTP`

---

## **Real Example**

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=jimj87313@gmail.com
MAIL_PASSWORD=xyzt abcd efgh ijkl
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=jimj87313@gmail.com
MAIL_FROM_NAME="STEP Platform"
```

---

**Go get your Gmail password and add it to .env!** 🚀
