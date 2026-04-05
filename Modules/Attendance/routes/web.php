<?php

use Modules\Attendance\app\Http\Controllers\AttendanceController;
use Modules\Attendance\app\Http\Controllers\HolidayController;
use Modules\Attendance\app\Http\Controllers\ShiftController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->group(function () {
    Route::resource('shifts', ShiftController::class)->except(['show']);
    Route::resource('holidays', HolidayController::class)->except(['show']);
    Route::get('/attendance', [AttendanceController::class, 'index'])->name('attendance.index');
    Route::post('/attendance', [AttendanceController::class, 'store'])->name('attendance.store');
    Route::put('/attendance/{attendance}', [AttendanceController::class, 'update'])->name('attendance.update');
    Route::delete('/attendance/{attendance}', [AttendanceController::class, 'destroy'])->name('attendance.destroy');
});
