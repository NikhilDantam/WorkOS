import React, { useState } from 'react'
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  CircleCheck,
  Shield,
  Layers,
  TrendingUp,
  Target,
  FileCheck2,
  UsersRound,
  ShieldCheck,
  LockKeyhole,
  Award,
  Sparkles,
  Database,
  BarChart3
} from 'lucide-react'
import { StakeholderShowcase } from './workosComponents'

const secondaryContent: Record<string, { eyebrow: string; title: string; description: string; accent: string; points: string[]; metrics: string[] }> = {
  '/platform': {
    eyebrow: 'The platform',
    title: 'One evidence layer for the whole outcome journey.',
    description: 'WorkOS brings training, employment, verification and impact into a single operating model for skilling programmes.',
    accent: 'A clear line from participation to progression.',
    points: ['Governed outcome definitions your teams can trust', 'Longitudinal timelines from day 0 through day 365', 'Operational workflows for verification and follow-up', 'Outcome Intelligence that shows the evidence behind each recommendation'],
    metrics: ['Longitudinal records connected', 'Participating districts in view', 'Evidence-backed outcome signals']
  },
  '/outcomes': {
    eyebrow: 'Outcome intelligence',
    title: 'Measure the outcome after the outcome.',
    description: 'Placement is an intermediate event. WorkOS helps you see whether employment holds, wages progress and skills stay relevant.',
    accent: 'Know what changes. Know where to act.',
    points: ['Cohort and course conversion funnels', '30/90/180/365-day retention curves', 'Wage progression and role relevance', 'Non-placement and attrition taxonomies'],
    metrics: ['Longitudinal 90-day retention', 'Verified wage progression', 'Evidence-backed employment']
  },
  '/for-providers': {
    eyebrow: 'For providers',
    title: 'Turn course performance into a better next cohort.',
    description: 'See where curriculum, skills and employer demand align — and where they leave trainees behind.',
    accent: 'A sharper feedback loop for delivery teams.',
    points: ['Course-to-role relevance views', 'Skill gaps tied to real placement signals', 'Provider comparison without simplistic scores', 'Interventions you can assign and review'],
    metrics: ['Curriculum skill benchmarks', 'Course completion tracking', 'Follow-up response loops']
  },
  '/for-employers': {
    eyebrow: 'For employers',
    title: 'Make verification a useful signal, not a checkbox.',
    description: 'Give employers a clear, low-friction way to verify claims, share feedback and improve the talent pipeline.',
    accent: 'Evidence that helps both sides make better decisions.',
    points: ['Verification queue with confidence states', 'Employer feedback connected to trainee records', 'Evidence capture from portal, call or field visit', 'Review flows for low-confidence outcomes'],
    metrics: ['Verified employment claims', 'Active employer network', 'Multi-source evidence trails']
  },
  '/for-programmes': {
    eyebrow: 'For programmes',
    title: 'See where the system is working — and why.',
    description: 'Move from programme-level reporting to an operating view of districts, providers, cohorts and interventions.',
    accent: 'Impact becomes a feedback system.',
    points: ['District and cohort comparisons', 'Programme-level outcome funnels', 'Neutral multidimensional provider views', 'Intervention review against expected metrics'],
    metrics: ['Territory-wide intelligence', 'Provider impact profiles', 'Targeted intervention tracking']
  },
  '/impact': {
    eyebrow: 'Impact measurement',
    title: 'Make programme impact legible over time.',
    description: 'A serious view of employment, retention, wages and skill relevance across cohorts, districts and demographic segments.',
    accent: 'Evidence for the decisions that follow the report.',
    points: ['Executive-grade impact dashboard', 'Filter by cohort, course, provider and district', 'Evidence panel for every trend', 'Export-ready narrative and source context'],
    metrics: ['Longitudinal employment conversion', 'Longitudinal retention tracking', 'Verified wage progression']
  },
  '/security': {
    eyebrow: 'Privacy by design',
    title: 'The trust model is part of the product.',
    description: 'WorkOS is designed for sensitive outcome data: explicit consent, role-based access, privacy-safe identifiers and an accountable audit trail.',
    accent: 'Measure responsibly, from capture to decision.',
    points: ['Consent status and purpose recorded with outcomes', 'Role-based access across programme teams', 'Human review for low-confidence records', 'Audit history for changes and data access'],
    metrics: ['100% consent-aware records', '5 confidence states', 'Full audit visibility']
  },
  '/about': {
    eyebrow: 'About WorkOS',
    title: 'The operating system for better skilling outcomes.',
    description: 'WorkOS exists to help the people who design, fund, deliver and evaluate skilling programmes learn what actually changes livelihoods.',
    accent: 'Activity is the start. Outcomes are the measure.',
    points: ['Built for institutions, not vanity dashboards', 'Calm, credible and evidence-led by default', 'Designed around the full trainee journey', 'Made to turn learning into the next improvement'],
    metrics: ['Evidence over assumptions', 'Outcome over placement', 'Human-in-the-loop']
  }
}

