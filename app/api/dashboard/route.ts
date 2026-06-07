import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const businessId = searchParams.get('businessId')

    if (!businessId) {
      return NextResponse.json({ error: 'businessId required' }, { status: 400 })
    }

    const db = supabaseAdmin()

    const { data: business } = await db
      .from('businesses')
      .select('*')
      .eq('id', businessId)
      .single()

    const { data: clients } = await db
      .from('clients')
      .select('*')
      .eq('business_id', businessId)
      .order('created_at', { ascending: true })

    if (!clients) {
      return NextResponse.json({ business, clients: [], usecases: [] })
    }

    const clientIds = clients.map((c) => c.id)

    const { data: usecases } = await db
      .from('usecases')
      .select('*')
      .in('client_id', clientIds)
      .order('created_at', { ascending: false })
      .limit(50)

    const usecasesWithNames = usecases?.map((u) => ({
      ...u,
      client_name: clients.find((c) => c.id === u.client_id)?.name || 'Unknown',
    }))

    return NextResponse.json({
      business,
      clients,
      usecases: usecasesWithNames || [],
    })
  } catch (error) {
    console.error('Dashboard error:', error)
    return NextResponse.json({ error: 'Failed to load dashboard' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { usecaseId, status } = await req.json()
    const db = supabaseAdmin()
    await db.from('usecases').update({ status }).eq('id', usecaseId)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update status' }, { status: 500 })
  }
}