import { useForm } from '@inertiajs/react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post('/login');
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-5">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
                        backgroundSize: '32px 32px',
                    }}
                />
            </div>

            <div className="relative w-full max-w-md">
                {/* Logo / Brand */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-600 rounded-2xl mb-4 shadow-lg shadow-blue-600/30">
                        <span className="text-white font-bold text-xl">G</span>
                    </div>
                    <h1 className="text-2xl font-bold text-white">GeniusHRM</h1>
                    <p className="text-slate-400 text-sm mt-1">Human Resource Management System</p>
                </div>

                <Card className="border-slate-700/50 bg-slate-800/50 backdrop-blur-sm shadow-2xl">
                    <CardHeader className="space-y-1 pb-4">
                        <CardTitle className="text-xl text-white">Sign in to your account</CardTitle>
                        <CardDescription className="text-slate-400">
                            Enter your credentials to access the system
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={submit} className="space-y-4">
                            {/* Email */}
                            <div className="space-y-1.5">
                                <Label htmlFor="email" className="text-slate-300">
                                    Email address
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    autoComplete="email"
                                    autoFocus
                                    placeholder="you@company.com"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className={`bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20 ${
                                        errors.email ? 'border-red-500' : ''
                                    }`}
                                />
                                {errors.email && (
                                    <p className="text-red-400 text-xs mt-1">{errors.email}</p>
                                )}
                            </div>

                            {/* Password */}
                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password" className="text-slate-300">
                                        Password
                                    </Label>
                                    <a
                                        href="#"
                                        className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                                    >
                                        Forgot password?
                                    </a>
                                </div>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        autoComplete="current-password"
                                        placeholder="••••••••"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        className={`bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20 pr-10 ${
                                            errors.password ? 'border-red-500' : ''
                                        }`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-300"
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="text-red-400 text-xs mt-1">{errors.password}</p>
                                )}
                            </div>

                            {/* Remember me */}
                            <div className="flex items-center gap-2">
                                <input
                                    id="remember"
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-blue-600 focus:ring-blue-500/20"
                                />
                                <Label htmlFor="remember" className="text-slate-400 text-sm cursor-pointer">
                                    Keep me signed in
                                </Label>
                            </div>

                            {/* Submit */}
                            <Button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium h-10 mt-2"
                            >
                                {processing ? (
                                    <>
                                        <Loader2 size={16} className="mr-2 animate-spin" />
                                        Signing in…
                                    </>
                                ) : (
                                    'Sign in'
                                )}
                            </Button>
                        </form>

                        {/* Demo credentials */}
                        <div className="mt-6 rounded-lg bg-slate-700/30 border border-slate-600/30 overflow-hidden">
                            <div className="px-3 py-2 border-b border-slate-600/30">
                                <p className="text-xs font-semibold text-slate-300">Demo Accounts</p>
                                <p className="text-[10px] text-slate-500 mt-0.5">Password for all: <span className="text-slate-400 font-mono">Admin@1234</span></p>
                            </div>
                            <div className="divide-y divide-slate-700/40">
                                {[
                                    { role: 'Admin',      email: 'admin@geniushrm.test',    color: 'text-blue-400' },
                                    { role: 'HR Manager', email: 'hr@geniushrm.test',       color: 'text-purple-400' },
                                    { role: 'Manager',    email: 'manager@geniushrm.test',  color: 'text-emerald-400' },
                                    { role: 'Employee',   email: 'employee@geniushrm.test', color: 'text-amber-400' },
                                    { role: 'Recruiter',  email: 'recruiter@geniushrm.test',color: 'text-rose-400' },
                                    { role: 'Finance',    email: 'finance@geniushrm.test',  color: 'text-teal-400' },
                                ].map(({ role, email, color }) => (
                                    <button
                                        key={role}
                                        type="button"
                                        onClick={() => { setData('email', email); setData('password', 'Admin@1234'); }}
                                        className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-slate-700/40 transition-colors text-left group"
                                    >
                                        <span className={`text-xs font-medium ${color}`}>{role}</span>
                                        <span className="text-[10px] text-slate-500 group-hover:text-slate-400 font-mono truncate max-w-[180px]">{email}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <p className="text-center text-slate-600 text-xs mt-6">
                    © {new Date().getFullYear()} XGeniousLLC · GeniusHRM
                </p>
            </div>
        </div>
    );
}
