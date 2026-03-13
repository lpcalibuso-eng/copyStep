import { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';
import { useSupabase } from '../../context/SupabaseContext';

export default function OAuthCallback() {
  const { validateGoogleEmailDomain, user, loading, signOut } = useSupabase();
  const [error, setError] = useState('');
  const [validating, setValidating] = useState(true);

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

          // Email is valid - now sync with Laravel backend
          await syncUserWithBackend(user);
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

  /**
   * Sync user data with Laravel backend and Supabase
   */
  const syncUserWithBackend = async (supabaseUser) => {
    try {
      // Get CSRF token from meta tag
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;

      if (!csrfToken) {
        throw new Error('CSRF token not found. Please refresh the page.');
      }

      // Prepare user data for backend
      const userData = {
        email: supabaseUser.email,
        name: supabaseUser.user_metadata?.full_name || supabaseUser.email.split('@')[0],
        provider: 'google',
        provider_id: supabaseUser.id,
        avatar_url: supabaseUser.user_metadata?.avatar_url || null,
      };

      // Send to Laravel backend to sync with database and Supabase
      const response = await fetch('/oauth/store', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to sync user data');
      }

      if (data.success) {
        // Redirect to the appropriate page
        if (data.redirect) {
          // Add a small delay to ensure session is set
          setTimeout(() => {
            window.location.href = data.redirect;
          }, 500);
        } else {
          router.visit('/dashboard');
        }
      } else {
        throw new Error(data.message || 'Failed to process authentication');
      }
    } catch (err) {
      console.error('Backend sync error:', err);
      throw err;
    }
  };

  return (
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
  );
}
