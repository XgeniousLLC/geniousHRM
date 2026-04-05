<?php

namespace Modules\Attendance\app\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Route;

class AttendanceServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        $this->loadMigrationsFrom(__DIR__ . '/../../database/migrations');
        $this->registerRoutes();
    }

    private function registerRoutes(): void
    {
        Route::middleware('web')
            ->group(__DIR__ . '/../../routes/web.php');
    }
}
