<?php

use Modules\Employee\app\Http\Controllers\EmployeeController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->group(function () {
    Route::resource('employees', EmployeeController::class);
});
