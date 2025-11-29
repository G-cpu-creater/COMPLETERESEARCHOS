import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

const GROQ_API_KEY = process.env.GROQ_API_KEY || ''
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'

export async function POST(req: NextRequest) {
    try {
        const { text } = await req.json()

        if (!text) {
            return NextResponse.json({ error: 'Text is required' }, { status: 400 })
        }

        const systemMessage = `You are an expert editor. Rephrase the following text without changing its meaning or context. Improve grammar, clarity, and human tone. Return ONLY the rephrased text, no explanations.`

        const response = await fetch(GROQ_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GROQ_API_KEY}`,
            },
            body: JSON.stringify({
                model: 'llama-3.1-8b-instant',
                messages: [
                    { role: 'system', content: systemMessage },
                    { role: 'user', content: text }
                ],
                temperature: 0.3,
                max_tokens: 1024,
            }),
        })

        if (!response.ok) {
            throw new Error('Failed to get AI response')
        }

        const data = await response.json()
        const rephrasedText = data.choices[0]?.message?.content || text

        return NextResponse.json({ rephrasedText })
    } catch (error) {
        console.error('Rephrase API error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
