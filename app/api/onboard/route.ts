import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const { businessName, services, expertise, pastWork, clients } = await req.json()

    const db = supabaseAdmin()

    const { data: business, error: bizError } = await db
      .from('businesses')
      .insert({
        name: businessName,
        services: services,
        expertise: expertise,
        past_work: pastWork,
      })
      .select()
      .single()

    if (bizError) throw bizError

    const clientRows = clients.map((c: { name: string; domain: string; industry: string }) => ({
      business_id: business.id,
      name: c.name,
      domain: c.domain,
      industry: c.industry,
    }))

    const { error: clientError } = await db.from('clients').insert(clientRows)
    if (clientError) throw clientError

    return NextResponse.json({ success: true, businessId: business.id })
  } catch (error) {
    console.error('Onboard error:', error)
    return NextResponse.json({ error: 'Failed to onboard' }, { status: 500 })
  }
}