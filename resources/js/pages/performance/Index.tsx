import { router, useForm } from '@inertiajs/react';
import { ChevronRight, Plus, Target, Users, X } from 'lucide-react';
import { useState } from 'react';

import AppLayout from '@/components/layout/AppLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Cycle {
    id: number;
    name: string;
    start_date: string;
    end_date: string;
    status: 'active' | 'closed';
    created_by: string;
    goals_count: number;
    reviews_count: number;
    ratings_count: number;
}

interface Props {
    cycles: Cycle[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_STYLES: Record<string, string> = {
    active: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
    closed: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
};

// ─── Create Cycle Modal ────────────────────────────────────────────────────────

function CreateCycleModal({ onClose }: { onClose: () => void }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        start_date: '',
        end_date: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/performance/cycles', {
            onSuccess: onClose,
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 shadow-xl p-6">
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                        New Performance Cycle
                    </h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={submit} className="space-y-4">
                    <div className="space-y-1.5">
                        <Label htmlFor="name">Cycle Name</Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={e => setData('name', e.target.value)}
                            placeholder="e.g. Q1 2026 Appraisal"
                        />
                        {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label htmlFor="start_date">Start Date</Label>
                            <Input
                                id="start_date"
                                type="date"
                                value={data.start_date}
                                onChange={e => setData('start_date', e.target.value)}
                            />
                            {errors.start_date && <p className="text-xs text-red-500">{errors.start_date}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="end_date">End Date</Label>
                            <Input
                                id="end_date"
                                type="date"
                                value={data.end_date}
                                onChange={e => setData('end_date', e.target.value)}
                            />
                            {errors.end_date && <p className="text-xs text-red-500">{errors.end_date}</p>}
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            Create Cycle
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function PerformanceIndex({ cycles }: Props) {
    const [showCreate, setShowCreate] = useState(false);

    return (
        <AppLayout>
            {showCreate && <CreateCycleModal onClose={() => setShowCreate(false)} />}

            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                            Performance Management
                        </h1>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            Manage appraisal cycles, goals, and reviews
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.visit('/performance/goals')}
                            className="flex items-center gap-1.5"
                        >
                            <Target size={14} /> My Goals
                        </Button>
                        <Button
                            size="sm"
                            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white"
                            onClick={() => setShowCreate(true)}
                        >
                            <Plus size={14} /> New Cycle
                        </Button>
                    </div>
                </div>

                {/* Cycles table */}
                <Card className="border-slate-200 dark:border-slate-700 dark:bg-slate-900">
                    <CardHeader className="border-b border-slate-200 dark:border-slate-700 px-6 py-4">
                        <CardTitle className="text-base font-semibold text-slate-900 dark:text-slate-100">
                            Appraisal Cycles
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {cycles.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                <Users className="h-12 w-12 text-slate-300 dark:text-slate-600 mb-4" />
                                <p className="text-slate-500 dark:text-slate-400 text-sm">No cycles yet.</p>
                                <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">
                                    Click "New Cycle" to create the first appraisal cycle.
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                                            {['Cycle Name', 'Period', 'Goals', 'Reviews', 'Status', 'Created By', ''].map(col => (
                                                <th key={col} className="px-4 py-3 text-left font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap">
                                                    {col}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cycles.map((cycle, idx) => (
                                            <tr
                                                key={cycle.id}
                                                className={cn(
                                                    'border-b border-slate-100 dark:border-slate-800 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer',
                                                    idx === cycles.length - 1 && 'border-b-0',
                                                )}
                                                onClick={() => router.visit(`/performance/cycles/${cycle.id}`)}
                                            >
                                                <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">
                                                    {cycle.name}
                                                </td>
                                                <td className="px-4 py-3 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                                                    {cycle.start_date} — {cycle.end_date}
                                                </td>
                                                <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                                                    {cycle.goals_count}
                                                </td>
                                                <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                                                    {cycle.reviews_count}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize', STATUS_STYLES[cycle.status])}>
                                                        {cycle.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                                                    {cycle.created_by}
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <ChevronRight size={16} className="inline text-slate-400" />
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
