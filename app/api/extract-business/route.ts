import { NextRequest, NextResponse } from 'next/server'
import { groq, MODEL } from '@/lib/groq'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const url = formData.get('url') as string | null

    if (!url) {
      return NextResponse.json(
        { error: 'Provide a URL.' },
        { status: 400 }
      )
    }

    let rawContent = ''

    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36',
        },
      })

      const html = await res.text()

// Detect Cloudflare / anti-bot pages
const isBlocked =
  html.includes('Attention Required') ||
  html.includes('Cloudflare') ||
  html.includes('Please enable cookies') ||
  html.includes('Sorry, you have been blocked')

if (isBlocked) {
  return NextResponse.json(
    {
      error:
        'Website is protected by Cloudflare. Direct extraction is not possible.',
      cloudflareBlocked: true,
    },
    { status: 400 }
  )
}

rawContent = html
  .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, ' ')
  .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, ' ')
  .replace(/<noscript[^>]*>[\s\S]*?<\/noscript>/gi, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/\s+/g, ' ')
  .trim()
  .slice(0, 20000)

console.log(
  'EXTRACTED CONTENT PREVIEW:',
  rawContent.slice(0, 1000)
)

      console.log(
        'EXTRACTED CONTENT PREVIEW:',
        rawContent.slice(0, 1000)
      )
    } catch (error) {
      console.error('Website fetch failed:', error)

      return NextResponse.json(
        { error: 'Could not fetch that URL.' },
        { status: 400 }
      )
    }

    if (!rawContent || rawContent.length < 50) {
      return NextResponse.json(
        { error: 'Could not extract text from this URL.' },
        { status: 400 }
      )
    }

    const prompt = `
You are extracting business profile information from website content.

CONTENT:
${rawContent}

Extract the following and return ONLY valid JSON.

{
  "businessName": "",
  "services": [],
  "expertise": "",
  "pastWork": ""
}

Rules:
- Never invent information
- If unknown return empty string or empty array
- Services should be individual items
- Maximum 6 services
- Expertise should be one sentence
- Past work should be one sentence
`

    const response = await groq.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.1,
      max_tokens: 800,
    })

    const content =
      response.choices[0].message.content || '{}'

    const cleaned = content
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim()

    let extracted

    try {
      extracted = JSON.parse(cleaned)
    } catch {
      console.error('Invalid JSON returned:', cleaned)

      return NextResponse.json(
        {
          error: 'Model returned invalid JSON',
          raw: cleaned,
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      extracted,
      rawContent,
    })
  } catch (error) {
    console.error('Extract business error:', error)

    return NextResponse.json(
      {
        error: 'Failed to extract business info',
      },
      {
        status: 500,
      }
    )
  }
}