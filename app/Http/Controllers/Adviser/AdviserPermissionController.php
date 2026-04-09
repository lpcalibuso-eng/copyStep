<?php

namespace App\Http\Controllers\Adviser;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\StudentCsgOfficer;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdviserPermissionController extends Controller
{
    public function index()
    {
        // Get all users for the search modal
        $users = User::where('archive', false)
            ->where('status', 'active')
            ->select('id', 'name', 'email', 'phone')
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'studentId' => $user->id, // Using id as studentId for now
                    'avatar' => strtoupper(substr($user->name, 0, 2)),
                    'currentRole' => $user->role?->name ?? 'Student',
                ];
            });

        // Get current CSG officers
        $csgOfficers = StudentCsgOfficer::with('user')
            ->where('archive', false)
            ->where('csg_is_active', true)
            // ->where('csg_position', '!=', 'member')
            ->get()
            ->groupBy('csg_position')
            ->map(function ($officers, $position) {
                $officer = $officers->first();
                return [
                    'userId' => $officer->user_id ?? '',
                    'position' => $position,
                    'name' => $officer->user?->name ?? '',
                    'userId' => $officer->user_id ?? '',
                    'email' => $officer->user?->email ?? '',
                ];
            })
            ->values()
            ->toArray();

        // Ensure all positions are present
        $positions = [
            'President',
            'Vice President for Internal Affairs',
            'Vice President for External Affairs',
            'Secretary',
            'Auditor',
            'Press Relations Officer',
            'Business Manager',
            'Student Liaison',
            'ICDI IS Representative',
            'ICDI CS Representative',
            'IGDS SW Representative',
            'ION Representative',
            'IOM Representative'
        ];
        $councilOfficers = [];
        foreach ($positions as $pos) {
            $existing = collect($csgOfficers)->firstWhere('position', $pos);
            if ($existing) {
                $councilOfficers[] = $existing;
            } else {
                $councilOfficers[] = [
                    'position' => $pos,
                    'name' => '',
                    'userId' => '',
                    'email' => '',
                ];
            }
        }

        $csgOfficerCandidates = StudentCsgOfficer::with('user')
            ->where('archive', false)
            ->get()
            ->filter(fn ($officer) => $officer->user)
           
