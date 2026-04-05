<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user() ? [
                    'id'          => $request->user()->id,
                    'name'        => $request->user()->name,
                    'email'       => $request->user()->email,
                    'roles'       => $request->user()->getRoleNames(),
                    'permissions' => $request->user()->getAllPermissions()->pluck('name'),
                ] : null,
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error'   => fn () => $request->session()->get('error'),
                'info'    => fn () => $request->session()->get('info'),
            ],
            'notifications' => fn () => $request->user()
                ? $request->user()->unreadNotifications->take(15)->map(fn ($n) => [
                    'id'         => $n->id,
                    'title'      => $n->data['title'] ?? 'Notification',
                    'message'    => $n->data['message'] ?? '',
                    'url'        => $n->data['url'] ?? null,
                    'created_at' => $n->created_at->diffForHumans(),
                ])->values()
                : [],
            'unread_count' => fn () => $request->user()
                ? $request->user()->unreadNotifications()->count()
                : 0,
            'app_settings' => function () {
                return [
                    'app_name'         => \Modules\SystemAdmin\app\Models\SystemSetting::get('app_name', 'GeniusHRM'),
                    'footer_copyright' => \Modules\SystemAdmin\app\Models\SystemSetting::get('footer_copyright', '© ' . date('Y') . ' GeniusHRM. All rights reserved.'),
                    'logo_path'        => \Modules\SystemAdmin\app\Models\SystemSetting::get('logo_path'),
                ];
            },
        ];
    }
}
