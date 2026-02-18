'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Copy, Check, FileText } from 'lucide-react';

interface PlanOutputProps {
    content: string;
    title?: string;
}

export default function PlanOutput({ content, title }: PlanOutputProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="glass-card overflow-hidden"
        >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/6">
                <div className="flex items-center gap-2">
                    <FileText size={16} className="text-blue-400" />
                    <span className="text-white/70 text-sm font-medium truncate max-w-[200px] sm:max-w-xs">
                        {title || 'Your Action Plan'}
                    </span>
                </div>
                <motion.button
                    onClick={handleCopy}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all duration-200 ${copied
                            ? 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10'
                            : 'text-white/40 border-white/10 hover:text-white/70 hover:border-white/20 hover:bg-white/5'
                        }`}
                >
                    {copied ? <Check size={13} /> : <Copy size={13} />}
                    {copied ? 'Copied!' : 'Copy'}
                </motion.button>
            </div>

            {/* Markdown content */}
            <div className="px-6 py-6 prose-container">
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                        h1: ({ children }) => (
                            <h1 className="text-2xl font-bold text-white mb-4 mt-6 first:mt-0">{children}</h1>
                        ),
                        h2: ({ children }) => (
                            <h2 className="text-lg font-bold gradient-text mb-3 mt-6 first:mt-0">{children}</h2>
                        ),
                        h3: ({ children }) => (
                            <h3 className="text-base font-semibold text-white/90 mb-2 mt-4">{children}</h3>
                        ),
                        p: ({ children }) => (
                            <p className="text-white/65 text-sm leading-7 mb-3">{children}</p>
                        ),
                        ul: ({ children }) => (
                            <ul className="space-y-1.5 mb-4 ml-4">{children}</ul>
                        ),
                        ol: ({ children }) => (
                            <ol className="space-y-1.5 mb-4 ml-4 list-decimal">{children}</ol>
                        ),
                        li: ({ children }) => (
                            <li className="text-white/65 text-sm leading-6 flex gap-2">
                                <span className="text-blue-400 mt-1.5 flex-shrink-0">▸</span>
                                <span>{children}</span>
                            </li>
                        ),
                        strong: ({ children }) => (
                            <strong className="text-white font-semibold">{children}</strong>
                        ),
                        em: ({ children }) => (
                            <em className="text-white/80 italic">{children}</em>
                        ),
                        blockquote: ({ children }) => (
                            <blockquote className="border-l-2 border-blue-400/50 pl-4 my-4 text-white/50 italic text-sm">
                                {children}
                            </blockquote>
                        ),
                        code: ({ children }) => (
                            <code className="bg-white/8 text-emerald-300 text-xs px-1.5 py-0.5 rounded font-mono">
                                {children}
                            </code>
                        ),
                        hr: () => <hr className="border-white/8 my-6" />,
                    }}
                >
                    {content}
                </ReactMarkdown>
            </div>
        </motion.div>
    );
}
