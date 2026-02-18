import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { groq, MODEL_NAME } from '@/lib/groq';

export const runtime = 'edge';

const SYSTEM_PROMPT = `You are Kynto, an expert strategic planner and productivity coach. 
Your job is to create clear, actionable, phased roadmaps that help people achieve their goals.
Always respond in clean Markdown with headers, bullet points, and bold text for emphasis.
Be specific, practical, and motivating.`;

const USER_PROMPT_TEMPLATE = (goal: string) => `Create a comprehensive, actionable roadmap for the following goal:

"${goal}"

Structure your response exactly like this:

# 🎯 Executive Summary
A brief 2-3 sentence overview of the roadmap.

# 🏆 Key Objectives
3-5 specific, measurable objectives to achieve.

## 🚀 Phase 1: Foundation (Week 1-2)
Immediate actions to take right now.

## ⚡ Phase 2: Execution (Week 3-6)
Core implementation steps.

## 📈 Phase 3: Optimization (Week 7+)
Refinement and scaling strategies.

# 📊 Success Metrics
How to measure progress and know you're on track.

# ⚠️ Potential Challenges & Mitigations
Anticipate obstacles and how to overcome them.

Be specific, practical, and motivating. Use bullet points liberally.`;

async function fetchGroqStream(goal: string, retryCount = 0): Promise<ReadableStream> {
    try {
        const response = await groq.chat.completions.create({
            model: MODEL_NAME,
            messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                { role: 'user', content: USER_PROMPT_TEMPLATE(goal) },
            ],
            stream: true,
            temperature: 0.7,
            max_tokens: 2048,
        });

        // Convert async iterator to ReadableStream
        const stream = new ReadableStream({
            async start(controller) {
                try {
                    for await (const chunk of response) {
                        const content = chunk.choices[0]?.delta?.content || '';
                        if (content) {
                            controller.enqueue(new TextEncoder().encode(content));
                        }
                    }
                    controller.close();
                } catch (err) {
                    controller.error(err);
                }
            },
        });

        return stream;
    } catch (error: any) {
        // Retry logic for 429 errors
        if (error?.status === 429 && retryCount < 3) {
            console.log(`Rate limit hit. Retrying (${retryCount + 1}/3)...`);
            await new Promise((resolve) => setTimeout(resolve, 2000 * (retryCount + 1))); // Exponential-ish backoff
            return fetchGroqStream(goal, retryCount + 1);
        }
        throw error;
    }
}

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

        // Auth check... (Since we are streaming, we might need a different auth strategy or just do it upfront)
        // Creating Supabase client inside Edge Runtime requires slightly different handling but let's stick to standard pattern if possible
        // Actually, 'edge' runtime + specific cookie handling might be tricky.
        // Let's remove 'edge' runtime for now to keep Supabase auth simplified unless needed for streaming performance.
        // Streaming works in Node.js runtime too in Next.js 14+.

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

        if (!user && guestUsed) {
            return NextResponse.json(
                { requiresAuth: true, error: 'Free credit used. Please sign up for unlimited access.' },
                { status: 403 }
            );
        }

        const stream = await fetchGroqStream(goal.trim());

        return new NextResponse(stream, {
            headers: {
                'Content-Type': 'text/plain; charset=utf-8',
            },
        });

    } catch (error: any) {
        console.error('Generate API error:', error);
        const message = error.message || 'Unknown error';

        if (message.includes('429') || message.includes('quota')) {
            return NextResponse.json(
                { error: 'Kynto is highly active right now. Please try again in a moment.' },
                { status: 429 }
            );
        }

        return NextResponse.json(
            { error: 'Failed to generate roadmap. Please try again.' },
            { status: 500 }
        );
    }
}
