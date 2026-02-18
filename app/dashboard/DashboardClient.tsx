'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import GenerateForm from '@/components/GenerateForm';
import PlanOutput from '@/components/PlanOutput';
import AuthModal from '@/components/AuthModal';
import { createClient } from '@/lib/supabase';
import { Plan } from '@/types';
import { Zap } from 'lucide-react';
import type { User } from '@supabase/supabase-js';

const GUEST_USED_KEY = 'briefly_guest_used';
const RETRY_DELAY_MESSAGE_MS = 2500; // Show "Kynto is highly active..." after 2.5s

export default function DashboardClient() {
    const [user, setUser] = useState<User | null>(null);
    const [plans, setPlans] = useState<Plan[]>([]);
    const [currentPlan, setCurrentPlan] = useState<Plan | null>(null);
    const [currentPlanContent, setCurrentPlanContent] = useState<string>('');
    const [currentGoal, setCurrentGoal] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [loadingText, setLoadingText] = useState('Building your roadmap...');
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [pendingGoal, setPendingGoal] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [mobileOpen, setMobileOpen] = useState(false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const supabase = useMemo(() => createClient(), []);
    const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);


    // Fetch user plans
    const fetchPlans = useCallback(async () => {
        try {
            const res = await fetch('/api/plans');
            if (res.ok) {
                const data = await res.json();
                setPlans(data.plans || []);
            }
        } catch {
            // silently fail
        }
    }, []);

    // Auth state listener
    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            setUser(user);
            if (user) fetchPlans();
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchPlans();
                // If there was a pending goal after auth, generate it
                if (pendingGoal) {
                    handleGenerate(pendingGoal, true);
                    setPendingGoal('');
                }
            }
        });

        return () => subscription.unsubscribe();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleGenerate = async (goal: string, skipGuestCheck = false) => {
        setIsLoading(true);
        setError('');
        setCurrentPlan(null);
        setCurrentPlanContent('');
        setLoadingText('Building your roadmap...');

        const guestUsed = localStorage.getItem(GUEST_USED_KEY) === 'true';

        // Check if guest has used their free credit
        if (!user && guestUsed && !skipGuestCheck) {
            setPendingGoal(goal);
            setShowAuthModal(true);
            setIsLoading(false);
            return;
        }

        // Set timeout to show "Retrying" message if server takes time (exponential backoff)
        if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);
        retryTimeoutRef.current = setTimeout(() => {
            setLoadingText('Kynto is highly active right now. Retrying in a moment...');
        }, RETRY_DELAY_MESSAGE_MS);

        try {
            const res = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ goal, guestUsed: guestUsed && !user }),
            });

            // Clear retry message timer once we get a response (headers)
            if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);

            // Handle Auth/Quota errors specifically
            if (res.status === 403) {
                const data = await res.json();
                if (data.requiresAuth) {
                    setPendingGoal(goal);
                    setShowAuthModal(true);
                    setIsLoading(false);
                    return;
                }
            }

            if (res.status === 429) {
                setError('Kynto is highly active right now. Please try again in 1 minute.');
                setIsLoading(false);
                return;
            }

            if (!res.ok || !res.body) {
                const data = await res.json().catch(() => ({}));
                setError(data.error || 'Something went wrong. Please try again.');
                setIsLoading(false);
                return;
            }

            // Mark guest credit as used immediately upon success start
            if (!user) {
                localStorage.setItem(GUEST_USED_KEY, 'true');
            }

            // STREAMING LOGIC
            setLoadingText('Streaming roadmap...');
            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let accumulatedContent = '';

            try {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    const chunk = decoder.decode(value, { stream: true });
                    accumulatedContent += chunk;
                    setCurrentPlanContent(accumulatedContent);
                }
            } catch (err) {
                console.error('Stream error:', err);
                setError('Stream interrupted. Please try again.');
            } finally {
                reader.releaseLock();
            }

            // Generation Complete
            setCurrentGoal(goal);
            setIsLoading(false); // Stop loading animation but content stays

            // SAVE TO DB IF AUTHENTICATED
            if (user && accumulatedContent.length > 50) {
                const title = goal.trim().slice(0, 80);
                await supabase.from('plans').insert({
                    user_id: user.id,
                    title,
                    content: accumulatedContent,
                });
                fetchPlans(); // Refresh sidebar
            }

        } catch {
            setError('Network error. Please check your connection and try again.');
            setIsLoading(false);
        } finally {
            if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);
        }
    };

    const handleSelectPlan = (plan: Plan) => {
        setCurrentPlan(plan);
        setCurrentPlanContent(plan.content);
        setCurrentGoal(plan.title);
        setError('');
        setMobileOpen(false); // Close mobile sidebar on selection
    };

    const handleDeletePlan = async (id: string) => {
        try {
            await fetch(`/api/plans?id=${id}`, { method: 'DELETE' });
            setPlans((prev) => prev.filter((p) => p.id !== id));
            if (currentPlan?.id === id) {
                setCurrentPlan(null);
                setCurrentPlanContent('');
                setCurrentGoal('');
            }
        } catch {
            // silently fail
        }
    };

    const handleAuthSuccess = () => {
        setShowAuthModal(false);
    };

    return (
        <div className="flex flex-col h-screen overflow-hidden" style={{ background: '#050505' }}>
            {/* Navbar */}
            <Navbar
                userEmail={user?.email}
                onSignInClick={() => setShowAuthModal(true)}
                onMenuClick={() => setMobileOpen(true)}
            />

            {/* Main layout */}
            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <Sidebar
                    plans={plans}
                    selectedPlanId={currentPlan?.id ?? null}
                    onSelectPlan={handleSelectPlan}
                    onDeletePlan={handleDeletePlan}
                    isAuthenticated={!!user}
                    mobileOpen={mobileOpen}
                    onMobileClose={() => setMobileOpen(false)}
                />

                {/* Main content */}
                <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
                    <div className="max-w-3xl mx-auto space-y-6">
                        {/* Welcome header */}
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="pt-2 pb-2 md:pt-0"
                        >
                            <h1 className="text-2xl md:text-3xl font-bold text-white">
                                {user ? `Welcome back` : 'Generate Your Roadmap'}
                            </h1>
                            <p className="text-white/35 text-sm mt-1">
                                {user
                                    ? `Signed in as ${user.email}`
                                    : 'Try it free — no account needed for your first roadmap.'}
                            </p>
                        </motion.div>

                        {/* Generate form */}
                        <GenerateForm onGenerate={handleGenerate} isLoading={isLoading && !currentPlanContent} />

                        {/* Error */}
                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="glass-card p-4 border-red-500/20 bg-red-500/5 mb-4"
                                >
                                    <p className="text-red-400 text-sm">{error}</p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Loading indication (only before stream starts) */}
                        <AnimatePresence>
                            {isLoading && !currentPlanContent && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="glass-card p-8 flex flex-col items-center justify-center gap-4"
                                >
                                    <div className="relative">
                                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/20 to-emerald-500/20 border border-white/10 flex items-center justify-center">
                                            <Zap size={20} className="text-blue-400 animate-pulse" />
                                        </div>
                                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/10 to-emerald-500/10 animate-ping" />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-white/70 font-medium text-sm">{loadingText}</p>
                                        <p className="text-white/30 text-xs mt-1">AI Agent Working</p>
                                    </div>
                                    <div className="w-full space-y-2 mt-2">
                                        {[80, 60, 70, 50].map((w, i) => (
                                            <div
                                                key={i}
                                                className="h-3 rounded-full bg-white/5 animate-pulse"
                                                style={{ width: `${w}%`, animationDelay: `${i * 0.15}s` }}
                                            />
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Plan output (Streams in real-time) */}
                        <AnimatePresence>
                            {(currentPlanContent || (isLoading && currentPlanContent)) && (
                                <PlanOutput content={currentPlanContent} title={currentGoal} />
                            )}
                        </AnimatePresence>

                        {/* Empty state */}
                        {!currentPlanContent && !isLoading && !error && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="glass-card p-12 flex flex-col items-center justify-center text-center"
                            >
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/10 to-emerald-500/10 border border-white/8 flex items-center justify-center mb-4">
                                    <Zap size={28} className="text-white/20" />
                                </div>
                                <p className="text-white/30 text-sm font-medium">Your plan will appear here</p>
                                <p className="text-white/18 text-xs mt-1">Enter a goal above to get started</p>
                            </motion.div>
                        )}
                    </div>
                </main>
            </div>

            {/* Auth Modal */}
            <AuthModal
                isOpen={showAuthModal}
                onClose={() => setShowAuthModal(false)}
                onSuccess={handleAuthSuccess}
            />
        </div>
    );
}
