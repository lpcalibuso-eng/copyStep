#!/bin/bash

# OTP System Verification Script
# Run this to verify everything is configured correctly

echo "═══════════════════════════════════════════════════════════"
echo "  OTP REGISTRATION SYSTEM - VERIFICATION SCRIPT"
echo "═══════════════════════════════════════════════════════════"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check 1: CACHE_STORE configuration
echo "🔍 Checking CACHE_STORE configuration..."
if grep -q "CACHE_STORE=file" .env; then
    echo -e "${GREEN}✅ CACHE_STORE=file is set in .env${NC}"
else
    echo -e "${RED}❌ CACHE_STORE=file is NOT set in .env${NC}"
    echo "   Adding it now..."
    echo "CACHE_STORE=file" >> .env
    echo -e "${GREEN}✅ Added CACHE_STORE=file${NC}"
fi
echo ""

# Check 2: OTPController file exists
echo "🔍 Checking OTPController file..."
if [ -f "app/Http/Controllers/Auth/OTPController.php" ]; then
    echo -e "${GREEN}✅ OTPController.php exists${NC}"
else
    echo -e "${RED}❌ OTPController.php NOT found${NC}"
fi
echo ""

# Check 3: Routes registered
echo "🔍 Checking if routes are registered..."
ROUTE_COUNT=$(php artisan route:list 2>/dev/null | grep -c "api/otp")
if [ $ROUTE_COUNT -ge 3 ]; then
    echo -e "${GREEN}✅ Found $ROUTE_COUNT OTP routes registered${NC}"
    echo ""
    echo "   Routes:"
    php artisan route:list 2>/dev/null | grep "api/otp" | sed 's/^/   /'
else
    echo -e "${RED}❌ OTP routes NOT found ($ROUTE_COUNT found, need at least 3)${NC}"
    echo "   Trying to clear and regenerate routes..."
    php artisan route:clear 2>/dev/null
    ROUTE_COUNT=$(php artisan route:list 2>/dev/null | grep -c "api/otp")
    if [ $ROUTE_COUNT -ge 3 ]; then
        echo -e "${GREEN}✅ Routes regenerated successfully ($ROUTE_COUNT found)${NC}"
    else
        echo -e "${RED}❌ Routes still not found${NC}"
    fi
fi
echo ""

# Check 4: Register.jsx has correct endpoint
echo "🔍 Checking Register.jsx endpoint..."
if grep -q 'fetch("/api/otp/send"' resources/js/Pages/Auth/Register.jsx; then
    echo -e "${GREEN}✅ Register.jsx using correct endpoint /api/otp/send${NC}"
else
    echo -e "${RED}❌ Register.jsx NOT using correct endpoint${NC}"
fi
echo ""

# Check 5: VerifyOTP.jsx has correct endpoints
echo "🔍 Checking VerifyOTP.jsx endpoints..."
if grep -q 'fetch("/api/otp/verify"' resources/js/Pages/Auth/VerifyOTP.jsx && \
   grep -q 'fetch("/api/otp/resend"' resources/js/Pages/Auth/VerifyOTP.jsx; then
    echo -e "${GREEN}✅ VerifyOTP.jsx using correct endpoints${NC}"
else
    echo -e "${RED}❌ VerifyOTP.jsx NOT using correct endpoints${NC}"
fi
echo ""

# Check 6: ProfileCompletionModal exists
echo "🔍 Checking ProfileCompletionModal..."
if [ -f "resources/js/Components/ProfileCompletionModal.jsx" ]; then
    echo -e "${GREEN}✅ ProfileCompletionModal.jsx exists${NC}"
else
    echo -e "${RED}❌ ProfileCompletionModal.jsx NOT found${NC}"
fi
echo ""

# Check 7: Migration exists
echo "🔍 Checking migration file..."
if ls database/migrations/*add_profile_fields_to_users_table.php >/dev/null 2>&1; then
    echo -e "${GREEN}✅ Migration file exists${NC}"
    echo "   You can run: php artisan migrate"
else
    echo -e "${RED}❌ Migration file NOT found${NC}"
fi
echo ""

# Check 8: Laravel server running
echo "🔍 Checking if Laravel server is running..."
if curl -s http://127.0.0.1:8000/api/test | grep -q "API is working"; then
    echo -e "${GREEN}✅ Laravel server is running on http://127.0.0.1:8000${NC}"
else
    echo -e "${YELLOW}⚠️  Laravel server might not be running${NC}"
    echo "   Start it with: php artisan serve"
fi
echo ""

# Check 9: PHP syntax
echo "🔍 Checking OTPController PHP syntax..."
if php -l app/Http/Controllers/Auth/OTPController.php 2>&1 | grep -q "No syntax errors"; then
    echo -e "${GREEN}✅ OTPController.php has no syntax errors${NC}"
else
    echo -e "${RED}❌ OTPController.php has syntax errors${NC}"
    php -l app/Http/Controllers/Auth/OTPController.php
fi
echo ""

# Summary
echo "═══════════════════════════════════════════════════════════"
echo "  VERIFICATION COMPLETE"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "📝 Next Steps:"
echo "  1. If all checks passed (✅), test the registration flow:"
echo "     Go to: http://127.0.0.1:8000/register"
echo "  2. Fill the form and submit"
echo "  3. Check browser console for OTP sent message"
echo "  4. Check logs for OTP: tail -f storage/logs/laravel.log | grep OTP"
echo ""
echo "❓ If some checks failed:"
echo "  1. Run: php artisan cache:clear"
echo "  2. Run: php artisan route:clear"
echo "  3. Run: php artisan config:clear"
echo "  4. Run: php artisan serve"
echo "  5. Then run this script again"
echo ""
