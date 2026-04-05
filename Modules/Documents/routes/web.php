<?php

use Illuminate\Support\Facades\Route;
use Modules\Documents\app\Http\Controllers\CompanyDocumentController;
use Modules\Documents\app\Http\Controllers\EmployeeDocumentController;

Route::middleware('auth')->group(function () {
    // Company documents
    Route::get('/documents',                                        [CompanyDocumentController::class, 'index'])->name('documents.index');
    Route::post('/documents',                                       [CompanyDocumentController::class, 'store'])->name('documents.store');
    Route::patch('/documents/{document}',                           [CompanyDocumentController::class, 'update'])->name('documents.update');
    Route::delete('/documents/{document}',                          [CompanyDocumentController::class, 'destroy'])->name('documents.destroy');
    Route::get('/documents/{document}/download',                    [CompanyDocumentController::class, 'download'])->name('documents.download');
    Route::post('/documents/{document}/acknowledge',                [CompanyDocumentController::class, 'acknowledge'])->name('documents.acknowledge');

    // Employee documents
    Route::post('/employees/{employee}/documents',                  [EmployeeDocumentController::class, 'store'])->name('employee.documents.store');
    Route::delete('/employee-documents/{document}',                 [EmployeeDocumentController::class, 'destroy'])->name('employee.documents.destroy');
    Route::get('/employee-documents/{document}/download',           [EmployeeDocumentController::class, 'download'])->name('employee.documents.download');
});
