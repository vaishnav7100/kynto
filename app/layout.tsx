import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Kynto — Instant AI Roadmaps',
  description:
    'Transform your goals into detailed, actionable roadmaps in seconds using the power of AI. Free to try, no signup required.',
  keywords: ['AI', 'roadmap', 'action plan', 'productivity', 'goal setting', 'planning'],
  openGraph: {
    title: 'Kynto — Instant AI Roadmaps',
    description: 'Transform your goals into detailed, actionable roadmaps in seconds.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased">
        <div className="ambient-glow" />
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