export function WorkosSecondaryPage({ path, onNavigate, onOpenDemoModal }: { path: string; onNavigate: (path: string) => void; onOpenDemoModal: () => void }) {
  const page = secondaryContent[path] ?? secondaryContent['/platform']

  return (
    <div className="pt-28 pb-20 max-w-[1240px] mx-auto px-5 sm:px-8">
      {/* Header */}
      <div className="max-w-3xl mb-16">
        <span className="text-xs uppercase tracking-wider text-slate-gray font-medium mb-3 block">
          {page.eyebrow}
        </span>
        <h1 className="font-serif text-[42px] sm:text-[56px] md:text-[68px] font-normal leading-[1.1] text-primary-text tracking-[-0.02em] mb-6">
          {page.title}
        </h1>
        <p className="text-lg sm:text-xl font-book text-slate-gray leading-relaxed mb-8">
          {page.description}
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('/app/overview')}
            className="rounded-full bg-primary-text text-white px-6 h-11 text-base font-book hover:opacity-90 transition-opacity inline-flex items-center gap-2"
          >
            <span>Explore the platform</span>
            <ArrowUpRight className="size-4" />
          </button>
          <button
            onClick={onOpenDemoModal}
            className="rounded-full bg-trans-5 hover:bg-trans-10 text-primary-text px-6 h-11 text-base font-book transition-colors"
          >
            Talk to the team
          </button>
        </div>
      </div>

      {/* Metrics Banner */}
      <div className="bg-blush-peach text-sienna-brown p-8 rounded-3xl mb-16 shadow-subtle flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-sienna-brown/15">
        <div>
          <span className="text-xs uppercase tracking-wider block font-semibold opacity-75 mb-1">Impact Signal</span>
          <span className="font-serif text-2xl sm:text-3xl font-normal">{page.accent}</span>
        </div>
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          {page.metrics.map((m, i) => (
            <div key={i} className="bg-white/50 backdrop-blur-sm px-4 py-2 rounded-2xl border border-sienna-brown/10">
              <span className="text-xs opacity-70 block">Metric 0{i + 1}</span>
              <strong className="text-base font-medium">{m}</strong>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Platform Dashboard Showcase on /platform */}
      {path === '/platform' && (
        <div className="mb-20">
          <div className="mb-8">
            <span className="text-xs uppercase tracking-wider text-slate-gray font-medium mb-2 block">
              Interactive Dashboard Canvas
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-primary-text mb-3">
              Explore the outcome operating model
            </h2>
            <p className="text-base text-slate-gray max-w-xl">
              Switch through live analytics views across cohort overview, retention curves, wage progression, verification queues, and district benchmarks.
            </p>
          </div>
          <StakeholderShowcase onNavigate={onNavigate} />
        </div>
      )}

      {/* Feature Grid */}
      <div className="mb-20">
        <h2 className="font-serif text-3xl sm:text-4xl font-normal text-primary-text mb-8">
          What changes with WorkOS
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {page.points.map((pt, index) => (
            <div key={index} className="p-6 sm:p-8 bg-mist-gray rounded-3xl border border-black/5 flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono text-slate-gray mb-3 block">0{index + 1}</span>
                <h3 className="text-lg sm:text-xl font-medium text-primary-text mb-2">{pt}</h3>
                <p className="text-sm text-slate-gray">
                  Every outcome status is backed by verifiable sources and human review mechanisms.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-black/5 flex items-center text-xs text-primary-text font-medium">
                <span>Integrated in operating model</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// --- WORKOS CONTACT / BOOK A WALKTHROUGH PAGE ---
export function WorkosContactPage({ onNavigate }: { onNavigate: (path: string) => void }) {
  const [submitted, setSubmitted] = useState(false)
  const [email, setEmail] = useState('')
  const [org, setOrg] = useState('')
  const [focus, setFocus] = useState('outcomes')

  return (
    <div className="pt-28 pb-20 max-w-[1240px] mx-auto px-5 sm:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Left Column */}
        <div className="max-w-xl">
          <span className="text-xs uppercase tracking-wider text-slate-gray font-medium mb-3 block">
            Start a conversation
          </span>
          <h1 className="font-serif text-[42px] sm:text-[56px] font-normal leading-[1.1] text-primary-text tracking-[-0.02em] mb-6">
            See what your programme can learn next.
          </h1>
          <p className="text-lg font-book text-slate-gray leading-relaxed mb-8">
            Tell us a little about your outcome measurement priorities. We’ll bring a clear, focused walkthrough of the WorkOS model.
          </p>

          <div className="space-y-3 text-sm text-slate-gray">
            <div className="flex items-center gap-2">
              <CircleCheck className="size-4 text-emerald-600" />
              <span>No sales theatre — a real product walkthrough</span>
            </div>
            <div className="flex items-center gap-2">
              <CircleCheck className="size-4 text-emerald-600" />
              <span>Built around your outcome questions</span>
            </div>
            <div className="flex items-center gap-2">
              <CircleCheck className="size-4 text-emerald-600" />
              <span>Institutional privacy by design</span>
            </div>
          </div>
        </div>

        {/* Right Column: Clean Form */}
        <div className="bg-white p-8 rounded-3xl border border-black/10 shadow-subtle-2">
          {submitted ? (
            <div className="text-center py-10 space-y-4">
              <div className="size-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <Check className="size-6" />
              </div>
              <h3 className="font-serif text-3xl font-normal text-primary-text">Thanks — your note is with the team.</h3>
              <p className="text-sm text-slate-gray">
                We’ll follow up with a focused walkthrough of the WorkOS outcome model.
              </p>
              <button
                onClick={() => onNavigate('/')}
                className="mt-4 px-6 h-10 rounded-full bg-primary-text text-white text-xs font-book"
              >
                Back to WorkOS
              </button>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true) }} className="space-y-4">
              <div>
                <span className="text-xs uppercase tracking-wider text-slate-gray font-semibold block mb-1">Book a walkthrough</span>
                <h3 className="font-serif text-2xl text-primary-text font-normal mb-4">Make the full journey visible.</h3>
              </div>

              <div>
                <label className="block text-xs font-medium text-primary-text mb-1">Work email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@organisation.org"
                  className="w-full px-4 h-11 rounded-xl bg-mist-gray border-0 text-sm text-primary-text focus:outline-none focus:ring-2 focus:ring-primary-text"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-primary-text mb-1">Organisation</label>
                <input
                  type="text"
                  required
                  value={org}
                  onChange={(e) => setOrg(e.target.value)}
                  placeholder="Your programme or department"
                  className="w-full px-4 h-11 rounded-xl bg-mist-gray border-0 text-sm text-primary-text focus:outline-none focus:ring-2 focus:ring-primary-text"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-primary-text mb-1">What would you like to understand?</label>
                <select
                  value={focus}
                  onChange={(e) => setFocus(e.target.value)}
                  className="w-full px-3 h-11 rounded-xl bg-mist-gray border-0 text-sm text-primary-text focus:outline-none focus:ring-2 focus:ring-primary-text"
                >
                  <option value="outcomes">Outcome and longitudinal impact measurement</option>
                  <option value="providers">Provider and course performance</option>
                  <option value="verification">Verification and follow-up workflows</option>
                  <option value="security">Privacy, consent and audit architecture</option>
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full h-11 rounded-full bg-primary-text text-white text-base font-book hover:opacity-90 transition-opacity cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>Request a walkthrough</span>
                  <ArrowUpRight className="size-4" />
                </button>
              </div>

              <p className="text-[11px] text-slate-gray text-center pt-2">
                By submitting, you agree to be contacted about WorkOS. We never sell your data.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
