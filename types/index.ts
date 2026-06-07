export interface Business {
    id: string
    name: string
    services: string[]
    expertise: string
    past_work: string
    created_at: string
  }
  
  export interface Client {
    id: string
    business_id: string
    name: string
    domain: string
    industry: string
    created_at: string
  }
  
  export interface IntelFeed {
    id: string
    client_id: string
    fetched_at: string
    raw_snippets: string
    structured_intel: StructuredIntel | null
  }
  
  export interface StructuredIntel {
    new_hires: { role: string; seniority: string }[]
    job_postings: { role: string; department: string }[]
    company_moves: string[]
    pain_indicators: string[]
    summary: string
  }
  
  export interface Usecase {
    id: string
    client_id: string
    client_name?: string
    trigger: string
    opportunity_summary: string
    recommended_service: string
    draft_pitch: string
    urgency: 'high' | 'medium' | 'low'
    status: 'new' | 'viewed' | 'acted'
    created_at: string
  }