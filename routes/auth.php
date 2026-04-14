<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\ApiLoginController;
use App\Http\Controllers\Auth\ConfirmablePasswordController;
use App\Http\Controllers\Auth\EmailVerificationNotificationController;
use App\Http\Controllers\Auth\EmailVerificationPromptController;
use App\Http\Controllers\Auth\InstituteController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\PasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\VerifyEmailController;
use App\Http\Controllers\Auth\OTPController;
use App\Http\Controllers\Auth\GoogleAuthController;
use App\Http\Controllers\Auth\OnboardingController;
use Illuminate\Support\Facades\Route;

Route::middleware('guest')->group(function () {
    Route::get('register', [RegisteredUserController::class, 'create'])
        ->name('register');

    Route::post('register', [RegisteredUserController::class, 'store']);

    Route::get('login', [AuthenticatedSessionController::class, 'create'])
        ->name('login');

    Route::post('login', [AuthenticatedSessionController::class, 'store']);

    // ========== API LOGIN ENDPOINT FOR REACT COMPONENT ==========
    // This endpoint accepts JSON and returns JSON with user role and redirect URL
    // Used by the React Login component for step2 database authentication
    Route::post('api/login', [ApiLoginController::class, 'login']);
    
    // Test endpoint to verify API is responding
    Route::get('api/test', function () {
        return response()->json(['message' => 'API is working', 'timestamp' => now()]);
    });
    // ===========================================================

    // ========== OTP-BASED REGISTRATION ENDPOINTS ==========
    Route::post('api/otp/send', [OTPController::class, 'sendOTP']);
    Route::post('api/otp/verify', [OTPController::class, 'verifyOTP']);
    Route::post('api/otp/resend', [OTPController::class, 'resendOTP']);
    // ======================================================

    // ========== GOOGLE OAUTH ENDPOINTS ==========
    // This creates/updates user in step2 DB after Google OAuth authentication
    // NOTE: Using withoutMiddleware to skip CSRF since OAuth comes from external provider
    Route::post('api/oauth/google-login', [GoogleAuthController::class, 'googleLogin'])
        ->withoutMiddleware('csrf');
    // ============================================

    Route::get('forgot-password', [PasswordResetLinkController::class, 'create'])
        ->name('password.request');

    Route::post('forgot-password', [PasswordResetLinkController::class, 'store'])
        ->name('password.email');

    Route::get('reset-password/{token}', [NewPasswordController::class, 'create'])
        ->name('password.reset');

    Route::post('reset-password', [NewPasswordController::class, 'store'])
        ->name('password.store');
});

// Institutes API route - accessible to everyone for registration
Route::get('institutes', [InstituteController::class, 'index']);
Route::get('institutes/{id}', [InstituteController::class, 'show']);

// OAuth callback route - accessible to everyone (will be handled by OAuthCallback component)
Route::get('callback', function () {
    return \Inertia\Inertia::render('Auth/OAuthCallback');
})->name('auth.callback');

// ==========================================

Route::middleware('auth')->group(function () {
    Route::get('verify-email', EmailVerificationPromptController::class)
        ->name('verification.notice');

    Route::get('verify-email/{id}/{hash}', VerifyEmailController::class)
        ->middleware(['signed', 'throttle:6,1'])
        ->name('verification.verify');

    Route::post('email/verification-notification', [EmailVerificationNotificationController::class, 'store'])
        ->middleware('throttle:6,1')
        ->name('verification.send');

    Route::get('confirm-password', [ConfirmablePasswordController::class, 'show'])
        ->name('password.confirm');

    Route::post('confirm-password', [ConfirmablePasswordController::class, 'store']);

    Route::put('password', [PasswordController::class, 'update'])->name('password.update');

    Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])
        ->name('logout');

    // ========== API LOGOUT ENDPOINT FOR REACT COMPONENT ==========
    // This endpoint is for JSON API calls from React components
    Route::post('api/logout', [ApiLoginController::class, 'logout']);
    // ===========================================================

    // ========== PROFILE COMPLETION ENDPOINTS ==========
    Route::post('api/profile/complete', [OTPController::class, 'completeProfile']);
    Route::get('api/profile/status', [OTPController::class, 'checkProfileStatus']);
    // ===================================================
});
