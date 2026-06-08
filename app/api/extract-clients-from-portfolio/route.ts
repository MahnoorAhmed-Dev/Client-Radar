import { NextRequest, NextResponse } from 'next/server'
import { groq, MODEL } from '@/lib/groq'

export async function POST(req: NextRequest) {
  try {
    const { portfolioUrl, portfolioContent } = await req.json()

    let rawContent = portfolioContent || ''

    if (!rawContent && portfolioUrl) {
      try {
        const res = await fetch(portfolioUrl, {
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
          { error: 'Could not fetch your portfolio URL.' },
          { status: 400 }
        )
      }
    }

    if (!rawContent || rawContent.trim().length < 10) {
      return NextResponse.json(
        { error: 'No portfolio content available.' },
        { status: 400 }
      )
    }

    const prompt = `You are extracting a list of past or current clients from a freelancer or agency portfolio.

PORTFOLIO CONTENT:
${rawContent}

Look for any mentioned companies, brands, or clients this person has worked with.
They may appear in sections like "clients", "case studies", "work", "projects", "portfolio", or mentioned inline.

Return ONLY valid JSON, no other text:
{
  "clients": [
    {
      "name": "Company Name",
      "domain": "companydomain.com",
      "industry": "Industry"
    }
  ]
}

Rules:
- Only include real company names, not generic descriptions
- domain: best guess based on company name if not explicitly mentioned
- industry: one or two words max
- If no clients are found, return an empty array
- Max 10 clients`

    const response = await groq.chat.completions.create({
      model: MODEL,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.1,
      max_tokens: 800,
    })

    const content = response.choices[0].message.content || '{}'
    const cleaned = content.replace(/```json|```/g, '').trim()
    const extracted = JSON.parse(cleaned)

    return NextResponse.json({ success: true, clients: extracted.clients || [] })
  } catch (error) {
    console.error('Extract clients from portfolio error:', error)
    return NextResponse.json(
      { error: 'Failed to extract clients' },
      { status: 500 }
    )
  }
}