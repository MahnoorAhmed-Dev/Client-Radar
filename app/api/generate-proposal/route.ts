import { NextRequest, NextResponse } from 'next/server'

import { supabaseAdmin } from '@/lib/supabase'
import { groq, MODEL } from '@/lib/groq'
import { createProposalPdf } from '@/lib/proposal-pdf'

export async function POST(
  req: NextRequest
) {
  try {
    const { usecaseId } = await req.json()

    const db = supabaseAdmin()

    const { data: usecase } = await db
      .from('usecases')
      .select('*')
      .eq('id', usecaseId)
      .single()

    if (!usecase) {
      return NextResponse.json(
        { error: 'Usecase not found' },
        { status: 404 }
      )
    }

    const { data: client } = await db
      .from('clients')
      .select('*')
      .eq('id', usecase.client_id)
      .single()

    if (!client) {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      )
    }

    const proposalPrompt = `
Create a professional business proposal.

Client:
${client.name}

Opportunity:
${usecase.opportunity_summary}

Recommended Service:
${usecase.recommended_service}

Pitch:
${usecase.draft_pitch}

Generate a professional client proposal.

IMPORTANT RULES:
- Maximum 350 words total
- Keep each section concise
- Use professional consulting language
- Use bullet points where appropriate
- Do not use long paragraphs
- Do not repeat information
- Format exactly as shown below

EXECUTIVE SUMMARY:
<2-3 sentences>

PROBLEM IDENTIFIED:
<2-3 sentences>

RECOMMENDED SOLUTION:
<2-3 sentences>

KEY DELIVERABLES:
• Deliverable 1
• Deliverable 2
• Deliverable 3
• Deliverable 4

IMPLEMENTATION TIMELINE:
• Week 1 - Discovery & Analysis
• Week 2 - Strategy Development
• Week 3 - Implementation
• Week 4 - Optimization

EXPECTED BUSINESS IMPACT:
• Impact 1
• Impact 2
• Impact 3

INVESTMENT ESTIMATE:
Provide a realistic budget range only.

NEXT STEPS:
<2 short sentences>

Return plain text only.
`

    const completion =
      await groq.chat.completions.create({
        model: MODEL,
        messages: [
          {
            role: 'user',
            content: proposalPrompt,
          },
        ],
        temperature: 0.4,
        max_tokens: 2000,
      })

    const proposal =
      completion.choices[0].message.content ||
      'Proposal generation failed'

    const pdfBytes =
      await createProposalPdf(
        client.name,
        proposal
      )

    return new NextResponse(pdfBytes, {
      headers: {
        'Content-Type':
          'application/pdf',
        'Content-Disposition':
          `attachment; filename="${client.name}-proposal.pdf"`,
      },
    })
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      {
        error: 'Proposal generation failed',
      },
      {
        status: 500,
      }
    )
  }
}