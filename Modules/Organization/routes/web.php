<?php

use Modules\Organization\app\Http\Controllers\DepartmentController;
use Modules\Organization\app\Http\Controllers\PositionController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->group(function () {
    Route::resource('departments', DepartmentController::class);
    Route::resource('positions', PositionController::class)->except(['show']);
});
