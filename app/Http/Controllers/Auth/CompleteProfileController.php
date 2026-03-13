<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class CompleteProfileController extends Controller
{
    /**
     * Show the complete profile form
     */
    public function show(): Response
    {
        return Inertia::render('Auth/CompleteProfile');
    }

    /**
     * Store the completed profile information
     */
    public function store(Request $request): RedirectResponse
    {
        // Validate the request
        $validated = $request->validate([
            'department' => 'required|string|max:255',
            'year_level' => 'required|string|max:255',
            'password' => 'nullable|string|min:8|confirmed',
        ]);

        try {
            /** @var User $user */
            $user = Auth::user();

            if (!$user) {
                return redirect()->route('login')->with('error', 'User not authenticated');
            }

            // Update user with profile information
            $user->update([
                'department' => $validated['department'],
                'year_level' => $validated['year_level'],
                'password' => $validated['password'] ? Hash::make($validated['password']) : $user->password,
            ]);

            // Assign student role if not already assigned
            if (!$user->roles()->exists()) {
                $studentRole = Role::where('slug', 'student')->first();
                if ($studentRole) {
                    $user->roles()->attach($studentRole);
                }
            }

            return redirect()->route('dashboard')->with('success', 'Profile completed successfully!');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to complete profile: ' . $e->getMessage());
        }
    }
}
