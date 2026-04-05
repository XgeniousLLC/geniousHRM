<?php

namespace App\Http\Controllers\Reports;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Department;
use App\Models\Employee;
use App\Models\JobPosting;
use App\Models\LeaveRequest;
use App\Models\PayrollRun;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Modules\SystemAdmin\app\Models\AuditLog;
use Modules\Training\app\Models\TrainingEnrollment;

class DashboardController extends Controller
{
    public function __invoke()
    {
        $today      = now()->toDateString();
        $thisMonth  = now()->month;
        $thisYear   = now()->year;
        $lastMonth  = now()->subMonth();

        // ── Core KPIs ──────────────────────────────────────────────────────────
        $totalEmployees     = Employee::where('employment_status', 'Active')->count();
        $newThisMonth       = Employee::where('employment_status', 'Active')
                                ->whereMonth('date_of_joining', $thisMonth)
                                ->whereYear('date_of_joining', $thisYear)->count();

        $presentToday       = Attendance::where('date', $today)
                                ->whereIn('status', ['present', 'late'])->count();
        $attendanceRate     = $totalEmployees > 0
                                ? round($presentToday / $totalEmployees * 100, 1) : 0;

        $onLeaveToday       = LeaveRequest::where('status', 'approved')
                                ->where('start_date', '<=', $today)
                                ->where('end_date', '>=', $today)->count();
        $pendingLeaves      = LeaveRequest::where('status', 'pending')->count();

        $openPositions      = JobPosting::where('status', 'open')->count();
        $totalApplications  = \App\Models\JobApplication::count();


        // ── Secondary stats ────────────────────────────────────────────────────
        $totalDepartments   = Department::count();

        $lastPayroll        = PayrollRun::where('status', 'paid')
                                ->orderByDesc('year')->orderByDesc('month')->first();
        $lastPayrollAmount  = $lastPayroll ? number_format($lastPayroll->total_net, 0) : '—';
        $lastPayrollLabel   = $lastPayroll
                                ? Carbon::create($lastPayroll->year, $lastPayroll->month)->format('M Y')
                                : null;

        $trainingCompletion = TrainingEnrollment::count() > 0
            ? round(TrainingEnrollment::where('status', 'completed')->count() / TrainingEnrollment::count() * 100, 1)
            : 0;

        $pendingApprovals   = LeaveRequest::where('status', 'pending')->count()
                            + \App\Models\JobApplication::where('stage', 'interview')->count();

        // Headcount by department (top 6)
        $headcountByDept = Employee::where('employment_status', 'Active')
            ->with('department:id,name')
            ->get()
            ->groupBy(fn ($e) => $e->department?->name ?? 'Unassigned')
            ->map->count()
            ->sortDesc()
            ->take(6)
            ->map(fn ($count, $name) => ['name' => $name, 'count' => $count])
            ->values();

        // Headcount trend last 6 months
        $headcountTrend = collect(range(5, 0))->map(function ($i) {
            $date = now()->subMonths($i)->endOfMonth();
            return [
                'month' => $date->format('M'),
                'count' => Employee::where('employment_status', 'Active')
                    ->where('date_of_joining', '<=', $date)->count(),
            ];
        })->values();

        // Attendance trend last 7 days
        $attendanceTrend = collect(range(6, 0))->map(function ($i) {
            $date = now()->subDays($i)->toDateString();
            return [
                'date'    => Carbon::parse($date)->format('D'),
                'present' => Attendance::where('date', $date)->whereIn('status', ['present', 'late'])->count(),
                'absent'  => Attendance::where('date', $date)->where('status', 'absent')->count(),
            ];
        })->values();

        // Leave by type this month
        $leaveByType = LeaveRequest::where('status', 'approved')
            ->whereMonth('start_date', $thisMonth)
            ->whereYear('start_date', $thisYear)
            ->with('leaveType:id,name')
            ->get()
            ->groupBy(fn ($r) => $r->leaveType?->name ?? 'Other')
            ->map->count()
            ->map(fn ($count, $name) => ['name' => $name, 'count' => $count])
            ->values();

        // Recent audit log activity
        $recentActivity = AuditLog::with('user:id,name')
            ->orderByDesc('created_at')
            ->take(8)
            ->get()
            ->map(fn ($log) => [
                'id'          => $log->id,
                'user'        => $log->user_name,
                'action'      => $log->action,
                'module'      => $log->module,
                'description' => $log->description,
                'time'        => $log->created_at->diffForHumans(),
            ]);

        // Employment type breakdown
        $employmentTypes = Employee::where('employment_status', 'Active')
            ->select('contract_type', DB::raw('count(*) as count'))
            ->whereNotNull('contract_type')
            ->groupBy('contract_type')
            ->pluck('count', 'contract_type');

        // Gender breakdown
        $genderBreakdown = Employee::where('employment_status', 'Active')
            ->select('gender', DB::raw('count(*) as count'))
            ->whereNotNull('gender')
            ->groupBy('gender')
            ->pluck('count', 'gender');

        return Inertia::render('Dashboard', [
            'stats' => [
                'total_employees'    => $totalEmployees,
                'new_this_month'     => $newThisMonth,
                'present_today'      => $presentToday,
                'attendance_rate'    => $attendanceRate,
                'on_leave_today'     => $onLeaveToday,
                'pending_leaves'     => $pendingLeaves,
                'open_positions'     => $openPositions,
                'total_applications' => $totalApplications,
                'total_departments'  => $totalDepartments,
                'last_payroll_net'   => $lastPayrollAmount,
                'last_payroll_month' => $lastPayrollLabel,
                'training_completion'=> $trainingCompletion,
                'pending_approvals'  => $pendingApprovals,
            ],
            'headcountByDept'  => $headcountByDept,
            'headcountTrend'   => $headcountTrend,
            'attendanceTrend'  => $attendanceTrend,
            'leaveByType'      => $leaveByType,
            'employmentTypes'  => $employmentTypes,
            'genderBreakdown'  => $genderBreakdown,
            'recentActivity'   => $recentActivity,
        ]);
    }
}
