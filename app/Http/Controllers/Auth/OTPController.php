<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Student;
use App\Models\Teacher;
use App\Mail\OTPMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;

class OTPController extends Controller
{
    /**
     * Send OTP code to user's email
     */
    public function sendOTP(Request $request)
    {
        try {
            $request->validate([
                'email' => 'required|email|unique:users',
                'firstName' => 'required|string',
                'lastName' => 'required|string',
                'password' => 'required|string|min:8',
                'role_id' => 'required|exists:roles,id',
            ]);

            // Generate 6-digit OTP
            $otp = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
            
            // Store OTP in cache with 10 minutes expiration
            // Key format: otp_{email}
            Cache::put("otp_{$request->email}", [
                'otp' => $otp,
                'firstName' => $request->firstName,
                'lastName' => $request->lastName,
                'password' => $request->password,
                'role_id' => $request->role_id,
            ], now()->addMinutes(10));

            // Send OTP via email
            $this->sendOTPEmail($request->email, $request->firstName, $otp);

            return response()->json([
                'success' => true,
                'message' => 'OTP sent successfully to your email',
            ], 200);

        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Send OTP Validation Error:', [
                'email' => $request->email ?? 'N/A',
                'errors' => $e->errors(),
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            Log::error('Send OTP Error:', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to send OTP: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Verify OTP and create user account
     */
    public function verifyOTP(Request $request)
    {
        try {
            $request->validate([
                'email' => 'required|email',
                'otp' => 'required|string|size:6',
            ]);

            // Retrieve OTP data from cache
            $otpData = Cache::get("otp_{$request->email}");

            if (!$otpData) {
                return response()->json([
                    'success' => false,
                    'message' => 'OTP expired or invalid. Please request a new one.',
                ], 400);
            }

            // Verify OTP matches
            if ($otpData['otp'] !== $request->otp) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid OTP code. Please try again.',
                ], 400);
            }

            // Create user account in STEP2 database
            $user = User::create([
                'id' => Str::uuid(),
                'name' => $otpData['firstName'] . ' ' . $otpData['lastName'],
                'email' => $request->email,
                'password' => Hash::make($otpData['password']),
                'role_id' => $otpData['role_id'],
                'status' => 'active',
                'email_verified_at' => now(),
                'avatar_url' => $this->getGmailProfilePicture($request->email),
                'profile_completed' => false, // Mark profile as incomplete
            ]);

            // Create Supabase Auth user
            $this->createSupabaseAuthUser(
                $request->email,
                $otpData['password'],
                $otpData['firstName'],
                $otpData['lastName']
            );

            // Clear the OTP from cache
            Cache::forget("otp_{$request->email}");

            // Log the user in
            Auth::login($user);

            return response()->json([
                'success' => true,
                'message' => 'Email verified successfully! Your account has been created.',
                'user' => $user,
                'profile_completed' => false,
                'redirect' => 'complete-profile', // Redirect to profile completion page
            ], 200);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            Log::error('Verify OTP Error:', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Verification failed: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Resend OTP code to user's email
     */
    public function resendOTP(Request $request)
    {
        try {
            $request->validate([
                'email' => 'required|email',
            ]);

            // Retrieve OTP data from cache
            $otpData = Cache::get("otp_{$request->email}");

            if (!$otpData) {
                return response()->json([
                    'success' => false,
                    'message' => 'No pending OTP found. Please register again.',
                ], 400);
            }

            // Generate new 6-digit OTP
            $otp = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
            
            // Update OTP in cache
            $otpData['otp'] = $otp;
            Cache::put("otp_{$request->email}", $otpData, now()->addMinutes(10));

            // Send new OTP via email
            $this->sendOTPEmail($request->email, $otpData['firstName'], $otp);

            return response()->json([
                'success' => true,
                'message' => 'New OTP sent to your email',
            ], 200);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            Log::error('Resend OTP Error:', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to resend OTP: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Send OTP via Laravel Mail (Simple & Reliable)
     */
    private function sendOTPEmail($email, $firstName, $otp)
    {
        try {
            Log::info("📧 Sending OTP email to: $email", ['firstName' => $firstName]);

            // Send using Laravel Mail
            Mail::to($email)->send(new OTPMail($firstName, $otp));

            Log::info("✅ OTP Email sent successfully to: $email", [
                'otp' => $otp,
                'firstName' => $firstName,
                'method' => 'Laravel Mail'
            ]);

        } catch (\Exception $e) {
            Log::error("❌ Failed to send OTP email to $email: " . $e->getMessage(), [
                'exception' => get_class($e),
                'email' => $email
            ]);
            
            // Log OTP as fallback for debugging
            Log::info("📧 OTP Code for $email: $otp (Failed to send via email - check logs)");
        }
    }

    /**
     * Get Gmail profile picture URL using Gravatar as fallback
     * Gmail profile pictures can be retrieved via Google API or Gravatar
     */
    private function getGmailProfilePicture($email)
    {
        try {
            // Use Gravatar as the profile picture service
            // Gravatar is linked to Gmail accounts and provides consistent avatars
            $hash = md5(strtolower(trim($email)));
            $gravatarUrl = "https://www.gravatar.com/avatar/{$hash}?s=400&d=identicon";
            
            return $gravatarUrl;
        } catch (\Exception $e) {
            Log::warning("Failed to get Gravatar profile picture for: $email", ['error' => $e->getMessage()]);
            // Return a default avatar URL if Gravatar fails
            return "https://www.gravatar.com/avatar/default?s=400&d=identicon";
        }
    }

    /**
     * Complete user profile - called after user fills in additional information
     */
    public function completeProfile(Request $request)
    {
        try {
            $request->validate([
                'phone' => 'nullable|string|max:20',
                'profile_data' => 'nullable|array', // For additional profile fields if needed
            ]);

            $user = Auth::user();

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized. Please log in first.',
                ], 401);
            }

            // Update user profile - use fill() and save()
            $user->fill([
                'phone' => $request->phone ?? $user->phone,
                'profile_completed' => true,
            ])->save();

            // Create role-specific profile if needed
            $this->createRoleSpecificProfile($user);

            return response()->json([
                'success' => true,
                'message' => 'Profile completed successfully!',
                'user' => $user,
                'profile_completed' => true,
            ], 200);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            Log::error('Complete Profile Error:', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to complete profile: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Create role-specific profile (Student, Teacher, etc.)
     */
    private function createRoleSpecificProfile($user)
    {
        try {
            // Get role name to determine which table to create profile in
            $role = $user->role;
            
            if ($role && $role->name === 'student') {
                // Create student profile if it doesn't exist
                Student::firstOrCreate(
                    ['user_id' => $user->id],
                    [
                        'id' => 'STU_' . $user->id,
                        'adviser_id' => null,
                        'archived' => false,
                    ]
                );
            } elseif ($role && $role->name === 'teacher') {
                // Create teacher profile if it doesn't exist
                Teacher::firstOrCreate(
                    ['user_id' => $user->id],
                    [
                        'id' => 'TEA_' . $user->id,
                        'department' => null,
                        'archived' => false,
                    ]
                );
            }
        } catch (\Exception $e) {
            Log::warning('Failed to create role-specific profile', ['error' => $e->getMessage()]);
            // Don't throw - this is non-critical
        }
    }

    /**
     * Check if user profile is complete
     */
    public function checkProfileStatus(Request $request)
    {
        try {
            $user = Auth::user();

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized. Please log in first.',
                ], 401);
            }

            return response()->json([
                'success' => true,
                'profile_completed' => $user->profile_completed,
                'user' => $user,
            ], 200);

        } catch (\Exception $e) {
            Log::error('Check Profile Status Error:', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to check profile status: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Create user in Supabase Auth (Backend - Server-side)
     * Using Service Role Key for secure backend user creation
     */
    private function createSupabaseAuthUser($email, $password, $firstName, $lastName)
    {
        try {
            $supabaseUrl = env('VITE_SUPABASE_URL');
            $serviceRoleKey = env('SUPABASE_SERVICE_ROLE_KEY');

            if (!$supabaseUrl || !$serviceRoleKey) {
                Log::warning('Supabase credentials not configured', [
                    'supabaseUrl' => !empty($supabaseUrl),
                    'serviceRoleKey' => !empty($serviceRoleKey),
                ]);
                return; // Skip if not configured
            }

            Log::info("🔐 Creating Supabase Auth user for: $email");

            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $serviceRoleKey,
                'Content-Type' => 'application/json',
                'apikey' => $serviceRoleKey,
            ])->post($supabaseUrl . '/auth/v1/admin/users', [
                'email' => $email,
                'password' => $password,
                'email_confirm' => true,
                'user_metadata' => [
                    'firstName' => $firstName,
                    'lastName' => $lastName,
                    'full_name' => "$firstName $lastName",
                    'display_name' => "$firstName $lastName",
                ],
            ]);

            if ($response->failed()) {
                Log::error('❌ Failed to create Supabase Auth user', [
                    'email' => $email,
                    'status' => $response->status(),
                    'response' => $response->json(),
                ]);
                return;
            }

            Log::info("✅ Supabase Auth user created successfully for: $email");
        } catch (\Exception $e) {
            Log::error('Exception creating Supabase Auth user: ' . $e->getMessage(), [
                'email' => $email,
                'exception' => $e,
            ]);
            // Don't throw - Supabase creation is non-critical to registration flow
        }
    }
}

