'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Loader2, ArrowRight, AlertCircle } from 'lucide-react';

interface GenerateFormProps {
    onGenerate: (goal: string) => Promise<void>;
    isLoading: boolean;
}

const EXAMPLE_GOALS = [
    'Launch a SaaS product in 90 days',
    'Learn machine learning from scratch',
    'Build a 6-figure freelance business',
    'Get promoted to senior engineer',
];

const MAX_CHARS = 8000;

export default function GenerateForm({ onGenerate, isLoading }: GenerateFormProps) {
    const [goal, setGoal] = useState('');
    const [showTooltip, setShowTooltip] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!goal.trim() || isLoading || goal.length > MAX_CHARS) return;
        await onGenerate(goal.trim());
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        if (value.length <= MAX_CHARS) {
            setGoal(value);
            setShowTooltip(false);
        } else {
            setShowTooltip(true);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="glass-card p-6 md:p-8"
        >
            <div className="mb-6">
                <h2 className="text-xl font-bold text-white mb-1">What&apos;s your goal?</h2>
                <p className="text-white/40 text-sm">
                    Describe your objective and Kynto will craft a detailed roadmap.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                    <textarea
                        value={goal}
                        onChange={handleChange}
                        placeholder="e.g. Launch a SaaS product in 90 days targeting small businesses..."
                        rows={4}
                        className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white placeholder-white/25 focus:outline-none focus:bg-white/8 transition-all text-sm resize-none leading-relaxed ${goal.length >= MAX_CHARS ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-blue-400/50'
                            }`}
                    />
                    <div className={`absolute bottom-3 right-3 text-xs transition-colors ${goal.length >= MAX_CHARS ? 'text-red-400 font-medium' : 'text-white/20'
                        }`}>
                        {goal.length}/{MAX_CHARS}
                    </div>
                </div>

                {/* Example chips */}
                <div className="flex flex-wrap gap-2">
                    {EXAMPLE_GOALS.map((example) => (
                        <button
                            key={example}
                            type="button"
                            onClick={() => setGoal(example)}
                            className="text-xs text-white/35 hover:text-white/60 bg-white/5 hover:bg-white/8 border border-white/8 hover:border-white/15 rounded-full px-3 py-1.5 transition-all duration-200"
                        >
                            {example}
                        </button>
                    ))}
                </div>

                <div className="relative">
                    <motion.button
                        type="submit"
                        disabled={isLoading || goal.trim().length < 5 || goal.length > MAX_CHARS}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onMouseEnter={() => goal.length >= MAX_CHARS && setShowTooltip(true)}
                        onMouseLeave={() => setShowTooltip(false)}
                        className="w-full btn-primary py-3.5 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />
                                <span>Building your roadmap...</span>
                            </>
                        ) : (
                            <>
                                <Sparkles size={16} />
                                <span>Generate Roadmap</span>
                                <ArrowRight size={16} />
                            </>
                        )}
                    </motion.button>

                    {/* Tooltip for character limit */}
                    {showTooltip && goal.length >= MAX_CHARS && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute -top-12 left-1/2 -translate-x-1/2 bg-red-500/90 text-white text-xs px-3 py-2 rounded-lg shadow-lg whitespace-nowrap z-10 backdrop-blur-sm border border-red-400/20"
                        >
                            <div className="flex items-center gap-1.5">
                                <AlertCircle size={12} />
                                To ensure quality, Kynto roadmaps are limited to 8,000 characters.
                            </div>
                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-red-500/90" />
                        </motion.div>
                    )}
                </div>
            </form>
        </motion.div>
    );
}
