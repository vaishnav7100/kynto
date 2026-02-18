import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function generateActionPlan(goal: string): Promise<string> {
    const completion = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
            {
                role: 'system',
                content: `You are Kynto, an expert strategic planner and productivity coach. 
Your job is to create clear, actionable, phased roadmaps that help people achieve their goals.
Always respond in clean Markdown with headers, bullet points, and bold text for emphasis.
Be specific, practical, and motivating.`,
            },
            {
                role: 'user',
                content: `Create a comprehensive, actionable roadmap for the following goal:

"${goal}"

Structure your response exactly like this:

## 🎯 Executive Summary
A brief 2-3 sentence overview of the roadmap.

## 🏆 Key Objectives
3-5 specific, measurable objectives to achieve.

## 🚀 Phase 1: Foundation (Week 1-2)
Immediate actions to take right now.

## ⚡ Phase 2: Execution (Week 3-6)
Core implementation steps.

## 📈 Phase 3: Optimization (Week 7+)
Refinement and scaling strategies.

## 📊 Success Metrics
How to measure progress and know you're on track.

## ⚠️ Potential Challenges & Mitigations
Anticipate obstacles and how to overcome them.

Be specific, practical, and motivating. Use bullet points liberally.`,
            },
        ],
        temperature: 0.7,
        max_tokens: 2048,
    });

    return completion.choices[0]?.message?.content ?? 'No response generated.';
}
