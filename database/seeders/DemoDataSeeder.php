<?php

namespace Database\Seeders;

use App\Models\Department;
use App\Models\Employee;
use App\Models\Position;
use Illuminate\Database\Seeder;

class DemoDataSeeder extends Seeder
{
    public function run(): void
    {
        $this->seedDepartments();
        $this->seedPositions();
        $this->seedEmployees();
    }

    private function seedDepartments(): void
    {
        $departments = [
            ['name' => 'Engineering',       'description' => 'Software development and infrastructure'],
            ['name' => 'Human Resources',   'description' => 'People operations and talent management'],
            ['name' => 'Finance',           'description' => 'Accounting, budgeting, and financial planning'],
            ['name' => 'Marketing',         'description' => 'Brand, growth, and communications'],
            ['name' => 'Sales',             'description' => 'Revenue generation and client relationships'],
            ['name' => 'Product',           'description' => 'Product strategy and roadmap'],
            ['name' => 'Customer Support',  'description' => 'Client success and technical support'],
            ['name' => 'Operations',        'description' => 'Business operations and process management'],
        ];

        foreach ($departments as $data) {
            Department::firstOrCreate(['name' => $data['name']], $data);
        }
    }

    private function seedPositions(): void
    {
        $map = [
            'Engineering'      => ['Software Engineer', 'Senior Software Engineer', 'Engineering Manager', 'DevOps Engineer', 'QA Engineer'],
            'Human Resources'  => ['HR Manager', 'HR Specialist', 'Recruiter', 'Payroll Specialist'],
            'Finance'          => ['Finance Manager', 'Accountant', 'Financial Analyst'],
            'Marketing'        => ['Marketing Manager', 'Content Specialist', 'SEO Analyst', 'Graphic Designer'],
            'Sales'            => ['Sales Manager', 'Sales Executive', 'Account Manager'],
            'Product'          => ['Product Manager', 'Product Designer', 'Business Analyst'],
            'Customer Support' => ['Support Manager', 'Support Specialist'],
            'Operations'       => ['Operations Manager', 'Operations Analyst'],
        ];

        foreach ($map as $deptName => $positions) {
            $dept = Department::where('name', $deptName)->first();
            if (!$dept) continue;

            foreach ($positions as $title) {
                Position::firstOrCreate(
                    ['name' => $title, 'department_id' => $dept->id],
                    ['name' => $title, 'department_id' => $dept->id, 'description' => null]
                );
            }
        }
    }

