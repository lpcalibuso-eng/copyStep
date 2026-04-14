#!/bin/bash

# OTP Email Diagnostic Script
# Run: bash diagnostic.sh

echo "🔍 Supabase OTP Email Configuration Diagnostic"
echo "=================================================="
echo ""

# Check if .env file exists
echo "✓ Checking .env file..."
if [ -f .env ]; then
    echo "  ✅ .env file found"
else
    echo "  ❌ .env file NOT found"
    exit 1
fi

echo ""
echo "✓ Checking Supabase Configuration..."

# Check VITE_SUPABASE_URL
SUPABASE_URL=$(grep "VITE_SUPABASE_URL=" .env | cut -d '=' -f2)
if [ -z "$SUPABASE_URL" ]; then
    echo "  ❌ VITE_SUPABASE_URL not set"
else
    echo "  ✅ VITE_SUPABASE_URL: $SUPABASE_URL"
fi

# Check Service Role Key
SERVICE_KEY=$(grep "SUPABASE_SERVICE_ROLE_KEY=" .env | cut -d '=' -f2)
if [ -z "$SERVICE_KEY" ]; then
    echo "  ❌ SUPABASE_SERVICE_ROLE_KEY not set"
    KEY_LENGTH=0
else
    KEY_LENGTH=${#SERVICE_KEY}
    echo "  ✅ SUPABASE_SERVICE_ROLE_KEY: Set (${KEY_LENGTH} characters)"
    
    # Check if it's the dummy key
    if [[ "$SERVICE_KEY" == "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmaWR1eWxkYmFsZ2Nqb2pvdmhxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxMDUyNjc1MCwiZXhwIjoxNzQyMDYyNzUwfQ.dP2_xMZ2Zy0LhMxW8K0qkWc5L5t2Q9R4N6M3P8V0W1s"* ]]; then
        echo "  ⚠️  WARNING: This looks like the DUMMY/PLACEHOLDER key!"
        echo "  ⚠️  You need to get the REAL key from Supabase:"
        echo "     1. Go to https://app.supabase.com"
        echo "     2. Settings > API"
        echo "     3. Copy 'Service Role' key (NOT 'Anon Key')"
        echo "     4. Replace in .env"
    elif [[ ${KEY_LENGTH} -lt 50 ]]; then
        echo "  ❌ SUPABASE_SERVICE_ROLE_KEY seems too short (${KEY_LENGTH} chars, should be 150+)"
    else
        echo "  ✅ Key looks valid (${KEY_LENGTH} characters)"
    fi
fi

echo ""
echo "✓ Checking Resend Configuration..."

# Check if Supabase Edge Function has Resend key set
echo "  Note: RESEND_API_KEY should be set in Supabase Secrets (not .env)"
echo "  To verify: https://app.supabase.com > Project > Edge Functions > Secrets"

echo ""
echo "✓ Checking Laravel Configuration..."

if [ -f "storage/logs/laravel.log" ]; then
    LAST_OTP=$(grep "OTP (fallback log)" storage/logs/laravel.log | tail -1)
    if [ -n "$LAST_OTP" ]; then
        echo "  ℹ️  Last fallback OTP logged:"
        echo "  $LAST_OTP"
        echo ""
        echo "  💡 This means OTP was generated but email didn't send"
    fi
    
    LAST_ERROR=$(grep "Supabase email failed" storage/logs/laravel.log | tail -1)
    if [ -n "$LAST_ERROR" ]; then
        echo "  📋 Last Supabase Error:"
        echo "  $LAST_ERROR"
    fi
else
    echo "  ⚠️  Laravel logs not found"
fi

echo ""
echo "=================================================="
echo "Diagnostic Complete"
echo ""
echo "Next Steps:"
echo "1. If key shows as placeholder, get real Service Role Key from Supabase"
echo "2. Update SUPABASE_SERVICE_ROLE_KEY in .env"
echo "3. Restart Laravel: php artisan serve"
echo "4. Test registration again"
