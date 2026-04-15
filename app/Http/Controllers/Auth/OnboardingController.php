<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Course;
use App\Models\Institute;
use App\Models\Role;
use App\Models\StudentCsgOfficer;
use App\Models\TeacherAdviser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;

class OnboardingController extends Controller
{
    /**
     * Complete the first step of onboarding
     * 
     * Uses a Database Transaction to ensure atomicity:
     * Step A: Update the user record (role_id, phone)
     * Step B: If student → insert into students_csg_officers with course_id
     * Step C: If professor → insert into teacher_adviser with institute_id
     * Step D: Mark profile_completed = true
     * 
     * Request body:
     * {
     *   "user_id": "uuid",
     *   "email": "user@kld.edu.ph",
     *   "role": "student" or "professor",
     *   "student_id": "STU001" (if student),
     *   "course_id": "uuid" (if student),
     *   "employee_id": "EMP001" (if professor),
     *   "institute_id": "uuid" (if professor),
     *   "phone_number": "09xxxxxxxxx" (optional)
     * }
     */
    // public function complete(Request $request)
    // {
    //     try {
    //         Log::info('🎯 Onboarding Start', [
    //             'user_id' => $request->input('user_id'),
    //             'email' => $request->input('email'),
    //             'role' => $request->input('role'),
    //         ]);

    //         // // Validate request
    //         // $validated = $request->validate([
    //         //     'user_id' => 'required|string|uuid',
    //         //     'email' => 'required|email',
    //         //     'role' => 'required|in:student,professor',
    //         //     'phone_number' => 'nullable|string',
    //         //     // Student fields
    //         //     'student_id' => 'required_if:role,student|string',
    //         //     'course_id' => 'required_if:role,student|string',
    //         //     // Professor fields
    //         //     'employee_id' => 'required_if:role,professor|string',
    //         //     'institute_id' => 'required_if:role,professor|string',
    //         // ]);

    //         // 1. Validate based on your SQL table types
    //         $validated = $request->validate([
    //             'user_id'      => 'required|string|uuid',
    //             'email'        => 'required|email',
    //             'role'         => 'required|string', 
    //             'phone_number' => 'nullable|string',
    //             // Relationships
    //             'student_id'   => 'required_if:role,student|string',
    //             'course_id'    => 'required_if:role,student|string',
    //             'employee_id'  => 'required_if:role,professor|string',
    //             'institute_id' => 'required_if:role,professor|string',
    //         ]);

    //         // $userId = $validated['user_id'];
    //         // $role = $validated['role'];

    //         $user = User::findOrFail($validated['user_id']);
    //     $roleStr = strtolower($validated['role']); // Handle casing issues

    //         // ========== FIND USER ==========
    //         $user = User::find($userId);
    //         if (!$user) {
    //             Log::error('❌ User not found', ['user_id' => $userId]);
    //             return response()->json([
    //                 'success' => false,
    //                 'message' => 'User not found',
    //             ], 404);
    //         }

    //         // ========== VALIDATE FOREIGN KEY REFERENCES ==========
    //         if ($role === 'Student') {
    //             $course = Course::find($validated['course_id']);
    //             if (!$course) {
    //                 Log::error('❌ Course not found', ['course_id' => $validated['course_id']]);
    //                 return response()->json([
    //                     'success' => false,
    //                     'message' => 'Selected course does not exist. Please choose a valid course.',
    //                 ], 422);
    //             }
    //         }

    //         if ($role === 'Ordinary Teacher') {
    //             $institute = Institute::find($validated['institute_id']);
    //             if (!$institute) {
    //                 Log::error('❌ Institute not found', ['institute_id' => $validated['institute_id']]);
    //                 return response()->json([
    //                     'success' => false,
    //                     'message' => 'Selected institute does not exist. Please choose a valid institute.',
    //                 ], 422);
    //             }
    //         }

