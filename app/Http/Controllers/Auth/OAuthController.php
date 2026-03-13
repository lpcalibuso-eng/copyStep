<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class OAuthController extends Controller
{
    /**
     * Handle OAuth callback (Google, etc.)
     * This is called by the OAuthCallback component in React
     */
    public function callback()
    {
        // The React component (OAuthCallback.jsx) handles the Supabase OAuth logic
        // This route just renders the callback component
        return Inertia::render('Auth/OAuthCallback');
    }

    /**
     * Store user from OAuth provider
     * Called by React component after OAuth succeeds
     * This now syncs with both Laravel DB and Supabase
     */
    public function store(Request $request)
    {
        try {
            // Get OAuth data from request
            $providerUser = $request->validate([
                'email' => 'required|email',
                'name' => 'required|string',
                'provider' => 'required|string',
                'provider_id' => 'required|string',
                'avatar_url' => 'nullable|string',
            ]);

            // Step 1: Create or update user in Laravel database
            $user = User::updateOrCreate(
                ['email' => $providerUser['email']],
                [
                    'name' => $providerUser['name'],
                    'provider' => $providerUser['provider'],
                    'provider_id' => $providerUser['provider_id'],
                    'avatar_url' => $providerUser['avatar_url'] ?? null,
                    'last_login_at' => now(),
                    'is_active' => true,
                ]
            );

            // Step 2: Sync user data with Supabase (if enabled)
            $this->syncWithSupabase($user, $providerUser);

            // Step 3: If newly created (just registered), redirect to profile completion
            if ($user->wasRecentlyCreated) {
                Auth::login($user, remember: false);
                return response()->json([
                    'success' => true,
                    'redirect' => '/complete-profile',
                    'message' => 'Please complete your profile',
                ]);
            }

            // Step 4: If already exists, check if they need to complete profile
            if (!$user->department || !$user->year_level) {
                Auth::login($user, remember: false);
                return response()->json([
                    'success' => true,
                    'redirect' => '/complete-profile',
                    'message' => 'Please complete your profile',
                ]);
            }

            // Step 5: Assign student role if not already assigned
            if (!$user->roles()->exists()) {
                $studentRole = Role::where('slug', 'student')->first();
                if ($studentRole) {
                    $user->roles()->attach($studentRole);
                }
            }

            // Step 6: Login user
            Auth::login($user, remember: false);

            return response()->json([
                'success' => true,
                'redirect' => '/dashboard',
                'message' => 'Welcome back!',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Authentication failed: ' . $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Sync user data with Supabase
     * This ensures user data exists in Supabase auth_users or users table
     */
    private function syncWithSupabase(User $user, array $providerUser)
    {
        try {
            $supabaseUrl = config('services.supabase.url') ?? env('VITE_SUPABASE_URL');
            $supabaseKey = config('services.supabase.key') ?? env('VITE_SUPABASE_ANON_KEY');

            if (!$supabaseUrl || !$supabaseKey) {
                Log::warning('Supabase credentials not configured');
                return;
            }

            // Check if user exists in Supabase
            $response = Http::withHeaders([
                'apikey' => $supabaseKey,
                'Authorization' => 'Bearer ' . $supabaseKey,
                'Content-Type' => 'application/json',
            ])->get("{$supabaseUrl}/rest/v1/users?email=eq.{$user->email}");

            if ($response->successful() && count($response->json()) > 0) {
                // User exists, update if needed
                $supabaseUser = $response->json()[0];
                
                // Update Supabase user metadata
                $this->updateSupabaseUserMetadata($supabaseUrl, $supabaseKey, $supabaseUser['id'], [
                    'name' => $user->name,
                    'avatar_url' => $user->avatar_url,
                    'provider' => $user->provider,
                    'last_login_at' => $user->last_login_at,
                ]);
            } else {
                // User doesn't exist, create in Supabase users table
                Http::withHeaders([
                    'apikey' => $supabaseKey,
                    'Authorization' => 'Bearer ' . $supabaseKey,
                    'Content-Type' => 'application/json',
                    'Prefer' => 'return=representation',
                ])->post("{$supabaseUrl}/rest/v1/users", [
                    'email' => $user->email,
                    'name' => $user->name,
                    'avatar_url' => $user->avatar_url,
                    'provider' => $user->provider,
                    'provider_id' => $user->provider_id,
                    'is_active' => $user->is_active,
                    'created_at' => $user->created_at,
                ]);
            }

            Log::info("User {$user->email} synced with Supabase successfully");
        } catch (\Exception $e) {
            // Log error but don't fail the registration
            Log::error('Supabase sync failed: ' . $e->getMessage());
        }
    }

    /**
     * Update user metadata in Supabase
     */
    private function updateSupabaseUserMetadata($supabaseUrl, $supabaseKey, $userId, array $metadata)
    {
        try {
            Http::withHeaders([
                'apikey' => $supabaseKey,
                'Authorization' => 'Bearer ' . $supabaseKey,
                'Content-Type' => 'application/json',
                'Prefer' => 'return=representation',
            ])->patch("{$supabaseUrl}/rest/v1/users?id=eq.{$userId}", [
                'name' => $metadata['name'] ?? null,
                'avatar_url' => $metadata['avatar_url'] ?? null,
                'provider' => $metadata['provider'] ?? null,
                'last_login_at' => $metadata['last_login_at'] ?? null,
                'updated_at' => now(),
            ]);
        } catch (\Exception $e) {
            Log::warning('Failed to update Supabase user metadata: ' . $e->getMessage());
        }
    }

    /**
     * Handle logout
     */
    public function logout()
    {
        Auth::logout();
        request()->session()->invalidate();
        request()->session()->regenerateToken();
        
        return redirect('/');
    }
}
