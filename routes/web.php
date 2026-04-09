<?php

use App\Http\Controllers\Adviser\AdviserApprovalController;
use App\Http\Controllers\Adviser\AdviserDashboardController;
use App\Http\Controllers\Adviser\AdviserLedgerController;
use App\Http\Controllers\Adviser\AdviserNotificationController;
use App\Http\Controllers\Adviser\AdviserPermissionController;
use App\Http\Controllers\Adviser\AdviserRatingsController;
use App\Http\Controllers\BlockchainController;
use App\Http\Controllers\CSG\CSGDashboardController;
use App\Http\Controllers\CSG\CSGProjectController;
use App\Http\Controllers\CSG\CSGRatingsController;
use App\Http\Controllers\CSG\LedgerEntryController;
use App\Http\Controllers\CSG\MeetingController;
use App\Http\Controllers\CSG\ProjectController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SAdmin\SAdminDashboardController;
use App\Http\Controllers\SAdmin\UserManagementController;
use App\Http\Controllers\User\UserProjectController;
use App\Models\User\Notification;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
// use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/contact', function () {
    return Inertia::render('ContactUs');
})->name('contact');

Route::get('/privacy', function () {
    return Inertia::render('PrivacyPolicy');
})->name('privacy');

Route::get('/terms', function () {
    return Inertia::render('TermsOfService');
})->name('terms');

Route::get('/features', function () {
    return Inertia::render('Features');
})->name('features');

Route::get('/user-guide', function () {
    return Inertia::render('UserGuide');
})->name('user-guide');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

// Role-specific dashboards (simple routes to front-end pages)
Route::get('/sadmin', [SAdminDashboardController::class, 'index'])->name('sadmin.dashboard');

Route::get('/sadmin/dashboard', [SAdminDashboardController::class, 'index'])->name('sadmin.dashboard.alias');

// Superadmin sub-pages
Route::get('/sadmin/users', [UserManagementController::class, 'index'])->name('sadmin.users');
Route::get('/sadmin/users/search', [UserManagementController::class, 'search'])->name('sadmin.users.search');
Route::get('/sadmin/users/form-fields/{roleId}', [UserManagementController::class, 'getFormFields'])->name('sadmin.users.form-fields');

Route::post('/sadmin/users', [UserManagementController::class, 'create'])->name('sadmin.users.create');
Route::post('/sadmin/users/store', [UserManagementController::class, 'store'])->name('sadmin.users.store');
Route::patch('/sadmin/users/{user}/toggle-status', [UserManagementController::class, 'toggleStatus'])->name('sadmin.users.toggle-status');
Route::post('/sadmin/users/{user}/reset-password', [UserManagementController::class, 'resetPassword'])->name('sadmin.users.reset-password');
Route::patch('/sadmin/users/{user}/role', [UserManagementController::class, 'updateRole'])->name('sadmin.users.update-role');
Route::patch('/sadmin/users/{user}/restore', [UserManagementController::class, 'restore'])->name('sadmin.users.restore');
Route::delete('/sadmin/users/{user}', [UserManagementController::class, 'destroy'])->name('sadmin.users.destroy');

Route::get('/sadmin/roles', function () {
    return Inertia::render('SAdmin/RolesPermissions');
})->name('sadmin.roles');

Route::get('/sadmin/data-backup', function () {
    return Inertia::render('SAdmin/DataBackup');
})->name('sadmin.data-backup');

Route::get('/sadmin/organizations', function () {
    return Inertia::render('SAdmin/Organizations');
})->name('sadmin.organizations');

Route::get('/sadmin/settings', function () {
    return Inertia::render('SAdmin/SystemSettings');
})->name('sadmin.settings');

Route::get('/sadmin/audit-logs', function () {
    return Inertia::render('SAdmin/AuditLogs');
})->name('sadmin.audit-logs');

Route::get('/sadmin/engagement-rules', function () {
    return Inertia::render('SAdmin/EngagementRules');
})->name('sadmin.engagement-rules');

Route::get('/sadmin/master-data', function () {
    return Inertia::render('SAdmin/MasterData');
})->name('sadmin.master-data');

