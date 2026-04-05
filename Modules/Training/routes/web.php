<?php

use Illuminate\Support\Facades\Route;
use Modules\Training\app\Http\Controllers\TrainingCourseController;
use Modules\Training\app\Http\Controllers\TrainingSessionController;
use Modules\Training\app\Http\Controllers\TrainingEnrollmentController;

Route::middleware('auth')->group(function () {
    // Courses
    Route::get('/training',                                        [TrainingCourseController::class, 'index'])->name('training.index');
    Route::post('/training/courses',                               [TrainingCourseController::class, 'store'])->name('training.courses.store');
    Route::patch('/training/courses/{course}',                     [TrainingCourseController::class, 'update'])->name('training.courses.update');
    Route::delete('/training/courses/{course}',                    [TrainingCourseController::class, 'destroy'])->name('training.courses.destroy');

    // Sessions
    Route::get('/training/courses/{course}/sessions/create',       [TrainingSessionController::class, 'create'])->name('training.sessions.create');
    Route::post('/training/courses/{course}/sessions',             [TrainingSessionController::class, 'store'])->name('training.sessions.store');
    Route::get('/training/sessions/{session}',                     [TrainingSessionController::class, 'show'])->name('training.sessions.show');
    Route::patch('/training/sessions/{session}',                   [TrainingSessionController::class, 'update'])->name('training.sessions.update');
    Route::delete('/training/sessions/{session}',                  [TrainingSessionController::class, 'destroy'])->name('training.sessions.destroy');

    // Enrollments
    Route::post('/training/sessions/{session}/enroll',             [TrainingEnrollmentController::class, 'store'])->name('training.enrollments.store');
    Route::patch('/training/enrollments/{enrollment}',             [TrainingEnrollmentController::class, 'update'])->name('training.enrollments.update');
    Route::delete('/training/enrollments/{enrollment}',            [TrainingEnrollmentController::class, 'destroy'])->name('training.enrollments.destroy');
});
