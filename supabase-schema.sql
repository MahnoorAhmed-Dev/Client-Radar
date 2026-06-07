-- Run this in your Supabase SQL editor to set up the database

-- Businesses table (your agency/freelance profile)
CREATE TABLE businesses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  services TEXT[] NOT NULL DEFAULT '{}',
  expertise TEXT,
  past_work TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Clients table
CREATE TABLE clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  domain TEXT,
  industry TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Intel feed table (raw + structured data per client)
CREATE TABLE intel_feed (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  fetched_at TIMESTAMPTZ DEFAULT NOW(),
  raw_snippets TEXT,
  structured_intel JSONB
);

-- Usecases table (generated opportunities)
CREATE TABLE usecases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  trigger TEXT NOT NULL,
  opportunity_summary TEXT NOT NULL,
  recommended_service TEXT NOT NULL,
  draft_pitch TEXT NOT NULL,
  urgency TEXT DEFAULT 'medium' CHECK (urgency IN ('high', 'medium', 'low')),
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'viewed', 'acted')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE intel_feed ENABLE ROW LEVEL SECURITY;
ALTER TABLE usecases ENABLE ROW LEVEL SECURITY;

-- Allow all for demo
CREATE POLICY "Allow all" ON businesses FOR ALL USING (true);
CREATE POLICY "Allow all" ON clients FOR ALL USING (true);
CREATE POLICY "Allow all" ON intel_feed FOR ALL USING (true);
CREATE POLICY "Allow all" ON usecases FOR ALL USING (true);