Route::get('/sadmin/global-reports', function () {
    return Inertia::render('SAdmin/GlobalReports');
})->name('sadmin.global-reports');

Route::get('/sadmin/notifications', function () {
    return Inertia::render('SAdmin/Notifications');
})->name('sadmin.notifications');

Route::get('/sadmin/profile', function () {
    return Inertia::render('SAdmin/Profile');
})->name('sadmin.profile');

Route::get('/adviser', [AdviserDashboardController::class, 'index'])->name('adviser.dashboard');

Route::get('/adviser/dashboard', [AdviserDashboardController::class, 'index'])->name('adviser.dashboard.alias');

// Same as other /adviser/* pages: no auth gate so navigation from the adviser dashboard works
// without a Laravel session (data still loads from DB via controllers below).
Route::get('/adviser/approvals', [AdviserApprovalController::class, 'index'])->name('adviser.approvals');
Route::post('/adviser/approvals/approve', [AdviserApprovalController::class, 'approve'])->name('adviser.approvals.approve');
Route::post('/adviser/approvals/reject', [AdviserApprovalController::class, 'reject'])->name('adviser.approvals.reject');

// Blockchain routes
Route::get('/blockchain/project/{projectId}', [BlockchainController::class, 'show'])->name('blockchain.show');
Route::post('/blockchain/verify', [BlockchainController::class, 'verify'])->name('blockchain.verify');
Route::get('/blockchain/project/{projectId}/export', [BlockchainController::class, 'export'])->name('blockchain.export');

Route::get('/adviser/ledger', [AdviserLedgerController::class, 'index'])->name('adviser.ledger');
Route::post('/adviser/ledger/{id}/approve', [AdviserLedgerController::class, 'approve'])->name('adviser.ledger.approve');
Route::post('/adviser/ledger/{id}/reject', [AdviserLedgerController::class, 'reject'])->name('adviser.ledger.reject');
Route::post('/adviser/ledger/{id}/correction', [AdviserLedgerController::class, 'correction'])->name('adviser.ledger.correction');

Route::get('/adviser/role-permissions', [AdviserPermissionController::class, 'index'])->name('adviser.role-permissions');
Route::post('/adviser/role-permissions/assign-officer', [AdviserPermissionController::class, 'assignOfficer'])->name('adviser.role-permissions.assign-officer');
Route::post('/adviser/role-permissions/update', [AdviserPermissionController::class, 'updatePermissions'])->name('adviser.role-permissions.update');

Route::get('/adviser/ratings', [AdviserRatingsController::class, 'index'])->name('adviser.ratings');

Route::get('/adviser/notifications', [AdviserNotificationController::class, 'index'])->name('adviser.notifications');
Route::post('/adviser/notifications/read/{id}', [AdviserNotificationController::class, 'markRead'])->name('adviser.notifications.read');
Route::post('/adviser/notifications/mark-all-read', [AdviserNotificationController::class, 'markAllRead'])->name('adviser.notifications.mark-all-read');

// system-logs
Route::get('/adviser/system-logs', function () {
    return Inertia::render('Adviser/SystemLog');
})->name('adviser.system-logs');

Route::get('/adviser/profile', function () {
    return Inertia::render('Adviser/Profile');
})->name('adviser.profile');

// CSG routes
Route::get('/csg', [CSGDashboardController::class, 'index'])->name('csg.dashboard');

Route::get('/csg/dashboard', [CSGDashboardController::class, 'index'])->name('csg.dashboard.alias');

