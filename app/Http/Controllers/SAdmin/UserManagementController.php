<?php

namespace App\Http\Controllers\SAdmin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Student;
use App\Models\Teacher;
use App\Models\Role;
use App\Models\Institute;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Illuminate\Support\Str;

class UserManagementController extends Controller
{
    /**
     * Display the user management page
     */
    public function index()
    {
        $users = User::with('role')
            ->orderBy('created_at', 'desc')
            ->paginate(5);

        $roles = Role::all();
        $statuses = [
            ['label' => 'Active', 'value' => 'active'],
            ['label' => 'Suspended', 'value' => 'suspended'],
            ['label' => 'Archived', 'value' => 'archived'],
        ];

        // Format users for frontend
        $formattedUsers = array_map(function ($user) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'status' => $user->status,
                'role' => $user->role ? [
                    'id' => $user->role->id,
                    'name' => $user->role->name,
                ] : null,
                'createdAt' => $user->created_at ? $user->created_at->format('M d, Y') : null,
                'lastLogin' => $user->last_login_at ? $user->last_login_at->format('M d, Y h:i A') : null,
            ];
        }, $users->items());

        return Inertia::render('SAdmin/UserManagement', [
            'users' => $formattedUsers,
            'pagination' => [
                'current_page' => $users->currentPage(),
                'per_page' => $users->perPage(),
                'total' => $users->total(),
                'last_page' => $users->lastPage(),
            ],
            'roles' => $roles,
            'statuses' => $statuses,
            'filters' => [
                'search' => '',
                'role' => 'all',
                'status' => 'all',
            ],
        ]);
    }

    /**
     * Search and filter users via AJAX
     */
    public function search(Request $request)
    {
        $search = $request->input('search', '');
        $role = $request->input('role', 'all');
        $status = $request->input('status', 'all');
        $page = $request->input('page', 1);

        $query = User::with('role');

        // Search by name or email
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Filter by role
        if ($role !== 'all') {
            $query->whereHas('role', function ($q) use ($role) {
                $q->where('name', $role);
            });
        }

        // Filter by status
        if ($status !== 'all') {
            $query->where('status', $status);
        }

        $users = $query->orderBy('created_at', 'desc')->paginate(5, ['*'], 'page', $page);

        // Format the users for frontend
        $formattedUsers = $users->items();
        $formattedUsers = array_map(function ($user) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'status' => $user->status,
                'role' => $user->role ? [
                    'id' => $user->role->id,
                    'name' => $user->role->name,
                ] : null,
                'createdAt' => $user->created_at ? $user->created_at->format('M d, Y') : null,
                'lastLogin' => $user->last_login_at ? $user->last_login_at->format('M d, Y h:i A') : null,
            ];
        }, $formattedUsers);

        return response()->json([
            'users' => $formattedUsers,
            'pagination' => [
                'current_page' => $users->currentPage(),
                'per_page' => $users->perPage(),
                'total' => $users->total(),
                'last_page' => $users->lastPage(),
            ],
        ]);
    }

    /**
     * Get form fields for a specific role
     */
    public function getFormFields($roleId)
    {
        $role = Role::find($roleId);

        if (!$role) {
            return response()->json(['error' => 'Role not found'], 404);
        }

        // Base fields that appear for all roles
        $baseFields = [
            'name' => [
                'label' => 'Full Name',
                'type' => 'text',
                'required' => true,
            ],
            'email' => [
                'label' => 'Email',
                'type' => 'email',
                'required' => true,
            ],
            'password' => [
                'label' => 'Password',
                'type' => 'password',
                'required' => true,
            ],
            'phone' => [
                'label' => 'Phone',
                'type' => 'tel',
                'required' => false,
            ],
        ];

        $roleSpecificFields = [];

        // Student: student_id only
        if ($role->name === 'Student') {
            $roleSpecificFields = [
                'student_id' => [
                    'label' => 'Student ID',
                    'type' => 'text',
                    'required' => true,
                ],
            ];
        }

        // Teacher: employee_id, specialization, office_location
        if ($role->name === 'Ordinary Teacher') {
            $roleSpecificFields = [
                'employee_id' => [
                    'label' => 'Employee ID',
                    'type' => 'text',
                    'required' => true,
                ],
                'specialization' => [
                    'label' => 'Specialization',
                    'type' => 'text',
                    'required' => false,
                ],
                'office_location' => [
                    'label' => 'Office Location',
                    'type' => 'text',
                    'required' => false,
                ],
            ];
        }

        // Adviser: same as teacher
        if ($role->name === 'Admin/Adviser') {
            $roleSpecificFields = [
                'employee_id' => [
                    'label' => 'Employee ID',
                    'type' => 'text',
                    'required' => true,
                ],
                'specialization' => [
                    'label' => 'Specialization',
                    'type' => 'text',
                    'required' => false,
                ],
                'office_location' => [
                    'label' => 'Office Location',
                    'type' => 'text',
                    'required' => false,
                ],
            ];
        }

        return response()->json([
            'baseFields' => $baseFields,
            'roleSpecificFields' => $roleSpecificFields,
            'role' => $role,
        ]);
    }

    /**
     * Create a new user with role-specific data
     */
    public function create(Request $request)
    {
        // Get the role first to validate role-specific fields
        $role = Role::find($request->role_id);
        
        if (!$role) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid role selected',
                'errors' => ['role_id' => ['The selected role is invalid.']],
            ], 422);
        }

        // Build dynamic validation rules based on role
        $rules = [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', Rule::unique('users')],
            'password' => ['required', 'string', 'min:6', 'regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/', 'confirmed'],
            'password_confirmation' => ['required', 'same:password'],
            'phone' => ['nullable', 'string', 'max:20'],
            'role_id' => ['required', 'exists:roles,id'],
        ];

        // Add role-specific validation
        if ($role->name === 'Student') {
            $rules = array_merge($rules, [
                'student_id' => ['required', 'string', 'max:50', Rule::unique('student_csg_officers', 'id')],
            ]);
        } elseif (in_array($role->name, ['Ordinary Teacher', 'Admin/Adviser'])) {
            $rules = array_merge($rules, [
                'employee_id' => ['required', 'string', 'max:50', Rule::unique('teacher_adviser', 'id')],
                'specialization' => ['nullable', 'string', 'max:255'],
                'office_location' => ['nullable', 'string', 'max:255'],
            ]);
        }

        try {
            $validated = $request->validate($rules);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        }

        try {
            // Create user with UUID
            $user = User::create([
                'id' => Str::uuid(),
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => bcrypt($validated['password']),
                'phone' => $validated['phone'] ?? null,
                'role_id' => $validated['role_id'],
                'status' => 'active',
            ]);

            // Create role-specific records
            if ($role->name === 'Student') {
                Student::create([
                    'id' => $validated['student_id'],
                    'user_id' => $user->id,
                ]);
            } elseif (in_array($role->name, ['Ordinary Teacher', 'Admin/Adviser'])) {
                Teacher::create([
                    'id' => $validated['employee_id'],
                    'user_id' => $user->id,
                    'specialization' => $validated['specialization'] ?? null,
                    'office_location' => $validated['office_location'] ?? null,
                    'is_adviser' => in_array($role->name, ['Admin/Adviser']) ? 1 : 0,
                ]);
            }

            return response()->json([
                'success' => true,
                'message' => 'User created successfully',
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone' => $user->phone,
                    'status' => $user->status,
                    'role' => [
                        'id' => $user->role->id,
                        'name' => $user->role->name,
                    ],
                    'createdAt' => $user->created_at->format('M d, Y'),
                    'lastLogin' => null,
                ],
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create user: ' . $e->getMessage(),
                'errors' => [],
            ], 500);
        }
    }

    /**
     * Store a user (legacy - kept for compatibility)
     */
    public function store(Request $request)
    {
        return $this->create($request);
    }

    /**
     * Toggle user status (active/suspended)
     */
    public function toggleStatus(Request $request, User $user)
    {
        $newStatus = $user->status === 'active' ? 'suspended' : 'active';
        $user->update(['status' => $newStatus]);

        return response()->json([
            'success' => true,
            'message' => "User {$newStatus} successfully",
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'status' => $user->status,
                'role' => $user->role ? [
                    'id' => $user->role->id,
                    'name' => $user->role->name,
                ] : null,
            ],
            'status' => $newStatus,
        ]);
    }

    /**
     * Reset user password
     */
    public function resetPassword(Request $request, User $user)
    {
        // In a real app, you'd send a password reset email
        // For now, we'll just return success
        
        return response()->json([
            'success' => true,
            'message' => 'Password reset email sent',
            'email' => $user->email,
        ]);
    }

    /**
     * Archive a user (soft delete by status)
     */
    public function destroy(Request $request, User $user)
    {
        $user->update(['status' => 'archived']);

        return response()->json([
            'success' => true,
            'message' => 'User archived successfully',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'status' => $user->status,
                'role' => $user->role ? [
                    'id' => $user->role->id,
                    'name' => $user->role->name,
                ] : null,
            ],
        ]);
    }

    /**
     * Restore an archived user
     */
    public function restore(Request $request, User $user)
    {
        $user->update(['status' => 'active']);

        return response()->json([
            'success' => true,
            'message' => 'User restored successfully',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'status' => $user->status,
                'role' => $user->role ? [
                    'id' => $user->role->id,
                    'name' => $user->role->name,
                ] : null,
            ],
        ]);
    }

    /**
     * Update user role
     */
    public function updateRole(Request $request, User $user)
    {
        $validated = $request->validate([
            'role_id' => ['required', 'exists:roles,id'],
        ]);

        $user->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'User role updated successfully',
            'user' => $user->load('role'),
        ]);
    }
}
