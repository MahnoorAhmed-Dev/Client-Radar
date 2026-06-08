'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Zap, Target, Users, ArrowDown, TrendingUp, CheckCircle } from 'lucide-react'

export default function Home() {
  const router = useRouter()
  const [typed, setTyped] = useState('')
  const [businessId, setBusinessId] = useState<string | null>(null)
  const fullText = 'Your clients are moving. Are you watching?'

  useEffect(() => {
    setBusinessId(localStorage.getItem('businessId'))
  }, [])

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

  return (
    <main className="min-h-screen">

      {/* HERO */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 relative">
        <div className="fixed top-0 left-0 w-32 h-32 border-l-2 border-t-2 border-radar-accent opacity-20" />
        <div className="fixed top-0 right-0 w-32 h-32 border-r-2 border-t-2 border-radar-accent opacity-20" />
        <div className="fixed bottom-0 left-0 w-32 h-32 border-l-2 border-b-2 border-radar-accent opacity-20" />
        <div className="fixed bottom-0 right-0 w-32 h-32 border-r-2 border-b-2 border-radar-accent opacity-20" />

        <div className="max-w-3xl w-full text-center space-y-8">
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

          <div className="relative">
            <p className="font-display text-xl text-radar-dim leading-relaxed min-h-[2rem]">
              {typed}
              {typed.length < fullText.length && (
                <span className="inline-block w-0.5 h-5 bg-radar-accent ml-1 animate-pulse" />
              )}
            </p>
          </div>

          <div className="flex flex-wrap gap-3 justify-center">
            {[
              '↗ Tracks client hires',
              '↗ Monitors news & funding',
              '↗ Generates pitches',
              '↗ Downloads proposals',
            ].map((f) => (
              <span
                key={f}
                className="font-mono text-xs px-3 py-1.5 rounded border border-radar-border text-radar-dim"
              >
                {f}
              </span>
            ))}
          </div>

          <div className="flex gap-4 justify-center flex-wrap">
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

          <p className="font-mono text-radar-dim text-xs">
            Want to see it live? Hit START RADAR for a full demo
          </p>

          <div className="flex items-center justify-center mt-2">
            <ArrowDown size={16} className="text-radar-dim animate-bounce" />
          </div>
        </div>
      </section>

      {/* PROBLEM */}
      <section className="py-32 px-6 border-t border-radar-border">
        <div className="max-w-4xl mx-auto">
          <div className="font-mono text-radar-accent text-xs tracking-widest uppercase mb-6">
            01 / THE PROBLEM
          </div>
          <h2 className="font-display text-5xl font-black text-radar-text mb-8 leading-tight">
            Every day your clients give signals.
            <br />
            <span className="text-radar-dim">Nobody is watching.</span>
          </h2>
          <p className="font-display text-radar-dim text-lg leading-relaxed mb-12">
            Freelancers, agencies, and corporate service teams lose deals not because they lack
            skill — but because they pitch at the wrong time with the wrong message. They have no
            system to know when a client is ready to buy. So they default to cold outreach that
            fails, or they wait for clients to come to them. Meanwhile the signals are right there.
          </p>
          <div className="grid grid-cols-3 gap-6">
            {[
              {
                trigger: 'Client hires a Head of Growth',
                meaning: 'They are scaling. They need new tools, agencies, and services right now.',
              },
              {
                trigger: 'Client raises a funding round',
                meaning: 'They have budget and they are about to spend it. Are you first in line?',
              },
              {
                trigger: 'Client posts five new jobs',
                meaning: 'They are expanding fast and probably overwhelmed. Perfect timing to reach out.',
              },
            ].map((item) => (
              <div
                key={item.trigger}
                className="p-5 rounded border border-radar-border bg-radar-surface"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Zap size={12} className="text-radar-yellow" />
                  <span className="font-mono text-xs text-radar-yellow">SIGNAL MISSED</span>
                </div>
                <div className="font-display font-bold text-radar-text text-sm mb-2">
                  {item.trigger}
                </div>
                <div className="font-display text-radar-dim text-xs leading-relaxed">
                  {item.meaning}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SOLUTION */}
      <section className="py-32 px-6 border-t border-radar-border">
        <div className="max-w-4xl mx-auto">
          <div className="font-mono text-radar-accent text-xs tracking-widest uppercase mb-6">
            02 / THE SOLUTION
          </div>
          <h2 className="font-display text-5xl font-black text-radar-text mb-8 leading-tight">
            ClientRadar watches your clients
            <br />
            <span className="text-radar-accent glow-text-green">
              so you know exactly when to strike.
            </span>
          </h2>
          <p className="font-display text-radar-dim text-lg leading-relaxed mb-12">
            ClientRadar is not a search tool. It is not a CRM. It is an opportunity engine. It
            monitors your clients daily, detects signals, and generates a personalised pitch matched
            to your specific services — ready to send in under 60 seconds. One more click and you
            have a full proposal PDF to attach.
          </p>
          <div className="grid grid-cols-3 gap-6">
            {[
              {
                step: '01',
                title: 'Onboard once',
                desc: 'Paste your website URL. We read it and build your full business profile automatically. Your services, expertise, and past work — done in seconds.',
              },
              {
                step: '02',
                title: 'Radar runs',
                desc: 'We watch your clients daily. New hires, funding rounds, job postings, leadership changes. Every signal that means they might need you.',
              },
              {
                step: '03',
                title: 'You get the play',
                desc: 'A specific opportunity, the trigger behind it, a personalised pitch, and a downloadable proposal PDF. Ready to send right now.',
              },
            ].map((item) => (
              <div
                key={item.step}
                className="p-5 rounded border border-radar-border bg-radar-surface"
              >
                <div className="font-mono text-radar-accent text-xs mb-3">{item.step}</div>
                <div className="font-display font-bold text-radar-text text-sm mb-2">
                  {item.title}
                </div>
                <div className="font-display text-radar-dim text-xs leading-relaxed">
                  {item.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHO IT'S FOR */}
      <section className="py-32 px-6 border-t border-radar-border">
        <div className="max-w-4xl mx-auto">
          <div className="font-mono text-radar-accent text-xs tracking-widest uppercase mb-6">
            03 / WHO IT IS FOR
          </div>
          <h2 className="font-display text-5xl font-black text-radar-text mb-12 leading-tight">
            Built for anyone selling
            <br />
            <span className="text-radar-accent">B2B services.</span>
          </h2>
          <div className="grid grid-cols-2 gap-6">
            {[
              {
                icon: Users,
                title: 'Freelancers & Agencies',
                desc: 'Web developers, designers, SEO specialists, copywriters, consultants. Anyone with a client base and services to sell who is tired of cold outreach going nowhere.',
              },
              {
                icon: Target,
                title: 'Corporate Sales Teams',
                desc: 'Service businesses with a full catalogue of offerings and a sales floor that needs to know what to pitch, to whom, and when — without spending hours on manual research.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="p-6 rounded border border-radar-border bg-radar-surface flex gap-4"
              >
                <item.icon size={20} className="text-radar-accent shrink-0 mt-1" />
                <div>
                  <div className="font-display font-bold text-radar-text text-sm mb-2">
                    {item.title}
                  </div>
                  <div className="font-display text-radar-dim text-xs leading-relaxed">
                    {item.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MARKET */}
      <section className="py-32 px-6 border-t border-radar-border">
        <div className="max-w-4xl mx-auto">
          <div className="font-mono text-radar-accent text-xs tracking-widest uppercase mb-6">
            04 / THE MARKET
          </div>
          <h2 className="font-display text-5xl font-black text-radar-text mb-12 leading-tight">
            A massive market with
            <br />
            <span className="text-radar-accent">no product built for it.</span>
          </h2>
          <div className="grid grid-cols-3 gap-6">
            {[
              {
                number: '1.5M+',
                label: 'Registered freelancers in Pakistan',
                sub: 'Top 5 freelancing nation globally',
              },
              {
                number: '300K+',
                label: 'Operating in B2B services',
                sub: 'Where client intelligence drives revenue',
              },
              {
                number: '$400M+',
                label: 'South Asian B2B services market',
                sub: 'Annually, growing fast',
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="p-6 rounded border border-radar-border bg-radar-surface text-center"
              >
                <div className="font-display text-4xl font-black text-radar-accent mb-2">
                  {stat.number}
                </div>
                <div className="font-display font-semibold text-radar-text text-sm mb-1">
                  {stat.label}
                </div>
                <div className="font-mono text-radar-dim text-xs">{stat.sub}</div>
              </div>
            ))}
          </div>
          <p className="font-display text-radar-dim text-lg leading-relaxed mt-10">
            This specific product — personalised, automated opportunity intelligence for service
            sellers — does not exist at this price point or level of automation anywhere in the
            region. We are creating a new category.
          </p>
        </div>
      </section>

      {/* TRACTION */}
      <section className="py-32 px-6 border-t border-radar-border">
        <div className="max-w-4xl mx-auto">
          <div className="font-mono text-radar-accent text-xs tracking-widest uppercase mb-6">
            05 / TRACTION
          </div>
          <h2 className="font-display text-5xl font-black text-radar-text mb-12 leading-tight">
            Built and live
            <br />
            <span className="text-radar-accent">in 24 hours.</span>
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              'Live at clientradar.app right now',
              'Full onboarding flow — website URL to business profile in seconds',
              'Client monitoring pipeline fully functional',
              'AI pitch generation working across Pakistani company profiles',
              'One-click proposal PDF generation and download',
              'Opportunity management dashboard — track new, viewed, and acted',
            ].map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 p-4 rounded border border-radar-border bg-radar-surface"
              >
                <CheckCircle size={14} className="text-radar-accent shrink-0 mt-0.5" />
                <span className="font-display text-radar-text text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REVENUE */}
      <section className="py-32 px-6 border-t border-radar-border">
        <div className="max-w-4xl mx-auto">
          <div className="font-mono text-radar-accent text-xs tracking-widest uppercase mb-6">
            06 / REVENUE MODEL
          </div>
          <h2 className="font-display text-5xl font-black text-radar-text mb-12 leading-tight">
            Simple subscription.
            <br />
            <span className="text-radar-accent">Win one deal. Paid for itself.</span>
          </h2>
          <div className="grid grid-cols-3 gap-6">
            {[
              {
                tier: 'STARTER',
                price: '$15 / mo',
                who: 'Freelancers',
                features: ['Up to 10 clients', 'Manual scans', 'Pitch generation', 'Proposal PDF'],
              },
              {
                tier: 'PRO',
                price: '$35 / mo',
                who: 'Growing agencies',
                features: ['Up to 30 clients', 'Daily monitoring', 'Priority generation', 'Everything in Starter'],
              },
              {
                tier: 'TEAM',
                price: '$79 / mo',
                who: 'Corporate teams',
                features: ['Unlimited clients', 'Team dashboard', 'Shared opportunity feed', 'Everything in Pro'],
              },
            ].map((tier) => (
              <div
                key={tier.tier}
                className="p-6 rounded border border-radar-border bg-radar-surface"
              >
                <div className="font-mono text-radar-accent text-xs mb-1">{tier.tier}</div>
                <div className="font-display text-3xl font-black text-radar-text mb-1">
                  {tier.price}
                </div>
                <div className="font-mono text-radar-dim text-xs mb-4">{tier.who}</div>
                <div className="space-y-2">
                  {tier.features.map((f) => (
                    <div key={f} className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-radar-accent" />
                      <span className="font-display text-radar-dim text-xs">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROADMAP */}
      <section className="py-32 px-6 border-t border-radar-border">
        <div className="max-w-4xl mx-auto">
          <div className="font-mono text-radar-accent text-xs tracking-widest uppercase mb-6">
            07 / WHERE WE ARE GOING
          </div>
          <h2 className="font-display text-5xl font-black text-radar-text mb-12 leading-tight">
            This is just the beginning.
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              {
                icon: TrendingUp,
                title: 'Daily automated monitoring',
                desc: 'Wake up to fresh opportunities every morning without lifting a finger.',
              },
              {
                icon: Zap,
                title: 'WhatsApp and email alerts',
                desc: 'Intelligence delivered directly where Pakistani business owners already operate.',
              },
              {
                icon: Target,
                title: 'CRM layer',
                desc: 'Track which pitches were sent, opened, and converted. Close the loop.',
              },
              {
                icon: Users,
                title: 'Team sales dashboard',
                desc: 'An entire corporate sales floor working from the same live intelligence feed.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="p-5 rounded border border-radar-border bg-radar-surface flex gap-4"
              >
                <item.icon size={16} className="text-radar-accent shrink-0 mt-1" />
                <div>
                  <div className="font-display font-bold text-radar-text text-sm mb-1">
                    {item.title}
                  </div>
                  <div className="font-display text-radar-dim text-xs leading-relaxed">
                    {item.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-6 border-t border-radar-border">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="flex items-center justify-center gap-3">
            <div className="w-3 h-3 rounded-full bg-radar-accent pulse-dot" />
            <span className="font-mono text-radar-dim text-xs tracking-widest uppercase">
              LIVE NOW
            </span>
            <div className="w-3 h-3 rounded-full bg-radar-accent pulse-dot" />
          </div>

          <h2 className="font-display text-6xl font-black text-radar-text leading-tight">
            Stop guessing.
            <br />
            <span className="text-radar-accent glow-text-green">Start watching.</span>
          </h2>

          <p className="font-display text-radar-dim text-lg">
            ClientRadar is live at clientradar.app. Onboard in 60 seconds,
            get your first opportunity before you finish your coffee.
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            <button
              onClick={() => router.push('/onboarding')}
              className="btn-primary px-10 py-4 rounded text-sm"
            >
              START RADAR →
            </button>
            {businessId && (
              <button
                onClick={() => router.push(`/dashboard?b=${businessId}`)}
                className="px-10 py-4 rounded text-sm font-mono border border-radar-border text-radar-dim hover:border-radar-accent hover:text-radar-accent transition-all"
              >
                OPEN DASHBOARD
              </button>
            )}
          </div>

          <p className="font-mono text-radar-dim text-xs">
            clientradar.app · Built in 24 hours · Spectrum 26 · DHA Suffa University
          </p>
        </div>
      </section>

    </main>
  )
}