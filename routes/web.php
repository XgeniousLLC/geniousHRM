<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes — GeniusHRM (Inertia SPA)
|--------------------------------------------------------------------------
| All web routes serve the Inertia SPA. The React frontend handles routing.
| API routes are in routes/api.php.
*/

Route::get('/{any}', function () {
    return inertia('Home');
})->where('any', '.*');
