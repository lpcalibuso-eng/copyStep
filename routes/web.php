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

Route::get('/adviser', function () {
    return Inertia::render('Adviser/Dashboard');
})->name('adviser.dashboard');

Route::get('/adviser/approvals', function () {
    return Inertia::render('Adviser/Approvals');
})->name('adviser.approvals');

Route::get('/adviser/ledger', function () {
    return Inertia::render('Adviser/Ledger');
})->name('adviser.ledger');

Route::get('/adviser/permission', function () {
    return Inertia::render('Adviser/Permission');
})->name('adviser.permission');

Route::get('/csg', function () {
    return Inertia::render('CSG/Dashboard');
})->name('csg.dashboard');

Route::get('/user', function () {
    return Inertia::render('User/Dashboard');
})->name('user.dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