// Route::get('/csg/projects', [CSGProjectController::class, 'index'])->name('csg.projects');
Route::get('/csg/projects/{projectId?}', function ($projectId = null) {
    return Inertia::render('CSG/Projects', [
        'selectedProjectId' => $projectId
    ]);
})->name('csg.projects');
Route::post('/csg/projects', [CSGProjectController::class, 'store'])->name('csg.projects.store');
Route::patch('/csg/projects/{id}', [CSGProjectController::class, 'update'])->name('csg.projects.update');
Route::delete('/csg/projects/{id}', [CSGProjectController::class, 'destroy'])->name('csg.projects.destroy');
Route::post('/csg/projects/{projectId}/ledger', [CSGProjectController::class, 'storeLedger'])->name('csg.projects.ledger.store');
Route::patch('/csg/projects/{projectId}/ledger/{ledgerId}', [CSGProjectController::class, 'updateLedger'])->name('csg.projects.ledger.update');
Route::delete('/csg/projects/{projectId}/ledger/{ledgerId}', [CSGProjectController::class, 'destroyLedger'])->name('csg.projects.ledger.destroy');

Route::get('/csg/projects/{projectId?}', function ($projectId = null) {
    return Inertia::render('CSG/Projects', [
        'selectedProjectId' => $projectId
    ]);
})->name('csg.projects');


Route::get('/csg/ledger', function () {
    return Inertia::render('CSG/Ledger');
})->name('csg.ledger');

Route::get('/csg/proof', function () {
    return Inertia::render('CSG/Proof');
})->name('csg.proof');

Route::get('/csg/meetings', function () {
    return Inertia::render('CSG/Meetings');
})->name('csg.meetings');

Route::get('/csg/ratings', [CSGRatingsController::class, 'index'])->name('csg.ratings');
Route::get('/api/csg/ratings', [CSGRatingsController::class, 'getRatingsData'])->name('api.csg.ratings');

Route::get('/csg/notification', function () {
    return Inertia::render('CSG/Notification');
})->name('csg.notification');

Route::get('/csg/profile', function () {
    return Inertia::render('CSG/Profile');
})->name('csg.profile');

Route::get('/user', [UserProjectController::class, 'dashboard'])->name('user.dashboard');

Route::get('/user/dashboard', [UserProjectController::class, 'dashboard'])->name('user.dashboard.alias');

Route::get('/user/projects', [UserProjectController::class, 'index'])->name('user.projects');

Route::get('/user/projects/{id}', [UserProjectController::class, 'show'])->name('user.project-details');
Route::post('/user/projects/{id}/ratings', [UserProjectController::class, 'upsertRating'])->name('user.project-rate');

Route::get('/user/meetings', [UserProjectController::class, 'meetings'])->name('user.meetings');

Route::get('/user/profile', [UserProjectController::class, 'profile'])->name('user.profile');

Route::get('/user/points', [UserProjectController::class, 'points'])->name('user.points');

Route::get('/user/badges', [UserProjectController::class, 'badges'])->name('user.badges');

Route::get('/user/leaderboard', [UserProjectController::class, 'leaderboard'])->name('user.leaderboard');

Route::get('/user/notifications', [UserProjectController::class, 'notifications'])->name('user.notifications');


// ==================== API ROUTES ====================
Route::prefix('api')->group(function () {
    // Project Management Routes
    Route::prefix('projects')->group(function () {
        Route::get('/', [ProjectController::class, 'index']);
        Route::post('/', [ProjectController::class, 'store']);
        Route::get('/{id}', [ProjectController::class, 'show']);
        Route::put('/{id}', [ProjectController::class, 'update']);
        Route::delete('/{id}', [ProjectController::class, 'destroy']);
        Route::post('/{id}/archive', [ProjectController::class, 'archive']);
        Route::post('/{id}/submit', [ProjectController::class, 'submitForApproval']);
        Route::get('/{id}/ledger', [ProjectController::class, 'ledgerEntries']);
        Route::get('/{id}/ratings', [ProjectController::class, 'getRatings']);
        Route::get('/{id}/file', [ProjectController::class, 'getFile']);
        Route::delete('/{id}/file', [ProjectController::class, 'deleteFile']);
    });
    
    // Ledger Entry Management Routes
    Route::prefix('ledger-entries')->group(function () {
        Route::get('/', [LedgerEntryController::class, 'all']);
        Route::get('/project/{projectId}', [LedgerEntryController::class, 'index']);
        Route::post('/', [LedgerEntryController::class, 'store']);
        Route::put('/{id}', [LedgerEntryController::class, 'update']);
        Route::delete('/{id}', [LedgerEntryController::class, 'destroy']);
        Route::post('/{id}/submit', [LedgerEntryController::class, 'submitForApproval']);
        Route::post('/{id}/proof', [LedgerEntryController::class, 'uploadProof']);
    });
    
    // Meeting Management Routes
    Route::prefix('meetings')->group(function () {
        Route::get('/', [MeetingController::class, 'all']);
        Route::post('/', [MeetingController::class, 'store']);
        Route::put('/{id}', [MeetingController::class, 'update']);
        Route::delete('/{id}', [MeetingController::class, 'destroy']);
        Route::post('/{id}/mark-as-done', [MeetingController::class, 'markAsDone']);
        Route::post('/{id}/archive', [MeetingController::class, 'toggleArchive']);
    });

    Route::get('/projects', [ProjectController::class, 'index']);
});

