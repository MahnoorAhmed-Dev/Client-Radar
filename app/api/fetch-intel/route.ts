import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { searchCompany, getDemoIntel } from '@/lib/serper'
import { groq, MODEL } from '@/lib/groq'

export async function POST(req: NextRequest) {
  try {
    const { clientId, demoMode = false } = await req.json()

    const db = supabaseAdmin()

    const { data: client, error: clientError } = await db
      .from('clients')
      .select('*')
      .eq('id', clientId)
      .single()

    if (clientError || !client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 })
    }

    let rawSnippets: string
    if (demoMode) {
      rawSnippets = getDemoIntel(client.name)
    } else {
      rawSnippets = await searchCompany(client.name)
    }

    if (!rawSnippets || rawSnippets.trim().length === 0) {
      rawSnippets = getDemoIntel(client.name)
    }

    const extractionPrompt = `You are an intelligent business analyst. Extract structured signals from these search results about a company.

COMPANY: ${client.name}
INDUSTRY: ${client.industry}

RAW SEARCH RESULTS:
${rawSnippets}

Return ONLY valid JSON in this exact format, no other text:
{
  "new_hires": [{"role": "string", "seniority": "string"}],
  "job_postings": [{"role": "string", "department": "string"}],
  "company_moves": ["string"],
  "pain_indicators": ["string"],
  "summary": "2-3 sentence summary of what this company is doing right now"
}`

    const extraction = await groq.chat.completions.create({
      model: MODEL,
      messages: [{ role: 'user', content: extractionPrompt }],
      temperature: 0.2,
      max_tokens: 1000,
    })

    let structuredIntel = null
    try {
      const content = extraction.choices[0].message.content || '{}'
      const cleaned = content.replace(/```json|```/g, '').trim()
      structuredIntel = JSON.parse(cleaned)
    } catch {
      console.error('Failed to parse structured intel JSON')
    }

    const { data: feed, error: feedError } = await db
      .from('intel_feed')
      .insert({
        client_id: clientId,
        raw_snippets: rawSnippets,
        structured_intel: structuredIntel,
      })
      .select()
      .single()

    if (feedError) throw feedError

    return NextResponse.json({
      success: true,
      feedId: feed.id,
      structuredIntel,
      clientName: client.name,
    })
  } catch (error) {
    console.error('Fetch intel error:', error)
    return NextResponse.json({ error: 'Failed to fetch intel' }, { status: 500 })
  }
}