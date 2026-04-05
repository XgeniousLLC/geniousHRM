<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\EmployeeController;
use App\Http\Controllers\Api\V1\DepartmentController;
use App\Http\Controllers\Api\V1\PositionController;
use App\Http\Controllers\Api\V1\AttendanceController;
use App\Http\Controllers\Api\V1\LeaveController;
use App\Http\Controllers\Api\V1\PayrollController;
use App\Http\Controllers\Api\V1\PerformanceController;
use App\Http\Controllers\Api\V1\TrainingController;
use App\Http\Controllers\Api\V1\ReportsController;

// ══════════════════════════════════════════════════════════
//  REST API v1 — Sanctum token auth
// ══════════════════════════════════════════════════════════
Route::prefix('v1')->group(function () {

    // Public
    Route::post('/auth/login', [AuthController::class, 'login']);

    // Protected
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/auth/logout', [AuthController::class, 'logout']);
        Route::get('/auth/me',      [AuthController::class, 'me']);

        // Employees
        Route::apiResource('employees', EmployeeController::class);

        // Org structure
        Route::apiResource('departments', DepartmentController::class);
        Route::apiResource('positions',   PositionController::class);

        // Attendance
        Route::get('attendance',                     [AttendanceController::class, 'index']);
        Route::post('attendance/check-in',           [AttendanceController::class, 'checkIn']);
        Route::post('attendance/check-out',          [AttendanceController::class, 'checkOut']);
        Route::get('attendance/employee/{employee}', [AttendanceController::class, 'byEmployee']);

        // Leave
        Route::get('leave/types', [LeaveController::class, 'types']);
        Route::apiResource('leave/requests', LeaveController::class)
            ->parameters(['requests' => 'leaveRequest']);
        Route::patch('leave/requests/{leaveRequest}/approve', [LeaveController::class, 'approve']);
        Route::patch('leave/requests/{leaveRequest}/reject',  [LeaveController::class, 'reject']);

        // Payroll
        Route::get('payroll/runs',               [PayrollController::class, 'runs']);
        Route::get('payroll/runs/{run}',         [PayrollController::class, 'showRun']);
        Route::get('payroll/payslips',           [PayrollController::class, 'payslips']);
        Route::get('payroll/payslips/{payslip}', [PayrollController::class, 'showPayslip']);

        // Performance
        Route::get('performance/cycles',           [PerformanceController::class, 'cycles']);
        Route::get('performance/cycles/{cycle}',   [PerformanceController::class, 'showCycle']);
        Route::get('performance/ratings',          [PerformanceController::class, 'ratings']);
        Route::get('performance/ratings/{rating}', [PerformanceController::class, 'showRating']);

        // Training
        Route::get('training/courses',                             [TrainingController::class, 'courses']);
        Route::get('training/courses/{course}',                    [TrainingController::class, 'showCourse']);
        Route::get('training/sessions',                            [TrainingController::class, 'sessions']);
        Route::get('training/enrollments',                         [TrainingController::class, 'enrollments']);
        Route::post('training/enrollments',                        [TrainingController::class, 'enroll']);
        Route::patch('training/enrollments/{enrollment}/complete', [TrainingController::class, 'complete']);

        // Reports
        Route::get('reports/headcount',  [ReportsController::class, 'headcount']);
        Route::get('reports/attendance', [ReportsController::class, 'attendance']);
        Route::get('reports/leave',      [ReportsController::class, 'leave']);
        Route::get('reports/payroll',    [ReportsController::class, 'payroll']);
    });
});

// ══════════════════════════════════════════════════════════
//  Legacy / existing module routes below
// ══════════════════════════════════════════════════════════

/*
|--------------------------------------------------------------------------
| API Routes — GeniusHRM
|--------------------------------------------------------------------------
| All routes are prefixed with /api automatically via bootstrap/app.php
| Grouped by module for clarity.
*/