// Legacy non-api route prefix (for backward compatibility)
Route::prefix('projects')->group(function () {
    Route::get('/', [ProjectController::class, 'index']);
    Route::get('/{id}', [ProjectController::class, 'show']);
    Route::get('/{id}/ledger', [ProjectController::class, 'ledgerEntries']);
    Route::post('/', [ProjectController::class, 'store']);
    Route::put('/{id}', [ProjectController::class, 'update']);
    Route::delete('/{id}', [ProjectController::class, 'destroy']);
    Route::post('/{id}/archive', [ProjectController::class, 'archive']);
    Route::get('/{id}/file', [ProjectController::class, 'getFile']);
    Route::delete('/{id}/file', [ProjectController::class, 'deleteFile']);
});

// Auth routes


// Route::post('/sadmin/notifications/read/{id}', function ($id) {
//     Notification::where('id', $id)->update(['is_read' => 1, 'read_at' => now()]);
//     return back();
// });

// Route::post('/sadmin/notifications/archive/{id}', function ($id) {
//     Notification::where('id', $id)->update(['archive' => 1]);
//     return back();
// });

// Route::post('/sadmin/notifications/mark-all-read', function () {
//     Notification::where('user_id', auth()->id())->update(['is_read' => 1, 'read_at' => now()]);
//     return back();
// });
Route::middleware('auth')->group(function () {
    Route::post('/sadmin/notifications/read/{id}', function ($id) {
        // Use the Model to ensure string ID handling
        \App\Models\Notification::where('id', $id)->update([
            'is_read' => 1, 
            'read_at' => now()
        ]);
        return back();
    });

    Route::post('/sadmin/notifications/archive/{id}', function ($id) {
        \App\Models\Notification::where('id', $id)->update(['archive' => 1]);
        return back();
    });

    Route::post('/sadmin/notifications/mark-all-read', function () {
        \App\Models\Notification::where('user_id', Auth::id())
            ->where('is_read', 0)
            ->update(['is_read' => 1, 'read_at' => now()]);
        return back();
    });

    // Student notification read/unread (mark as read)
    Route::post('/user/notifications/read/{id}', function ($id) {
        \App\Models\Notification::where('id', $id)
            ->where(function ($q) {
                $q->where('user_id', Auth::id())->orWhereNull('user_id');
            })
            ->where('archive', 0)
            ->update([
                'is_read' => 1,
                'read_at' => now(),
            ]);

        return back();
    });

    Route::post('/user/notifications/mark-all-read', function () {
        \App\Models\Notification::where('archive', 0)
            ->where(function ($q) {
                $q->where('user_id', Auth::id())->orWhereNull('user_id');
            })
            ->where('is_read', 0)
            ->update([
                'is_read' => 1,
                'read_at' => now(),
            ]);

        return back();
    });
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Secret superadmin login route (Easter egg)
Route::middleware('guest')->group(function () {
    Route::get('sadmin/login', function () {
        return Inertia::render('Auth/SuperAdminLogin');
    })->name('sadmin.login');
});

require __DIR__.'/auth.php';

// Logout route
Route::post('/logout', function () {
    auth()->guard()->logout();
    return redirect('/');
})->name('logout');
