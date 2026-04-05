<?php

namespace Modules\Employee\app\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Route;

class EmployeeServiceProvider extends ServiceProvider
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
