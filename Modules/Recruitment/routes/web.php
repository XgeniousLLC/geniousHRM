<?php

use Modules\Recruitment\app\Http\Controllers\ApplicationController;
use Modules\Recruitment\app\Http\Controllers\InterviewController;
use Modules\Recruitment\app\Http\Controllers\JobController;
use Modules\Recruitment\app\Http\Controllers\PublicJobController;
use Illuminate\Support\Facades\Route;

// Public careers portal (no auth required)
Route::get('/careers', [PublicJobController::class, 'index'])->name('careers.index');
Route::get('/careers/{job}', [PublicJobController::class, 'show'])->name('careers.show');
Route::post('/careers/{job}/apply', [PublicJobController::class, 'apply'])->name('careers.apply');

Route::middleware('auth')->group(function () {
    Route::get('/recruitment', [JobController::class, 'index'])->name('recruitment.index');
    Route::resource('recruitment', JobController::class)->except(['index'])->parameters(['recruitment' => 'job']);
    Route::patch('/recruitment/{job}/status', [JobController::class, 'updateStatus'])->name('recruitment.status');
    Route::post('/recruitment/{job}/apply', [ApplicationController::class, 'store'])->name('recruitment.apply');
    Route::patch('/applications/{application}/stage', [ApplicationController::class, 'updateStage'])->name('applications.stage');
    Route::patch('/applications/{application}/rating', [ApplicationController::class, 'updateRating'])->name('applications.rating');
    Route::patch('/applications/{application}/notes', [ApplicationController::class, 'updateNotes'])->name('applications.notes');
    Route::delete('/applications/{application}', [ApplicationController::class, 'destroy'])->name('applications.destroy');
    Route::post('/applications/{application}/interviews', [InterviewController::class, 'store'])->name('interviews.store');
    Route::patch('/interviews/{interview}', [InterviewController::class, 'update'])->name('interviews.update');
    Route::delete('/interviews/{interview}', [InterviewController::class, 'destroy'])->name('interviews.destroy');
});
