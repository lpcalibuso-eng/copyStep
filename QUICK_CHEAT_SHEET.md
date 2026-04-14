# ⚡ QUICK CHEAT SHEET - Google OAuth + step2 DB

**Print this out!** Reference while testing.

---

## 🎯 WHAT WAS BUILT

When users click "Continue with Google":
- ✅ Stored in Supabase Auth (automatic)
- ✅ **NEW:** Stored in step2 DB (automatic)
- ✅ Avatar saved from Google
- ✅ Student role assigned
- ✅ Email verified
- ✅ Login tracked

---

## 📁 FILES CREATED

```
✅ NEW: app/Http/Controllers/Auth/GoogleAuthController.php
✅ UPDATED: routes/auth.php (route + import)
✅ UPDATED: resources/js/Pages/Auth/OAuthCallback.jsx (API call)
```

---

## 🧪 TEST CHECKLIST (15 min total)

### Test 1: New User (5 min)
```
[ ] Go to /register
[ ] Click "Continue with Google"
[ ] Sign in with @kld.edu.ph email
[ ] Check database: User created
[ ] Verify: avatar_url populated, role = student, email_verified_at = now
```

### Test 2: Existing User (3 min)
```
[ ] Logout
[ ] Go to /login
[ ] Click "Continue with Google"
[ ] Same email
[ ] Check database: last_login_at updated, user count = 1
```

### Test 3: Invalid Email (2 min)
```
[ ] Try @gmail.com email
[ ] Verify: Error shown, user NOT created
```

### Test 4: Avatar (2 min)
```
[ ] Check navbar: Avatar shows
[ ] Check profile: Avatar shows
[ ] Check database: avatar_url != NULL
```

---

## 🔍 DATABASE QUERIES

### Check User Created
```sql
SELECT id, name, email, avatar_url, role_id, email_verified_at
FROM users 
WHERE email = 'john@kld.edu.ph';
```

### Check with Role
```sql
SELECT u.id, u.name, u.email, u.avatar_url, r.name as role
FROM users u
JOIN roles r ON u.role_id = r.id
WHERE u.email = 'john@kld.edu.ph';
```

### Check Last Login Updated
```sql
SELECT email, last_login_at FROM users 
WHERE email = 'john@kld.edu.ph';
```

### Verify No Duplicates
```sql
SELECT COUNT(*) FROM users WHERE email = 'john@kld.edu.ph';
-- Should return: 1
```

---

## 💻 TERMINAL COMMANDS

### Start Dev Server
```bash
# Terminal 1
cd /home/jimz/Documents/Capstone/step22
php artisan serve

# Terminal 2
npm run dev
```

### View Logs
```bash
tail -f storage/logs/laravel.log | grep -i google
```

### Quick Check
```bash
mysql -u root -p step2
SELECT * FROM users WHERE email = 'your@kld.edu.ph';
```

---

## 🌐 TEST URLS

| Action | URL |
|--------|-----|
| Register | http://127.0.0.1:8000/register |
| Login | http://127.0.0.1:8000/login |
| Dashboard | http://127.0.0.1:8000/user |
| Profile | http://127.0.0.1:8000/profile |

---

## 📱 BROWSER CONSOLE

When testing, check browser console (F12) for:
```
✅ "User created/updated in step2 DB:"
✅ User object with: id, name, email, role
```

---

## 📊 EXPECTED DATA

### New User Should Have
```json
{
  "id": "uuid-auto-generated",
  "name": "John Doe",
  "email": "john@kld.edu.ph",
  "avatar_url": "https://lh3.googleusercontent.com/...",
  "role_id": "student-role-id",
  "email_verified_at": "2026-04-14 10:30:00",
  "profile_completed": 0,
  "status": "active"
}
```

---

## ⚠️ TROUBLESHOOTING

| Problem | Solution |
|---------|----------|
| User not created | Check console errors, review logs |
| Duplicate users | Clear cookies, use incognito |
| Avatar missing | Check avatar_url in DB |
| Role wrong | Verify student role exists |
| Error 500 | Check: Laravel logs, email format |

---

## 📚 DOCUMENTATION QUICK LINKS

- Quick overview: `DOCUMENTATION_INDEX.md`
- Reference: `GOOGLE_OAUTH_QUICK_REFERENCE.md`
- Testing guide: `TESTING_GOOGLE_OAUTH_STEP2_DB.md` ← **USE THIS**
- Full guide: `GOOGLE_OAUTH_COMPLETE_GUIDE.md`
- Deployment: `DEPLOYMENT_CHECKLIST.md`

---

## ✅ SUCCESS CRITERIA

- [ ] New user created in step2 DB
- [ ] Avatar stored from Google
- [ ] Student role assigned
- [ ] Email verified_at set
- [ ] Existing user updated (not duplicated)
- [ ] last_login_at changed
- [ ] Invalid email shows error
- [ ] Avatar displays in UI

---

## 🚀 QUICK REFERENCE

**Endpoint:** `POST /api/oauth/google-login`

**Request:**
```json
{
  "email": "john@kld.edu.ph",
  "name": "John Doe",
  "avatar_url": "https://..."
}
```

**Response:**
```json
{
  "success": true,
  "user": { /* user data */ }
}
```

---

## 🎯 TESTING FLOW

```
Start Dev → /register → Google → Dashboard
          ↓
        Database
```

```
Login again → /login → Google → Dashboard
          ↓
    last_login_at updated
```

---

## ⏱️ TIME ESTIMATES

| Task | Time |
|------|------|
| Read docs | 10 min |
| Test | 15 min |
| Verify | 5 min |
| Deploy | 5 min |
| **TOTAL** | **~40 min** |

---

## 📞 KEY CONTACTS

**Need Help?** Check these files in order:
1. `GOOGLE_OAUTH_QUICK_REFERENCE.md` (2 min)
2. `TESTING_GOOGLE_OAUTH_STEP2_DB.md` (5 min)
3. `GOOGLE_OAUTH_COMPLETE_GUIDE.md` (10 min)

---

## 🎉 YOU'RE READY!

Everything is implemented and documented.

**NEXT STEP:** Follow `TESTING_GOOGLE_OAUTH_STEP2_DB.md`

**Good luck!** 🚀