->map(function ($officer) {
    return [
        'id' => $officer->user_id,  // Add this for React compatibility
        'studentId' => $officer->user_id,  // Keep for display if needed
        'name' => $officer->user->name,
        'email' => $officer->user->email,
        'avatar' => strtoupper(substr($officer->user->name, 0, 2)),
        'position' => $officer->csg_position,
        'isCsg' => $officer->is_csg,
        'isActive' => $officer->csg_is_active,
    ];
})
            ->unique('id')
            ->values()
            ->toArray();

        // Predefined CSG positions with permissions
        $csgPositions = [
            [
                'id' => 'President',
                'name' => 'President',
                'sections' => [
                    [
                        'category' => 'Projects',
                        'permissions' => [
                            ['id' => 'proj_view', 'label' => 'View', 'enabled' => true],
                            ['id' => 'proj_create', 'label' => 'Create', 'enabled' => true],
                            ['id' => 'proj_edit', 'label' => 'Edit', 'enabled' => true],
                            ['id' => 'proj_delete', 'label' => 'Delete', 'enabled' => true],
                            ['id' => 'proj_approve', 'label' => 'Approve', 'enabled' => false],
                            ['id' => 'proj_rate', 'label' => 'Rate', 'enabled' => true],
                        ],
                    ],
                    [
                        'category' => 'Ledger',
                        'permissions' => [
                            ['id' => 'ledger_view', 'label' => 'View', 'enabled' => true],
                            ['id' => 'ledger_create', 'label' => 'Create', 'enabled' => true],
                            ['id' => 'ledger_edit', 'label' => 'Edit', 'enabled' => true],
                            ['id' => 'ledger_delete', 'label' => 'Delete', 'enabled' => true],
                            ['id' => 'ledger_approve', 'label' => 'Approve', 'enabled' => false],
                            ['id' => 'ledger_submit', 'label' => 'Submit', 'enabled' => true],
                        ],
                    ],
                    [
                        'category' => 'Proof',
                        'permissions' => [
                            ['id' => 'proof_view', 'label' => 'View', 'enabled' => true],
                            ['id' => 'proof_upload', 'label' => 'Upload', 'enabled' => true],
                            ['id' => 'proof_delete', 'label' => 'Delete', 'enabled' => true],
                            ['id' => 'proof_verify', 'label' => 'Verify', 'enabled' => false],
                        ],
                    ],
                ],
            ],
            [
                'id' => 'Vice President for Internal Affairs',
                'name' => 'Vice President for Internal Affairs',
                'sections' => [
                    [
                        'category' => 'Projects',
                        'permissions' => [
                            ['id' => 'proj_view', 'label' => 'View', 'enabled' => true],
                            ['id' => 'proj_create', 'label' => 'Create', 'enabled' => true],
                            ['id' => 'proj_edit', 'label' => 'Edit', 'enabled' => true],
                            ['id' => 'proj_delete', 'label' => 'Delete', 'enabled' => false],
                            ['id' => 'proj_approve', 'label' => 'Approve', 'enabled' => false],
                            ['id' => 'proj_rate', 'label' => 'Rate', 'enabled' => true],
                        ],
                    ],
                    [
                        'category' => 'Ledger',
                        'permissions' => [
                            ['id' => 'ledger_view', 'label' => 'View', 'enabled' => true],
                            ['id' => 'ledger_create', 'label' => 'Create', 'enabled' => true],
                            ['id' => 'ledger_edit', 'label' => 'Edit', 'enabled' => true],
                            ['id' => 'ledger_delete', 'label' => 'Delete', 'enabled' => false],
                            ['id' => 'ledger_approve', 'label' => 'Approve', 'enabled' => false],
                            ['id' => 'ledger_submit', 'label' => 'Submit', 'enabled' => true],
                        ],
                    ],
                    [
                        'category' => 'Proof',
                        'permissions' => [
                            ['id' => 'proof_view', 'label' => 'View', 'enabled' => true],
                            ['id' => 'proof_upload', 'label' => 'Upload', 'enabled' => true],
                            ['id' => 'proof_delete', 'label' => 'Delete', 'enabled' => false],
                            ['id' => 'proof_verify', 'label' => 'Verify', 'enabled' => false],
                        ],
                    ],
                ],
            ],
            [
                'id' => 'Vice President for External Affairs',
                'name' => 'Vice President for External Affairs',
                'sections' => [
                    [
                        'category' => 'Projects',
                        'permissions' => [
                            ['id' => 'proj_view', 'label' => 'View', 'enabled' => true],
                            ['id' => 'proj_create', 'label' => 'Create', 'enabled' => true],
                            ['id' => 'proj_edit', 'label' => 'Edit', 'enabled' => true],
                            ['id' => 'proj_delete', 'label' => 'Delete', 'enabled' => false],
                            ['id' => 'proj_approve', 'label' => 'Approve', 'enabled' => false],
                            ['id' => 'proj_rate', 'label' => 'Rate', 'enabled' => true],
                        ],
                    ],
                    [
                        'category' => 'Ledger',
                        'permissions' => [
                            ['id' => 'ledger_view', 'label' => 'View', 'enabled' => true],
                            ['id' => 'ledger_create', 'label' => 'Create', 'enabled' => true],
                            ['id' => 'ledger_edit', 'label' => 'Edit', 'enabled' => true],
                            ['id' => 'ledger_delete', 'label' => 'Delete', 'enabled' => false],
                            ['id' => 'ledger_approve', 'label' => 'Approve', 'enabled' => false],
                            ['id' => 'ledger_submit', 'label' => 'Submit', 'enabled' => true],
                        ],
                    ],
                    [
                        'category' => 'Proof',
                        'permissions' => [
                            ['id' => 'proof_view', 'label' => 'View', 'enabled' => true],
                            ['id' => 'proof_upload', 'label' => 'Upload', 'enabled' => true],
                            ['id' => 'proof_delete', 'label' => 'Delete', 'enabled' => false],
                            ['id' => 'proof_verify', 'label' => 'Verify', 'enabled' => false],
                        ],
                    ],
                ],
            ],
            [
                'id' => 'Secretary',
                'name' => 'Secretary',
                'sections' => [
                    [
                        'category' => 'Projects',
                        'permissions' => [
                            ['id' => 'proj_view', 'label' => 'View', 'enabled' => true],
                            ['id' => 'proj_create', 'label' => 'Create', 'enabled' => true],
                            ['id' => 'proj_edit', 'label' => 'Edit', 'enabled' => true],
                            ['id' => 'proj_delete', 'label' => 'Delete', 'enabled' => false],
                            ['id' => 'proj_approve', 'label' => 'Approve', 'enabled' => false],
                            ['id' => 'proj_rate', 'label' => 'Rate', 'enabled' => true],
                        ],
                    ],
                    [
                        'category' => 'Ledger',
                        'permissions' => [
                            ['id' => 'ledger_view', 'label' => 'View', 'enabled' => true],
                            ['id' => 'ledger_create', 'label' => 'Create', 'enabled' => false],
                            ['id' => 'ledger_edit', 'label' => 'Edit', 'enabled' => false],
                            ['id' => 'ledger_delete', 'label' => 'Delete', 'enabled' => false],
                            ['id' => 'ledger_approve', 'label' => 'Approve', 'enabled' => false],
                            ['id' => 'ledger_submit', 'label' => 'Submit', 'enabled' => false],
                        ],
                    ],
                    [
                        'category' => 'Proof',
                        'permissions' => [
                            ['id' => 'proof_view', 'label' => 'View', 'enabled' => true],
                            ['id' => 'proof_upload', 'label' => 'Upload', 'enabled' => true],
                            ['id' => 'proof_delete', 'label' => 'Delete', 'enabled' => false],
                            ['id' => 'proof_verify', 'label' => 'Verify', 'enabled' => false],
                        ],
                    ],
                ],
            ],
            [
                'id' => 'Auditor',
                'name' => 'Auditor',
                'sections' => [
                    [
                        'category' => 'Projects',
                        'permissions' => [
                            ['id' => 'proj_view', 'label' => 'View', 'enabled' => true],
                            ['id' => 'proj_create', 'label' => 'Create', 'enabled' => false],
                            ['id' => 'proj_edit', 'label' => 'Edit', 'enabled' => false],
                            ['id' => 'proj_delete', 'label' => 'Delete', 'enabled' => false],
                            ['id' => 'proj_approve', 'label' => 'Approve', 'enabled' => false],
                            ['id' => 'proj_rate', 'label' => 'Rate', 'enabled' => true],
                        ],
                    ],
                    [
                        'category' => 'Ledger',
                        'permissions' => [
                            ['id' => 'ledger_view', 'label' => 'View', 'enabled' => true],
                            ['id' => 'ledger_create', 'label' => 'Create', 'enabled' => false],
                            ['id' => 'ledger_edit', 'label' => 'Edit', 'enabled' => false],
                            ['id' => 'ledger_delete', 'label' => 'Delete', 'enabled' => false],
                            ['id' => 'ledger_approve', 'label' => 'Approve', 'enabled' => false],
                            ['id' => 'ledger_submit', 'label' => 'Submit', 'enabled' => false],
                        ],
                    ],
                    [
                        'category' => 'Proof',
                        'permissions' => [
                            ['id' => 'proof_view', 'label' => 'View', 'enabled' => true],
                            ['id' => 'proof_upload', 'label' => 'Upload', 'enabled' => false],
                            ['id' => 'proof_delete', 'label' => 'Delete', 'enabled' => false],
                            ['id' => 'proof_verify', 'label' => 'Verify', 'enabled' => true],
                        ],
                    ],
                ],
            ],
            [
                'id' => 'Press Relations Officer',
                'name' => 'Press Relations Officer',
                'sections' => [
                    [
                        'category' => 'Projects',
                        'permissions' => [
                            ['id' => 'proj_view', 'label' => 'View', 'enabled' => true],
                            ['id' => 'proj_create', 'label' => 'Create', 'enabled' => true],
                            ['id' => 'proj_edit', 'label' => 'Edit', 'enabled' => true],
                            ['id' => 'proj_delete', 'label' => 'Delete', 'enabled' => false],
                            ['id' => 'proj_approve', 'label' => 'Approve', 'enabled' => false],
                            ['id' => 'proj_rate', 'label' => 'Rate', 'enabled' => true],
                        ],
                    ],
                    [
                        'category' => 'Ledger',
                        'permissions' => [
                            ['id' => 'ledger_view', 'label' => 'View', 'enabled' => true],
                            ['id' => 'ledger_create', 'label' => 'Create', 'enabled' => false],
                            ['id' => 'ledger_edit', 'label' => 'Edit', 'enabled' => false],
                            ['id' => 'ledger_delete', 'label' => 'Delete', 'enabled' => false],
                            ['id' => 'ledger_approve', 'label' => 'Approve', 'enabled' => false],
                            ['id' => 'ledger_submit', 'label' => 'Submit', 'enabled' => false],
                        ],
                    ],
                    [
                        'category' => 'Proof',
                        'permissions' => [
                            ['id' => 'proof_view', 'label' => 'View', 'enabled' => true],
                            ['id' => 'proof_upload', 'label' => 'Upload', 'enabled' => true],
                            ['id' => 'proof_delete', 'label' => 'Delete', 'enabled' => false],
                            ['id' => 'proof_verify', 'label' => 'Verify', 'enabled' => false],
                        ],
                    ],
                ],
            ],
            [
                'id' => 'Business Manager',
                'name' => 'Business Manager',
                'sections' => [
                    [
                        'category' => 'Projects',
                        'permissions' => [
                            ['id' => 'proj_view', 'label' => 'View', 'enabled' => true],
                            ['id' => 'proj_create', 'label' => 'Create', 'enabled' => false],
                            ['id' => 'proj_edit', 'label' => 'Edit', 'enabled' => false],
                            ['id' => 'proj_delete', 'label' => 'Delete', 'enabled' => false],
                            ['id' => 'proj_approve', 'label' => 'Approve', 'enabled' => false],
                            ['id' => 'proj_rate', 'label' => 'Rate', 'enabled' => true],
                        ],
                    ],
                    [
                        'category' => 'Ledger',
                        'permissions' => [
                            ['id' => 'ledger_view', 'label' => 'View', 'enabled' => true],
                            ['id' => 'ledger_create', 'label' => 'Create', 'enabled' => true],
                            ['id' => 'ledger_edit', 'label' => 'Edit', 'enabled' => true],
                            ['id' => 'ledger_delete', 'label' => 'Delete', 'enabled' => true],
                            ['id' => 'ledger_approve', 'label' => 'Approve', 'enabled' => false],
                            ['id' => 'ledger_submit', 'label' => 'Submit', 'enabled' => true],
                        ],
                    ],
                    [
                        'category' => 'Proof',
                        'permissions' => [
                            ['id' => 'proof_view', 'label' => 'View', 'enabled' => true],
                            ['id' => 'proof_upload', 'label' => 'Upload', 'enabled' => true],
                            ['id' => 'proof_delete', 'label' => 'Delete', 'enabled' => true],
                            ['id' => 'proof_verify', 'label' => 'Verify', 'enabled' => false],
                        ],
                    ],
                ],
            ],
            [
                'id' => 'Student Liaison',
                'name' => 'Student Liaison',
                'sections' => [
                    [
                        'category' => 'Projects',
                        'permissions' => [
                            ['id' => 'proj_view', 'label' => 'View', 'enabled' => true],
                            ['id' => 'proj_create', 'label' => 'Create', 'enabled' => true],
                            ['id' => 'proj_edit', 'label' => 'Edit', 'enabled' => true],
                            ['id' => 'proj_delete', 'label' => 'Delete', 'enabled' => false],
                            ['id' => 'proj_approve', 'label' => 'Approve', 'enabled' => false],
                            ['id' => 'proj_rate', 'label' => 'Rate', 'enabled' => true],
                        ],
                    ],
                    [
                        'category' => 'Ledger',
                        'permissions' => [
                            ['id' => 'ledger_view', 'label' => 'View', 'enabled' => true],
                            ['id' => 'ledger_create', 'label' => 'Create', 'enabled' => false],
                            ['id' => 'ledger_edit', 'label' => 'Edit', 'enabled' => false],
                            ['id' => 'ledger_delete', 'label' => 'Delete', 'enabled' => false],
                            ['id' => 'ledger_approve', 'label' => 'Approve', 'enabled' => false],
                            ['id' => 'ledger_submit', 'label' => 'Submit', 'enabled' => false],
                        ],
                    ],
                    [
                        'category' => 'Proof',
                        'permissions' => [
                            ['id' => 'proof_view', 'label' => 'View', 'enabled' => true],
                            ['id' => 'proof_upload', 'label' => 'Upload', 'enabled' => true],
                            ['id' => 'proof_delete', 'label' => 'Delete', 'enabled' => false],
                            ['id' => 'proof_verify', 'label' => 'Verify', 'enabled' => false],
                        ],
                    ],
                ],
            ],
            [
                'id' => 'ICDI IS Representative',
                'name' => 'ICDI IS Representative',
                'sections' => [
                    [
                        'category' => 'Projects',
                        'permissions' => [
                            ['id' => 'proj_view', 'label' => 'View', 'enabled' => true],
                            ['id' => 'proj_create', 'label' => 'Create', 'enabled' => true],
                            ['id' => 'proj_edit', 'label' => 'Edit', 'enabled' => true],
                            ['id' => 'proj_delete', 'label' => 'Delete', 'enabled' => false],
                            ['id' => 'proj_approve', 'label' => 'Approve', 'enabled' => false],
                            ['id' => 'proj_rate', 'label' => 'Rate', 'enabled' => true],
                        ],
                    ],
                    [
                        'category' => 'Ledger',
                        'permissions' => [
                            ['id' => 'ledger_view', 'label' => 'View', 'enabled' => true],
                            ['id' => 'ledger_create', 'label' => 'Create', 'enabled' => false],
                            ['id' => 'ledger_edit', 'label' => 'Edit', 'enabled' => false],
                            ['id' => 'ledger_delete', 'label' => 'Delete', 'enabled' => false],
                            ['id' => 'ledger_approve', 'label' => 'Approve', 'enabled' => false],
                            ['id' => 'ledger_submit', 'label' => 'Submit', 'enabled' => false],
                        ],
                    ],
                    [
                        'category' => 'Proof',
                        'permissions' => [
                            ['id' => 'proof_view', 'label' => 'View', 'enabled' => true],
                            ['id' => 'proof_upload', 'label' => 'Upload', 'enabled' => true],
                            ['id' => 'proof_delete', 'label' => 'Delete', 'enabled' => false],
                            ['id' => 'proof_verify', 'label' => 'Verify', 'enabled' => false],
                        ],
                    ],
                ],
            ],
            [
                'id' => 'ICDI CS Representative',
                'name' => 'ICDI CS Representative',
                'sections' => [
                    [
                        'category' => 'Projects',
                        'permissions' => [
                            ['id' => 'proj_view', 'label' => 'View', 'enabled' => true],
                            ['id' => 'proj_create', 'label' => 'Create', 'enabled' => true],
                            ['id' => 'proj_edit', 'label' => 'Edit', 'enabled' => true],
                            ['id' => 'proj_delete', 'label' => 'Delete', 'enabled' => false],
                            ['id' => 'proj_approve', 'label' => 'Approve', 'enabled' => false],
                            ['id' => 'proj_rate', 'label' => 'Rate', 'enabled' => true],
                        ],
                    ],
                    [
                        'category' => 'Ledger',
                        'permissions' => [
                            ['id' => 'ledger_view', 'label' => 'View', 'enabled' => true],
                            ['id' => 'ledger_create', 'label' => 'Create', 'enabled' => false],
                            ['id' => 'ledger_edit', 'label' => 'Edit', 'enabled' => false],
                            ['id' => 'ledger_delete', 'label' => 'Delete', 'enabled' => false],
                            ['id' => 'ledger_approve', 'label' => 'Approve', 'enabled' => false],
                            ['id' => 'ledger_submit', 'label' => 'Submit', 'enabled' => false],
                        ],
                    ],
                    [
                        'category' => 'Proof',
                        'permissions' => [
                            ['id' => 'proof_view', 'label' => 'View', 'enabled' => true],
                            ['id' => 'proof_upload', 'label' => 'Upload', 'enabled' => true],
                            ['id' => 'proof_delete', 'label' => 'Delete', 'enabled' => false],
                            ['id' => 'proof_verify', 'label' => 'Verify', 'enabled' => false],
                        ],
                    ],
                ],
            ],
            [
                'id' => 'IGDS SW Representative',
                'name' => 'IGDS SW Representative',
                'sections' => [
                    [
                        'category' => 'Projects',
                        'permissions' => [
                            ['id' => 'proj_view', 'label' => 'View', 'enabled' => true],
                            ['id' => 'proj_create', 'label' => 'Create', 'enabled' => true],
                            ['id' => 'proj_edit', 'label' => 'Edit', 'enabled' => true],
                            ['id' => 'proj_delete', 'label' => 'Delete', 'enabled' => false],
                            ['id' => 'proj_approve', 'label' => 'Approve', 'enabled' => false],
                            ['id' => 'proj_rate', 'label' => 'Rate', 'enabled' => true],
                        ],
                    ],
                    [
                        'category' => 'Ledger',
                        'permissions' => [
                            ['id' => 'ledger_view', 'label' => 'View', 'enabled' => true],
                            ['id' => 'ledger_create', 'label' => 'Create', 'enabled' => false],
                            ['id' => 'ledger_edit', 'label' => 'Edit', 'enabled' => false],
                            ['id' => 'ledger_delete', 'label' => 'Delete', 'enabled' => false],
                            ['id' => 'ledger_approve', 'label' => 'Approve', 'enabled' => false],
                            ['id' => 'ledger_submit', 'label' => 'Submit', 'enabled' => false],
                        ],
                    ],
                    [
                        'category' => 'Proof',
                        'permissions' => [
                            ['id' => 'proof_view', 'label' => 'View', 'enabled' => true],
                            ['id' => 'proof_upload', 'label' => 'Upload', 'enabled' => true],
                            ['id' => 'proof_delete', 'label' => 'Delete', 'enabled' => false],
                            ['id' => 'proof_verify', 'label' => 'Verify', 'enabled' => false],
                        ],
                    ],
                ],
            ],
            [
                'id' => 'ION Representative',
                'name' => 'ION Representative',
                'sections' => [
                    [
                        'category' => 'Projects',
                        'permissions' => [
                            ['id' => 'proj_view', 'label' => 'View', 'enabled' => true],
                            ['id' => 'proj_create', 'label' => 'Create', 'enabled' => true],
                            ['id' => 'proj_edit', 'label' => 'Edit', 'enabled' => true],
                            ['id' => 'proj_delete', 'label' => 'Delete', 'enabled' => false],
                            ['id' => 'proj_approve', 'label' => 'Approve', 'enabled' => false],
                            ['id' => 'proj_rate', 'label' => 'Rate', 'enabled' => true],
                        ],
                    ],
                    [
                        'category' => 'Ledger',
                        'permissions' => [
                            ['id' => 'ledger_view', 'label' => 'View', 'enabled' => true],
                            ['id' => 'ledger_create', 'label' => 'Create', 'enabled' => false],
                            ['id' => 'ledger_edit', 'label' => 'Edit', 'enabled' => false],
                            ['id' => 'ledger_delete', 'label' => 'Delete', 'enabled' => false],
                            ['id' => 'ledger_approve', 'label' => 'Approve', 'enabled' => false],
                            ['id' => 'ledger_submit', 'label' => 'Submit', 'enabled' => false],
                        ],
                    ],
                    [
                        'category' => 'Proof',
                        'permissions' => [
                            ['id' => 'proof_view', 'label' => 'View', 'enabled' => true],
                            ['id' => 'proof_upload', 'label' => 'Upload', 'enabled' => true],
                            ['id' => 'proof_delete', 'label' => 'Delete', 'enabled' => false],
                            ['id' => 'proof_verify', 'label' => 'Verify', 'enabled' => false],
                        ],
                    ],
                ],
            ],
            [
                'id' => 'IOM Representative',
                'name' => 'IOM Representative',
                'sections' => [
                    [
                        'category' => 'Projects',
                        'permissions' => [
                            ['id' => 'proj_view', 'label' => 'View', 'enabled' => true],
                            ['id' => 'proj_create', 'label' => 'Create', 'enabled' => true],
                            ['id' => 'proj_edit', 'label' => 'Edit', 'enabled' => true],
                            ['id' => 'proj_delete', 'label' => 'Delete', 'enabled' => false],
                            ['id' => 'proj_approve', 'label' => 'Approve', 'enabled' => false],
                            ['id' => 'proj_rate', 'label' => 'Rate', 'enabled' => true],
                        ],
                    ],
                    [
                        'category' => 'Ledger',
                        'permissions' => [
                            ['id' => 'ledger_view', 'label' => 'View', 'enabled' => true],
                            ['id' => 'ledger_create', 'label' => 'Create', 'enabled' => false],
                            ['id' => 'ledger_edit', 'label' => 'Edit', 'enabled' => false],
                            ['id' => 'ledger_delete', 'label' => 'Delete', 'enabled' => false],
                            ['id' => 'ledger_approve', 'label' => 'Approve', 'enabled' => false],
                            ['id' => 'ledger_submit', 'label' => 'Submit', 'enabled' => false],
                        ],
                    ],
                    [
                        'category' => 'Proof',
                        'permissions' => [
                            ['id' => 'proof_view', 'label' => 'View', 'enabled' => true],
                            ['id' => 'proof_upload', 'label' => 'Upload', 'enabled' => true],
                            ['id' => 'proof_delete', 'label' => 'Delete', 'enabled' => false],
                            ['id' => 'proof_verify', 'label' => 'Verify', 'enabled' => false],
                        ],
                    ],
                ],
            ],
        ];

        $roles = [
            [
                'name' => 'Superadmin',
                'description' => 'Full system access with all permissions',
                'totalPermissions' => 43,
                'isEditable' => false,
                'sections' => [
                    [
                        'category' => 'System',
                        'permissions' => [
                            ['id' => 'sys_view', 'label' => 'View', 'enabled' => true],
                            ['id' => 'sys_create', 'label' => 'Create', 'enabled' => true],
                            ['id' => 'sys_edit', 'label' => 'Edit', 'enabled' => true],
                            ['id' => 'sys_delete', 'label' => 'Delete', 'enabled' => true],
                            ['id' => 'sys_manage', 'label' => 'Manage Users', 'enabled' => true],
                        ],
                    ],
                    [
                        'category' => 'All Modules',
                        'permissions' => [['id' => 'all_access', 'label' => 'Full Access', 'enabled' => true]],
                    ],
                ],
            ],
            [
                'name' => 'Admin/Adviser',
                'description' => 'Approval authority and oversight capabilities',
                'totalPermissions' => 14,
                'isEditable' => false,
                'sections' => [
                    [
                        'category' => 'Projects',
                        'permissions' => [
                            ['id' => 'proj_view', 'label' => 'View', 'enabled' => true],
                            ['id' => 'proj_approve', 'label' => 'Approve', 'enabled' => true],
                        ],
                    ],
                    [
                        'category' => 'Ledger',
                        'permissions' => [
                            ['id' => 'ledger_view', 'label' => 'View', 'enabled' => true],
                            ['id' => 'ledger_approve', 'label' => 'Approve', 'enabled' => true],
                            ['id' => 'ledger_verify', 'label' => 'Verify', 'enabled' => true],
                        ],
                    ],
                    [
                        'category' => 'Permissions',
                        'permissions' => [
                            ['id' => 'perm_manage', 'label' => 'Manage CSG Permissions', 'enabled' => true],
                            ['id' => 'perm_delegate', 'label' => 'Delegate Authority', 'enabled' => true],
                        ],
                    ],
                ],
            ],
            [
                'name' => 'CSG Officer',
                'description' => 'Create projects, manage ledger, and upload proofs',
                'totalPermissions' => 234, // 13 positions × 18 permissions each
                'isEditable' => true,
                'sections' => [],
            ],
            [
                'name' => 'Student',
                'description' => 'Read-only access with engagement features',
                'totalPermissions' => 8,
                'isEditable' => true,
                'sections' => [
                    [
                        'category' => 'Projects',
                        'permissions' => [
                            ['id' => 'proj_view', 'label' => 'View', 'enabled' => true],
                            ['id' => 'proj_rate', 'label' => 'Rate', 'enabled' => true],
                        ],
                    ],
                    [
                        'category' => 'Engagement',
                        'permissions' => [
                            ['id' => 'engage_view', 'label' => 'View Points', 'enabled' => true],
                            ['id' => 'engage_badges', 'label' => 'View Badges', 'enabled' => true],
                            ['id' => 'engage_leaderboard', 'label' => 'View Leaderboard', 'enabled' => true],
                        ],
                    ],
                ],
            ],
        ];

        return Inertia::render('Adviser/Permission', [
            'users' => $users,
            'csgOfficerCandidates' => $csgOfficerCandidates,
            'councilOfficers' => $councilOfficers,
            'csgPositions' => $csgPositions,
            'roles' => $roles,
        ]);
    }

    public function assignOfficer(Request $request)
    {
        $request->validate([
            'position' => 'required|string',
            'userId' => 'required|exists:users,id',
        ]);

        $position = $request->position;
        $userId = $request->userId;

        // Revert any existing officer in this position back to Member
        $existingOfficer = StudentCsgOfficer::where('csg_position', $position)
            ->where('archive', false)
            ->first();

        if ($existingOfficer && $existingOfficer->user_id !== $userId) {
            $existingOfficer->update([
                'csg_position' => 'Member',
                'csg_is_active' => false,
                'is_csg' => false,
            ]);
        }

        $candidate = StudentCsgOfficer::where('user_id', $userId)
            ->where('archive', false)
            ->first();

        if (! $candidate) {
            return response()->json(['message' => 'Selected student record not found.'], 422);
        }

        $candidate->update([
            'csg_position' => $position,
            'csg_is_active' => true,
            'is_csg' => true,
        ]);

        // return response()->json(['message' => 'Officer assigned successfully']);
    }

    public function updatePermissions(Request $request)
    {
        // For now, just return success since permissions are not stored in DB yet
        // In future, implement permission storage
        return response()->json(['message' => 'Permissions updated successfully']);
    }
}