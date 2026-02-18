'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Zap, LogOut, User, Menu } from 'lucide-react';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

interface NavbarProps {
    userEmail?: string | null;
    onSignInClick: () => void;
    onMenuClick?: () => void;
}

export default function Navbar({ userEmail, onSignInClick, onMenuClick }: NavbarProps) {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const supabase = useMemo(() => createClient(), []);
    const router = useRouter();

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.refresh();
    };

    return (
        <motion.nav
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-white/6"
            style={{ background: 'rgba(5, 5, 5, 0.8)', backdropFilter: 'blur(20px)' }}
        >
            <div className="flex items-center gap-3">
                {/* Mobile Menu Button */}
                {onMenuClick && (
                    <button
                        onClick={onMenuClick}
                        className="md:hidden text-white/70 hover:text-white transition-colors"
                    >
                        <Menu size={24} />
                    </button>
                )}

                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <Zap size={16} className="text-white" />
                    </div>
                    <span className="text-lg font-bold gradient-text hidden sm:block">Kynto</span>
                </Link>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
                {userEmail ? (
                    <>
                        <div className="hidden sm:flex items-center gap-2 text-white/40 text-sm">
                            <User size={14} />
                            <span className="max-w-[160px] truncate">{userEmail}</span>
                        </div>
                        <button
                            onClick={handleSignOut}
                            className="flex items-center gap-2 text-white/40 hover:text-white/70 text-sm transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5"
                        >
                            <LogOut size={14} />
                            <span className="hidden sm:inline">Sign Out</span>
                        </button>
                    </>
                ) : (
                    <button
                        onClick={onSignInClick}
                        className="btn-primary text-sm px-4 py-2"
                    >
                        Sign In
                    </button>
                )}
            </div>
        </motion.nav>
    );
}
