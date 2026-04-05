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
    KeyRound,
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

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useTheme, type Theme } from '@/hooks/useTheme';
import type { AppNotification, PageProps } from '@/types';

// ─── Nav config (permission-gated) ────────────────────────────────────────────

const NAV_CONFIG = [
    {
        group: 'Main',
        items: [
            { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, permission: null },
        ],
    },
    {
        group: 'People',
        items: [
            { label: 'Employees',   href: '/employees',   icon: Users,     permission: 'employees.view' },
            { label: 'Departments', href: '/departments', icon: Building2, permission: 'departments.view' },
            { label: 'Positions',   href: '/positions',   icon: Briefcase, permission: 'departments.view' },
        ],
    },
    {
        group: 'Time & Leave',
        items: [
            { label: 'Attendance',        href: '/attendance', icon: Clock,        permission: 'attendance.view' },
            { label: 'Leave Management',  href: '/leaves',     icon: CalendarDays, permission: 'leaves.view' },
        ],
    },
    {
        group: 'Talent',
        items: [
            { label: 'Recruitment', href: '/recruitment', icon: Briefcase, permission: 'recruitment.view' },
            { label: 'Performance', href: '/performance', icon: Star,      permission: 'performance.view' },
            { label: 'Training',    href: '/training',    icon: BookOpen,  permission: 'training.view' },
        ],
    },
    {
        group: 'Finance',
        items: [
            { label: 'Payroll', href: '/payroll', icon: CreditCard, permission: 'payroll.view' },
        ],
    },
    {
        group: 'System',
        items: [
            { label: 'Documents', href: '/documents', icon: FileText,  permission: 'documents.view' },
            { label: 'Reports',   href: '/reports',   icon: BarChart3, permission: 'reports.view' },
        ],
    },
    {
        group: 'Administration',
        items: [
            { label: 'Settings',            href: '/admin/settings',   icon: Settings,  permission: 'admin.settings' },
            { label: 'Users',               href: '/admin/users',      icon: Users,     permission: 'admin.users' },
            { label: 'Roles & Permissions', href: '/admin/roles',      icon: Shield,    permission: 'admin.roles' },
            { label: 'Audit Log',           href: '/admin/audit-log',  icon: BarChart3, permission: 'admin.audit-logs' },
        ],
    },
];

// ─── Sidebar ──────────────────────────────────────────────────────────────────

function Sidebar({ currentPath }: { currentPath: string }) {
    const page = usePage<PageProps>().props;
    const { app_settings } = page as any;
    const permissions: string[] = (page.auth?.user as any)?.permissions ?? [];

    const appName       = app_settings?.app_name ?? 'GeniusHRM';
    const footerCopyright = app_settings?.footer_copyright ?? `© ${new Date().getFullYear()} GeniusHRM. All rights reserved.`;
    const logoPath      = app_settings?.logo_path;

    const can = (permission: string | null) => !permission || permissions.includes(permission);

    return (
        <aside className="flex h-screen w-60 flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            {/* Brand */}
            <div className="flex h-16 items-center gap-3 px-5 border-b border-slate-100 dark:border-slate-800">
                {logoPath ? (
                    <img src={`/storage/${logoPath}`} alt={appName} className="h-7 w-auto object-contain flex-shrink-0" />
                ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 shadow-sm flex-shrink-0">
                        <span className="text-white text-sm font-bold">{appName.charAt(0).toUpperCase()}</span>
                    </div>
                )}
                <div className="min-w-0">
                    <p className="font-semibold text-slate-900 dark:text-white text-sm leading-none truncate">{appName}</p>
                    <p className="text-slate-400 text-xs mt-0.5">HR Management</p>
                </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
                {NAV_CONFIG.map((group) => {
                    const visibleItems = group.items.filter(item => can(item.permission));
                    if (visibleItems.length === 0) return null;
                    return (
                        <div key={group.group}>
                            <p className="px-2 mb-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                {group.group}
                            </p>
                            <ul className="space-y-0.5">
                                {visibleItems.map(({ label, href, icon: Icon }) => {
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
                                                <Icon size={16} className={active ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'} />
                                                {label}
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    );
                })}
            </nav>

            {/* Footer copyright */}
            <div className="border-t border-slate-100 dark:border-slate-800">
                <p className="text-xs text-slate-400 px-3 py-3 leading-snug">{footerCopyright}</p>
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
            <DropdownMenuTrigger
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Toggle theme"
            >
                <Icon size={18} />
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

function NotificationBell({ notifications, unreadCount }: { notifications: AppNotification[]; unreadCount: number }) {
    function markAllRead() {
        router.post('/notifications/mark-all-read', {}, { preserveScroll: true });
    }
    function visitAndRead(n: AppNotification) {
        router.post(`/notifications/${n.id}/mark-read`, {}, {
            preserveScroll: true,
            onSuccess: () => { if (n.url) router.visit(n.url); },
        });
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="relative flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <Bell size={18} />
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
                )}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 p-0">
                {/* Header */}
                <div className="flex items-center justify-between px-3 py-2.5 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                        Notifications {unreadCount > 0 && <span className="ml-1 text-xs font-normal text-slate-400">({unreadCount} unread)</span>}
                    </p>
                    {unreadCount > 0 && (
                        <button onClick={markAllRead} className="text-xs text-blue-600 hover:underline">
                            Mark all read
                        </button>
                    )}
                </div>

                {/* List */}
                {notifications.length === 0 ? (
                    <div className="py-8 text-center text-sm text-slate-400">No new notifications</div>
                ) : (
                    <div className="max-h-80 overflow-y-auto divide-y divide-slate-50 dark:divide-slate-800">
                        {notifications.map((n) => (
                            <button
                                key={n.id}
                                onClick={() => visitAndRead(n)}
                                className="w-full text-left px-3 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors block"
                            >
                                <p className="text-sm font-medium text-slate-900 dark:text-white leading-snug">{n.title}</p>
                                <p className="text-xs text-slate-500 mt-0.5 leading-snug">{n.message}</p>
                                <p className="text-xs text-slate-400 mt-1">{n.created_at}</p>
                            </button>
                        ))}
                    </div>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

function Header({ user }: { user: PageProps['auth']['user'] }) {
    const { notifications, unread_count } = usePage<PageProps>().props;

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
                <NotificationBell notifications={notifications} unreadCount={unread_count} />

                {/* Divider */}
                <div className="w-px h-6 bg-slate-200 dark:bg-slate-700" />

                {/* User menu */}
                <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                        <div className="h-7 w-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                            {initials}
                        </div>
                        <div className="text-left hidden sm:block">
                            <p className="text-sm font-medium text-slate-900 dark:text-white leading-none">{user?.name}</p>
                            <p className="text-xs text-slate-400 mt-0.5">{user?.roles?.[0] ?? 'User'}</p>
                        </div>
                        <ChevronDown size={14} className="text-slate-400" />
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="w-52">
                        {/* User info header — plain div, NOT DropdownMenuLabel (requires Menu.Group parent) */}
                        <div className="px-2 py-2 border-b border-slate-100 dark:border-slate-800 mb-1">
                            <p className="font-medium text-sm text-slate-900 dark:text-white">{user?.name}</p>
                            <p className="text-xs text-slate-500 mt-0.5">{user?.email}</p>
                        </div>
                        <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => router.visit('/profile')}
                        >
                            <User size={14} className="mr-2" /> Profile Settings
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => router.visit('/profile/password')}
                        >
                            <KeyRound size={14} className="mr-2" /> Change Password
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={logout}
                            className="text-red-600 cursor-pointer"
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
