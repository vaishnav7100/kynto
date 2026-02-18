import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://kynto-ai.vercel.app'),
  title: {
    default: 'Kynto — Instant AI Roadmaps',
    template: '%s | Kynto',
  },
  description:
    'Transform your goals into detailed, actionable roadmaps in seconds using the power of AI. Free to try, no signup required.',
  keywords: [
    'AI',
    'roadmap',
    'action plan',
    'productivity',
    'goal setting',
    'planning',
    'groq',
    'llama 3',
    'AI Roadmap Generator',
    'YouTube to Action Plan',
    'Strategic Planning AI',
    'Kynto Productivity'
  ],
  authors: [{ name: 'Kynto Team' }],
  creator: 'Kynto',
  openGraph: {
    title: 'Kynto — Instant AI Roadmaps',
    description: 'Transform your goals into detailed, actionable roadmaps in seconds.',
    url: 'https://kynto-ai.vercel.app',
    siteName: 'Kynto',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kynto — Instant AI Roadmaps',
    description: 'Transform your goals into detailed, actionable roadmaps in seconds.',
  },
  alternates: {
    canonical: '/',
  },
  verification: {
    google: 'B9VMlqvfjw3rURYZraGWk9DnFa0nuLIsTsQZUo_w6xc',
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
