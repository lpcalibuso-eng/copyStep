<?php

use App\Http\Controllers\ProfileController;
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

// Superadmin sub-pages
Route::get('/sadmin/users', function () {
    return Inertia::render('SAdmin/UserManagement');
})->name('sadmin.users');

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

Route::get('/csg/projects', function () {
    return Inertia::render('CSG/Projects');
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

Route::get('/csg/ratings', function () {
    return Inertia::render('CSG/Ratings');
})->name('csg.ratings');

Route::get('/csg/performance-panel', function () {
    return Inertia::render('CSG/PerformancePanel');
})->name('csg.performance-panel');

Route::get('/csg/profile', function () {
    return Inertia::render('CSG/Profile');
})->name('csg.profile');

Route::get('/user', function () {
    return Inertia::render('User/Dashboard');
})->name('user.dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';

// Logout route
Route::post('/logout', function () {
    auth()->logout();
    return redirect('/');
})->name('logout');
