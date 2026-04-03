<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::firstOrCreate(
            ['email' => 'admin@geniushrm.test'],
            [
                'name'     => 'Super Admin',
                'password' => Hash::make('Admin@1234'),
            ]
        );

        $admin->assignRole('Admin');

        // Demo HR Manager
        $hr = User::firstOrCreate(
            ['email' => 'hr@geniushrm.test'],
            [
                'name'     => 'HR Manager',
                'password' => Hash::make('Admin@1234'),
            ]
        );
        $hr->assignRole('HR Manager');

        // Demo Manager
        $manager = User::firstOrCreate(
            ['email' => 'manager@geniushrm.test'],
            [
                'name'     => 'Department Manager',
                'password' => Hash::make('Admin@1234'),
            ]
        );
        $manager->assignRole('Manager');

        // Demo Employee
        $employee = User::firstOrCreate(
            ['email' => 'employee@geniushrm.test'],
            [
                'name'     => 'John Employee',
                'password' => Hash::make('Admin@1234'),
            ]
        );
        $employee->assignRole('Employee');
    }
}