// ──────────────────────────────────────────
// Module 01: Authentication
// ──────────────────────────────────────────
Route::prefix('auth')->group(function () {
    // Public auth routes (no token required)
    Route::post('login', [\App\Http\Controllers\Auth\AuthController::class, 'login']);
    Route::post('forgot-password', [\App\Http\Controllers\Auth\AuthController::class, 'forgotPassword']);
    Route::post('reset-password', [\App\Http\Controllers\Auth\AuthController::class, 'resetPassword']);

    // Protected auth routes
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('logout', [\App\Http\Controllers\Auth\AuthController::class, 'logout']);
        Route::post('refresh-token', [\App\Http\Controllers\Auth\AuthController::class, 'refreshToken']);
        Route::post('change-password', [\App\Http\Controllers\Auth\AuthController::class, 'changePassword']);
        Route::get('user', [\App\Http\Controllers\Auth\AuthController::class, 'user']);

        // MFA
        Route::prefix('mfa')->group(function () {
            Route::post('enable', [\App\Http\Controllers\Auth\MfaController::class, 'enable']);
            Route::post('verify', [\App\Http\Controllers\Auth\MfaController::class, 'verify']);
            Route::post('disable', [\App\Http\Controllers\Auth\MfaController::class, 'disable']);
            Route::get('backup-codes', [\App\Http\Controllers\Auth\MfaController::class, 'backupCodes']);
        });

        // Sessions (admin only)
        Route::prefix('sessions')->middleware('role:Admin')->group(function () {
            Route::get('/', [\App\Http\Controllers\Auth\SessionController::class, 'index']);
            Route::delete('{id}', [\App\Http\Controllers\Auth\SessionController::class, 'destroy']);
        });
    });
});

