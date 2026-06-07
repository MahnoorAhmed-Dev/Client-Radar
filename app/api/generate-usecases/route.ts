import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { groq, MODEL } from '@/lib/groq'

export async function POST(req: NextRequest) {
  try {
    const { clientId, feedId } = await req.json()

    const db = supabaseAdmin()

    const { data: client } = await db
      .from('clients')
      .select('*, businesses(*)')
      .eq('id', clientId)
      .single()

    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 })
    }

    const { data: feed } = await db
      .from('intel_feed')
      .select('*')
      .eq('id', feedId)
      .single()

    if (!feed) {
      return NextResponse.json({ error: 'Intel feed not found' }, { status: 404 })
    }

    const business = client.businesses
    const intel = feed.structured_intel

    const usecasePrompt = `You are a sharp B2B sales strategist. Based on what a client company is doing, generate actionable sales opportunities for a service provider.

YOUR BUSINESS:
Name: ${business.name}
Services: ${business.services.join(', ')}
Expertise: ${business.expertise}
Past Work: ${business.past_work}

CLIENT COMPANY: ${client.name}
Industry: ${client.industry}

WHAT THEY'RE DOING RIGHT NOW:
${JSON.stringify(intel, null, 2)}

Generate 2-3 specific, high-quality sales opportunities. For each opportunity, identify a real trigger from their activity and map it to a service you can deliver.

Return ONLY valid JSON in this exact format, no other text:
[
  {
    "trigger": "specific thing they just did or are doing",
    "opportunity_summary": "one line: what you can help them with",
    "recommended_service": "specific service from your list",
    "draft_pitch": "3-4 sentence personalized outreach message. Start with the trigger, explain the pain, offer your specific solution, end with a soft CTA",
    "urgency": "high|medium|low"
  }
]`

    const generation = await groq.chat.completions.create({
      model: MODEL,
      messages: [{ role: 'user', content: usecasePrompt }],
      temperature: 0.4,
      max_tokens: 2000,
    })

    let usecases = []
    try {
      const content = generation.choices[0].message.content || '[]'
      const cleaned = content.replace(/```json|```/g, '').trim()
      usecases = JSON.parse(cleaned)
    } catch {
      console.error('Failed to parse usecases JSON')
      return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 })
    }

    const usecaseRows = usecases.map((u: {
      trigger: string
      opportunity_summary: string
      recommended_service: string
      draft_pitch: string
      urgency: string
    }) => ({
      client_id: clientId,
      trigger: u.trigger,
      opportunity_summary: u.opportunity_summary,
      recommended_service: u.recommended_service,
      draft_pitch: u.draft_pitch,
      urgency: u.urgency || 'medium',
      status: 'new',
    }))

    const { data: savedUsecases, error: ucError } = await db
      .from('usecases')
      .insert(usecaseRows)
      .select()

    if (ucError) throw ucError

    return NextResponse.json({
      success: true,
      usecases: savedUsecases,
      count: savedUsecases?.length || 0,
    })
  } catch (error) {
    console.error('Generate usecases error:', error)
    return NextResponse.json({ error: 'Failed to generate usecases' }, { status: 500 })
  }
}