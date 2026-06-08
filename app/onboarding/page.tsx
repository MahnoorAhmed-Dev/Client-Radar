'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { X, Plus, Globe, Loader, Sparkles } from 'lucide-react'

interface ClientEntry {
  name: string
  domain: string
  industry: string
}

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [extracting, setExtracting] = useState(false)
  const [extractingClients, setExtractingClients] = useState(false)
  const [error, setError] = useState('')
  const [extractError, setExtractError] = useState('')
  const [websiteUrl, setWebsiteUrl] = useState('')
  const [portfolioContent, setPortfolioContent] = useState('')
  const [extracted, setExtracted] = useState(false)
  const [clientsExtracted, setClientsExtracted] = useState(false)

  // Business info
  const [businessName, setBusinessName] = useState('')
  const [services, setServices] = useState<string[]>([''])
  const [expertise, setExpertise] = useState('')
  const [pastWork, setPastWork] = useState('')

  // Clients
  const [clients, setClients] = useState<ClientEntry[]>([
    { name: '', domain: '', industry: '' },
  ])

  const addService = () => setServices([...services, ''])
  const removeService = (i: number) =>
    setServices(services.filter((_, idx) => idx !== i))
  const updateService = (i: number, val: string) => {
    const updated = [...services]
    updated[i] = val
    setServices(updated)
  }

  const addClient = () =>
    setClients([...clients, { name: '', domain: '', industry: '' }])
  const removeClient = (i: number) =>
    setClients(clients.filter((_, idx) => idx !== i))
  const updateClient = (i: number, field: keyof ClientEntry, val: string) => {
    const updated = [...clients]
    updated[i] = { ...updated[i], [field]: val }
    setClients(updated)
  }

  // Business auto-fill
  const handleExtract = async () => {
    setExtracting(true)
    setExtractError('')
    setExtracted(false)

    try {
      if (!websiteUrl) {
        setExtractError('Enter a URL first.')
        setExtracting(false)
        return
      }

      const formData = new FormData()
      formData.append('url', websiteUrl)

      const res = await fetch('/api/extract-business', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      const { extracted: info } = data
      if (info.businessName) setBusinessName(info.businessName)
      if (info.services?.length) setServices(info.services)
      if (info.expertise) setExpertise(info.expertise)
      if (info.pastWork) setPastWork(info.pastWork)

      setPortfolioContent(data.rawContent || '')
      setExtracted(true)
    } catch (err) {
      setExtractError(err instanceof Error ? err.message : 'Extraction failed')
    } finally {
      setExtracting(false)
    }
  }

  // Extract clients from portfolio
  const handleExtractClients = async () => {
    setExtractingClients(true)
    setClientsExtracted(false)

    try {
      const res = await fetch('/api/extract-clients-from-portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          portfolioUrl: websiteUrl || null,
          portfolioContent: portfolioContent || null,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      if (data.clients && data.clients.length > 0) {
        const manualClients = clients.filter((c) => c.name.trim() !== '')
        const merged = [...data.clients, ...manualClients]
        setClients(merged)
      }
      setClientsExtracted(true)
    } catch (err) {
      console.error('Extract clients error:', err)
      setClientsExtracted(true)
    } finally {
      setExtractingClients(false)
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/onboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName,
          services: services.filter(Boolean),
          expertise,
          pastWork,
          clients: clients.filter((c) => c.name),
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      localStorage.setItem('businessId', data.businessId)
      router.push(`/dashboard?b=${data.businessId}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen py-16 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="font-mono text-radar-accent text-xs tracking-widest mb-3">
            SETUP // STEP {step} OF 2
          </div>
          <h1 className="font-display text-4xl font-black text-radar-text mb-2">
            {step === 1 ? 'Your Business' : 'Your Clients'}
          </h1>
          <p className="font-display text-radar-dim text-sm">
            {step === 1
              ? 'Drop your website URL and we fill everything in.'
              : 'Pull clients from your portfolio or add them manually.'}
          </p>
        </div>

        {/* Progress bar */}
        <div className="flex gap-2 mb-10">
          {[1, 2].map((s) => (
            <div
              key={s}
              className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                s <= step ? 'bg-radar-accent' : 'bg-radar-border'
              }`}
            />
          ))}
        </div>

        {/* Step 1 — Business */}
        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            {/* Smart extract panel */}
            <div className="p-5 rounded border border-radar-accent/30 bg-radar-accent/5">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles size={14} className="text-radar-accent" />
                <span className="font-mono text-xs text-radar-accent tracking-wider uppercase">
                  Auto-fill from your website
                </span>
              </div>

              <div className="flex gap-2">
                <div className="flex items-center gap-2 px-4 py-2 rounded border border-radar-accent text-radar-accent bg-radar-accent/10 font-mono text-xs">
                  <Globe size={12} /> WEBSITE URL
                </div>
                <input
                  className="input-dark flex-1 px-4 py-3 rounded text-sm"
                  placeholder="https://yourcompany.com"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                />
                <button
                  onClick={handleExtract}
                  disabled={extracting || !websiteUrl}
                  className="btn-primary px-5 py-3 rounded text-xs flex items-center gap-2 whitespace-nowrap"
                >
                  {extracting ? (
                    <Loader size={12} className="animate-spin" />
                  ) : (
                    <Sparkles size={12} />
                  )}
                  {extracting ? 'READING...' : 'AUTO-FILL'}
                </button>
              </div>

              {extractError && (
                <p className="font-mono text-xs text-radar-red mt-2">
                  ERROR: {extractError}
                </p>
              )}
              {extracted && (
                <p className="font-mono text-xs text-radar-accent mt-2">
                  ✓ Fields populated — review and edit below
                </p>
              )}
            </div>

            {/* Manual fields */}
            <div>
              <label className="font-mono text-xs text-radar-dim tracking-wider uppercase block mb-2">
                Business / Agency Name
              </label>
              <input
                className="input-dark w-full px-4 py-3 rounded text-sm"
                placeholder="e.g. Pixel Studio, Fatima Consulting"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
              />
            </div>

            <div>
              <label className="font-mono text-xs text-radar-dim tracking-wider uppercase block mb-2">
                Services You Offer
              </label>
              <div className="space-y-2">
                {services.map((s, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      className="input-dark flex-1 px-4 py-3 rounded text-sm"
                      placeholder="e.g. Brand Identity, Web Development, SEO"
                      value={s}
                      onChange={(e) => updateService(i, e.target.value)}
                    />
                    {services.length > 1 && (
                      <button
                        onClick={() => removeService(i)}
                        className="p-3 rounded border border-radar-border text-radar-dim hover:text-radar-red hover:border-radar-red transition-all"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={addService}
                  className="flex items-center gap-2 font-mono text-xs text-radar-accent hover:text-radar-text transition-all"
                >
                  <Plus size={12} /> ADD SERVICE
                </button>
              </div>
            </div>

            <div>
              <label className="font-mono text-xs text-radar-dim tracking-wider uppercase block mb-2">
                Your Core Expertise
              </label>
              <input
                className="input-dark w-full px-4 py-3 rounded text-sm"
                placeholder="e.g. Growth-stage B2B SaaS companies, E-commerce brands"
                value={expertise}
                onChange={(e) => setExpertise(e.target.value)}
              />
            </div>

            <div>
              <label className="font-mono text-xs text-radar-dim tracking-wider uppercase block mb-2">
                Notable Past Work (optional)
              </label>
              <textarea
                className="input-dark w-full px-4 py-3 rounded text-sm resize-none"
                rows={3}
                placeholder="e.g. Rebranded Markhor, built Bazaar's landing pages, ran Foodpanda's SEO..."
                value={pastWork}
                onChange={(e) => setPastWork(e.target.value)}
              />
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!businessName || !services.some(Boolean)}
              className="btn-primary w-full py-4 rounded text-sm mt-4"
            >
              NEXT: ADD CLIENTS →
            </button>
          </div>
        )}

        {/* Step 2 — Clients */}
        {step === 2 && (
          <div className="space-y-6 animate-fade-in">

            {/* Auto-populate panel */}
            <div className="p-5 rounded border border-radar-accent/30 bg-radar-accent/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles size={14} className="text-radar-accent" />
                  <span className="font-mono text-xs text-radar-accent tracking-wider uppercase">
                    Auto-populate from your portfolio
                  </span>
                </div>
                <button
                  onClick={handleExtractClients}
                  disabled={extractingClients || (!websiteUrl && !portfolioContent)}
                  className="flex items-center gap-2 px-4 py-2 rounded btn-primary text-xs disabled:opacity-40"
                >
                  {extractingClients ? (
                    <Loader size={12} className="animate-spin" />
                  ) : (
                    <Sparkles size={12} />
                  )}
                  {extractingClients ? 'SCANNING...' : 'PULL MY CLIENTS'}
                </button>
              </div>

              {!websiteUrl && !portfolioContent && (
                <p className="font-mono text-xs text-radar-dim mt-3">
                  Go back and auto-fill your business first — we use your portfolio to find clients.
                </p>
              )}

              {clientsExtracted && !extractingClients && (
                <p className="font-mono text-xs text-radar-accent mt-3">
                  ✓ Clients pulled — edit below or add more manually
                </p>
              )}
            </div>

            {/* Client cards */}
            {clients.map((client, i) => (
              <div
                key={i}
                className="p-5 rounded border border-radar-border bg-radar-surface space-y-3"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-xs text-radar-accent">
                    CLIENT_{String(i + 1).padStart(2, '0')}
                  </span>
                  {clients.length > 1 && (
                    <button
                      onClick={() => removeClient(i)}
                      className="text-radar-dim hover:text-radar-red transition-all"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
                <input
                  className="input-dark w-full px-4 py-3 rounded text-sm"
                  placeholder="Company name (e.g. Careem, Foodpanda)"
                  value={client.name}
                  onChange={(e) => updateClient(i, 'name', e.target.value)}
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    className="input-dark w-full px-4 py-3 rounded text-sm"
                    placeholder="Domain (e.g. careem.com)"
                    value={client.domain}
                    onChange={(e) => updateClient(i, 'domain', e.target.value)}
                  />
                  <input
                    className="input-dark w-full px-4 py-3 rounded text-sm"
                    placeholder="Industry (e.g. Fintech)"
                    value={client.industry}
                    onChange={(e) => updateClient(i, 'industry', e.target.value)}
                  />
                </div>
              </div>
            ))}

            <button
              onClick={addClient}
              className="flex items-center gap-2 font-mono text-xs text-radar-accent hover:text-radar-text transition-all"
            >
              <Plus size={12} /> ADD ANOTHER CLIENT
            </button>

            {error && (
              <div className="p-4 rounded border border-radar-red bg-radar-red/10 font-mono text-xs text-radar-red">
                ERROR: {error}
              </div>
            )}

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-4 rounded border border-radar-border text-radar-dim font-mono text-sm hover:border-radar-accent hover:text-radar-accent transition-all"
              >
                ← BACK
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading || !clients.some((c) => c.name)}
                className="btn-primary flex-1 py-4 rounded text-sm"
              >
                {loading ? 'INITIALISING RADAR...' : 'LAUNCH RADAR →'}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}