<?php

use App\Http\Controllers\Reports\DashboardController;
use App\Http\Controllers\Employee\SelfController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', DashboardController::class)->name('dashboard');
    Route::get('/', fn () => redirect()->route('dashboard'));

    // Self-service routes — any authenticated user, scoped to their own employee record
    Route::get('/my/payslips',  [SelfController::class, 'payslips'])->name('my.payslips');
    Route::get('/my/documents', [SelfController::class, 'documents'])->name('my.documents');
});
