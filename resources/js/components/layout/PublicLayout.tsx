export default function PublicLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-slate-50">
            <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="max-w-5xl mx-auto px-6 h-14 flex items-center gap-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600">
                        <span className="text-white text-xs font-bold">G</span>
                    </div>
                    <span className="font-semibold text-slate-900 text-sm">GeniusHRM</span>
                    <span className="text-slate-300 text-sm">/</span>
                    <span className="text-slate-500 text-sm">Careers</span>
                </div>
            </header>
            <main className="max-w-5xl mx-auto px-6 py-10">{children}</main>
            <footer className="border-t border-slate-200 mt-16 py-6 text-center text-xs text-slate-400">
                © {new Date().getFullYear()} GeniusHRM. All rights reserved.
            </footer>
        </div>
    );
}