    //         // ========== BEGIN DATABASE TRANSACTION ==========
    //         $result = DB::transaction(function () use ($validated, $user, $role) {

    //             $phoneNumber = $validated['phone_number'] ?? null;

    //             // ------ Step A: Update user record (role_id, phone) ------
    //             $updateData = [
    //                 'profile_completed' => true,
    //             ];

    //             // Update role_id based on selected role
    //             if ($role === 'Student') {
    //                 $studentRole = Role::where('slug', 'student')->first();
    //                 if ($studentRole) {
    //                     $updateData['role_id'] = $studentRole->id;
    //                 }
    //             } elseif ($role === 'Ordinary Teacher') {
    //                 $teacherRole = Role::where('slug', 'teacher')->first();
    //                 if ($teacherRole) {
    //                     $updateData['role_id'] = $teacherRole->id;
    //                 }
    //             }

    //             // Update phone number if provided
    //             if ($phoneNumber) {
    //                 $updateData['phone'] = $phoneNumber;
    //             }

    //             $user->update($updateData);

    //             Log::info('✅ Step A: User record updated', [
    //                 'user_id' => $user->id,
    //                 'role_id' => $updateData['role_id'] ?? $user->role_id,
    //                 'phone' => $phoneNumber,
    //             ]);

    //             // ------ Step B: If student → insert into student_csg_officers ------
    //             if ($role === 'Student') {
    //                 $studentId = $validated['student_id'];
    //                 $courseId = $validated['course_id'];

    //                 // Check if student record already exists for this user
    //                 $existingRecord = StudentCsgOfficer::where('user_id', $user->id)->first();

    //                 if ($existingRecord) {
    //                     $existingRecord->update([
    //                         'id' => $studentId,
    //                         'course_id' => $courseId,
    //                     ]);
    //                     Log::info('📝 Step B: Student record updated', [
    //                         'student_id' => $studentId,
    //                         'course_id' => $courseId,
    //                     ]);
    //                     $roleRecord = $existingRecord;
    //                     $message = 'Student record updated successfully';
    //                 } else {
    //                     $roleRecord = StudentCsgOfficer::create([
    //                         'id' => $studentId,
    //                         'user_id' => $user->id,
    //                         'course_id' => $courseId,
    //                         'is_csg' => false,
    //                         'csg_is_active' => true,
    //                     ]);
    //                     Log::info('✨ Step B: Student record created', [
    //                         'student_id' => $studentId,
    //                         'course_id' => $courseId,
    //                     ]);
    //                     $message = 'Student record created successfully';
    //                 }

    //                 return [
    //                     'message' => $message,
    //                     'record' => $roleRecord->load('course'),
    //                     'type' => 'student',
    //                 ];
    //             }

    //             // ------ Step C: If professor → insert into teacher_adviser ------
    //             if ($role === 'Ordinary Teacher') {
    //                 $employeeId = $validated['employee_id'];
    //                 $instituteId = $validated['institute_id'];

    //                 // Check if teacher record already exists for this user
    //                 $existingRecord = TeacherAdviser::where('user_id', $user->id)->first();

    //                 if ($existingRecord) {
    //                     $existingRecord->update([
    //                         'id' => $employeeId,
    //                         'institute_id' => $instituteId,
    //                     ]);
    //                     Log::info('📝 Step C: Teacher record updated', [
    //                         'employee_id' => $employeeId,
    //                         'institute_id' => $instituteId,
    //                     ]);
    //                     $roleRecord = $existingRecord;
    //                     $message = 'Teacher record updated successfully';
    //                 } else {
    //                     $roleRecord = TeacherAdviser::create([
    //                         'id' => $employeeId,
    //                         'user_id' => $user->id,
    //                         'institute_id' => $instituteId,
    //                         'is_adviser' => false,
    //                     ]);
    //                     Log::info('✨ Step C: Teacher record created', [
    //                         'employee_id' => $employeeId,
    //                         'institute_id' => $instituteId,
    //                     ]);
    //                     $message = 'Teacher record created successfully';
    //                 }

