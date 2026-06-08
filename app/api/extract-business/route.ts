import { NextRequest, NextResponse } from 'next/server'
import { groq, MODEL } from '@/lib/groq'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const url = formData.get('url') as string | null

    let rawContent = ''

    if (url) {
      try {
        const res = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; ClientRadar/1.0)',
          },
        })
        const html = await res.text()
        rawContent = html
          .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
          .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
          .replace(/<[^>]+>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim()
          .slice(0, 8000)
      } catch {
        return NextResponse.json(
          { error: 'Could not fetch that URL.' },
          { status: 400 }
        )
      }
    } else {
      return NextResponse.json(
        { error: 'Provide a URL.' },
        { status: 400 }
      )
    }

    if (!rawContent || rawContent.trim().length < 10) {
      return NextResponse.json(
        { error: 'Could not extract text from this URL.' },
        { status: 400 }
      )
    }

    const prompt = `You are extracting business profile information from website content.

CONTENT:
${rawContent}

Extract the following and return ONLY valid JSON, no other text:
{
  "businessName": "company or person name",
  "services": ["service 1", "service 2", "service 3"],
  "expertise": "who they serve and what they specialise in",
  "pastWork": "notable clients, projects, or case studies mentioned"
}

Rules:
- If something is not mentioned, return an empty string or empty array
- services should be individual items, max 6
- Keep expertise to one sentence
- Keep pastWork to one sentence
- Never make things up — only extract what is actually in the content`

    const response = await groq.chat.completions.create({
      model: MODEL,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.1,
      max_tokens: 800,
    })

    const content = response.choices[0].message.content || '{}'
    const cleaned = content.replace(/```json|```/g, '').trim()
    const extracted = JSON.parse(cleaned)

    return NextResponse.json({ success: true, extracted, rawContent })
  } catch (error) {
    console.error('Extract business error:', error)
    return NextResponse.json(
      { error: 'Failed to extract business info' },
      { status: 500 }
    )
  }
}