# ClientRadar 🎯
> AI-powered B2B opportunity intelligence. Watches your clients so you know exactly when to pitch.

## Team
| Member | Role |
|--------|------|
| Mahnoor | Backend + Frontend Support |
| Ibad | Frontend |
| Shayan | Frontend |

## What It Does
ClientRadar monitors your clients' digital activity — hires, news, funding, expansions — and generates personalised pitch opportunities matched to YOUR specific services and capabilities.

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
git clone https://github.com/YOUR_ORG/clientradar.git
cd clientradar
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

## Git Workflow
- Branch naming: `ibad/feature-name`, `mahnoor/feature-name`, `shayan/feature-name`
- Always branch off `main`
- Merge order: Mahnoor (backend) first, then Ibad, then Shayan
- Commit prefixes: `feat:`, `fix:`, `chore:`

## API Keys
| Service | URL | Notes |
|---------|-----|-------|
| Groq | https://console.groq.com | Free, instant |
| Serper | https://serper.dev | 100 searches/day free |
| Supabase | https://supabase.com | Free tier |

## Demo Script (Pitch Day)
1. Landing page — "Your clients are moving. Are you watching?"
2. Onboard — add your agency + 2 real clients
3. Hit **SCAN** — watch terminal log fill live
4. Show generated opportunity cards — trigger + pitch
5. Copy pitch — ready to send right now

**Money line:** "This isn't a ChatGPT prompt. It knows your services, watches your clients, and tells you exactly when to reach out and what to say."
