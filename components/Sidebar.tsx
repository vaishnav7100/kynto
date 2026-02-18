'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, FileText, Trash2, Clock, X, Menu } from 'lucide-react';
import { Plan } from '@/types';

interface SidebarProps {
    plans: Plan[];
    selectedPlanId: string | null;
    onSelectPlan: (plan: Plan) => void;
    onDeletePlan: (id: string) => void;
    isAuthenticated: boolean;
}

export default function Sidebar({
    plans,
    selectedPlanId,
    onSelectPlan,
    onDeletePlan,
    isAuthenticated,
}: SidebarProps) {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    // Close mobile drawer on resize
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) setMobileOpen(false);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
        });
    };

    const PlanList = () => (
        <div className="flex-1 overflow-y-auto space-y-1 px-2 py-2">
            {plans.length === 0 ? (
                <div className="text-center py-8 px-4">
                    <FileText className="mx-auto text-white/20 mb-3" size={32} />
                    <p className="text-white/30 text-xs">No plans yet. Generate your first one!</p>
                </div>
            ) : (
                plans.map((plan) => (
                    <motion.div
                        key={plan.id}
                        layout
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`group relative flex items-start gap-2 p-3 rounded-xl cursor-pointer transition-all duration-200 ${selectedPlanId === plan.id
                                ? 'bg-blue-500/15 border border-blue-500/30'
                                : 'hover:bg-white/5 border border-transparent'
                            }`}
                        onClick={() => {
                            onSelectPlan(plan);
                            setMobileOpen(false);
                        }}
                    >
                        <FileText
                            size={14}
                            className={`mt-0.5 flex-shrink-0 ${selectedPlanId === plan.id ? 'text-blue-400' : 'text-white/40'
                                }`}
                        />
                        <div className="flex-1 min-w-0">
                            <p className="text-white/80 text-xs font-medium truncate leading-relaxed">
                                {plan.title}
                            </p>
                            <div className="flex items-center gap-1 mt-1">
                                <Clock size={10} className="text-white/25" />
                                <span className="text-white/25 text-[10px]">{formatDate(plan.created_at)}</span>
                            </div>
                        </div>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onDeletePlan(plan.id);
                            }}
                            className="opacity-0 group-hover:opacity-100 text-white/30 hover:text-red-400 transition-all flex-shrink-0 mt-0.5"
                        >
                            <Trash2 size={12} />
                        </button>
                    </motion.div>
                ))
            )}
        </div>
    );

    return (
        <>
            {/* Mobile hamburger button */}
            <button
                onClick={() => setMobileOpen(true)}
                className="md:hidden fixed top-4 left-4 z-40 glass-card p-2 rounded-xl"
            >
                <Menu size={20} className="text-white/70" />
            </button>

            {/* Mobile Drawer */}
            <AnimatePresence>
                {mobileOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMobileOpen(false)}
                            className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                        />
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                            className="md:hidden fixed left-0 top-0 bottom-0 w-72 z-50 flex flex-col"
                            style={{
                                background: 'rgba(10, 10, 20, 0.95)',
                                backdropFilter: 'blur(20px)',
                                borderRight: '1px solid rgba(255,255,255,0.08)',
                            }}
                        >
                            <div className="flex items-center justify-between p-4 border-b border-white/8">
                                <span className="text-white/70 text-sm font-semibold">Plan History</span>
                                <button
                                    onClick={() => setMobileOpen(false)}
                                    className="text-white/40 hover:text-white/70 transition-colors"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                            {isAuthenticated ? (
                                <PlanList />
                            ) : (
                                <div className="flex-1 flex items-center justify-center p-6 text-center">
                                    <p className="text-white/30 text-xs">Sign in to view your saved plans.</p>
                                </div>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Desktop Sidebar */}
            <motion.div
                animate={{ width: collapsed ? 64 : 260 }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className="hidden md:flex flex-col flex-shrink-0 h-full relative"
                style={{
                    background: 'rgba(8, 8, 16, 0.8)',
                    backdropFilter: 'blur(20px)',
                    borderRight: '1px solid rgba(255,255,255,0.06)',
                }}
            >
                {/* Header */}
                <div className={`flex items-center p-4 border-b border-white/6 ${collapsed ? 'justify-center' : 'justify-between'}`}>
                    {!collapsed && (
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-white/60 text-xs font-semibold uppercase tracking-wider"
                        >
                            Plan History
                        </motion.span>
                    )}
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="text-white/30 hover:text-white/70 transition-colors p-1 rounded-lg hover:bg-white/5"
                    >
                        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                    </button>
                </div>

                {/* Content */}
                {collapsed ? (
                    <div className="flex-1 flex flex-col items-center py-4 gap-2">
                        {plans.slice(0, 8).map((plan) => (
                            <button
                                key={plan.id}
                                onClick={() => onSelectPlan(plan)}
                                title={plan.title}
                                className={`p-2 rounded-xl transition-all ${selectedPlanId === plan.id
                                        ? 'bg-blue-500/20 text-blue-400'
                                        : 'text-white/30 hover:text-white/60 hover:bg-white/5'
                                    }`}
                            >
                                <FileText size={16} />
                            </button>
                        ))}
                    </div>
                ) : isAuthenticated ? (
                    <PlanList />
                ) : (
                    <div className="flex-1 flex items-center justify-center p-6 text-center">
                        <p className="text-white/25 text-xs leading-relaxed">
                            Sign in to save and view your plan history.
                        </p>
                    </div>
                )}
            </motion.div>
        </>
    );
}
