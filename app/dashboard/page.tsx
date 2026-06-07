'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Home() {
  const router = useRouter()
  const [typed, setTyped] = useState('')
  const fullText = 'Your clients are moving. Are you watching?'

  useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      if (i <= fullText.length) {
        setTyped(fullText.slice(0, i))
        i++
      } else {
        clearInterval(interval)
      }
    }, 40)
    return () => clearInterval(interval)
  }, [])

  const businessId = typeof window !== 'undefined' ? localStorage.getItem('businessId') : null

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 relative">
      {/* Corner decorations */}
      <div className="fixed top-0 left-0 w-32 h-32 border-l-2 border-t-2 border-radar-accent opacity-20" />
      <div className="fixed top-0 right-0 w-32 h-32 border-r-2 border-t-2 border-radar-accent opacity-20" />
      <div className="fixed bottom-0 left-0 w-32 h-32 border-l-2 border-b-2 border-radar-accent opacity-20" />
      <div className="fixed bottom-0 right-0 w-32 h-32 border-r-2 border-b-2 border-radar-accent opacity-20" />

      <div className="max-w-3xl w-full text-center space-y-8">
        {/* Logo */}
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="relative">
              <div className="w-3 h-3 rounded-full bg-radar-accent pulse-dot" />
              <div className="absolute inset-0 w-3 h-3 rounded-full bg-radar-accent opacity-30 scale-150" />
            </div>
            <span className="font-mono text-radar-dim text-xs tracking-widest uppercase">
              LIVE INTEL SYSTEM
            </span>
            <div className="relative">
              <div className="w-3 h-3 rounded-full bg-radar-accent pulse-dot" />
            </div>
          </div>

          <h1 className="font-display text-6xl font-black tracking-tight">
            <span className="text-radar-text">Client</span>
            <span className="text-radar-accent glow-text-green">Radar</span>
          </h1>
          <div className="font-mono text-xs text-radar-dim tracking-widest uppercase">
            B2B Opportunity Intelligence
          </div>
        </div>

        {/* Typing animation */}
        <div className="relative">
          <p className="font-display text-xl text-radar-dim leading-relaxed min-h-[2rem]">
            {typed}
            {typed.length < fullText.length && (
              <span className="inline-block w-0.5 h-5 bg-radar-accent ml-1 animate-pulse" />
            )}
          </p>
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap gap-3 justify-center">
          {[
            '↗ Tracks client hires',
            '↗ Monitors news & funding',
            '↗ Generates pitches',
            '↗ Personalised to your stack',
          ].map((f) => (
            <span
              key={f}
              className="font-mono text-xs px-3 py-1.5 rounded border border-radar-border text-radar-dim"
            >
              {f}
            </span>
          ))}
        </div>

        {/* How it works */}
        <div className="grid grid-cols-3 gap-4 text-left">
          {[
            {
              step: '01',
              title: 'Onboard once',
              desc: "Add your clients and your services. That's it.",
            },
            {
              step: '02',
              title: 'Radar runs',
              desc: 'We watch their hires, news, and moves daily.',
            },
            {
              step: '03',
              title: 'You get plays',
              desc: 'Ready-to-send pitches based on real triggers.',
            },
          ].map((item) => (
            <div
              key={item.step}
              className="p-4 rounded border border-radar-border bg-radar-surface"
            >
              <div className="font-mono text-radar-accent text-xs mb-2">{item.step}</div>
              <div className="font-display font-semibold text-radar-text text-sm mb-1">
                {item.title}
              </div>
              <div className="font-display text-radar-dim text-xs leading-relaxed">
                {item.desc}
              </div>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => router.push('/onboarding')}
            className="btn-primary px-8 py-3 rounded text-sm"
          >
            START RADAR →
          </button>
          {businessId && (
            <button
              onClick={() => router.push(`/dashboard?b=${businessId}`)}
              className="px-8 py-3 rounded text-sm font-mono border border-radar-border text-radar-dim hover:border-radar-accent hover:text-radar-accent transition-all"
            >
              OPEN DASHBOARD
            </button>
          )}
        </div>

        <p className="font-mono text-radar-muted text-xs">
          Built for B2B freelancers and agencies who are tired of cold outreach
        </p>
      </div>
    </main>
  )
}