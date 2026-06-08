# ClientRadar 🎯
> AI-powered B2B opportunity intelligence. Watches your clients so you know exactly when to pitch.

**Live at:** [https://client-radar-self.vercel.app](https://client-radar-self.vercel.app)

ClientRadar is built for B2B freelancers, agencies, and corporate service providers who lose deals not because they lack skill, but because they pitch at the wrong time with the wrong message.

## The Problem

When a client hires a new Head of Growth, raises funding, or launches a new product line—that is a signal. It means they have a new problem and a budget to solve it. Nobody catches these signals[...]

For corporate service sellers, the problem runs deeper. They have a full catalogue of services but no way to know which client needs what right now. They default to cold outreach (which fails) or [...]

Tools like LinkedIn Sales Navigator are built for enterprise sales teams with big budgets. Independent operators and growing service businesses have nothing built for them.

## The Solution

ClientRadar is not a search tool or a CRM—it's an **opportunity engine**.

The core innovation is a two-step AI pipeline:
1. **Signal Detection** — reads what's happening at client companies (new hires, job postings, funding rounds, leadership changes)
2. **Personalized Pitch Generation** — cross-references those signals against your specific services and past work to generate ready-to-send pitches

The output isn't a report or dashboard. It's a specific action: "Here is what changed, here is why it matters to your business, and here is exactly what to say to them today."

## Who It's For

Our primary customers are Pakistani B2B service providers: freelancers, small agencies, and corporate sales teams offering services like web development, branding, SEO, software, or consulting. Th[...]

## How It Works

1. **Onboard** — Paste your website URL. Your business profile, services, and past work are extracted automatically
2. **Add Clients** — ClientRadar monitors them for signals
3. **Receive Opportunities** — AI-generated pitch opportunities with ready-to-send outreach messages
4. **Take Action** — Copy and send. The entire pipeline works in under 60 seconds

## The Team

| Member | Role |
|--------|------|
| Mahnoor | Backend + Frontend Support |
| Ibad | Frontend |
| Shayan | Frontend |

We bring together backend engineering, frontend development, and product thinking. We've built and shipped AI-powered production systems before and understand this market from the inside. We are n[...]

## Tech Stack

- **Next.js 14** (App Router, TypeScript)
- **Groq** (llama-3.3-70b) — LLM inference
- **Serper** — Google Search API
- **Supabase** — Postgres database
- **Tailwind CSS** — Styling

## Project Structure

```
clientradar/
├── app/
│   ├── api/
│   │   ├── onboard/route.ts            # POST — saves business + clients
│   │   ├── fetch-intel/route.ts        # POST — fetches + extracts intel per client
│   │   ├── generate-usecases/route.ts  # POST — generates pitch opportunities
│   │   └── dashboard/route.ts          # GET — loads dashboard data / PATCH — update status
│   ├── onboarding/page.tsx             # 2-step onboarding flow
│   ├── dashboard/page.tsx              # Main dashboard — clients + opportunity feed
│   ├── layout.tsx                      # Root layout
│   ├── page.tsx                        # Landing page
│   └── globals.css                     # Global styles + design tokens
├── lib/
│   ├── groq.ts                         # Groq client (llama-3.3-70b)
│   ├── serper.ts                       # Serper search + demo intel fallback
│   └── supabase.ts                     # Supabase client + admin client
├── types/
│   └── index.ts                        # Shared TypeScript interfaces
├── components/                         # Shared UI components (future)
├── supabase-schema.sql                 # Run once in Supabase SQL editor
└── .env.local.example                  # Copy to .env.local and fill in keys
```

## Pipeline

```
Onboard (your services + clients)
         ↓
Serper fetches intel per client (hires, news, funding)
         ↓
Groq Pass 1 — extracts structured signals from raw search results
         ↓
Groq Pass 2 — generates pitch opportunities matched to your services
         ↓
Dashboard shows alerts + ready-to-send pitches
```

## Setup

### 1. Clone & Install

```bash
git clone https://github.com/MahnoorAhmed-Dev/Client-Radar.git
cd Client-Radar
npm install
```

### 2. Environment Variables

```bash
cp .env.local.example .env.local
```

Fill in all keys:

```
GROQ_API_KEY=gsk_...
SERPER_API_KEY=...
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...
SUPABASE_SERVICE_ROLE_KEY=sb_secret_...
```

### 3. Database

- Go to Supabase → SQL Editor
- Paste and run the full contents of `supabase-schema.sql`
- You should see "Success. No rows returned"

### 4. Run

```bash
npm run dev
```

Open http://localhost:3000

## API Keys

| Service | URL | Notes |
|---------|-----|-------|
| Groq | https://console.groq.com | Free, instant |
| Serper | https://serper.dev | 100 searches/day free |
| Supabase | https://supabase.com | Free tier |

## Roadmap

- Auto-populate business profile and services through PDF proposal upload
- Daily automated monitoring so users wake up to fresh opportunities every morning
- WhatsApp and email alerts to deliver intelligence directly to where users operate
- CRM layer to track which pitches were sent, opened, and converted
- Shared team dashboard for corporate clients so entire sales teams work from the same live intelligence feed
- Long term: ClientRadar becomes the permanent answer to "who should I reach out to today, and what should I say?"

## Status

ClientRadar is live and fully functional. Users onboard by pasting their website URL and their business profile, services, and past work are extracted automatically. Clients are added and monitor[...]
