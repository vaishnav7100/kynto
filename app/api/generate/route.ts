import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { generateActionPlan } from '@/lib/gemini';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { goal, guestUsed } = body;

        if (!goal || typeof goal !== 'string' || goal.trim().length < 5) {
            return NextResponse.json(
                { error: 'Please provide a valid goal (at least 5 characters).' },
                { status: 400 }
            );
        }

        // Create Supabase server client to check auth
        const cookieStore = await cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return cookieStore.getAll();
                    },
                    setAll(cookiesToSet) {
                        try {
                            cookiesToSet.forEach(({ name, value, options }) =>
                                cookieStore.set(name, value, options)
                            );
                        } catch {
                            // Server component — ignore
                        }
                    },
                },
            }
        );

        const {
            data: { user },
        } = await supabase.auth.getUser();

        // If not authenticated and guest has already used their free credit
        if (!user && guestUsed) {
            return NextResponse.json(
                { requiresAuth: true, error: 'Free credit used. Please sign up for unlimited access.' },
                { status: 403 }
            );
        }

        // Generate the plan
        const planContent = await generateActionPlan(goal.trim());

        // If authenticated, save the plan to the database
        if (user) {
            const title = goal.trim().slice(0, 80);
            await supabase.from('plans').insert({
                user_id: user.id,
                title,
                content: planContent,
            });
        }

        return NextResponse.json({ plan: planContent });
    } catch (error) {
        console.error('Generate API error:', error);
        const message = error instanceof Error ? error.message : 'Unknown error';
        // Surface quota/auth errors clearly
        if (message.includes('429') || message.includes('quota') || message.includes('rate')) {
            return NextResponse.json(
                { error: 'Groq API rate limit hit. Please wait a moment and try again.' },
                { status: 500 }
            );
        }
        if (message.includes('API_KEY') || message.includes('401') || message.includes('403')) {
            return NextResponse.json(
                { error: 'Invalid Groq API key. Please check your GROQ_API_KEY in .env.local' },
                { status: 500 }
            );
        }
        return NextResponse.json(
            { error: 'Failed to generate roadmap. Please try again.' },
            { status: 500 }
        );
    }
}
