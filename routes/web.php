<?php

use App\Http\Controllers\Reports\DashboardController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', DashboardController::class)->name('dashboard');
    Route::get('/', fn () => redirect()->route('dashboard'));
});
