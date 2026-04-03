import { Link, router, usePage } from '@inertiajs/react';
import {
    BarChart3,
    Bell,
    BookOpen,
    Briefcase,
    Building2,
    ChevronDown,
    CreditCard,
    FileText,
    LayoutDashboard,
    LogOut,
    Monitor,
    Moon,
    Settings,
    Shield,
    Star,
    Sun,
    User,
    Users,
    Clock,
    CalendarDays,
} from 'lucide-react';
import { useState } from 'react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { useTheme, type Theme } from '@/hooks/useTheme';
import type { PageProps } from '@/types';

// ─── Nav config ───────────────────────────────────────────────────────────────

const navItems = [
    {
        group: 'Main',
        items: [
            { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        ],
    },
    {
        group: 'People',
        items: [
            { label: 'Employees', href: '/employees', icon: Users },
            { label: 'Departments', href: '/departments', icon: Building2 },
            { label: 'Org Chart', href: '/org-chart', icon: Building2 },
        ],
    },
    {
        group: 'Time & Leave',
        items: [
            { label: 'Attendance', href: '/attendance', icon: Clock },
            { label: 'Leave Management', href: '/leaves', icon: CalendarDays },
        ],
    },
    {
        group: 'Talent',
        items: [
            { label: 'Recruitment', href: '/recruitment', icon: Briefcase },
            { label: 'Performance', href: '/performance', icon: Star },
            { label: 'Training', href: '/training', icon: BookOpen },
        ],
    },
    {
        group: 'Finance',
        items: [
            { label: 'Payroll', href: '/payroll', icon: CreditCard },
        ],
    },
    {
        group: 'System',
        items: [
            { label: 'Documents', href: '/documents', icon: FileText },
            { label: 'Reports', href: '/reports', icon: BarChart3 },
            { label: 'Administration', href: '/admin', icon: Shield },
        ],
    },
];

// ─── Sidebar ──────────────────────────────────────────────────────────────────

function Sidebar({ currentPath }: { currentPath: string }) {
    return (
        <aside className="flex h-screen w-60 flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            {/* Brand */}
            <div className="flex h-16 items-center gap-3 px-5 border-b border-slate-100 dark:border-slate-800">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 shadow-sm">
                    <span className="text-white text-sm font-bold">G</span>
                </div>
                <div>
                    <p className="font-semibold text-slate-900 dark:text-white text-sm leading-none">GeniusHRM</p>
                    <p className="text-slate-400 text-xs mt-0.5">HR Management</p>
                </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
                {navItems.map((group) => (
                    <div key={group.group}>
                        <p className="px-2 mb-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                            {group.group}
                        </p>
                        <ul className="space-y-0.5">
                            {group.items.map(({ label, href, icon: Icon }) => {
                                const active = currentPath === href || currentPath.startsWith(href + '/');
                                return (
                                    <li key={href}>
                                        <Link
                                            href={href}
                                            className={cn(
                                                'flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors',
                                                active
                                                    ? 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400'
                                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white',
                                            )}
                                        >
                                            <Icon
                                                size={16}
                                                className={active ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}
                                            />
                                            {label}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ))}
            </nav>

            {/* Bottom settings link */}
            <div className="border-t border-slate-100 dark:border-slate-800 p-3">
                <Link
                    href="/admin/settings"
                    className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                    <Settings size={16} />
                    Settings
                </Link>
            </div>
        </aside>
    );
}

// ─── Theme Toggle ─────────────────────────────────────────────────────────────

const themeOptions: { value: Theme; icon: React.ElementType; label: string }[] = [
    { value: 'light',  icon: Sun,     label: 'Light'  },
    { value: 'dark',   icon: Moon,    label: 'Dark'   },
    { value: 'system', icon: Monitor, label: 'System' },
];

function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const current = themeOptions.find((t) => t.value === theme) ?? themeOptions[2];
    const Icon = current.icon;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <Icon size={18} />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36">
                {themeOptions.map(({ value, icon: ItemIcon, label }) => (
                    <DropdownMenuItem
                        key={value}
                        onClick={() => setTheme(value)}
                        className={cn('cursor-pointer gap-2', theme === value && 'font-semibold text-blue-600')}
                    >
                        <ItemIcon size={14} /> {label}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

// ─── Header ───────────────────────────────────────────────────────────────────

function Header({ user }: { user: PageProps['auth']['user'] }) {
    function logout() {
        router.post('/logout');
    }

    const initials = user?.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2) ?? 'U';

    return (
        <header className="flex h-16 items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6">
            <div />

            <div className="flex items-center gap-2">
                {/* Theme toggle */}
                <ThemeToggle />

                {/* Notifications */}
                <button className="relative flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <Bell size={18} />
                    <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
                </button>

                <Separator orientation="vertical" className="h-6" />

                {/* User menu */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                            <Avatar className="h-7 w-7">
                                <AvatarFallback className="bg-blue-600 text-white text-xs font-semibold">
                                    {initials}
                                </AvatarFallback>
                            </Avatar>
                            <div className="text-left hidden sm:block">
                                <p className="text-sm font-medium text-slate-900 dark:text-white leading-none">{user?.name}</p>
                                <p className="text-xs text-slate-400 mt-0.5">{user?.roles?.[0] ?? 'User'}</p>
                            </div>
                            <ChevronDown size={14} className="text-slate-400" />
                        </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="w-52">
                        <DropdownMenuLabel className="font-normal">
                            <p className="font-medium text-sm">{user?.name}</p>
                            <p className="text-xs text-slate-500 mt-0.5">{user?.email}</p>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href="/profile" className="cursor-pointer">
                                <User size={14} className="mr-2" /> My Profile
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/admin/settings" className="cursor-pointer">
                                <Settings size={14} className="mr-2" /> Settings
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={logout}
                            className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                        >
                            <LogOut size={14} className="mr-2" /> Sign out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}

// ─── AppLayout ────────────────────────────────────────────────────────────────

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const { auth } = usePage<PageProps>().props;
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/dashboard';

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
            <Sidebar currentPath={currentPath} />
            <div className="flex flex-1 flex-col overflow-hidden">
                <Header user={auth.user} />
                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
