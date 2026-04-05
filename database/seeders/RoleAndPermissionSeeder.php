<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleAndPermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Define permissions per module
        $modules = [
            'employees'    => ['view', 'create', 'edit', 'delete', 'export', 'import'],
            'departments'  => ['view', 'create', 'edit', 'delete'],
            'attendance'   => ['view', 'create', 'edit', 'mark'],
            'leaves'       => ['view', 'apply', 'approve', 'reject', 'manage'],
            'recruitment'  => ['view', 'create', 'edit', 'delete', 'manage'],
            'payroll'      => ['view', 'process', 'approve', 'export'],
            'performance'  => ['view', 'create', 'edit', 'manage'],
            'training'     => ['view', 'create', 'edit', 'manage'],
            'documents'    => ['view', 'upload', 'delete', 'manage'],
            'reports'      => ['view', 'export'],
            'admin'        => ['users', 'roles', 'settings', 'audit-logs'],
        ];

        foreach ($modules as $module => $actions) {
            foreach ($actions as $action) {
                Permission::firstOrCreate(['name' => "{$module}.{$action}"]);
            }
        }

        // Create roles with permissions
        $roles = [
            'Admin' => array_merge(
                ...array_map(
                    fn ($module, $actions) => array_map(fn ($a) => "{$module}.{$a}", $actions),
                    array_keys($modules),
                    $modules
                )
            ),

            'HR Manager' => [
                'employees.view', 'employees.create', 'employees.edit', 'employees.delete',
                'employees.export', 'employees.import',
                'departments.view', 'departments.create', 'departments.edit', 'departments.delete',
                'attendance.view', 'attendance.mark',
                'leaves.view', 'leaves.approve', 'leaves.reject', 'leaves.manage',
                'recruitment.view', 'recruitment.create', 'recruitment.edit', 'recruitment.manage',
                'payroll.view',
                'performance.view', 'performance.manage',
                'training.view', 'training.create', 'training.manage',
                'documents.view', 'documents.upload', 'documents.manage',
                'reports.view', 'reports.export',
            ],

            'Manager' => [
                'employees.view',
                'departments.view',
                'attendance.view', 'attendance.mark',
                'leaves.view', 'leaves.approve', 'leaves.reject',
                'recruitment.view',
                'performance.view', 'performance.create', 'performance.edit',
                'training.view',
                'documents.view',
                'reports.view',
            ],

            'Employee' => [
                'employees.view',
                'attendance.view', 'attendance.create',
                'leaves.view', 'leaves.apply',
                'performance.view',
                'training.view',
            ],

            'Recruiter' => [
                'employees.view',
                'recruitment.view', 'recruitment.create', 'recruitment.edit', 'recruitment.manage',
                'reports.view',
            ],

            'Finance' => [
                'employees.view',
                'payroll.view', 'payroll.process', 'payroll.approve', 'payroll.export',
                'reports.view', 'reports.export',
            ],
        ];

        foreach ($roles as $roleName => $permissions) {
            $role = Role::firstOrCreate(['name' => $roleName]);
            $role->syncPermissions($permissions);
        }
    }
}
