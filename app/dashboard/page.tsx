'use client';

import dynamic from 'next/dynamic';

// Load the dashboard client-side only to prevent Supabase SSR initialization
// errors during build when env vars are not available.
const DashboardClient = dynamic(() => import('./DashboardClient'), {
    ssr: false,
    loading: () => (
        <div
            className="flex items-center justify-center h-screen"
            style={{ background: '#050505' }}
        >
            <div className="text-center">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-emerald-500/20 border border-white/10 flex items-center justify-center mx-auto mb-3 animate-pulse">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-400">
                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                    </svg>
                </div>
                <p className="text-white/30 text-sm">Loading...</p>
            </div>
        </div>
    ),
});

export default function DashboardPage() {
    return <DashboardClient />;
}
