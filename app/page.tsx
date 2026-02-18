'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Zap, ArrowRight, Sparkles, Shield, Clock } from 'lucide-react';

const features = [
  {
    icon: Sparkles,
    title: 'AI-Powered Roadmaps',
    description: 'Groq + Llama 3.3 70B generates structured, professional roadmaps tailored to your specific goal — in seconds.',
  },
  {
    icon: Shield,
    title: 'Save & Revisit',
    description: 'Sign up to save unlimited roadmaps and access your full history from any device, anytime.',
  },
  {
    icon: Clock,
    title: 'Ready in Seconds',
    description: 'No more hours of planning. Get a comprehensive, phased roadmap in under 10 seconds.',
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-white/6"
        style={{ background: 'rgba(5,5,5,0.8)', backdropFilter: 'blur(20px)' }}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Zap size={16} className="text-white" />
          </div>
          <span className="text-lg font-bold gradient-text">Kynto</span>
        </div>
        <Link href="/dashboard">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="btn-primary px-4 py-2 text-sm"
          >
            Get Started Free
          </motion.button>
        </Link>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 glass-card px-4 py-2 mb-8 text-xs text-white/60"
          >
            <Sparkles size={12} className="text-blue-400" />
            Powered by Groq · Llama 3.3 70B
          </motion.div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black leading-tight mb-6 tracking-tight">
            Instant AI{' '}
            <span className="gradient-text">Roadmaps</span>
            <br />
            For Any Goal.
          </h1>

          <p className="text-white/45 text-lg sm:text-xl leading-relaxed mb-10 max-w-xl mx-auto">
            Describe your goal. Kynto builds a professional, phased roadmap in seconds.
            No fluff — just clear steps to move forward.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <motion.button
                whileHover={{ scale: 1.03, boxShadow: '0 20px 40px rgba(59,130,246,0.3)' }}
                whileTap={{ scale: 0.97 }}
                className="btn-primary px-8 py-4 text-base flex items-center gap-2"
              >
                Generate My Roadmap
                <ArrowRight size={18} />
              </motion.button>
            </Link>
            <p className="text-white/30 text-sm self-center">
              First roadmap free · No signup required
            </p>
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-24 max-w-4xl mx-auto w-full"
        >
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.1 }}
              className="glass-card p-6 text-left hover:border-white/15 transition-colors duration-300"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/15 to-emerald-500/15 border border-white/8 flex items-center justify-center mb-4">
                <feature.icon size={18} className="text-blue-400" />
              </div>
              <h3 className="text-white font-semibold text-sm mb-2">{feature.title}</h3>
              <p className="text-white/40 text-xs leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-white/20 text-xs border-t border-white/5">
        © {new Date().getFullYear()} Kynto. Built with Next.js & Groq AI.
      </footer>
    </div>
  );
}
