<?php

use Modules\Performance\app\Http\Controllers\PerformanceCycleController;
use Modules\Performance\app\Http\Controllers\PerformanceGoalController;
use Modules\Performance\app\Http\Controllers\PerformanceReviewController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->group(function () {
    Route::get('/performance',                                                    [PerformanceCycleController::class, 'index'])->name('performance.index');
    Route::post('/performance/cycles',                                            [PerformanceCycleController::class, 'store'])->name('performance.cycles.store');
    Route::get('/performance/cycles/{cycle}',                                     [PerformanceCycleController::class, 'show'])->name('performance.cycles.show');
    Route::post('/performance/cycles/{cycle}/close',                              [PerformanceCycleController::class, 'close'])->name('performance.cycles.close');
    Route::get('/performance/goals',                                              [PerformanceGoalController::class, 'index'])->name('performance.goals.index');
    Route::post('/performance/goals',                                             [PerformanceGoalController::class, 'store'])->name('performance.goals.store');
    Route::patch('/performance/goals/{goal}',                                     [PerformanceGoalController::class, 'update'])->name('performance.goals.update');
    Route::delete('/performance/goals/{goal}',                                    [PerformanceGoalController::class, 'destroy'])->name('performance.goals.destroy');
    Route::get('/performance/cycles/{cycle}/employees/{employee}/review',         [PerformanceReviewController::class, 'startOrShow'])->name('performance.review.start');
    Route::get('/performance/reviews/{review}',                                   [PerformanceReviewController::class, 'show'])->name('performance.reviews.show');
    Route::post('/performance/reviews/{review}/save',                             [PerformanceReviewController::class, 'save'])->name('performance.reviews.save');
    Route::post('/performance/reviews/{review}/submit',                           [PerformanceReviewController::class, 'submit'])->name('performance.reviews.submit');
    Route::post('/performance/cycles/{cycle}/employees/{employee}/finalise',      [PerformanceReviewController::class, 'finalise'])->name('performance.finalise');
});
