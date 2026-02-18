'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Loader2, ArrowRight } from 'lucide-react';

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

export default function GenerateForm({ onGenerate, isLoading }: GenerateFormProps) {
    const [goal, setGoal] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!goal.trim() || isLoading) return;
        await onGenerate(goal.trim());
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
                        onChange={(e) => setGoal(e.target.value)}
                        placeholder="e.g. Launch a SaaS product in 90 days targeting small businesses..."
                        rows={4}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/25 focus:outline-none focus:border-blue-400/50 focus:bg-white/8 transition-all text-sm resize-none leading-relaxed"
                    />
                    <div className="absolute bottom-3 right-3 text-white/20 text-xs">
                        {goal.length}/500
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

                <motion.button
                    type="submit"
                    disabled={isLoading || goal.trim().length < 5}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
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
            </form>
        </motion.div>
    );
}
