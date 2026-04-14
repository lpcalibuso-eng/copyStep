<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class GoogleAuthController extends Controller
{
    /**
     * Create or update user in step2 DB after Google OAuth authentication
     * 
     * Expected request body:
     * {
     *   "id": "supabase-user-id",
     *   "email": "user@kld.edu.ph",
     *   "name": "John Doe",
     *   "avatar_url": "https://lh3.googleusercontent.com/...",
     * }
     * 
     * Returns:
     * {
     *   "success": true,
     *   "user": { user data },
     *   "message": "User created/updated successfully"
     * }
     */
    public function googleLogin(Request $request)
    {
        try {
            Log::info('🔐 Google OAuth Login Handler - Start', [
                'id' => $request->input('id'),
                'email' => $request->input('email'),
                'name' => $request->input('name'),
            ]);

            // Validate required fields
            $validated = $request->validate([
                'id' => 'required|string|uuid', // Supabase user ID
                'email' => 'required|email',
                'name' => 'required|string',
                'avatar_url' => 'nullable|string|url',
            ]);

            $supabaseId = $validated['id']; // Use Supabase ID as step2 DB id
            $email = $validated['email'];
            $name = $validated['name'];
            $avatarUrl = $validated['avatar_url'] ?? null;

            // ========== FIND OR CREATE USER ==========
            $user = User::where('email', $email)->first();

            if ($user) {
                // Update existing user
                Log::info('📝 Updating existing Google user', ['email' => $email, 'id' => $supabaseId]);
                
                $user->update([
                    'avatar_url' => $avatarUrl,
                    'email_verified_at' => $user->email_verified_at ?? now(),
                    'last_login_at' => now(),
                ]);
                
                $message = 'User updated successfully';
            } else {
                // Create new user with SAME ID as Supabase
                Log::info('✨ Creating new Google user', [
                    'email' => $email,
                    'supabase_id' => $supabaseId,
                ]);
                
                // Get default role (Student)
                $defaultRole = Role::where('slug', 'student')->first();
                
                if (!$defaultRole) {
                    Log::warning('⚠️  Default student role not found');
                    return response()->json([
                        'success' => false,
                        'message' => 'Default role not configured',
                    ], 500);
                }

                // Create user with SAME ID as Supabase user
                $user = User::create([
                    'id' => $supabaseId, // USE SUPABASE ID - SAME AS SUPABASE USER ID
                    'role_id' => $defaultRole->id,
                    'name' => $name,
                    'email' => $email,
                    'avatar_url' => $avatarUrl,
                    'email_verified_at' => now(), // Google emails are verified
                    'profile_completed' => false, // User may need to complete profile
                    'status' => 'active',
                    'last_login_at' => now(),
                ]);

                Log::info('✅ Google user created in step2 DB', [
                    'user_id' => $user->id,
                    'email' => $user->email,
                ]);
                
                $message = 'User created successfully';
            }

            // Load the role relationship
            $user->load('role');

            // ✅ Authenticate the user in Laravel session
            Auth::login($user);
            Log::info('✅ User authenticated in Laravel session', [
                'user_id' => $user->id,
                'email' => $user->email,
            ]);

            return response()->json([
                'success' => true,
                'user' => $user,
                'message' => $message,
            ], 200);

        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::warning('❌ Google OAuth validation error', [
                'errors' => $e->errors(),
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $e->errors(),
            ], 422);

        } catch (\Exception $e) {
            Log::error('❌ Google OAuth error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'An error occurred during Google login: ' . $e->getMessage(),
            ], 500);
        }
    }
}