    //                 return [
    //                     'message' => $message,
    //                     'record' => $roleRecord->load('institute'),
    //                     'type' => 'teacher',
    //                 ];
    //             }
    //         });
    //         // ========== END TRANSACTION ==========

    //         Log::info('✅ Onboarding completed within transaction', [
    //             'user_id' => $user->id,
    //             'role' => $role,
    //         ]);

    //         return response()->json([
    //             'success' => true,
    //             'message' => $result['message'],
    //             $result['type'] . '_record' => $result['record'],
    //             'user_onboarded' => true,
    //         ], 200);

    //     } catch (\Illuminate\Validation\ValidationException $e) {
    //         Log::warning('❌ Onboarding validation error', [
    //             'errors' => $e->errors(),
    //         ]);

    //         return response()->json([
    //             'success' => false,
    //             'message' => 'Validation error',
    //             'errors' => $e->errors(),
    //         ], 422);

    //     } catch (\Exception $e) {
    //         Log::error('❌ Onboarding error (transaction rolled back)', [
    //             'error' => $e->getMessage(),
    //             'trace' => $e->getTraceAsString(),
    //         ]);

    //         return response()->json([
    //             'success' => false,
    //             'message' => 'An error occurred: ' . $e->getMessage(),
    //         ], 500);
    //     }
    // }

public function complete(Request $request)
    {
        try {
            Log::info('🎯 Onboarding Start', $request->all());

            // 1. Validate based on your SQL table types
            $validated = $request->validate([
                'user_id'      => 'required|string|uuid',
                'email'        => 'required|email',
                'role'         => 'required|string', 
                'phone_number' => 'nullable|string',
                // Relationships
                'student_id'   => 'nullable|required_if:role,student|string',
                'course_id'    => 'nullable|required_if:role,student|string',
                'employee_id'  => 'nullable|required_if:role,teacher,professor|string',
                'institute_id' => 'nullable|required_if:role,teacher,professor|string',
            ]);

            $userId = $validated['user_id'];
            $role   = strtolower($validated['role']); // Force lowercase to match slugs

            // 2. Database Transaction to ensure both tables update together
            $result = DB::transaction(function () use ($validated, $userId, $role) {
                $user = User::findOrFail($userId);

                // Step A: Update User Role & Profile Status
                // Maps 'student' -> role_id for student, 'professor' -> role_id for teacher
                $roleRecord = Role::where('slug', $role === 'professor' ? 'teacher' : $role)->first();
                
                $user->update([
                    'role_id'           => $roleRecord->id ?? $user->role_id,
                    'phone'             => $validated['phone_number'] ?? $user->phone,
                    'profile_completed' => true,
                ]);

                // Step B: Connect Student to Course
                if ($role === 'student') {
                    $roleRecord = Role::where('slug', 'student')->first();
                    StudentCsgOfficer::updateOrCreate(
                        ['user_id' => $userId],
                        [
                            'id'            => $validated['student_id'],
                            'course_id'     => $validated['course_id'],
                            'is_csg'        => false,
                            'csg_is_active' => true,
                        ]
                    );
                    return ['type' => 'student', 'message' => 'Student linked to course successfully'];
                }

                // Step C: Connect Teacher to Institute
                if ($role === 'professor' || $role === 'teacher') {
                    $roleRecord = Role::where('slug', 'teacher')->first();

                    // Current DB schema has teacher_adviser.institute_id constrained to permission.id.
                    // To prevent FK crashes during onboarding, only persist institute_id when it matches permission IDs.
                    $teacherInstituteId = $validated['institute_id'] ?? null;
                    if ($teacherInstituteId) {
                        $isValidForeignKey = DB::table('permission')
                            ->where('id', $teacherInstituteId)
                            ->exists();

                        if (!$isValidForeignKey) {
                            Log::warning('⚠️ Onboarding teacher institute_id does not match current FK target (permission.id). Saving as NULL.', [
                                'user_id' => $userId,
                                'provided_institute_id' => $teacherInstituteId,
                            ]);
                            $teacherInstituteId = null;
                        }
                    }

                    TeacherAdviser::updateOrCreate(
                        ['user_id' => $userId],
                        [
                            'id'           => $validated['employee_id'],
                            'institute_id' => $teacherInstituteId,
                            'is_adviser'   => false,
                        ]
                    );
                    return ['type' => 'teacher', 'message' => 'Teacher linked to institute successfully'];
                }
            });

            return response()->json([
                'success' => true,
                'message' => $result['message'],
                'user_onboarded' => true,
            ], 200);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            Log::error('❌ Onboarding Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Connection failed: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Set password for user (Step D of onboarding)
     * Allows users to set a STEP account password for shared device access
     * 
     * Request body:
     * {
     *   "user_id": "uuid",
     *   "password": "your-password",
     *   "password_confirmation": "your-password"
     * }
     */
    public function setPassword(Request $request)
    {
        try {
            Log::info('🔒 Set Password - Start', [
                'user_id' => $request->input('user_id'),
            ]);

            $validated = $request->validate([
                'user_id' => 'required|string|uuid',
                'password' => 'required|string|min:8|confirmed',
            ]);

            $user = User::find($validated['user_id']);
            if (!$user) {
                Log::error('❌ User not found', ['user_id' => $validated['user_id']]);
                return response()->json([
                    'success' => false,
                    'message' => 'User not found',
                ], 404);
            }

            // Step D: Hash password and update user
            DB::transaction(function () use ($user, $validated) {
                $user->update([
                    'password' => Hash::make($validated['password']),
                ]);
            });

            Log::info('✅ Password set successfully', [
                'user_id' => $user->id,
                'email' => $user->email,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Password set successfully',
                'user_id' => $user->id,
            ], 200);

        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::warning('❌ Password validation error', [
                'errors' => $e->errors(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $e->errors(),
            ], 422);

        } catch (\Exception $e) {
            Log::error('❌ Set password error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'An error occurred: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get courses for dropdown (used by frontend)
     * Returns all active courses
     */
    // public function getCourses()
    // {
    //     try {
    //         $courses = Course::where('archive', 0)->get();

    //         return response()->json([
    //             'success' => true,
    //             'courses' => $courses,
    //         ], 200);

    //     } catch (\Exception $e) {
    //         Log::error('❌ Get courses error', [
    //             'error' => $e->getMessage(),
    //         ]);

    //         return response()->json([
    //             'success' => false,
    //             'message' => 'Failed to fetch courses',
    //         ], 500);
    //     }
    // }

    public function getCourses()
{
    try {
        // Force the correct table name from your SQL
        $courses = DB::table('course')->where('archive', 0)->get();
        return response()->json(['success' => true, 'courses' => $courses], 200);
    } catch (\Exception $e) {
        return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
    }
}


    /**
     * Get institutes for dropdown (used by frontend)
     * Returns all active institutes
     */
    // public function getInstitutes()
    // {
    //     try {
    //         $institutes = Institute::where('archive', 0)->get();

    //         return response()->json([
    //             'success' => true,
    //             'institutes' => $institutes,
    //         ], 200);

    //     } catch (\Exception $e) {
    //         Log::error('❌ Get institutes error', [
    //             'error' => $e->getMessage(),
    //         ]);

    //         return response()->json([
    //             'success' => false,
    //             'message' => 'Failed to fetch institutes',
    //         ], 500);
    //     }
    // }

    public function getInstitutes()
{
    try {
        // Force the correct table name from your SQL
        $institutes = DB::table('institute')->where('archive', 0)->get();
        return response()->json(['success' => true, 'institutes' => $institutes], 200);
    } catch (\Exception $e) {
        return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
    }
}


}
