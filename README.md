# GeniusHRM

**Open-source Enterprise HR Management System** built with Laravel.

[![License](https://img.shields.io/packagist/l/laravel/framework)](https://opensource.org/licenses/MIT)

## Links

- **Live Demo:** [https://genius-hrm.xgenious.com/](https://genius-hrm.xgenious.com/)
- **Documentation:** [https://genious-hrm-whnd.vercel.app/](https://genious-hrm-whnd.vercel.app/)

## Features

- Employee Management
- Attendance & Shifts
- Leave Management
- Payroll & Compensation
- Recruitment & ATS
- Performance Management
- Training & Development
- Documents & Compliance
- Reports & Analytics
- Roles & Permissions

## Requirements

- PHP 8.1+
- Composer
- MySQL / MariaDB
- Node.js & NPM

## Installation

```bash
git clone https://github.com/xgeniousllc/geniushrm.git
cd geniushrm

composer install
cp .env.example .env
php artisan key:generate

# Configure your database in .env, then:
php artisan migrate --seed
npm install && npm run build
php artisan serve
```

For full setup instructions, see the [documentation](https://genious-hrm-whnd.vercel.app/guide/installation).

## License

GeniusHRM is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
