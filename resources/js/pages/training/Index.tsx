import { router, useForm } from '@inertiajs/react';
import {
    BookOpen, ChevronRight, Clock, DollarSign,
    Edit2, Plus, Trash2, X,
} from 'lucide-react';
import { useState } from 'react';

import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Course {
    id: number;
    title: string;
    description: string | null;
    category: string | null;
    delivery_mode: 'online' | 'in_person' | 'hybrid';
    duration_hours: number;
    provider: string | null;
    cost: number;
    status: 'active' | 'inactive';
    sessions_count: number;
    created_by: string;
}

interface Stats {
    total_courses: number;
    total_sessions: number;
    total_enrollments: number;
    completions: number;
}

interface Props {
    courses: Course[];
    stats: Stats;
    categories: string[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const DELIVERY_LABELS: Record<string, string> = {
    online:    'Online',
    in_person: 'In-Person',
    hybrid:    'Hybrid',
};

const DELIVERY_STYLES: Record<string, string> = {
    online:    'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
    in_person: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
    hybrid:    'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
};

function fmt(n: number) {
    return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// ─── Course Form Modal ────────────────────────────────────────────────────────

function CourseModal({
    course,
    categories,
    onClose,
}: {
    course?: Course;
    categories: string[];
    onClose: () => void;
}) {
    const isEdit = !!course;
    const { data, setData, post, patch, processing, errors } = useForm({
        title:          course?.title ?? '',
        description:    course?.description ?? '',
        category:       course?.category ?? '',
        delivery_mode:  course?.delivery_mode ?? 'online',
        duration_hours: course?.duration_hours?.toString() ?? '0',
        provider:       course?.provider ?? '',
        cost:           course?.cost?.toString() ?? '0',
        status:         course?.status ?? 'active',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit) {
            patch(`/training/courses/${course!.id}`, { onSuccess: onClose });
        } else {
            post('/training/courses', { onSuccess: onClose });
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 shadow-xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700">
                    <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                        {isEdit ? 'Edit Course' : 'New Training Course'}
                    </h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                        <X size={18} />
                    </button>
                </div>
                <form onSubmit={submit} className="p-6 space-y-4">
                    <div className="space-y-1.5">
                        <Label>Title</Label>
                        <Input value={data.title} onChange={e => setData('title', e.target.value)} placeholder="e.g. Excel Advanced Skills" />
                        {errors.title && <p className="text-xs text-red-500">{errors.title}</p>}
                    </div>

                    <div className="space-y-1.5">
                        <Label>Description <span className="text-slate-400 font-normal">(optional)</span></Label>
                        <textarea
                            rows={3}
                            value={data.description}
                            onChange={e => setData('description', e.target.value)}
                            className="w-full rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label>Category</Label>
                            <Input
                                list="categories"
                                value={data.category}
                                onChange={e => setData('category', e.target.value)}
                                placeholder="e.g. Technical"
                            />
                            <datalist id="categories">
                                {['Technical', 'Soft Skills', 'Compliance', 'Leadership', 'Safety'].map(c => (
                                    <option key={c} value={c} />
                                ))}
                                {categories.map(c => <option key={c} value={c} />)}
                            </datalist>
                        </div>
                        <div className="space-y-1.5">
                            <Label>Delivery Mode</Label>
                            <select
                                value={data.delivery_mode}
                                onChange={e => setData('delivery_mode', e.target.value as any)}
                                className="w-full rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="online">Online</option>
                                <option value="in_person">In-Person</option>
                                <option value="hybrid">Hybrid</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        <div className="space-y-1.5">
                            <Label>Duration (hours)</Label>
                            <Input type="number" min="0" value={data.duration_hours} onChange={e => setData('duration_hours', e.target.value)} />
                            {errors.duration_hours && <p className="text-xs text-red-500">{errors.duration_hours}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <Label>Cost ($)</Label>
                            <Input type="number" min="0" step="0.01" value={data.cost} onChange={e => setData('cost', e.target.value)} />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Status</Label>
                            <select
                                value={data.status}
                                onChange={e => setData('status', e.target.value as any)}
                                className="w-full rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label>Provider <span className="text-slate-400 font-normal">(optional)</span></Label>
                        <Input value={data.provider} onChange={e => setData('provider', e.target.value)} placeholder="e.g. Coursera / Internal" />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                        <Button type="submit" disabled={processing} className="bg-blue-600 hover:bg-blue-700 text-white">
                            {isEdit ? 'Save Changes' : 'Create Course'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function TrainingIndex({ courses, stats, categories }: Props) {
    const [modal, setModal] = useState<'create' | Course | null>(null);

    const deleteCourse = (id: number) => {
        if (!confirm('Delete this course and all its sessions?')) return;
        router.delete(`/training/courses/${id}`, { preserveScroll: true });
    };

    return (
        <AppLayout>
            {modal && (
                <CourseModal
                    course={modal === 'create' ? undefined : modal}
                    categories={categories}
                    onClose={() => setModal(null)}
                />
            )}

            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Training & Development</h1>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Manage courses, sessions, and employee enrollments</p>
                    </div>
                    <Button
                        size="sm"
                        className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={() => setModal('create')}
                    >
                        <Plus size={14} /> New Course
                    </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {[
                        { label: 'Active Courses',  value: stats.total_courses,     icon: BookOpen,     color: 'text-blue-600 dark:text-blue-400' },
                        { label: 'Sessions',         value: stats.total_sessions,    icon: Clock,        color: 'text-purple-600 dark:text-purple-400' },
                        { label: 'Enrollments',      value: stats.total_enrollments, icon: ChevronRight, color: 'text-amber-600 dark:text-amber-400' },
                        { label: 'Completions',      value: stats.completions,       icon: BookOpen,     color: 'text-green-600 dark:text-green-400' },
                    ].map(s => (
                        <div key={s.label} className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4">
                            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{s.value}</p>
                            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{s.label}</p>
                        </div>
                    ))}
                </div>

                {/* Courses table */}
                <Card className="border-slate-200 dark:border-slate-700 dark:bg-slate-900">
                    <CardHeader className="border-b border-slate-200 dark:border-slate-700 px-6 py-4">
                        <CardTitle className="text-base font-semibold text-slate-900 dark:text-slate-100">Courses</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {courses.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                <BookOpen className="h-12 w-12 text-slate-300 dark:text-slate-600 mb-4" />
                                <p className="text-slate-500 dark:text-slate-400 text-sm">No courses yet.</p>
                                <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">Click "New Course" to add the first training course.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                                            {['Title', 'Category', 'Mode', 'Duration', 'Cost', 'Sessions', 'Status', 'Actions'].map(col => (
                                                <th key={col} className="px-4 py-3 text-left font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap">{col}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {courses.map((course, idx) => (
                                            <tr
                                                key={course.id}
                                                className={cn(
                                                    'border-b border-slate-100 dark:border-slate-800 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/40',
                                                    idx === courses.length - 1 && 'border-b-0',
                                                )}
                                            >
                                                <td className="px-4 py-3">
                                                    <p className="font-medium text-slate-900 dark:text-slate-100">{course.title}</p>
                                                    {course.provider && <p className="text-xs text-slate-400 dark:text-slate-500">{course.provider}</p>}
                                                </td>
                                                <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{course.category ?? '—'}</td>
                                                <td className="px-4 py-3">
                                                    <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', DELIVERY_STYLES[course.delivery_mode])}>
                                                        {DELIVERY_LABELS[course.delivery_mode]}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                                                    <span className="flex items-center gap-1">
                                                        <Clock size={12} /> {course.duration_hours}h
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                                                    {course.cost > 0 ? fmt(course.cost) : <span className="text-green-600 dark:text-green-400">Free</span>}
                                                </td>
                                                <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{course.sessions_count}</td>
                                                <td className="px-4 py-3">
                                                    <span className={cn(
                                                        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize',
                                                        course.status === 'active'
                                                            ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                                                            : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                                                    )}>
                                                        {course.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-1">
                                                        <button
                                                            onClick={() => router.visit(`/training/courses/${course.id}/sessions/create`)}
                                                            className="inline-flex items-center gap-1 rounded-md bg-blue-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-blue-700"
                                                        >
                                                            <Plus size={11} /> Session
                                                        </button>
                                                        <button
                                                            onClick={() => setModal(course)}
                                                            className="p-1.5 rounded-md text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                                                        >
                                                            <Edit2 size={14} />
                                                        </button>
                                                        <button
                                                            onClick={() => deleteCourse(course.id)}
                                                            className="p-1.5 rounded-md text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
