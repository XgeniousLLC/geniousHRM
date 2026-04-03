<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ config('app.name', 'GeniusHRM') }}</title>

        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.tsx'])
        @inertiaHead
        <script>
            (function() {
                var theme = localStorage.getItem('hrm-theme') || 'system';
                var dark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
                document.documentElement.classList.add(dark ? 'dark' : 'light');
            })();
        </script>
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
