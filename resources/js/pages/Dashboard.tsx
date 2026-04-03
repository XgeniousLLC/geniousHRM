import { usePage } from '@inertiajs/react';
import {
    ArrowUpRight,
    BarChart3,
    Briefcase,
    CalendarCheck,
    CalendarDays,
    Clock,
    CreditCard,
    TrendingUp,
    Users,
    UserCheck,
    UserX,
    AlertCircle,
} from 'lucide-react';

import AppLayout from '@/components/layout/AppLayout';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { PageProps } from '@/types';

// ─── Types ────────────────────────────────────────────────────────────────────

interface StatCard {
    label: string;
    value: string | number;
    change?: string;
    changePositive?: boolean;
    icon: React.ElementType;
    color: string;
    bgColor: string;
}

interface Activity {
    id: number;
    type: 'leave' | 'attendance' | 'hire' | 'payroll';
    message: string;
    time: string;
    status?: 'pending' | 'approved' | 'rejected';
}

// ─── Mock data (replace with real API data in future) ─────────────────────────

const stats: StatCard[] = [
    {
        label: 'Total Employees',
        value: 0,
        change: '+0 this month',
        changePositive: true,
        icon: Users,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
    },
    {
        label: 'Present Today',
        value: 0,
        change: '0% attendance rate',
        changePositive: true,
        icon: UserCheck,
        color: 'text-emerald-600',
        bgColor: 'bg-emerald-50',
    },
    {
        label: 'On Leave',
        value: 0,
        change: '0 pending approvals',
        changePositive: true,
        icon: CalendarDays,
        color: 'text-amber-600',
        bgColor: 'bg-amber-50',
    },
    {
        label: 'Open Positions',
        value: 0,
        change: '0 applications',
        changePositive: true,
        icon: Briefcase,
        color: 'text-purple-600',
        bgColor: 'bg-purple-50',
    },
];

const recentActivities: Activity[] = [];

// ─── Components ───────────────────────────────────────────────────────────────

function StatCardItem({ stat }: { stat: StatCard }) {
    const Icon = stat.icon;
    return (
        <Card className="border-slate-200 hover:shadow-md transition-shadow">
            <CardContent className="p-5">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
                        <p className="text-3xl font-bold text-slate-900 mt-1">{stat.value}</p>
                        {stat.change && (
                            <p
                                className={cn(
                                    'text-xs mt-1.5 flex items-center gap-1',
                                    stat.changePositive ? 'text-emerald-600' : 'text-red-500',
                                )}
                            >
                                <TrendingUp size={11} />
                                {stat.change}
                            </p>
                        )}
                    </div>
                    <div className={cn('p-2.5 rounded-xl', stat.bgColor)}>
                        <Icon size={22} className={stat.color} />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function QuickAction({
    label,
    href,
    icon: Icon,
    description,
}: {
    label: string;
    href: string;
    icon: React.ElementType;
    description: string;
}) {
    return (
        <a
            href={href}
            className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-blue-200 hover:bg-blue-50/50 transition-all group"
        >
            <div className="p-2 rounded-lg bg-slate-100 group-hover:bg-blue-100 transition-colors">
                <Icon size={16} className="text-slate-600 group-hover:text-blue-600 transition-colors" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900">{label}</p>
                <p className="text-xs text-slate-500 truncate">{description}</p>
            </div>
            <ArrowUpRight size={14} className="text-slate-400 group-hover:text-blue-600 transition-colors" />
        </a>
    );
}

// ─── Dashboard Page ───────────────────────────────────────────────────────────

export default function Dashboard() {
    const { auth } = usePage<PageProps>().props;
    const user = auth.user;
    const role = user?.roles?.[0] ?? 'User';

    const greeting = (() => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    })();

    return (
        <AppLayout>
            <div className="space-y-6 max-w-7xl mx-auto">

                {/* Page header */}
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">
                            {greeting}, {user?.name?.split(' ')[0]} 👋
                        </h1>
                        <p className="text-slate-500 text-sm mt-1">
                            Here's what's happening across your organization today.
                        </p>
                    </div>
                    <Badge variant="secondary" className="text-xs px-3 py-1">
                        {role}
                    </Badge>
                </div>

                {/* Stat cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    {stats.map((stat) => (
                        <StatCardItem key={stat.label} stat={stat} />
                    ))}
                </div>

                {/* Main content row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Quick actions */}
                    <Card className="border-slate-200 lg:col-span-1">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-semibold text-slate-900">
                                Quick Actions
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <QuickAction
                                label="Add Employee"
                                href="/employees/create"
                                icon={Users}
                                description="Create a new employee record"
                            />
                            <QuickAction
                                label="Mark Attendance"
                                href="/attendance"
                                icon={Clock}
                                description="Check in / check out"
                            />
                            <QuickAction
                                label="Apply for Leave"
                                href="/leaves/apply"
                                icon={CalendarDays}
                                description="Submit a leave request"
                            />
                            <QuickAction
                                label="Post a Job"
                                href="/jobs/create"
                                icon={Briefcase}
                                description="Create a new job opening"
                            />
                            <QuickAction
                                label="Run Payroll"
                                href="/payroll"
                                icon={CreditCard}
                                description="Process monthly payroll"
                            />
                            <QuickAction
                                label="View Reports"
                                href="/reports"
                                icon={BarChart3}
                                description="Analytics and exports"
                            />
                        </CardContent>
                    </Card>

                    {/* Recent activity */}
                    <Card className="border-slate-200 lg:col-span-2">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-semibold text-slate-900">
                                Recent Activity
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {recentActivities.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                                        <CalendarCheck size={20} className="text-slate-400" />
                                    </div>
                                    <p className="text-sm font-medium text-slate-600">No activity yet</p>
                                    <p className="text-xs text-slate-400 mt-1">
                                        Activity will appear here as the team uses the system.
                                    </p>
                                </div>
                            ) : (
                                <ul className="space-y-3">
                                    {recentActivities.map((activity) => (
                                        <li
                                            key={activity.id}
                                            className="flex items-start gap-3 py-2 border-b border-slate-100 last:border-0"
                                        >
                                            <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                                            <div className="flex-1">
                                                <p className="text-sm text-slate-700">{activity.message}</p>
                                                <p className="text-xs text-slate-400 mt-0.5">{activity.time}</p>
                                            </div>
                                            {activity.status && (
                                                <Badge
                                                    variant={
                                                        activity.status === 'approved'
                                                            ? 'default'
                                                            : activity.status === 'rejected'
                                                              ? 'destructive'
                                                              : 'secondary'
                                                    }
                                                    className="text-xs"
                                                >
                                                    {activity.status}
                                                </Badge>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Setup progress banner */}
                <Card className="border-blue-200 bg-blue-50/50">
                    <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                            <AlertCircle size={18} className="text-blue-600 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="text-sm font-semibold text-blue-900">System Setup In Progress</p>
                                <p className="text-xs text-blue-700 mt-0.5">
                                    GeniusHRM core setup is complete. Modules are being implemented one by one.
                                    Next: Employee Management → Attendance → Leave → Payroll.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

            </div>
        </AppLayout>
    );
}
