<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
// Import your controllers here
use App\Http\Controllers\FinancialTransactionController;
use App\Http\Controllers\CSG\LedgerEntryController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make things great!
|
*/

// Default Sanctum User Route
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

/**
 * CSG FINANCIAL SYSTEM ROUTES
 */

// Route to create a new ledger entry with file upload
// This is used by the CSG Add Ledger Entry modal
Route::post('/ledger-entries', [LedgerEntryController::class, 'store']);

// Route to handle the document/image upload for a specific ledger entry
// This matches your React fetch: `/api/ledger-entries/{id}/upload`
Route::post('/ledger-entries/{id}/upload', [LedgerEntryController::class, 'uploadProof']);

// Route to fetch all entries for a specific project
// Supports both: /api/ledger-entries/project/{projectId} and query param
Route::get('/ledger-entries/project/{projectId}', [LedgerEntryController::class, 'index']);

// Route to fetch all entries (accepts project_id as query parameter)
Route::get('/ledger-entries', [LedgerEntryController::class, 'all']);