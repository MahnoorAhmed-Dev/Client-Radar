'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Suspense } from 'react'
import {
  Radar,
  Zap,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Copy,
  ExternalLink,
  RefreshCw,
  AlertCircle,
  TrendingUp,
} from 'lucide-react'
import type { Business, Client, Usecase } from '@/types'

function DashboardContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const businessId = searchParams.get('b')

  const [business, setBusiness] = useState<Business | null>(null)
  const [clients, setClients] = useState<Client[]>([])
  const [usecases, setUsecases] = useState<Usecase[]>([])
  const [loading, setLoading] = useState(true)
  const [scanning, setScanning] = useState<string | null>(null)
  const [scanLog, setScanLog] = useState<string[]>([])
  const [expandedUsecase, setExpandedUsecase] = useState<string | null>(null)
  const [copied, setCopied] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'new' | 'viewed' | 'acted'>('all')

  const loadDashboard = useCallback(async () => {
    if (!businessId) return
    try {
      const res = await fetch(`/api/dashboard?businessId=${businessId}`)
      const data = await res.json()
      setBusiness(data.business)
      setClients(data.clients || [])
      setUsecases(data.usecases || [])
    } catch (err) {
      console.error('Load dashboard error:', err)
    } finally {
      setLoading(false)
    }
  }, [businessId])

  useEffect(() => {
    if (!businessId) {
      router.push('/')
      return
    }
    loadDashboard()
  }, [businessId, loadDashboard, router])

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

  const runScan = async (clientId: string, clientName: string, demoMode = true) => {
    setScanning(clientId)
    setScanLog([])

    const log = (msg: string) => setScanLog((prev) => [...prev, msg])

    try {
      log(`> Initialising scan for ${clientName}...`)
      await sleep(400)
      log('> Querying search index...')

      const fetchRes = await fetch('/api/fetch-intel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId, demoMode }),
      })
      const fetchData = await fetchRes.json()
      if (!fetchRes.ok) throw new Error(fetchData.error)

      log('> Intel extracted. Running analysis...')
      await sleep(300)
      log('> Matching against your capabilities...')

      const ucRes = await fetch('/api/generate-usecases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId, feedId: fetchData.feedId }),
      })
      const ucData = await ucRes.json()
      if (!ucRes.ok) throw new Error(ucData.error)

      log(`> ${ucData.count} opportunities generated ✓`)
      await sleep(300)

      await loadDashboard()
    } catch (err) {
      log(`> ERROR: ${err instanceof Error ? err.message : 'Scan failed'}`)
    } finally {
      setScanning(null)
    }
  }

  const markStatus = async (usecaseId: string, status: string) => {
    await fetch('/api/dashboard', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usecaseId, status }),
    })
    setUsecases((prev) =>
      prev.map((u) =>
        u.id === usecaseId ? { ...u, status: status as Usecase['status'] } : u
      )
    )
  }

  const copyPitch = (id: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const filteredUsecases = usecases.filter(
    (u) => filter === 'all' || u.status === filter
  )

  const newCount = usecases.filter((u) => u.status === 'new').length

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-radar-accent border-t-transparent rounded-full animate-spin mx-auto" />
          <div className="font-mono text-xs text-radar-dim">LOADING RADAR...</div>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen">
      {/* Top nav */}
      <nav className="border-b border-radar-border px-6 py-4 flex items-center justify-between sticky top-0 bg-radar-bg/90 backdrop-blur z-50">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-radar-accent pulse-dot" />
          <span className="font-display font-black text-lg">
            Client<span className="text-radar-accent">Radar</span>
          </span>
          {business && (
            <span className="font-mono text-xs text-radar-dim border-l border-radar-border pl-3 ml-1">
              {business.name}
            </span>
          )}
        </div>
        <div className="flex items-center gap-4">
          {newCount > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-radar-accent/10 border border-radar-accent/30">
              <div className="w-1.5 h-1.5 rounded-full bg-radar-accent pulse-dot" />
              <span className="font-mono text-xs text-radar-accent">{newCount} NEW</span>
            </div>
          )}
          <button
            onClick={() => router.push('/onboarding')}
            className="font-mono text-xs text-radar-dim hover:text-radar-accent transition-all"
          >
            + ADD CLIENT
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* Stats row */}
        <div className="grid grid-cols-4 gap-4">
          {[
            {
              label: 'Clients Tracked',
              value: clients.length,
              icon: Radar,
              color: 'text-radar-accent',
            },
            {
              label: 'Total Opportunities',
              value: usecases.length,
              icon: TrendingUp,
              color: 'text-radar-blue',
            },
            {
              label: 'New Alerts',
              value: newCount,
              icon: Zap,
              color: 'text-radar-yellow',
            },
            {
              label: 'Acted On',
              value: usecases.filter((u) => u.status === 'acted').length,
              icon: CheckCircle,
              color: 'text-radar-accent',
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="p-4 rounded border border-radar-border bg-radar-surface"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-xs text-radar-dim uppercase tracking-wider">
                  {stat.label}
                </span>
                <stat.icon size={14} className={stat.color} />
              </div>
              <div className={`font-display text-3xl font-black ${stat.color}`}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        {/* Client radar panel */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-radar-text">Client Radar</h2>
            <span className="font-mono text-xs text-radar-dim">
              CLICK SCAN TO RUN INTEL
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {clients.map((client) => (
              <div
                key={client.id}
                className="p-4 rounded border border-radar-border bg-radar-surface card-hover"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-display font-semibold text-radar-text text-sm">
                      {client.name}
                    </div>
                    <div className="font-mono text-xs text-radar-dim mt-0.5">
                      {client.industry}
                    </div>
                  </div>
                  <button
                    onClick={() => runScan(client.id, client.name, true)}
                    disabled={scanning === client.id}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-radar-border font-mono text-xs text-radar-dim hover:border-radar-accent hover:text-radar-accent transition-all disabled:opacity-40"
                  >
                    <RefreshCw
                      size={10}
                      className={scanning === client.id ? 'animate-spin' : ''}
                    />
                    {scanning === client.id ? 'SCANNING' : 'SCAN'}
                  </button>
                </div>

                {/* Scan terminal log */}
                {scanning === client.id && scanLog.length > 0 && (
                  <div className="mt-3 p-3 rounded bg-radar-bg border border-radar-border">
                    {scanLog.map((line, i) => (
                      <div
                        key={i}
                        className="font-mono text-xs text-radar-accent leading-6"
                      >
                        {line}
                      </div>
                    ))}
                    <div className="loading-bar h-0.5 rounded mt-2" />
                  </div>
                )}

                <div className="flex items-center gap-2 mt-3">
                  <span className="font-mono text-xs text-radar-dim">
                    {usecases.filter((u) => u.client_id === client.id).length} plays
                  </span>
                  {usecases.filter(
                    (u) => u.client_id === client.id && u.status === 'new'
                  ).length > 0 && (
                    <span className="badge-new font-mono text-xs px-2 py-0.5 rounded">
                      {
                        usecases.filter(
                          (u) => u.client_id === client.id && u.status === 'new'
                        ).length
                      }{' '}
                      new
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Opportunity feed */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-radar-text">
              Opportunity Feed
            </h2>
            <div className="flex gap-2">
              {(['all', 'new', 'viewed', 'acted'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`font-mono text-xs px-3 py-1.5 rounded border transition-all ${
                    filter === f
                      ? 'border-radar-accent text-radar-accent bg-radar-accent/10'
                      : 'border-radar-border text-radar-dim hover:border-radar-muted'
                  }`}
                >
                  {f.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {filteredUsecases.length === 0 ? (
            <div className="py-16 text-center border border-dashed border-radar-border rounded">
              <AlertCircle size={24} className="text-radar-muted mx-auto mb-3" />
              <p className="font-display text-radar-dim text-sm">
                {usecases.length === 0
                  ? 'No opportunities yet. Run a scan on a client to get started.'
                  : 'No opportunities in this filter.'}
              </p>
              {usecases.length === 0 && clients.length > 0 && (
                <button
                  onClick={() => runScan(clients[0].id, clients[0].name, true)}
                  className="btn-primary px-6 py-3 rounded text-xs mt-4 inline-block"
                >
                  SCAN {clients[0]?.name?.toUpperCase()} NOW →
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredUsecases.map((uc) => (
                <div
                  key={uc.id}
                  className={`rounded border bg-radar-surface transition-all ${
                    uc.status === 'new'
                      ? 'border-radar-accent/30'
                      : 'border-radar-border'
                  }`}
                >
                  {/* Card header */}
                  <div
                    className="p-4 cursor-pointer"
                    onClick={() => {
                      setExpandedUsecase(
                        expandedUsecase === uc.id ? null : uc.id
                      )
                      if (uc.status === 'new') markStatus(uc.id, 'viewed')
                    }}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span className="font-mono text-xs text-radar-dim">
                            {uc.client_name}
                          </span>
                          <span
                            className={`font-mono text-xs px-2 py-0.5 rounded badge-${uc.urgency}`}
                          >
                            {uc.urgency.toUpperCase()}
                          </span>
                          <span
                            className={`font-mono text-xs px-2 py-0.5 rounded badge-${uc.status}`}
                          >
                            {uc.status.toUpperCase()}
                          </span>
                        </div>
                        <div className="font-display font-semibold text-radar-text text-sm mb-1">
                          {uc.opportunity_summary}
                        </div>
                        <div className="font-mono text-xs text-radar-dim">
                          ↗ {uc.recommended_service}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="font-mono text-xs text-radar-muted">
                          {new Date(uc.created_at).toLocaleDateString()}
                        </span>
                        {expandedUsecase === uc.id ? (
                          <ChevronUp size={14} className="text-radar-dim" />
                        ) : (
                          <ChevronDown size={14} className="text-radar-dim" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expanded content */}
                  {expandedUsecase === uc.id && (
                    <div className="px-4 pb-4 space-y-4 border-t border-radar-border pt-4 animate-slide-up">
                      {/* Trigger */}
                      <div>
                        <div className="font-mono text-xs text-radar-dim uppercase tracking-wider mb-2">
                          TRIGGER
                        </div>
                        <div className="p-3 rounded bg-radar-bg border border-radar-border">
                          <div className="flex items-start gap-2">
                            <Zap
                              size={12}
                              className="text-radar-yellow mt-0.5 shrink-0"
                            />
                            <p className="font-display text-sm text-radar-text">
                              {uc.trigger}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Draft pitch */}
                      <div>
                        <div className="font-mono text-xs text-radar-dim uppercase tracking-wider mb-2">
                          DRAFT PITCH
                        </div>
                        <div className="p-4 rounded bg-radar-bg border border-radar-border relative">
                          <p className="font-display text-sm text-radar-text leading-relaxed pr-8">
                            {uc.draft_pitch}
                          </p>
                          <button
                            onClick={() => copyPitch(uc.id, uc.draft_pitch)}
                            className="absolute top-3 right-3 p-1.5 rounded border border-radar-border text-radar-dim hover:text-radar-accent hover:border-radar-accent transition-all"
                          >
                            {copied === uc.id ? (
                              <CheckCircle
                                size={12}
                                className="text-radar-accent"
                              />
                            ) : (
                              <Copy size={12} />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => markStatus(uc.id, 'acted')}
                          disabled={uc.status === 'acted'}
                          className="btn-primary px-4 py-2 rounded text-xs flex items-center gap-2"
                        >
                          <CheckCircle size={12} />
                          {uc.status === 'acted' ? 'ACTED' : 'MARK ACTED'}
                        </button>
                        <button
                          onClick={() => copyPitch(uc.id, uc.draft_pitch)}
                          className="px-4 py-2 rounded border border-radar-border font-mono text-xs text-radar-dim hover:border-radar-accent hover:text-radar-accent transition-all flex items-center gap-2"
                        >
                          <Copy size={12} />
                          COPY PITCH
                        </button>
                        <button className="px-4 py-2 rounded border border-radar-border font-mono text-xs text-radar-dim hover:border-radar-blue hover:text-radar-blue transition-all flex items-center gap-2">
                          <ExternalLink size={12} />
                          OPEN LINKEDIN
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="font-mono text-xs text-radar-dim">LOADING...</div>
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  )
}