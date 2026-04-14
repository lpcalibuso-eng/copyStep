import { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';
import { useSupabase } from '../../context/SupabaseContext';
import OnboardingFlow from './OnboardingFlow';

export default function OAuthCallback() {
  const { validateGoogleEmailDomain, user, loading, signOut } = useSupabase();
  const [error, setError] = useState('');
  const [validating, setValidating] = useState(true);
  const [oauthUser, setOauthUser] = useState(null);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const [courseList, setCourseList] = useState([]);
  const [instituteList, setInstituteList] = useState([]);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        setValidating(true);

        // Wait for auth to complete
        if (loading) return;

        // Validate the email domain
        if (user && user.email) {
          if (!user.email.endsWith('@kld.edu.ph')) {
            // Sign out if email is not from valid domain
            await signOut();
            setError('Email must be a valid KLD school email (@kld.edu.ph). Your account has been signed out.');
            setTimeout(() => {
              router.visit('/login');
            }, 3000);
            return;
          }

          // ✅ Email is valid, now create/update user in step2 DB
          console.log('📝 Calling Google OAuth endpoint to create/update user in step2 DB');
          console.log('🆔 Supabase User ID:', user.id);

          const API_BASE_URL = "http://127.0.0.1:8000";
          console.log('📝 Syncing Supabase User to Laravel step2 DB...');

          const response = await fetch(`${API_BASE_URL}/api/oauth/google-login`, {

            // const response = await fetch('/api/oauth/google-login', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content,
            },
            body: JSON.stringify({
              id: user.id, // Supabase user ID - use same as step2 DB id
              email: user.email,
              name: user.user_metadata?.full_name || user.email.split('@')[0],
              avatar_url: user.user_metadata?.avatar_url || null,
            }),
          });

          // if (!response.ok) {
          //   const isJson = response.headers.get("content-type")?.includes("application/json");

          //   const errorHtml = await response.text();
          //   console.error('❌ Laravel Error Detected:', errorHtml);
          //   throw new Error(`Server responded with ${response.status}`);
          //   if (isJson) {
          //     const errorData = await response.json();
          //     throw new Error(errorData.message || 'Failed to create user in database');
          //   } else {
          //     const errorText = await response.text();
          //     console.error('HTML Error Response:', response.status, errorText);
          //     throw new Error(`Server error: ${response.status} - Expected JSON but received HTML`);
          //   }
          // }

          if (!response.ok) {
            const contentType = response.headers.get("content-type");

            if (contentType && contentType.includes("application/json")) {
              // 1. Handle actual API error messages (JSON)
              const errorData = await response.json();
              console.error('❌ API Error Data:', errorData);
              throw new Error(errorData.message || 'Failed to create user in database');
            } else {
              // 2. Handle Laravel Crash/419/HTML errors (The "<!DOCTYPE" stuff)
              const errorText = await response.text();
              console.error('❌ Laravel HTML Error Detected:', response.status);

              // Log the first 200 characters of the HTML to see the PHP error without flooding the console
              console.log('Error snippet:', errorText.substring(0, 200));

              throw new Error(`Server error: ${response.status}. Please check the Laravel logs or Network tab.`);
            }
          }
          // // startt
          // const data = await response.json();
          // console.log('✅ User created/updated in step2 DB:', data.user);

          // // Store user info for onboarding check
          // setOauthUser(data.user);

          // // Check if user profile_completed is false, show onboarding
          // if (!data.user.profile_completed) {
          //   console.log('📋 Profile incomplete, showing onboarding flow');
          //   setShowOnboarding(true);
          //   setValidating(false);
          // } else {
          //   console.log('✅ Profile already completed, redirecting to dashboard');
          //   router.visit('/user');
          // }

          // // end

          // ... inside handleCallback try block ...

          const data = await response.json();
          console.log('✅ User created/updated in step2 DB:', data.user);

          setOauthUser(data.user);

          // if (!data.user.profile_completed) {
          //   console.log('📋 Profile incomplete, fetching dropdown data...');

          //   try {
          //     // FETCH THE DATA FROM THE DATABASE HERE
          //     const academicRes = await fetch(`${API_BASE_URL}/api/onboarding/data`, {
          //       headers: { 'Accept': 'application/json' }
          //     });

          //     if (academicRes.ok) {
          //       const academicData = await academicRes.json();
          //       setCourseList(academicData.courses || []);
          //       setInstituteList(academicData.institutes || []);
          //       console.log('✅ Dropdown data loaded');
          //     }
          //   } catch (fetchErr) {
          //     console.error('❌ Failed to load dropdowns:', fetchErr);
          //   }

          //   setShowOnboarding(true);
          //   setValidating(false);
          // } else {
          //   router.visit('/user');
          // }

          if (!data.user.profile_completed) {
            // 1. Fetch the dropdown data here
            try {
              const [cRes, iRes] = await Promise.all([
                fetch('http://127.0.0.1:8000/api/onboarding/courses', { headers: { 'Accept': 'application/json' } }),
                fetch('http://127.0.0.1:8000/api/onboarding/institutes', { headers: { 'Accept': 'application/json' } })
              ]);

              const cData = await cRes.json();
              const iData = await iRes.json();

              setCourseList(cData.courses || []);
              setInstituteList(iData.institutes || []);
            } catch (err) {
              console.error("Failed to preload dropdowns", err);
            }

            setShowOnboarding(true);
            setValidating(false);
          }


        } else {
          throw new Error('No user session found after Google sign-in');
        }
      } catch (err) {
        console.error('OAuth callback error:', err);
        setError(err.message || 'Authentication failed. Redirecting to login...');
        setTimeout(() => {
          router.visit('/login');
        }, 3000);
      } finally {
        setValidating(false);
      }
    };

    handleCallback();
  }, [loading, user, validateGoogleEmailDomain, signOut]);

  return (
    <>
      {/* Show onboarding flow if needed */}
      {showOnboarding && oauthUser && (
        <OnboardingFlow
          // userId={oauthUser.id}
          // email={oauthUser.email}
          // profileCompleted={oauthUser.profile_completed}
          // onOnboardingComplete={(data) => {
          //   console.log('✅ Onboarding flow completed:', data);
          //   // Redirect to dashboard after onboarding is complete
          //   router.visit('/user');
          // }}
          userId={oauthUser.id}
          email={oauthUser.email}
          // Add these two lines to pass your database arrays
          courses={courseList}
          institutes={instituteList}
          profileCompleted={oauthUser.profile_completed}
          onOnboardingComplete={(data) => {
            console.log('✅ Onboarding flow completed:', data);
            router.visit('/user');
          }}
        />
      )}

      {/* Loading/Status UI */}
      {!showOnboarding && (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700 relative overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>

          {/* Main content */}
          <div className="relative z-10 text-center px-4">
            {error ? (
              <>
                {/* Error State */}
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/20 max-w-md">
                  <div className="mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/20 mb-4">
                      <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <h1 className="text-3xl font-bold text-white mb-4">Authentication Failed</h1>
                  <p className="text-white/90 text-base mb-6 leading-relaxed">{error}</p>
                  <p className="text-white/70 text-sm animate-bounce">Redirecting to login...</p>
                </div>
              </>
            ) : validating ? (
              <>
                {/* Loading State */}
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-12 shadow-2xl border border-white/20 max-w-md">
                  {/* Logo with spinning animation */}
                  <div className="mb-8">
                    <div className="relative inline-block">
                      {/* Outer spinning ring */}
                      <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-white border-r-white animate-spin"></div>

                      {/* Inner logo */}
                      <div className="relative w-24 h-24 flex items-center justify-center">
                        <img
                          src="/images/Logo.png"
                          alt="STEP Logo"
                          className="w-20 h-20 object-contain drop-shadow-lg"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Animated dots */}
                  <div className="flex justify-center gap-2 mb-6">
                    <div className="w-2 h-2 rounded-full bg-white animate-bounce" style={{ animationDelay: '0s' }}></div>
                    <div className="w-2 h-2 rounded-full bg-white animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 rounded-full bg-white animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>

                  <h1 className="text-2xl font-bold text-white mb-2">Verifying Credentials</h1>
                  <p className="text-white/80 text-sm mb-6">Please wait while we validate your KLD email</p>

                  {/* Progress indicator */}
                  <div className="w-full bg-white/20 rounded-full h-1 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-white via-blue-200 to-white rounded-full animate-pulse" style={{ width: '60%' }}></div>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Redirecting State */}
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-12 shadow-2xl border border-white/20 max-w-md">
                  <div className="mb-8">
                    <div className="inline-block">
                      <div className="animate-pulse">
                        <img
                          src="/images/Logo.png"
                          alt="STEP Logo"
                          className="w-20 h-20 object-contain drop-shadow-lg"
                        />
                      </div>
                    </div>
                  </div>

                  <h1 className="text-2xl font-bold text-white mb-2">Success!</h1>
                  <p className="text-white/80 text-sm">Taking you to your dashboard</p>

                  {/* Checkmark animation */}
                  <div className="mt-6 flex justify-center">
                    <svg className="w-12 h-12 text-green-400 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* CSS for additional animations */}
          <style>{`
            @keyframes float {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-10px); }
            }
            @keyframes shimmer {
              0%, 100% { opacity: 0.4; }
              50% { opacity: 1; }
            }
          `}</style>
        </div>
      )}

    </>
  );
}