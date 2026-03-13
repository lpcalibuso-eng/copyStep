# Quick Test Commands

## Start Server
```bash
cd "/opt/lampp/htdocs/Prototype System/Step/kldstep"
php artisan serve
```

## Test Registration
Visit: `http://localhost:8000/register`

Fill form:
- Email: `test@kld.edu.ph`
- Password: `password123` (min 8 chars)
- Confirm Password: `password123`

Click "Create Account" → Should redirect to `/dashboard` ✅

## Verify in Database
```bash
php artisan tinker

# List all users
User::all();

# Get user with roles
User::first()->load('roles');

# Check if student role assigned
User::first()->hasRole('student');
```

## Reset Database (If Needed)
```bash
# Fresh migration
php artisan migrate:fresh
php artisan db:seed

# Then test again
```

## Check Logs
```bash
tail -f storage/logs/laravel.log
```

## View Database File
```bash
ls -lah database/database.sqlite
```

---

**All errors fixed! Ready to test.** ✅