// ──────────────────────────────────────────
// All routes below require Sanctum auth
// ──────────────────────────────────────────
Route::middleware('auth:sanctum')->group(function () {

    // ──────────────────────────────────────
    // Module 02: Employee Management
    // ──────────────────────────────────────
    Route::prefix('employees')->group(function () {
        Route::get('/', [\App\Http\Controllers\Employee\EmployeeController::class, 'index']);
        Route::post('/', [\App\Http\Controllers\Employee\EmployeeController::class, 'store']);
        Route::get('export', [\App\Http\Controllers\Employee\EmployeeController::class, 'export']);
        Route::post('bulk-import', [\App\Http\Controllers\Employee\EmployeeController::class, 'bulkImport']);
        Route::get('{id}', [\App\Http\Controllers\Employee\EmployeeController::class, 'show']);
        Route::put('{id}', [\App\Http\Controllers\Employee\EmployeeController::class, 'update']);
        Route::delete('{id}', [\App\Http\Controllers\Employee\EmployeeController::class, 'destroy']);
        Route::post('{id}/documents', [\App\Http\Controllers\Employee\DocumentController::class, 'store']);
        Route::get('{id}/documents', [\App\Http\Controllers\Employee\DocumentController::class, 'index']);
        Route::delete('{id}/documents/{docId}', [\App\Http\Controllers\Employee\DocumentController::class, 'destroy']);
        Route::get('{id}/history', [\App\Http\Controllers\Employee\EmployeeController::class, 'history']);
    });

    // ──────────────────────────────────────
    // Module 03: Organizational Structure
    // ──────────────────────────────────────
    Route::apiResource('departments', \App\Http\Controllers\Organization\DepartmentController::class);
    Route::get('departments/{id}/employees', [\App\Http\Controllers\Organization\DepartmentController::class, 'employees']);
    Route::apiResource('positions', \App\Http\Controllers\Organization\PositionController::class);
    Route::prefix('org-chart')->group(function () {
        Route::get('/', [\App\Http\Controllers\Organization\OrgChartController::class, 'index']);
        Route::get('manager/{id}', [\App\Http\Controllers\Organization\OrgChartController::class, 'teamDirect']);
        Route::get('manager/{id}/tree', [\App\Http\Controllers\Organization\OrgChartController::class, 'teamTree']);
    });

    // ──────────────────────────────────────
    // Module 04: Attendance & Shifts
    // ──────────────────────────────────────
    Route::prefix('attendance')->group(function () {
        Route::post('check-in', [\App\Http\Controllers\Attendance\AttendanceController::class, 'checkIn']);
        Route::post('check-out', [\App\Http\Controllers\Attendance\AttendanceController::class, 'checkOut']);
        Route::get('today', [\App\Http\Controllers\Attendance\AttendanceController::class, 'today']);
        Route::get('daily', [\App\Http\Controllers\Attendance\AttendanceController::class, 'daily']);
        Route::get('monthly/{employee_id}', [\App\Http\Controllers\Attendance\AttendanceController::class, 'monthly']);
        Route::get('report', [\App\Http\Controllers\Attendance\AttendanceController::class, 'report']);
        Route::post('mark', [\App\Http\Controllers\Attendance\AttendanceController::class, 'mark']);
        Route::put('{id}', [\App\Http\Controllers\Attendance\AttendanceController::class, 'update']);
    });
    Route::apiResource('shifts', \App\Http\Controllers\Attendance\ShiftController::class);
    Route::post('shifts/{id}/assign', [\App\Http\Controllers\Attendance\ShiftController::class, 'assign']);
    Route::apiResource('holidays', \App\Http\Controllers\Attendance\HolidayController::class);

    // ──────────────────────────────────────
    // Module 05: Leave Management
    // ──────────────────────────────────────
    Route::apiResource('leave-types', \App\Http\Controllers\Leave\LeaveTypeController::class);
    Route::apiResource('leave-policies', \App\Http\Controllers\Leave\LeavePolicyController::class);
    Route::prefix('leaves')->group(function () {
        Route::get('/', [\App\Http\Controllers\Leave\LeaveController::class, 'index']);
        Route::post('apply', [\App\Http\Controllers\Leave\LeaveController::class, 'apply']);
        Route::get('pending', [\App\Http\Controllers\Leave\LeaveController::class, 'pending']);
        Route::get('calendar', [\App\Http\Controllers\Leave\LeaveController::class, 'calendar']);
        Route::get('report', [\App\Http\Controllers\Leave\LeaveController::class, 'report']);
        Route::get('{id}', [\App\Http\Controllers\Leave\LeaveController::class, 'show']);
        Route::put('{id}/approve', [\App\Http\Controllers\Leave\LeaveController::class, 'approve']);
        Route::put('{id}/reject', [\App\Http\Controllers\Leave\LeaveController::class, 'reject']);
        Route::put('{id}/cancel', [\App\Http\Controllers\Leave\LeaveController::class, 'cancel']);
    });
    Route::get('leave-balance/{employee_id}', [\App\Http\Controllers\Leave\LeaveController::class, 'balance']);

    // ──────────────────────────────────────
    // Module 06: Recruitment & ATS
    // ──────────────────────────────────────
    Route::apiResource('jobs', \App\Http\Controllers\Recruitment\JobController::class);
    Route::prefix('applicants')->group(function () {
        Route::get('/', [\App\Http\Controllers\Recruitment\ApplicantController::class, 'index']);
        Route::get('{id}', [\App\Http\Controllers\Recruitment\ApplicantController::class, 'show']);
    });
    Route::prefix('applications')->group(function () {
        Route::put('{id}/status', [\App\Http\Controllers\Recruitment\ApplicationController::class, 'updateStatus']);
        Route::post('{id}/notes', [\App\Http\Controllers\Recruitment\ApplicationController::class, 'addNote']);
        Route::get('{id}/notes', [\App\Http\Controllers\Recruitment\ApplicationController::class, 'notes']);
    });
    Route::apiResource('interviews', \App\Http\Controllers\Recruitment\InterviewController::class);
    Route::apiResource('offers', \App\Http\Controllers\Recruitment\OfferController::class);
    Route::get('recruitment/report', [\App\Http\Controllers\Recruitment\RecruitmentReportController::class, 'index']);

    // ──────────────────────────────────────
    // Module 07: Payroll & Compensation
    // ──────────────────────────────────────
    Route::apiResource('salary-components', \App\Http\Controllers\Payroll\SalaryComponentController::class);
    Route::apiResource('salary-structures', \App\Http\Controllers\Payroll\SalaryStructureController::class);
    Route::prefix('salary-assignments')->group(function () {
        Route::post('/', [\App\Http\Controllers\Payroll\SalaryAssignmentController::class, 'store']);
        Route::get('{employee_id}', [\App\Http\Controllers\Payroll\SalaryAssignmentController::class, 'show']);
    });
    Route::prefix('payroll')->group(function () {
        Route::get('runs', [\App\Http\Controllers\Payroll\PayrollController::class, 'index']);
        Route::post('run', [\App\Http\Controllers\Payroll\PayrollController::class, 'process']);
        Route::get('runs/{id}', [\App\Http\Controllers\Payroll\PayrollController::class, 'show']);
        Route::put('runs/{id}/approve', [\App\Http\Controllers\Payroll\PayrollController::class, 'approve']);
        Route::get('report', [\App\Http\Controllers\Payroll\PayrollController::class, 'report']);
    });
    Route::prefix('payslips')->group(function () {
        Route::get('{id}', [\App\Http\Controllers\Payroll\PayslipController::class, 'show']);
        Route::post('distribute', [\App\Http\Controllers\Payroll\PayslipController::class, 'distribute']);
    });
    Route::apiResource('deductions', \App\Http\Controllers\Payroll\DeductionController::class);

    // ──────────────────────────────────────
    // Module 08: Performance Management
    // ──────────────────────────────────────
    Route::apiResource('goals', \App\Http\Controllers\Performance\GoalController::class);
    Route::post('goals/{id}/review', [\App\Http\Controllers\Performance\GoalController::class, 'review']);
    Route::apiResource('appraisals', \App\Http\Controllers\Performance\AppraisalController::class);
    Route::put('appraisals/{id}/submit', [\App\Http\Controllers\Performance\AppraisalController::class, 'submit']);
    Route::put('appraisals/{id}/finalize', [\App\Http\Controllers\Performance\AppraisalController::class, 'finalize']);
    Route::prefix('feedback')->group(function () {
        Route::post('request', [\App\Http\Controllers\Performance\FeedbackController::class, 'request']);
        Route::get('/', [\App\Http\Controllers\Performance\FeedbackController::class, 'index']);
        Route::put('{id}', [\App\Http\Controllers\Performance\FeedbackController::class, 'submit']);
    });
    Route::get('performance/report', [\App\Http\Controllers\Performance\PerformanceReportController::class, 'index']);

    // ──────────────────────────────────────
    // Module 09: Training & Development
    // ──────────────────────────────────────
    Route::apiResource('trainings', \App\Http\Controllers\Training\TrainingController::class);
    Route::post('trainings/{id}/enroll', [\App\Http\Controllers\Training\TrainingController::class, 'enroll']);
    Route::put('trainings/{id}/attendance', [\App\Http\Controllers\Training\TrainingController::class, 'markAttendance']);
    Route::post('trainings/{id}/certificates', [\App\Http\Controllers\Training\TrainingController::class, 'generateCertificates']);
    Route::get('trainings/{id}/materials', [\App\Http\Controllers\Training\TrainingController::class, 'materials']);
    Route::post('training-materials', [\App\Http\Controllers\Training\TrainingMaterialController::class, 'store']);
    Route::apiResource('skills', \App\Http\Controllers\Training\SkillController::class);
    Route::prefix('employee-skills')->group(function () {
        Route::get('{employee_id}', [\App\Http\Controllers\Training\EmployeeSkillController::class, 'index']);
        Route::post('/', [\App\Http\Controllers\Training\EmployeeSkillController::class, 'store']);
        Route::put('{id}', [\App\Http\Controllers\Training\EmployeeSkillController::class, 'update']);
    });

    // ──────────────────────────────────────
    // Module 10: Documents & Compliance
    // ──────────────────────────────────────
    Route::apiResource('documents', \App\Http\Controllers\Documents\DocumentController::class);
    Route::get('documents/{id}/versions', [\App\Http\Controllers\Documents\DocumentController::class, 'versions']);
    Route::post('documents/{id}/acknowledge', [\App\Http\Controllers\Documents\DocumentController::class, 'acknowledge']);
    Route::get('documents/{id}/acknowledgments', [\App\Http\Controllers\Documents\DocumentController::class, 'acknowledgments']);
    Route::get('documents-expiring', [\App\Http\Controllers\Documents\DocumentController::class, 'expiring']);
    Route::apiResource('compliance-checklists', \App\Http\Controllers\Documents\ComplianceChecklistController::class);
    Route::post('compliance-checklists/{id}/complete-item', [\App\Http\Controllers\Documents\ComplianceChecklistController::class, 'completeItem']);
    Route::get('compliance/dashboard', [\App\Http\Controllers\Documents\ComplianceChecklistController::class, 'dashboard']);

    // ──────────────────────────────────────
    // Module 11: Reports & Analytics
    // ──────────────────────────────────────
    Route::prefix('dashboard')->group(function () {
        Route::get('executive', [\App\Http\Controllers\Reports\DashboardController::class, 'executive']);
        Route::get('hr', [\App\Http\Controllers\Reports\DashboardController::class, 'hr']);
        Route::get('manager', [\App\Http\Controllers\Reports\DashboardController::class, 'manager']);
    });
    Route::prefix('reports')->group(function () {
        Route::get('employees', [\App\Http\Controllers\Reports\ReportController::class, 'employees']);
        Route::get('attendance', [\App\Http\Controllers\Reports\ReportController::class, 'attendance']);
        Route::get('leaves', [\App\Http\Controllers\Reports\ReportController::class, 'leaves']);
        Route::get('recruitment', [\App\Http\Controllers\Reports\ReportController::class, 'recruitment']);
        Route::get('payroll', [\App\Http\Controllers\Reports\ReportController::class, 'payroll']);
        Route::get('performance', [\App\Http\Controllers\Reports\ReportController::class, 'performance']);
        Route::get('turnover', [\App\Http\Controllers\Reports\ReportController::class, 'turnover']);
        Route::post('custom', [\App\Http\Controllers\Reports\ReportController::class, 'custom']);
        Route::post('save', [\App\Http\Controllers\Reports\ReportController::class, 'save']);
        Route::get('saved', [\App\Http\Controllers\Reports\ReportController::class, 'saved']);
        Route::delete('saved/{id}', [\App\Http\Controllers\Reports\ReportController::class, 'deleteSaved']);
        Route::post('schedule', [\App\Http\Controllers\Reports\ReportController::class, 'schedule']);
        Route::get('export', [\App\Http\Controllers\Reports\ReportController::class, 'export']);
    });

    // ──────────────────────────────────────
    // Module 12: System Administration
    // ──────────────────────────────────────
    Route::middleware('role:Admin')->prefix('admin')->group(function () {
        // Users
        Route::apiResource('users', \App\Http\Controllers\Admin\UserController::class);
        Route::post('users/{id}/reset-password', [\App\Http\Controllers\Admin\UserController::class, 'resetPassword']);
        Route::post('users/bulk-import', [\App\Http\Controllers\Admin\UserController::class, 'bulkImport']);
        Route::post('users/{id}/roles', [\App\Http\Controllers\Admin\UserController::class, 'assignRole']);
        Route::delete('users/{id}/roles/{roleId}', [\App\Http\Controllers\Admin\UserController::class, 'removeRole']);

        // Roles & Permissions
        Route::apiResource('roles', \App\Http\Controllers\Admin\RoleController::class);
        Route::get('permissions', [\App\Http\Controllers\Admin\RoleController::class, 'permissions']);

        // System Settings
        Route::get('system-settings', [\App\Http\Controllers\Admin\SystemSettingController::class, 'index']);
        Route::put('system-settings', [\App\Http\Controllers\Admin\SystemSettingController::class, 'update']);

        // Email Templates
        Route::get('email-templates', [\App\Http\Controllers\Admin\EmailTemplateController::class, 'index']);
        Route::put('email-templates/{id}', [\App\Http\Controllers\Admin\EmailTemplateController::class, 'update']);
        Route::post('email-templates/{id}/test', [\App\Http\Controllers\Admin\EmailTemplateController::class, 'test']);

        // Audit Logs
        Route::get('audit-logs', [\App\Http\Controllers\Admin\AuditLogController::class, 'index']);
        Route::get('audit-logs/export', [\App\Http\Controllers\Admin\AuditLogController::class, 'export']);
    });
});

// ──────────────────────────────────────────
// Public Routes (no auth required)
// ──────────────────────────────────────────
Route::prefix('careers')->group(function () {
    Route::get('/', [\App\Http\Controllers\Recruitment\JobController::class, 'publicIndex']);
    Route::get('{id}', [\App\Http\Controllers\Recruitment\JobController::class, 'publicShow']);
    Route::post('{id}/apply', [\App\Http\Controllers\Recruitment\ApplicationController::class, 'store']);
});
