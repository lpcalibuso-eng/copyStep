<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SAdmin\UserManagementController;
use App\Http\Controllers\CSG\CSGProjectController;
use App\Http\Controllers\User\UserProjectController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

// Role-specific dashboards (simple routes to front-end pages)
Route::get('/sadmin', function () {
    return Inertia::render('SAdmin/Dashboard');
})->name('sadmin.dashboard');

Route::get('/sadmin/dashboard', function () {
    return Inertia::render('SAdmin/Dashboard');
})->name('sadmin.dashboard.alias');

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

Route::get('/adviser', function () {
    return Inertia::render('Adviser/Dashboard');
})->name('adviser.dashboard');

Route::get('/adviser/dashboard', function () {
    return Inertia::render('Adviser/Dashboard');
})->name('adviser.dashboard.alias');

Route::get('/adviser/approvals', function () {
    return Inertia::render('Adviser/Approvals');
})->name('adviser.approvals');

Route::get('/adviser/ledger', function () {
    return Inertia::render('Adviser/Ledger');
})->name('adviser.ledger');

Route::get('/adviser/role-permissions', function () {
    return Inertia::render('Adviser/Permission');
})->name('adviser.role-permissions');

    Route::get('/adviser/ratings', function () {
        return Inertia::render('Adviser/Ratings');
    })->name('adviser.ratings');

// system-logs
Route::get('/adviser/system-logs', function () {
    return Inertia::render('Adviser/SystemLog');
})->name('adviser.system-logs');

Route::get('/adviser/profile', function () {
    return Inertia::render('Adviser/Profile');
})->name('adviser.profile');

// CSG routes
Route::get('/csg', function () {
    return Inertia::render('CSG/Dashboard');
})->name('csg.dashboard');

Route::get('/csg/dashboard', function () {
    return Inertia::render('CSG/Dashboard');
})->name('csg.dashboard.alias');

Route::get('/csg/projects', [CSGProjectController::class, 'index'])->name('csg.projects');
Route::post('/csg/projects', [CSGProjectController::class, 'store'])->name('csg.projects.store');
Route::patch('/csg/projects/{id}', [CSGProjectController::class, 'update'])->name('csg.projects.update');
Route::delete('/csg/projects/{id}', [CSGProjectController::class, 'destroy'])->name('csg.projects.destroy');
Route::post('/csg/projects/{projectId}/ledger', [CSGProjectController::class, 'storeLedger'])->name('csg.projects.ledger.store');
Route::patch('/csg/projects/{projectId}/ledger/{ledgerId}', [CSGProjectController::class, 'updateLedger'])->name('csg.projects.ledger.update');
Route::delete('/csg/projects/{projectId}/ledger/{ledgerId}', [CSGProjectController::class, 'destroyLedger'])->name('csg.projects.ledger.destroy');

Route::get('/csg/ledger', function () {
    return Inertia::render('CSG/Ledger');
})->name('csg.ledger');

Route::get('/csg/proof', function () {
    return Inertia::render('CSG/Proof');
})->name('csg.proof');

Route::get('/csg/meetings', function () {
    return Inertia::render('CSG/Meetings');
})->name('csg.meetings');

Route::get('/csg/ratings', function () {
    return Inertia::render('CSG/Ratings');
})->name('csg.ratings');

Route::get('/csg/performance-panel', function () {
    return Inertia::render('CSG/PerformancePanel');
})->name('csg.performance-panel');

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