    private function seedEmployees(): void
    {
        $employees = [
            [
                'first_name' => 'James',        'last_name' => 'Wilson',
                'email'      => 'james.wilson@geniushrm.test',
                'department' => 'Engineering',  'position' => 'Engineering Manager',
                'status'     => 'Active',        'contract' => 'Permanent',
                'salary'     => 95000,           'joining'  => '2021-03-15',
                'gender'     => 'Male',          'phone'    => '+1-555-0101',
            ],
            [
                'first_name' => 'Sarah',        'last_name' => 'Chen',
                'email'      => 'sarah.chen@geniushrm.test',
                'department' => 'Engineering',  'position' => 'Senior Software Engineer',
                'status'     => 'Active',        'contract' => 'Permanent',
                'salary'     => 82000,           'joining'  => '2022-01-10',
                'gender'     => 'Female',        'phone'    => '+1-555-0102',
            ],
            [
                'first_name' => 'Michael',      'last_name' => 'Torres',
                'email'      => 'michael.torres@geniushrm.test',
                'department' => 'Engineering',  'position' => 'Software Engineer',
                'status'     => 'Active',        'contract' => 'Permanent',
                'salary'     => 68000,           'joining'  => '2023-06-01',
                'gender'     => 'Male',          'phone'    => '+1-555-0103',
            ],
            [
                'first_name' => 'Emily',        'last_name' => 'Davis',
                'email'      => 'emily.davis@geniushrm.test',
                'department' => 'Human Resources', 'position' => 'HR Manager',
                'status'     => 'Active',           'contract' => 'Permanent',
                'salary'     => 72000,              'joining'  => '2020-09-20',
                'gender'     => 'Female',           'phone'    => '+1-555-0104',
            ],
            [
                'first_name' => 'David',        'last_name' => 'Kim',
                'email'      => 'david.kim@geniushrm.test',
                'department' => 'Finance',      'position' => 'Finance Manager',
                'status'     => 'Active',        'contract' => 'Permanent',
                'salary'     => 88000,           'joining'  => '2019-11-05',
                'gender'     => 'Male',          'phone'    => '+1-555-0105',
            ],
            [
                'first_name' => 'Jessica',      'last_name' => 'Patel',
                'email'      => 'jessica.patel@geniushrm.test',
                'department' => 'Marketing',    'position' => 'Marketing Manager',
                'status'     => 'Active',        'contract' => 'Permanent',
                'salary'     => 75000,           'joining'  => '2021-07-12',
                'gender'     => 'Female',        'phone'    => '+1-555-0106',
            ],
            [
                'first_name' => 'Robert',       'last_name' => 'Johnson',
                'email'      => 'robert.johnson@geniushrm.test',
                'department' => 'Sales',         'position' => 'Sales Manager',
                'status'     => 'Active',         'contract' => 'Permanent',
                'salary'     => 78000,            'joining'  => '2020-04-18',
                'gender'     => 'Male',           'phone'    => '+1-555-0107',
            ],
            [
                'first_name' => 'Amanda',       'last_name' => 'Brown',
                'email'      => 'amanda.brown@geniushrm.test',
                'department' => 'Product',      'position' => 'Product Manager',
                'status'     => 'Active',        'contract' => 'Permanent',
                'salary'     => 90000,           'joining'  => '2022-02-28',
                'gender'     => 'Female',        'phone'    => '+1-555-0108',
            ],
            [
                'first_name' => 'Kevin',        'last_name' => 'Lee',
                'email'      => 'kevin.lee@geniushrm.test',
                'department' => 'Engineering',  'position' => 'DevOps Engineer',
                'status'     => 'Active',        'contract' => 'Permanent',
                'salary'     => 76000,           'joining'  => '2022-08-15',
                'gender'     => 'Male',          'phone'    => '+1-555-0109',
            ],
            [
                'first_name' => 'Sophia',       'last_name' => 'Martinez',
                'email'      => 'sophia.martinez@geniushrm.test',
                'department' => 'Customer Support', 'position' => 'Support Manager',
                'status'     => 'Active',            'contract' => 'Permanent',
                'salary'     => 62000,               'joining'  => '2021-05-03',
                'gender'     => 'Female',            'phone'    => '+1-555-0110',
            ],
            [
                'first_name' => 'Daniel',       'last_name' => 'Taylor',
                'email'      => 'daniel.taylor@geniushrm.test',
                'department' => 'Finance',      'position' => 'Accountant',
                'status'     => 'On Leave',      'contract' => 'Permanent',
                'salary'     => 58000,           'joining'  => '2020-12-01',
                'gender'     => 'Male',          'phone'    => '+1-555-0111',
            ],
            [
                'first_name' => 'Rachel',       'last_name' => 'White',
                'email'      => 'rachel.white@geniushrm.test',
                'department' => 'Marketing',    'position' => 'Content Specialist',
                'status'     => 'Active',        'contract' => 'Contract',
                'salary'     => 52000,           'joining'  => '2023-01-09',
                'gender'     => 'Female',        'phone'    => '+1-555-0112',
            ],
            [
                'first_name' => 'Thomas',       'last_name' => 'Anderson',
                'email'      => 'thomas.anderson@geniushrm.test',
                'department' => 'Operations',   'position' => 'Operations Manager',
                'status'     => 'Active',         'contract' => 'Permanent',
                'salary'     => 80000,            'joining'  => '2019-06-17',
                'gender'     => 'Male',           'phone'    => '+1-555-0113',
            ],
            [
                'first_name' => 'Laura',        'last_name' => 'Garcia',
                'email'      => 'laura.garcia@geniushrm.test',
                'department' => 'Human Resources', 'position' => 'Recruiter',
                'status'     => 'Active',           'contract' => 'Permanent',
                'salary'     => 55000,              'joining'  => '2022-10-24',
                'gender'     => 'Female',           'phone'    => '+1-555-0114',
            ],
            [
                'first_name' => 'Andrew',       'last_name' => 'Scott',
                'email'      => 'andrew.scott@geniushrm.test',
                'department' => 'Engineering',  'position' => 'QA Engineer',
                'status'     => 'Inactive',      'contract' => 'Contract',
                'salary'     => 60000,           'joining'  => '2021-11-30',
                'gender'     => 'Male',          'phone'    => '+1-555-0115',
            ],
        ];

        $counter = Employee::withTrashed()->count();

        foreach ($employees as $data) {
            if (Employee::where('email', $data['email'])->exists()) {
                continue;
            }

            $dept     = Department::where('name', $data['department'])->first();
            $position = Position::where('name', $data['position'])->first();

            $counter++;
            Employee::create([
                'employee_id'       => 'EMP-' . str_pad($counter, 3, '0', STR_PAD_LEFT),
                'first_name'        => $data['first_name'],
                'last_name'         => $data['last_name'],
                'email'             => $data['email'],
                'phone'             => $data['phone'],
                'gender'            => $data['gender'],
                'department_id'     => $dept?->id,
                'position_id'       => $position?->id,
                'date_of_joining'   => $data['joining'],
                'contract_type'     => $data['contract'],
                'employment_status' => $data['status'],
                'salary'            => $data['salary'],
            ]);
        }
    }
}
