<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Employee\EmployeeController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Auth routes (guest only)
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login']);
});

// Authenticated routes
Route::middleware('auth')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

    Route::get('/dashboard', fn () => Inertia::render('Dashboard'))->name('dashboard');
    Route::get('/', fn () => redirect()->route('dashboard'));

    // Module 02: Employees
    Route::resource('employees', EmployeeController::class);

    // Catch-all for SPA navigation — must stay last
    Route::get('/{any}', fn () => Inertia::render('Dashboard'))
        ->where('any', '^(?!api).*')
        ->name('spa');
});
