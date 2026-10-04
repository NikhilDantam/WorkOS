import React, { useState, useEffect } from 'react'
import { ThemeToggle } from './lib/ThemeContext'
import {
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Check,
  Search,
  Sparkles,
  Layers,
  Database,
  Calendar,
  X,
  Menu,
  Clock,
  AtSign,
  TrendingUp,
  BarChart3,
  Users,
  Shield,
  FileText,
  Cpu,
  RefreshCw,
  LockKeyhole,
  CircleCheck,
  Target,
  FileCheck2,
  UsersRound,
  ShieldCheck,
  Award,
  MapPin,
  MessageSquare,
  PhoneCall
} from 'lucide-react'

// --- WORKOS LOGO ---
export function WorkosLogo({ className = 'h-[26px] w-auto' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 text-primary-text font-sans font-medium tracking-tight ${className}`}>
      <svg width="24" height="24" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
        <rect width="28" height="28" rx="8" fill="#17191c" />
        <circle cx="9" cy="9" r="3.5" fill="#fbe1d1" />
        <circle cx="19" cy="9" r="3.5" fill="#ffffff" />
        <circle cx="9" cy="19" r="3.5" fill="#ffffff" />
        <path d="M16 19H22M19 16V22" stroke="#fbe1d1" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <span className="text-[17px] font-semibold tracking-[-0.03em] text-primary-text">WORKOS</span>
    </div>
  )
}

// --- WORKOS FLOATING HEADER ---
export function WorkosHeader({
  onNavigate,
  onOpenDemoModal,
  currentPath
}: {
  onNavigate: (path: string) => void
  onOpenDemoModal: () => void
  currentPath: string
}) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-5 h-16 flex items-center justify-center ${
          scrolled ? 'nav-glass' : 'bg-transparent'
        }`}
      >
        <div className="max-w-[1240px] w-full flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => onNavigate('/')}
            className="hover:opacity-85 transition-opacity focus:outline-none"
            aria-label="WorkOS Home"
          >
            <WorkosLogo />
          </button>

          {/* Nav Links */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2 text-xs font-book">
            <button
              onClick={() => onNavigate('/platform')}
              className={`py-1.5 px-3.5 rounded-full transition-colors ${
                currentPath === '/platform' ? 'text-primary-text font-medium' : 'text-primary-text/75 hover:text-primary-text'
              }`}
            >
              Platform
            </button>

            <button
              onClick={() => onNavigate('/outcomes')}
              className={`py-1.5 px-3.5 rounded-full transition-colors ${
                currentPath === '/outcomes' ? 'text-primary-text font-medium' : 'text-primary-text/75 hover:text-primary-text'
              }`}
            >
              Outcomes
            </button>

            {/* Stakeholders dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown('solutions')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                className={`py-1.5 px-3.5 rounded-full transition-colors ${
                  currentPath.startsWith('/for-') ? 'text-primary-text font-medium' : 'text-primary-text/75 hover:text-primary-text'
                }`}
              >
                Solutions
              </button>
              {activeDropdown === 'solutions' && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-64 animate-fade-in-y">
                  <div className="bg-white rounded-2xl shadow-subtle-2 ring-1 ring-black/5 p-2 text-left">
                    <button
                      onClick={() => { setActiveDropdown(null); onNavigate('/for-providers') }}
                      className="w-full p-2.5 rounded-xl hover:bg-mist-gray text-left transition-colors flex flex-col gap-0.5"
                    >
                      <span className="text-xs font-medium text-primary-text">For Training Providers</span>
                      <span className="text-[12px] text-slate-gray">Course relevance, skills & placements</span>
                    </button>
                    <button
                      onClick={() => { setActiveDropdown(null); onNavigate('/for-employers') }}
                      className="w-full p-2.5 rounded-xl hover:bg-mist-gray text-left transition-colors flex flex-col gap-0.5"
                    >
                      <span className="text-xs font-medium text-primary-text">For Employers</span>
                      <span className="text-[12px] text-slate-gray">Verification queue & talent signals</span>
                    </button>
                    <button
                      onClick={() => { setActiveDropdown(null); onNavigate('/for-programmes') }}
                      className="w-full p-2.5 rounded-xl hover:bg-mist-gray text-left transition-colors flex flex-col gap-0.5"
                    >
                      <span className="text-xs font-medium text-primary-text">For Programmes & Policy</span>
                      <span className="text-[12px] text-slate-gray">District & cohort impact measurement</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => onNavigate('/impact')}
              className={`py-1.5 px-3.5 rounded-full transition-colors ${
                currentPath === '/impact' ? 'text-primary-text font-medium' : 'text-primary-text/75 hover:text-primary-text'
              }`}
            >
              Impact
            </button>

            <button
              onClick={() => onNavigate('/security')}
              className={`py-1.5 px-3.5 rounded-full transition-colors ${
                currentPath === '/security' ? 'text-primary-text font-medium' : 'text-primary-text/75 hover:text-primary-text'
              }`}
            >
              Security
            </button>

            <button
              onClick={() => onNavigate('/about')}
              className={`py-1.5 px-3.5 rounded-full transition-colors ${
                currentPath === '/about' ? 'text-primary-text font-medium' : 'text-primary-text/75 hover:text-primary-text'
              }`}
            >
              About
            </button>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <ThemeToggle className="theme-toggle-btn" />
            <button
              onClick={onOpenDemoModal}
              className="hidden lg:inline-flex items-center justify-center font-book text-[15px] h-8 px-3 rounded-full hover:bg-trans-5 active:bg-trans-10 transition-colors text-primary-text cursor-pointer"
            >
              Book a walkthrough
            </button>
            <button
              onClick={() => onNavigate('/app/overview')}
              className="inline-flex items-center justify-center font-book text-[15px] h-8 px-3.5 rounded-full bg-primary-text text-white hover:opacity-90 active:opacity-80 transition-all cursor-pointer shadow-sm"
            >
              Explore platform
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-primary-text focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white pt-20 px-8 flex flex-col justify-between pb-12 md:hidden animate-fade-in-y">
          <div className="flex flex-col space-y-3 text-lg">
            <button onClick={() => { setMobileMenuOpen(false); onNavigate('/platform') }} className="text-left py-2 border-b border-black/5">Platform</button>
            <button onClick={() => { setMobileMenuOpen(false); onNavigate('/outcomes') }} className="text-left py-2 border-b border-black/5">Outcomes</button>
            <button onClick={() => { setMobileMenuOpen(false); onNavigate('/for-providers') }} className="text-left py-2 border-b border-black/5">For Providers</button>
            <button onClick={() => { setMobileMenuOpen(false); onNavigate('/for-employers') }} className="text-left py-2 border-b border-black/5">For Employers</button>
            <button onClick={() => { setMobileMenuOpen(false); onNavigate('/for-programmes') }} className="text-left py-2 border-b border-black/5">For Programmes</button>
            <button onClick={() => { setMobileMenuOpen(false); onNavigate('/impact') }} className="text-left py-2 border-b border-black/5">Impact</button>
            <button onClick={() => { setMobileMenuOpen(false); onNavigate('/security') }} className="text-left py-2 border-b border-black/5">Security & Privacy</button>
            <button onClick={() => { setMobileMenuOpen(false); onNavigate('/about') }} className="text-left py-2 border-b border-black/5">About WorkOS</button>
          </div>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => { setMobileMenuOpen(false); onNavigate('/app/overview') }}
              className="w-full h-11 rounded-full bg-primary-text text-white text-base font-book flex items-center justify-center"
            >
              Explore platform
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenDemoModal() }}
              className="w-full h-11 rounded-full bg-trans-5 text-primary-text text-base font-book flex items-center justify-center"
            >
              Book a walkthrough
            </button>
          </div>
        </div>
      )}
    </>
  )
}

// --- WORKOS HERO WITH MOTION & AI COMPOSER ---
export function WorkosHero({
  onNavigate,
  onOpenDemoModal
}: {
  onNavigate: (path: string) => void
  onOpenDemoModal: () => void
}) {
  const [typedPrompt, setTypedPrompt] = useState('')
  const [queryIndex, setQueryIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [userQuery, setUserQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)

  const sampleQuestions = [
    'Why did 90-day retention drop for the Q2 Healthcare cohort in Mysuru?',
    'Which training providers have the highest wage progression at 180 days?',
    'Compare verified employment conversion between urban and rural districts.',
    'What are the top 3 high-impact skill gaps reported by employers in Pune?'
  ]

  useEffect(() => {
    if (isFocused) return
    const current = sampleQuestions[queryIndex]
    const timer = setTimeout(() => {
      if (!isDeleting) {
        if (charIndex < current.length) {
          setTypedPrompt(current.substring(0, charIndex + 1))
          setCharIndex(c => c + 1)
        } else {
          setTimeout(() => setIsDeleting(true), 2400)
        }
      } else {
        if (charIndex > 0) {
          setTypedPrompt(current.substring(0, charIndex - 1))
          setCharIndex(c => c - 1)
        } else {
          setIsDeleting(false)
          setQueryIndex((q) => (q + 1) % sampleQuestions.length)
        }
      }
    }, isDeleting ? 25 : 55)
    return () => clearTimeout(timer)
  }, [charIndex, isDeleting, queryIndex, isFocused])

  const handleAsk = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    onNavigate('/app/insights')
  }

  return (
    <section className="relative w-full bg-linear-to-b from-[#F7F7F8] to-white pt-24 md:pt-32 pb-16 overflow-hidden">
      {/* Background Graphic & Noise Texture */}
      <div className="absolute inset-0 w-full max-h-[1440px] pointer-events-none transform-gpu z-0">
        <img
          src="/images/backgrounds/bg-home.jpg"
          alt=""
          className="w-full h-full object-cover object-center opacity-80"
        />
        <div className="absolute inset-0 noise-overlay"></div>
      </div>

      <div className="relative z-10 max-w-[1240px] mx-auto px-5 flex flex-col items-center text-center">
        {/* Top Badge Pill */}
        <div className="mb-8">
          <button
            onClick={() => onNavigate('/outcomes')}
            className="group inline-flex items-center gap-2.5 rounded-full border border-black/4 bg-black/4 px-4 py-[9px] text-[15px] whitespace-nowrap font-book text-primary-text transition-colors hover:bg-black/7 cursor-pointer"
          >
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="pb-px font-medium">Outcome Intelligence 2.0</span>
            <span className="text-slate-gray">· Longitudinal Evidence Engine</span>
            <ArrowRight className="size-3.5 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
          </button>
        </div>

        {/* Headline in Signifier Serif */}
        <h1 className="font-serif font-normal text-[44px] sm:text-[60px] md:text-[76px] lg:text-[88px] leading-[1.08] tracking-[-0.025em] text-primary-text max-w-[980px] mx-auto">
          From training records to <br className="hidden sm:inline" />
          <em className="italic font-normal">real-world outcomes.</em>
        </h1>

        {/* Subhead in Sohne Sans */}
        <p className="mt-6 text-base sm:text-lg md:text-xl lg:text-[22px] font-book text-primary-text/75 max-w-[660px] mx-auto leading-normal">
          Track what happens after skilling — from placement and employment to retention, wage progression and career growth. WorkOS connects the entire journey into one evidence-backed intelligence layer.
        </p>

        {/* CTAs */}
        <div className="mt-8 flex items-center justify-center gap-3">
          <button
            onClick={() => onNavigate('/app/overview')}
            className="group leading-none font-book focus:outline-none whitespace-nowrap cursor-pointer rounded-full inline-flex items-center justify-center gap-2 bg-primary-text text-white px-6 h-11 text-[17px] hover:opacity-90 active:opacity-80 transition-all shadow-md"
          >
            <span>Explore the platform</span>
            <ArrowUpRight className="size-4" />
          </button>
          <button
            onClick={onOpenDemoModal}
            className="group leading-none font-book focus:outline-none whitespace-nowrap cursor-pointer rounded-full inline-flex items-center justify-center gap-2 transition-colors hover:bg-trans-10 active:bg-trans-15 bg-trans-5 text-primary-text px-6 h-11 text-[17px]"
          >
            <span>Book a demo</span>
          </button>
        </div>

        {/* Trust Badges under CTA */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-gray">
          <span className="flex items-center gap-1.5"><CircleCheck className="size-4 text-emerald-600" /> Built for evidence-backed programmes</span>
          <span className="flex items-center gap-1.5"><CircleCheck className="size-4 text-emerald-600" /> Privacy-safe by design</span>
          <span className="flex items-center gap-1.5"><CircleCheck className="size-4 text-emerald-600" /> Longitudinal trainee outcome records</span>
        </div>

        {/* HERO PRODUCT CANVAS (DESKTOP) */}
        <div className="relative mt-14 w-full max-w-[1200px] mx-auto hidden lg:block">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl ring-1 ring-black/5 bg-white border border-black/5">
            {/* Window Top Title Bar */}
            <div className="h-10 border-b border-black/5 bg-[#FAFAFA] flex items-center justify-between px-4 text-xs select-none">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <div className="size-3 rounded-full bg-[#FF5F56] border border-[#E0443E]/50" />
                  <div className="size-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]/50" />
                  <div className="size-3 rounded-full bg-[#27C93F] border border-[#1AAB29]/50" />
                </div>
                <div className="h-3.5 w-px bg-black/10 mx-1.5" />
                <span className="text-[11px] font-medium text-slate-gray">
                  WorkOS Workspace · Karnataka Skills Mission · Q3 Cohort Analysis
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60 font-medium">
                  <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live Sync
                </span>
                <span className="text-[11px] text-slate-gray font-mono">⌘K</span>
              </div>
            </div>

            {/* Window Body */}
            <div className="flex bg-white min-h-[620px]">
              {/* Left Governed Sidebar */}
              <div className="w-[220px] shrink-0 border-r border-black/5 bg-[#FAFAFA]/70 p-3.5 flex flex-col justify-between select-none">
                <div>
                  {/* Workspace Selector */}
                  <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-white border border-black/5 shadow-2xs mb-4">
                    <WorkosLogo className="h-5" />
                    <span className="text-[11px] text-slate-gray ml-auto">▾</span>
                  </div>

                  {/* Sidebar Nav */}
                  <div className="space-y-1 text-xs">
                    <div className="px-2.5 py-1.5 rounded-lg bg-black text-white font-medium flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <BarChart3 className="size-3.5" />
                        <span>Overview</span>
                      </span>
                      <span className="size-1.5 rounded-full bg-white" />
                    </div>
                    <div className="px-2.5 py-1.5 rounded-lg text-primary-text hover:bg-black/5 font-book flex items-center justify-between cursor-pointer">
                      <span className="flex items-center gap-2">
                        <Sparkles className="size-3.5 text-sienna-brown" />
                        <span>Intelligence</span>
                      </span>
                      <span className="text-[10px] bg-blush-peach text-sienna-brown px-1.5 py-0.2 rounded font-semibold">AI</span>
                    </div>
                    <div className="px-2.5 py-1.5 rounded-lg text-slate-gray hover:bg-black/5 font-book flex items-center justify-between cursor-pointer">
                      <span className="flex items-center gap-2">
                        <Users className="size-3.5" />
                        <span>Trainees</span>
                      </span>
                      <span className="text-[10px] text-slate-gray font-mono">Active</span>
                    </div>
                    <div className="px-2.5 py-1.5 rounded-lg text-slate-gray hover:bg-black/5 font-book flex items-center gap-2 cursor-pointer">
                      <TrendingUp className="size-3.5" />
                      <span>Retention</span>
                    </div>
                    <div className="px-2.5 py-1.5 rounded-lg text-slate-gray hover:bg-black/5 font-book flex items-center justify-between cursor-pointer">
                      <span className="flex items-center gap-2">
                        <FileCheck2 className="size-3.5" />
                        <span>Verification</span>
                      </span>
                      <span className="text-[10px] text-emerald-700 font-medium">Audited</span>
                    </div>
                    <div className="px-2.5 py-1.5 rounded-lg text-slate-gray hover:bg-black/5 font-book flex items-center gap-2 cursor-pointer">
                      <MapPin className="size-3.5" />
                      <span>Districts</span>
                    </div>
                    <div className="px-2.5 py-1.5 rounded-lg text-slate-gray hover:bg-black/5 font-book flex items-center gap-2 cursor-pointer">
                      <ShieldCheck className="size-3.5" />
                      <span>Governance</span>
                    </div>
                  </div>
                </div>

                {/* Sidebar Bottom Profile */}
                <div className="pt-3 border-t border-black/5 flex items-center gap-2 px-1">
                  <div className="size-7 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center text-xs font-medium text-slate-700">
                    RS
                  </div>
                  <div className="flex flex-col text-left overflow-hidden">
                    <span className="text-[11px] font-medium text-primary-text truncate">Dr. Radhika Sen</span>
                    <span className="text-[10px] text-slate-gray truncate">State Director</span>
                  </div>
                </div>
              </div>

              {/* Main Content Area: Clean Content Stream */}
              <div className="flex-1 p-8 bg-white relative overflow-hidden text-left">
                <div className="max-w-[840px]">
                  <img
                    src="/images/home-site-25/home-content.png"
                    alt="WorkOS Content Stream"
                    className="w-full h-auto block"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Floating Metric Card 1 (Pink Block: Verified Employment) */}
          <div
            className="absolute top-[16%] -left-6 z-20 animate-float"
            style={{ filter: 'drop-shadow(0 20px 25px rgba(0,0,0,0.12))' }}
          >
            <div className="bg-[#fbe1d1] text-[#5d2a1a] p-5 rounded-2xl w-[280px] text-left border border-sienna-brown/15">
              <span className="text-[11px] uppercase tracking-wider block font-semibold opacity-75">Verified Employment</span>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-2xl font-serif">Audit Trail</span>
                <span className="text-xs font-semibold text-emerald-800 bg-white/40 px-2 py-0.5 rounded-full">Active</span>
              </div>
              <p className="text-xs mt-3 opacity-90 leading-tight">
                90-day retention verified via employer payslip & field visit trail.
              </p>
            </div>
          </div>

          {/* Floating Metric Card 2 (Blue Block: Retention Curve) */}
          <div
            className="absolute -top-6 right-[6%] z-20 animate-float-alt"
            style={{ filter: 'drop-shadow(0 20px 25px rgba(0,0,0,0.12))' }}
          >
            <div className="bg-white text-primary-text p-5 rounded-2xl w-[320px] text-left border border-black/10 ring-1 ring-black/5">
              <div className="flex items-center justify-between text-xs text-slate-gray mb-1">
                <span className="font-medium text-primary-text">90-Day Retention Curve</span>
                <span className="text-emerald-600 font-semibold">Continuous Survival</span>
              </div>
              <div className="h-16 flex items-end gap-1.5 pt-2">
                {[100, 92, 85, 78, 71, 68, 64, 61].map((val, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full bg-primary-text rounded-t-sm"
                      style={{ height: `${val * 0.55}px` }}
                    />
                    <span className="text-[9px] text-slate-gray">{i === 0 ? 'D0' : i === 4 ? '90d' : i === 7 ? '365d' : ''}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Floating Metric Card 3 (Gray Block: Median Monthly Wage) */}
          <div
            className="absolute bottom-[14%] -right-8 z-20 animate-float"
            style={{ filter: 'drop-shadow(0 20px 25px rgba(0,0,0,0.12))' }}
          >
            <div className="bg-[#f2f2f3] text-primary-text p-5 rounded-2xl w-[260px] text-left border border-black/10">
              <span className="text-[11px] text-slate-gray uppercase tracking-wider block font-medium">Median Wage</span>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-2xl font-serif">Indexed</span>
                <span className="text-xs font-semibold text-emerald-600">Progression</span>
              </div>
              <span className="text-[11px] text-slate-gray block mt-2">
                Longitudinal progression vs baseline placement wage.
              </span>
            </div>
          </div>

          {/* Floating Avatar Cursors */}
          <div className="absolute top-[32%] left-[28%] z-30 pointer-events-none flex items-center gap-1.5">
            <img src="/images/home/hero-cursor-left.svg" alt="" width="48" height="52" className="drop-shadow-md" />
            <span className="bg-primary-text text-white text-[11px] px-2 py-0.5 rounded-full shadow-md">Program Lead</span>
          </div>

          <div className="absolute top-[48%] right-[22%] z-30 pointer-events-none flex items-center gap-1.5">
            <img src="/images/home/hero-cursor-right.svg" alt="" width="48" height="52" className="drop-shadow-md" />
            <span className="bg-primary-text text-white text-[11px] px-2 py-0.5 rounded-full shadow-md">Field Verifier</span>
          </div>

          {/* AI OUTCOME COMPOSER BOX FLOATING OVER HERO */}
          <div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 w-[640px] max-w-[90%] transform-gpu"
            style={{ filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.15))' }}
          >
            <form
              onSubmit={handleAsk}
              className="bg-white rounded-[20px] p-4 flex flex-col justify-between h-[104px] border border-black/5 ring-1 ring-black/5 transition-all hover:shadow-lg focus-within:ring-black/20 text-left"
            >
              <div className="relative w-full">
                {isFocused || userQuery ? (
                  <input
                    type="text"
                    value={userQuery}
                    onChange={(e) => setUserQuery(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => { if (!userQuery) setIsFocused(false) }}
                    placeholder="Ask Outcome Intelligence..."
                    className="w-full text-[15px] font-book text-primary-text bg-transparent outline-none pr-8"
                    autoFocus
                  />
                ) : (
                  <div
                    onClick={() => setIsFocused(true)}
                    className="cursor-text flex items-center justify-start text-[15px] font-book text-primary-text h-6 truncate"
                  >
                    <span>{typedPrompt}</span>
                    <span className="inline-block w-0.5 h-4 bg-primary-text ml-0.5 animate-pulse" />
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-3 text-slate-gray text-xs">
                  <span className="flex items-center gap-1 hover:text-primary-text cursor-pointer">
                    <AtSign className="size-3.5" />
                    <span>cohort</span>
                  </span>
                  <span className="flex items-center gap-1 hover:text-primary-text cursor-pointer">
                    <Clock className="size-3.5" />
                    <span>evidence trail</span>
                  </span>
                </div>

                <button
                  type="submit"
                  className="bg-black text-white size-8 rounded-full flex items-center justify-center hover:opacity-85 transition-opacity cursor-pointer shadow-sm"
                  aria-label="Ask Outcome Intelligence"
                >
                  <ArrowRight className="size-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* MOBILE HERO VIEW */}
        <div className="mt-12 w-full max-w-[580px] lg:hidden flex flex-col items-center">
          <div className="w-full bg-white rounded-2xl shadow-xl ring-1 ring-black/5 overflow-hidden border border-black/5">
            <div className="h-9 border-b border-black/5 bg-[#FAFAFA] flex items-center justify-between px-3 text-xs select-none">
              <div className="flex items-center gap-1.5">
                <div className="size-2.5 rounded-full bg-[#FF5F56]" />
                <div className="size-2.5 rounded-full bg-[#FFBD2E]" />
                <div className="size-2.5 rounded-full bg-[#27C93F]" />
                <span className="ml-2 text-[10px] font-medium text-slate-gray">WorkOS · Outcome Intelligence</span>
              </div>
              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">90d Verified</span>
            </div>
            <div className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-[#fbe1d1] text-[#5d2a1a] p-3 rounded-xl text-left">
                  <span className="text-[10px] uppercase font-semibold opacity-75 block">Verified Employment</span>
                  <div className="text-base font-serif mt-0.5">Audit Trail</div>
                  <span className="text-[10px] text-emerald-800 font-medium">Evidence Attached</span>
                </div>
                <div className="bg-[#f2f2f3] text-primary-text p-3 rounded-xl text-left">
                  <span className="text-[10px] uppercase font-semibold text-slate-gray block">90-Day Retention</span>
                  <div className="text-base font-serif mt-0.5">Longitudinal</div>
                  <span className="text-[10px] text-emerald-600 font-medium">Milestone Tracking</span>
                </div>
              </div>
              <div className="bg-[#FAFAFA] rounded-xl p-3 border border-black/5 text-left">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-medium text-primary-text">Retention Curve (30d - 365d)</span>
                  <span className="text-slate-gray text-[10px]">Tracked cohorts</span>
                </div>
                <div className="h-14 flex items-end gap-2 pt-1">
                  {[100, 92, 85, 78, 71, 68, 64, 61].map((val, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-full bg-primary-text rounded-t-xs" style={{ height: `${val * 0.45}px` }} />
                      <span className="text-[8px] text-slate-gray">{i === 0 ? 'D0' : i === 4 ? '90d' : i === 7 ? '365d' : ''}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 w-full bg-white rounded-2xl p-4 shadow-subtle border border-black/5 text-left">
            <span className="text-xs text-slate-gray block mb-1 font-medium">Outcome Intelligence query</span>
            <div className="text-sm font-book text-primary-text mb-3">{typedPrompt}</div>
            <button
              onClick={() => onNavigate('/app/insights')}
              className="w-full h-9 rounded-full bg-primary-text text-white text-xs font-book flex items-center justify-center gap-1"
            >
              <span>Explore in workspace</span>
              <ArrowRight className="size-3.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

// --- TRUSTED MARQUEE (ECOSYSTEM PROGRAMMES) ---
export function EcosystemMarquee() {
  const partners = [
    'National Skills Programme',
    'PMKVY 4.0',
    'Jeevika Livelihood Hub',
    'Mission Employ',
    'District Skills Lab',
    'NAPS Apprenticeship',
    'State Skill Development Mission',
    'Skill India Digital'
  ]

  return (
    <div className="w-full py-12 md:py-16 flex flex-col items-center justify-center bg-white border-b border-black/5 overflow-hidden">
      <div className="text-xs uppercase tracking-wider text-slate-gray font-medium mb-6">
        Designed for teams across the outcome ecosystem
      </div>

      <div className="w-full relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-[15%] bg-linear-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-[15%] bg-linear-to-l from-white to-transparent z-10 pointer-events-none" />

        <div className="animate-carousel flex items-center">
          <div className="flex items-center gap-12 md:gap-20 shrink-0 pr-12 md:pr-20">
            {partners.map((p, idx) => (
              <span key={`p1-${idx}`} className="text-base sm:text-lg font-serif text-primary-text/75 font-normal tracking-tight whitespace-nowrap hover:text-primary-text transition-colors">
                {p}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-12 md:gap-20 shrink-0 pr-12 md:pr-20">
            {partners.map((p, idx) => (
              <span key={`p2-${idx}`} className="text-base sm:text-lg font-serif text-primary-text/75 font-normal tracking-tight whitespace-nowrap hover:text-primary-text transition-colors">
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// --- THREE USP CARDS ("The Shift: Counting trained vs Measuring changed") ---
export function TheShiftCards({ onNavigate }: { onNavigate: (path: string) => void }) {
  const [activeCard, setActiveCard] = useState<number>(0)

  const cards = [
    {
      id: 0,
      title: 'Built on evidence',
      tag: '01 · Full Journey',
      desc: 'Counting who was trained is not the same as measuring what changed. WorkOS moves beyond completion and placement dashboards to give every programme a longitudinal view of what happened next.',
      illustration: '/images/home/usp-1.svg',
      link: '/outcomes'
    },
    {
      id: 1,
      title: 'Powered by Outcome AI',
      tag: '02 · Outcome Intelligence',
      desc: 'WorkOS helps analysts move from "what happened?" to "why did it happen?" — grounded in governed metrics, verified employer signals, and recorded follow-up evidence.',
      illustration: '/images/home/usp-2.svg',
      link: '/platform'
    },
    {
      id: 2,
      title: 'Designed for trust',
      tag: '03 · Governance & Privacy',
      desc: 'Consent ledgers, role-based access, and transparent confidence states ensure sensitive livelihood data is handled with dignity, institutional accountability, and verifiable audit trails.',
      illustration: '/images/home/usp-3.svg',
      link: '/security'
    }
  ]

  return (
    <section className="py-20 md:py-28 px-5 max-w-[1360px] mx-auto bg-white">
      <div className="text-center max-w-[760px] mx-auto mb-14 md:mb-20">
        <span className="text-xs uppercase tracking-wider text-slate-gray font-medium mb-3 block">The Shift</span>
        <h2 className="font-serif text-[38px] sm:text-[50px] md:text-[62px] font-normal leading-[1.12] text-primary-text tracking-[-0.015em]">
          Counting who was trained is not the same as measuring what changed.
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card) => {
          const isSelected = activeCard === card.id
          return (
            <div
              key={card.id}
              onClick={() => setActiveCard(card.id)}
              onMouseEnter={() => setActiveCard(card.id)}
              className={`rounded-3xl p-8 sm:p-9 cursor-pointer transition-all duration-500 flex flex-col justify-between min-h-[460px] md:min-h-[520px] ${
                isSelected
                  ? 'bg-blush-peach text-sienna-brown shadow-subtle-2 md:scale-[1.03] z-10'
                  : 'bg-[#F7F7F8] text-[#4C4C4C] hover:bg-[#efeff1]'
              }`}
            >
              <div>
                <span className="text-xs uppercase tracking-wider block font-semibold mb-1 opacity-70">
                  {card.tag}
                </span>
                <span className="text-[22px] sm:text-[26px] font-[450] tracking-[-0.015em] block leading-tight">
                  {card.title}
                </span>
              </div>

              <div className="flex items-center justify-center my-6 py-4">
                <img
                  src={card.illustration}
                  alt={card.title}
                  className={`w-[68%] max-w-[220px] h-auto object-contain transition-transform duration-500 ${
                    isSelected ? 'scale-105' : 'scale-95 opacity-80'
                  }`}
                />
              </div>

              <div>
                <p className={`text-sm sm:text-base leading-snug transition-opacity duration-300 ${isSelected ? 'opacity-100 font-book' : 'opacity-65'}`}>
                  {card.desc}
                </p>
                <button
                  onClick={(e) => { e.stopPropagation(); onNavigate(card.link) }}
                  className="mt-4 text-xs font-semibold inline-flex items-center gap-1 hover:underline"
                >
                  <span>Learn more</span>
                  <ArrowRight className="size-3" />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

// --- ENGAGE EVERY STAKEHOLDER SHOWCASE SECTION ---
export function StakeholderShowcase({ onNavigate }: { onNavigate: (path: string) => void }) {
  const [activeTab, setActiveTab] = useState<'Overview' | 'Retention' | 'Wages' | 'Verification' | 'Skills' | 'Districts'>('Overview')

  const tabs: Array<'Overview' | 'Retention' | 'Wages' | 'Verification' | 'Skills' | 'Districts'> = [
    'Overview',
    'Retention',
    'Wages',
    'Verification',
    'Skills',
    'Districts'
  ]

  const tabContent: Record<string, { desc: string; kpi: string; stat: string }> = {
    Overview: {
      desc: 'Training, assessment, certification, placement, employment, verification and retention live in one timeline.',
      kpi: 'Employment Tracking',
      stat: 'Verified Active Pipeline'
    },
    Retention: {
      desc: 'Compare milestone survival across 30, 90, 180, and 365 days to pinpoint where drop-offs happen.',
      kpi: '30d–365d Survival',
      stat: 'Multi-Milestone Retention'
    },
    Wages: {
      desc: 'Measure longitudinal progression from placement offer to one-year earnings milestones.',
      kpi: 'Wage Progression',
      stat: 'Longitudinal Milestones'
    },
    Verification: {
      desc: 'Empower employers and field coordinators to record verifiable proof with confidence states.',
      kpi: 'Evidence Verification',
      stat: 'Audited Follow-ups'
    },
    Skills: {
      desc: 'Identify curriculum gaps between training modules and the skills employers report needing on the job.',
      kpi: 'Skill Demand Alignment',
      stat: 'Curriculum Insights'
    },
    Districts: {
      desc: 'Compare district-level livelihood outcomes across state programmes and cohort demographics.',
      kpi: 'District Governance',
      stat: 'Regional Benchmarking'
    }
  }

  return (
    <section className="py-20 md:py-28 relative overflow-hidden bg-fog-white border-t border-black/5">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1400px] h-[1400px] pointer-events-none opacity-40 z-0">
        <img src="/images/backgrounds/bg-home-showcase.jpg" alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 noise-overlay"></div>
      </div>

      <div className="relative z-10 max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12">
        <button
          onClick={() => onNavigate('/outcomes')}
          className="text-xs uppercase tracking-wider text-slate-gray font-medium mb-3 flex items-center gap-1.5 hover:text-primary-text transition-colors"
        >
          <span>Outcome journey</span>
          <ArrowRight className="size-3" />
        </button>

        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-12">
          <div>
            <h2 className="font-serif text-[42px] sm:text-[56px] lg:text-[68px] font-normal leading-tight text-primary-text tracking-[-0.015em]">
              Engage every stakeholder
            </h2>
            <p className="mt-3 text-lg sm:text-xl font-book text-primary-text/70 max-w-xl">
              Connect trainees, providers, employers, programmes, and districts into a single operating model.
            </p>
          </div>

          <button
            onClick={() => onNavigate('/app/overview')}
            className="group inline-flex items-center gap-2 rounded-full bg-trans-5 hover:bg-trans-10 active:bg-trans-15 px-5 h-11 text-[17px] font-book text-primary-text transition-colors"
          >
            <span>Explore workspace</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </div>

        {/* Tab Selection Bar */}
        <div className="relative border-b border-black/10 pb-px mb-8 flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-6 overflow-x-auto scrollbar-hide py-2">
            {tabs.map((tab) => {
              const isActive = activeTab === tab
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative py-3 px-3 text-[15px] sm:text-base font-book transition-colors whitespace-nowrap cursor-pointer ${
                    isActive ? 'text-primary-text font-medium' : 'text-primary-text/50 hover:text-primary-text'
                  }`}
                >
                  {tab}
                  {isActive && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-text rounded-full animate-fade-in-y" />}
                </button>
              )
            })}
          </div>
        </div>

        <p className="text-primary-text/80 text-sm sm:text-base mb-8 max-w-xl animate-fade-in-y">
          {tabContent[activeTab].desc}
        </p>

        {/* Interactive Product Showcase Canvas */}
        <div className="w-full rounded-2xl sm:rounded-3xl bg-white shadow-2xl ring-1 ring-black/5 overflow-hidden transition-all duration-500 min-h-[520px] flex flex-col">
          {/* Top Bar */}
          <div className="h-12 border-b border-black/5 bg-[#fafafb] px-5 flex items-center justify-between text-xs text-slate-gray">
            <div className="flex items-center gap-3">
              <span className="size-2.5 rounded-full bg-emerald-500" />
              <span className="font-medium text-primary-text">National Skills Programme · Cohort 2025–26</span>
              <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-medium text-[11px]">Governed</span>
            </div>
            <div className="flex items-center gap-3">
              <span>{tabContent[activeTab].kpi}</span>
              <span className="px-2 py-1 bg-white border border-black/5 rounded-md text-primary-text font-medium text-[12px]">
                {activeTab} View
              </span>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 sm:p-8 h-[calc(100%-48px)] bg-white overflow-y-auto">
            {activeTab === 'Overview' && (
              <div className="h-full flex flex-col justify-between animate-fade-in-y space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-mist-gray rounded-2xl">
                    <span className="text-xs text-slate-gray block">Cohort Enrolment</span>
                    <span className="text-2xl font-serif text-primary-text">Tracked</span>
                    <span className="text-[11px] text-emerald-600 block mt-1">100% consent recorded</span>
                  </div>
                  <div className="p-4 bg-mist-gray rounded-2xl">
                    <span className="text-xs text-slate-gray block">Placed in Work</span>
                    <span className="text-2xl font-serif text-primary-text">Verified</span>
                    <span className="text-[11px] text-emerald-600 block mt-1">Status conversion tracked</span>
                  </div>
                  <div className="p-4 bg-mist-gray rounded-2xl">
                    <span className="text-xs text-slate-gray block">Verified Employed</span>
                    <span className="text-2xl font-serif text-primary-text">Audited</span>
                    <span className="text-[11px] text-emerald-600 block mt-1">Evidence attached</span>
                  </div>
                  <div className="p-4 bg-mist-gray rounded-2xl">
                    <span className="text-xs text-slate-gray block">90-Day Retention</span>
                    <span className="text-2xl font-serif text-primary-text">Longitudinal</span>
                    <span className="text-[11px] text-emerald-600 block mt-1">Milestone survival</span>
                  </div>
                </div>

                {/* Timeline Journey Visual */}
                <div className="p-5 rounded-2xl border border-black/10 bg-[#fafafb] space-y-3">
                  <span className="text-xs font-semibold text-primary-text block">Continuous Trainee Timeline</span>
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex flex-col items-center gap-1">
                      <span className="size-6 rounded-full bg-primary-text text-white flex items-center justify-center text-[11px]">1</span>
                      <span className="font-medium">Enrollment</span>
                    </div>
                    <div className="h-0.5 flex-1 bg-black/15 mx-2" />
                    <div className="flex flex-col items-center gap-1">
                      <span className="size-6 rounded-full bg-primary-text text-white flex items-center justify-center text-[11px]">2</span>
                      <span className="font-medium">Certification</span>
                    </div>
                    <div className="h-0.5 flex-1 bg-black/15 mx-2" />
                    <div className="flex flex-col items-center gap-1">
                      <span className="size-6 rounded-full bg-primary-text text-white flex items-center justify-center text-[11px]">3</span>
                      <span className="font-medium">Offer Verified</span>
                    </div>
                    <div className="h-0.5 flex-1 bg-black/15 mx-2" />
                    <div className="flex flex-col items-center gap-1">
                      <span className="size-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[11px]">4</span>
                      <span className="font-medium text-emerald-700">90d Retained</span>
                    </div>
                    <div className="h-0.5 flex-1 bg-black/15 mx-2" />
                    <div className="flex flex-col items-center gap-1">
                      <span className="size-6 rounded-full bg-black/20 text-white flex items-center justify-center text-[11px]">5</span>
                      <span className="text-slate-gray">365d Wage</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'Retention' && (
              <div className="h-full flex flex-col justify-between animate-fade-in-y">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-gray">Retention curve across Day 0 → 365</span>
                  <span className="text-xs text-emerald-600 font-semibold">Continuous milestone tracking</span>
                </div>
                <div className="h-44 flex items-end justify-between gap-3 pt-4">
                  {[100, 88, 76, 71, 66, 61].map((v, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                      <div className="w-full bg-primary-text rounded-t-sm" style={{ height: `${v * 1.4}px` }} />
                      <span className="text-xs font-mono">{i === 0 ? 'D0' : i === 1 ? '30d' : i === 2 ? '60d' : i === 3 ? '90d' : i === 4 ? '180d' : '365d'}</span>
                      <span className="text-[10px] text-slate-gray">Step {i + 1}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'Wages' && (
              <div className="h-full flex flex-col justify-between animate-fade-in-y space-y-4">
                <div className="p-4 bg-mist-gray rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-gray">Starting Placement Baseline</span>
                    <span className="text-xl font-serif text-primary-text block">Baseline Wage</span>
                  </div>
                  <ArrowRight className="size-5 text-slate-gray" />
                  <div>
                    <span className="text-xs text-slate-gray">365-Day Progression</span>
                    <span className="text-xl font-serif text-emerald-700 block">Advancement Tier</span>
                  </div>
                  <span className="text-xs font-semibold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">Indexed</span>
                </div>
                <p className="text-xs text-slate-gray">
                  Trainees in formal tracks progress through verifiable wage bands tracked over 12 months.
                </p>
              </div>
            )}

            {activeTab === 'Verification' && (
              <div className="h-full flex flex-col animate-fade-in-y">
                <div className="text-xs text-slate-gray mb-3">Live Verification Queue (Confidence states)</div>
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-black/10 text-slate-gray">
                      <th className="py-2">Trainee</th>
                      <th>Employer</th>
                      <th>Evidence Source</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5 text-primary-text">
                    <tr>
                      <td className="py-2.5 font-medium">Aditi Narayanan</td>
                      <td>Cognizant Foundation Partner</td>
                      <td>Employer portal + payslip</td>
                      <td><span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px]">Verified</span></td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-medium">Rohan Mehta</td>
                      <td>Avaada Energy</td>
                      <td>Employer response</td>
                      <td><span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px]">Verified</span></td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-medium">Meena Kumari</td>
                      <td>Independent retail kiosk</td>
                      <td>Field visit confirmation</td>
                      <td><span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px]">Partially verified</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'Skills' && (
              <div className="h-full flex flex-col justify-between animate-fade-in-y space-y-3">
                <span className="text-xs text-slate-gray">Employer-reported skill gaps across cohorts</span>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Advanced Excel & Data Quality</span>
                      <span className="font-semibold text-rose-600">High Demand Gap</span>
                    </div>
                    <div className="h-2 w-full bg-mist-gray rounded-full overflow-hidden">
                      <div className="h-full bg-rose-500 rounded-full" style={{ width: '45%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Customer & Field Communication</span>
                      <span className="font-semibold text-amber-600">Moderate Gap</span>
                    </div>
                    <div className="h-2 w-full bg-mist-gray rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: '30%' }} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'Districts' && (
              <div className="h-full flex flex-col justify-between animate-fade-in-y">
                <span className="text-xs text-slate-gray">District Livelihood Conversion Benchmarks</span>
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 bg-mist-gray rounded-xl">
                    <span className="text-xs font-semibold block">Coimbatore</span>
                    <span className="text-base font-serif">High Retention</span>
                    <span className="text-[10px] text-emerald-600 block">Manufacturing cluster</span>
                  </div>
                  <div className="p-3 bg-mist-gray rounded-xl">
                    <span className="text-xs font-semibold block">Ahmedabad</span>
                    <span className="text-base font-serif">High Wage Growth</span>
                    <span className="text-[10px] text-emerald-600 block">Logistics cluster</span>
                  </div>
                  <div className="p-3 bg-mist-gray rounded-xl">
                    <span className="text-xs font-semibold block">Pune</span>
                    <span className="text-base font-serif">Apprenticeship</span>
                    <span className="text-[10px] text-slate-gray block">Automotive cluster</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

// --- PROGRAMME STORIES SECTION ON #D3E3FC WASH ---
export function ProgrammeStories({ onNavigate }: { onNavigate: (path: string) => void }) {
  const [activeStory, setActiveStory] = useState(0)

  const stories = [
    {
      programme: 'National Skills Programme',
      quote: '“Counting completions told us nothing about livelihoods. WorkOS gave us our first true retention metric.”',
      author: 'Dr. Anand Verma · Director of Skilling & Livelihoods',
      stat: 'Longitudinal 90-day retention tracking',
      image: '/images/home/customers-voi.jpg'
    },
    {
      programme: 'PMKVY 4.0 State Cell',
      quote: '“We can now see which courses actually produce wage growth, not just certificates.”',
      author: 'Pooja Sundaram · Lead Evaluation Officer',
      stat: 'Verifiable wage progression tracking',
      image: '/images/home/customers-juni.jpg'
    },
    {
      programme: 'Jeevika Livelihood Mission',
      quote: '“The verification queue connected self-employed women to verified evidence for the first time.”',
      author: 'Sunil Kumar · Programme Head',
      stat: 'Multi-channel follow-up completion',
      image: '/images/home/customers-bounce.jpg'
    },
    {
      programme: 'Mission Employ Hub',
      quote: '“Instead of quarterly spreadsheets, every district team reviews outcomes in the same operating model.”',
      author: 'Meera Chawla · Monitoring Lead',
      stat: 'Cross-district outcome benchmarking',
      image: '/images/home/customers-onceupon.jpg'
    }
  ]

  const current = stories[activeStory]

  return (
    <section className="bg-[#D3E3FC] py-20 md:py-32 px-5 sm:px-8 lg:px-12 transition-colors duration-500">
      <div className="max-w-[1360px] mx-auto">
        <span className="text-xs uppercase tracking-wider text-primary-text/75 font-medium mb-8 block">
          Programme evidence in practice
        </span>

        <div className="flex flex-col md:flex-row items-center justify-between gap-12 lg:gap-20">
          <div className="flex-1 flex flex-col justify-between min-h-[380px]">
            <div>
              <span className="text-xs font-semibold text-primary-text uppercase tracking-wider block mb-4">
                {current.programme}
              </span>

              <h2 className="font-serif text-[34px] sm:text-[44px] md:text-[48px] lg:text-[54px] font-normal leading-[1.18] text-primary-text tracking-[-0.015em] mb-4">
                {current.quote}
              </h2>

              <p className="text-base sm:text-lg text-primary-text/75 font-book mb-6">
                {current.author}
              </p>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => onNavigate('/impact')}
                  className="rounded-full bg-primary-text text-white px-5 h-11 text-base font-book hover:opacity-90 transition-opacity inline-flex items-center gap-2"
                >
                  <span>Explore impact data</span>
                  <span>→</span>
                </button>
                <button
                  onClick={() => onNavigate('/outcomes')}
                  className="rounded-full bg-white/40 hover:bg-white/60 text-primary-text px-5 h-11 text-base font-book transition-colors"
                >
                  View outcome model
                </button>
              </div>
            </div>

            {/* Story Tabs */}
            <div className="mt-12 pt-6 border-t border-black/10 flex items-center justify-between gap-2 overflow-x-auto scrollbar-hide">
              {stories.map((s, idx) => (
                <button
                  key={s.programme}
                  onClick={() => setActiveStory(idx)}
                  className={`px-3 py-1.5 rounded-full text-xs font-book transition-all whitespace-nowrap ${
                    activeStory === idx ? 'bg-primary-text text-white font-medium' : 'text-primary-text/60 hover:text-primary-text'
                  }`}
                >
                  {s.programme}
                </button>
              ))}
            </div>
          </div>

          {/* Right Image */}
          <div className="w-full md:w-[46%] max-w-[500px] aspect-square rounded-3xl overflow-hidden shadow-xl ring-1 ring-black/10 relative">
            <img
              src={current.image}
              alt={current.programme}
              className="w-full h-full object-cover mix-blend-multiply"
            />
            <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/80 backdrop-blur-md text-xs text-primary-text shadow-sm">
              <span className="font-semibold block">{current.programme}</span>
              <span className="text-slate-gray">{current.stat}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// --- DARK MODE SECTION: PRIVACY BY DESIGN & GOVERNANCE ---
export function GovernanceSection({ onNavigate }: { onNavigate: (path: string) => void }) {
  return (
    <section className="relative py-24 md:py-36 bg-[#121212] text-white overflow-hidden">
      <div className="absolute inset-0 noise-overlay-dark pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-white/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12">
        <button
          onClick={() => onNavigate('/security')}
          className="text-xs uppercase tracking-wider text-white/70 font-medium mb-3 flex items-center gap-1.5 hover:text-white transition-colors"
        >
          <span>Privacy by design</span>
          <ArrowRight className="size-3" />
        </button>

        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-12">
          <div>
            <h2 className="font-serif text-[42px] sm:text-[56px] lg:text-[68px] font-normal leading-tight text-white tracking-[-0.015em]">
              Trust is part of <br /> the architecture.
            </h2>
            <p className="mt-3 text-lg sm:text-xl font-book text-white/60 max-w-xl">
              Consent, role-based access, privacy-safe identifiers, evidence trails and audit logs are not add-ons. They are how WorkOS earns the right to measure outcomes.
            </p>
          </div>

          <button
            onClick={() => onNavigate('/security')}
            className="group inline-flex items-center gap-2 rounded-full bg-white/10 hover:bg-white/15 px-5 h-11 text-[17px] font-book text-white transition-colors"
          >
            <span>Explore security model</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </div>

        {/* Code/Audit Stream Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-16">
          <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-white/10 shadow-2xl font-mono text-xs sm:text-sm text-white/90">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10 text-white/40 text-xs">
              <span className="flex items-center gap-2">
                <span className="size-2.5 rounded-full bg-emerald-500" />
                <span>trainee_outcome_ledger.json</span>
              </span>
              <span>VERIFIED · CONSENT ACTIVE</span>
            </div>
            <pre className="overflow-x-auto leading-relaxed text-emerald-400">
              <code>{`{
  "trainee_id": "WO-TRN-2026-UUID",
  "consent": {
    "status": "Active",
    "purpose": "Longitudinal employment and wage audit",
    "recorded_at": "2026-01-18T09:12:00Z"
  },
  "employment_episode": {
    "employer": "Cognizant Foundation Partner",
    "milestone_90d": "Verified",
    "evidence_confidence": "High",
    "source": "Employer portal + payslip"
  }
}`}</code>
            </pre>
          </div>

          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-2 text-sm font-semibold mb-1 text-white">
                <LockKeyhole className="size-4 text-blush-peach" />
                <span>Explicit Consent Ledger</span>
              </div>
              <p className="text-xs text-white/60">Every outcome record specifies explicit consent purposes before tracking commences.</p>
            </div>
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-2 text-sm font-semibold mb-1 text-white">
                <ShieldCheck className="size-4 text-emerald-400" />
                <span>Role-Based Data Partitioning</span>
              </div>
              <p className="text-xs text-white/60">Training providers only view course aggregates; field coordinators access assigned verification tasks.</p>
            </div>
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-2 text-sm font-semibold mb-1 text-white">
                <RefreshCw className="size-4 text-blue-400" />
                <span>Immutable Audit History</span>
              </div>
              <p className="text-xs text-white/60">Every verification update, status change, and document review is permanently timestamped.</p>
            </div>
          </div>
        </div>

        {/* 4 Feature Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pt-8 border-t border-white/10">
          <div>
            <h4 className="text-base font-medium text-white mb-1">01 · Consent ledger</h4>
            <p className="text-sm text-white/60">Every outcome purpose is clear, reviewable, and revocable by the trainee.</p>
          </div>
          <div>
            <h4 className="text-base font-medium text-white mb-1">02 · Role-based access</h4>
            <p className="text-sm text-white/60">The right people see the right level of detail with zero privacy leaks.</p>
          </div>
          <div>
            <h4 className="text-base font-medium text-white mb-1">03 · Evidence trails</h4>
            <p className="text-sm text-white/60">Sources, timestamps, and confidence states travel with each record.</p>
          </div>
          <div>
            <h4 className="text-base font-medium text-white mb-1">04 · Audit history</h4>
            <p className="text-sm text-white/60">Changes stay attributable from data capture to executive policy decisions.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

// --- OUTCOME INTELLIGENCE SECTION WITH FLOATING PERSONAS ---
export function OutcomeIntelligenceSection({ onNavigate }: { onNavigate: (path: string) => void }) {
  return (
    <section className="py-24 md:py-36 bg-mist-gray relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1400px] h-[1400px] pointer-events-none opacity-50 z-0">
        <img src="/images/ai/bg-ai-section.jpg" alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 noise-overlay"></div>
      </div>

      <div className="relative z-10 max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12">
        <span className="text-xs uppercase tracking-wider text-slate-gray font-medium mb-3 block">
          Outcome Intelligence
        </span>

        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-16">
          <div>
            <h2 className="font-serif text-[42px] sm:text-[56px] lg:text-[68px] font-normal leading-tight text-primary-text tracking-[-0.015em]">
              Ask the question behind the number.
            </h2>
            <p className="mt-3 text-lg sm:text-xl font-book text-primary-text/70 max-w-xl">
              WorkOS helps analysts move from “what happened?” to “why did it happen?” — grounded in governed metrics and recorded evidence.
            </p>
          </div>

          <button
            onClick={() => onNavigate('/app/insights')}
            className="group inline-flex items-center gap-2 rounded-full bg-trans-5 hover:bg-trans-10 px-5 h-11 text-[17px] font-book text-primary-text transition-colors"
          >
            <span>Explore insights</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </div>

        {/* Center Dashboard View with Floating Personas */}
        <div className="relative mb-20">
          <div className="max-w-[880px] mx-auto rounded-3xl overflow-hidden shadow-2xl ring-1 ring-black/5 bg-white">
            <img src="/images/ai/hero-medium-long.png" alt="Outcome Intelligence" className="w-full h-auto block" />
          </div>

          {/* Persona 1: Program Director */}
          <div className="hidden lg:flex flex-col gap-1.5 absolute top-[14%] left-0 w-[310px] animate-float z-20">
            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-white pl-2.5 pr-3.5 py-2 shadow-subtle ring-1 ring-black/5">
              <div className="size-6 rounded-full overflow-hidden bg-slate-200">
                <img src="/images/ai/face-2.jpg" alt="Dr. Radhika" className="w-full h-full object-cover" />
              </div>
              <span className="text-xs leading-none">
                <strong className="font-medium text-primary-text">Dr. Radhika</strong>{' '}
                <span className="text-slate-gray">Program Director</span>
              </span>
            </div>
            <div className="rounded-[18px] bg-white px-4 py-3 text-xs leading-snug text-primary-text shadow-subtle-2 ring-1 ring-black/5">
              Why are trainees from this course failing to convert to retained employment?
            </div>
          </div>

          {/* Persona 2: Employer Partner */}
          <div className="hidden lg:flex flex-col gap-1.5 absolute bottom-[8%] left-[4%] w-[330px] animate-float-alt z-20">
            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-white pl-2.5 pr-3.5 py-2 shadow-subtle ring-1 ring-black/5">
              <div className="size-6 rounded-full overflow-hidden bg-slate-200">
                <img src="/images/ai/face-1.jpg" alt="Vikram" className="w-full h-full object-cover" />
              </div>
              <span className="text-xs leading-none">
                <strong className="font-medium text-primary-text">Vikram</strong>{' '}
                <span className="text-slate-gray">Employer Partner</span>
              </span>
            </div>
            <div className="rounded-[18px] bg-white px-4 py-3 text-xs leading-snug text-primary-text shadow-subtle-2 ring-1 ring-black/5">
              Verified cohort hires with longitudinal retention confirmation and salary evidence.
            </div>
          </div>

          {/* Persona 3: State Skilling Lead */}
          <div className="hidden lg:flex flex-col gap-1.5 absolute top-[40%] right-0 w-[320px] animate-float z-20">
            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-white pl-2.5 pr-3.5 py-2 shadow-subtle ring-1 ring-black/5">
              <div className="size-6 rounded-full overflow-hidden bg-slate-200">
                <img src="/images/ai/face-3.jpg" alt="Priya" className="w-full h-full object-cover" />
              </div>
              <span className="text-xs leading-none">
                <strong className="font-medium text-primary-text">Priya</strong>{' '}
                <span className="text-slate-gray">State Skilling Lead</span>
              </span>
            </div>
            <div className="rounded-[18px] bg-white px-4 py-3 text-xs leading-snug text-primary-text shadow-subtle-2 ring-1 ring-black/5">
              Retention drops significantly after day 90 in healthcare roles with transit friction.
            </div>
          </div>
        </div>

        {/* 3 Outcome Intelligence Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col">
            <div className="rounded-2xl overflow-hidden aspect-square shadow-subtle mb-4">
              <img src="/images/ai/trust.png" alt="Evidence you can trust" className="w-full h-full object-cover" />
            </div>
            <h3 className="text-lg font-medium text-primary-text mb-1">Evidence you can trust</h3>
            <p className="text-sm text-slate-gray">Finding, evidence and confidence score recorded on every recommendation.</p>
          </div>

          <div className="flex flex-col">
            <div className="rounded-2xl overflow-hidden aspect-square shadow-subtle mb-4">
              <img src="/images/ai/generate-reports.png" alt="Actionable interventions" className="w-full h-full object-cover" />
            </div>
            <h3 className="text-lg font-medium text-primary-text mb-1">Actionable interventions</h3>
            <p className="text-sm text-slate-gray">Turn insights into assignable, reviewable interventions across providers and courses.</p>
          </div>

          <div className="flex flex-col text-left">
            <div className="rounded-2xl overflow-hidden aspect-square shadow-subtle mb-4 bg-[#f2f2f3] flex flex-col items-center justify-center p-6 relative">
              {/* Connecting curved / dashed SVG lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 300 300" fill="none">
                <path d="M 60 95 C 60 145, 150 155, 150 185" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4 4" />
                <path d="M 150 95 L 150 185" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4 4" />
                <path d="M 240 95 C 240 145, 150 155, 150 185" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4 4" />
              </svg>
              
              {/* Top 3 circular nodes */}
              <div className="relative z-10 w-full flex justify-between px-2 mb-10">
                <div className="flex flex-col items-center gap-1">
                  <div className="size-13 rounded-full bg-white shadow-subtle flex items-center justify-center border border-black/5">
                    <MessageSquare className="size-5 text-[#4A154B]" />
                  </div>
                  <span className="text-[11px] text-slate-gray font-medium">Slack / Teams</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="size-13 rounded-full bg-white shadow-subtle flex items-center justify-center border border-black/5">
                    <FileCheck2 className="size-5 text-emerald-600" />
                  </div>
                  <span className="text-[11px] text-slate-gray font-medium">Payroll API</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="size-13 rounded-full bg-white shadow-subtle flex items-center justify-center border border-black/5">
                    <PhoneCall className="size-5 text-blue-600" />
                  </div>
                  <span className="text-[11px] text-slate-gray font-medium">Field Verifier</span>
                </div>
              </div>

              {/* Bottom Hub Node: WorkOS */}
              <div className="relative z-10 flex flex-col items-center gap-1">
                <div className="size-16 rounded-full bg-white shadow-subtle-2 flex items-center justify-center ring-2 ring-black/5">
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <rect width="28" height="28" rx="8" fill="#17191c" />
                    <circle cx="9" cy="9" r="3.5" fill="#fbe1d1" />
                    <circle cx="19" cy="9" r="3.5" fill="#ffffff" />
                    <circle cx="9" cy="19" r="3.5" fill="#ffffff" />
                    <path d="M16 19H22M19 16V22" stroke="#fbe1d1" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
                <span className="text-xs font-semibold text-primary-text tracking-wide">WorkOS</span>
              </div>
            </div>
            <h3 className="text-lg font-medium text-primary-text mb-1">Support delivery teams</h3>
            <p className="text-sm text-slate-gray">Source records remain visible, auditable, and editable by human programme analysts.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

// --- WORKOS CLOSING CTA ---
export function WorkosClosingCTA({
  onNavigate,
  onOpenDemoModal
}: {
  onNavigate: (path: string) => void
  onOpenDemoModal: () => void
}) {
  return (
    <section className="py-24 md:py-36 px-5 max-w-[1360px] mx-auto bg-white border-t border-black/5">
      <div className="flex flex-col lg:flex-row-reverse items-center justify-center gap-12 lg:gap-20">
        <div className="w-[240px] sm:w-[340px] shrink-0">
          <img
            src="/images/model/get-started-light-fallback.png"
            alt="WorkOS outcome journey"
            className="w-full h-auto drop-shadow-md"
          />
        </div>

        <div className="text-center lg:text-left max-w-xl">
          <span className="text-xs uppercase tracking-wider text-slate-gray font-medium mb-3 block">Build what works next</span>
          <h2 className="font-serif text-[42px] sm:text-[56px] lg:text-[64px] font-normal leading-tight text-primary-text tracking-[-0.015em] mb-4">
            Measure outcomes.<br /><em className="italic font-normal">Understand causes. Improve programmes.</em>
          </h2>
          <p className="text-base sm:text-lg font-book text-slate-gray mb-8">
            WorkOS gives every team the evidence to move from activity reporting to sustained livelihood outcomes.
          </p>

          <div className="flex items-center justify-center lg:justify-start gap-4">
            <button
              onClick={() => onNavigate('/app/overview')}
              className="rounded-full bg-primary-text text-white px-6 h-11 text-[17px] font-book hover:opacity-90 transition-opacity shadow-sm"
            >
              Explore platform
            </button>
            <button
              onClick={onOpenDemoModal}
              className="rounded-full bg-trans-5 hover:bg-trans-10 text-primary-text px-6 h-11 text-[17px] font-book transition-colors inline-flex items-center gap-1"
            >
              <span>Book a walkthrough</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

// --- WORKOS 5-COLUMN FOOTER ---
export function WorkosFooter({ onNavigate }: { onNavigate: (path: string) => void }) {
  return (
    <footer className="bg-[#F7F7F8] border-t border-black/5 py-16 px-5 sm:px-8 lg:px-12 text-xs">
      <div className="max-w-[1200px] mx-auto grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
        <div className="hidden md:block">
          <button onClick={() => onNavigate('/')} className="hover:opacity-85 transition-opacity" aria-label="WorkOS Home">
            <WorkosLogo />
          </button>
          <p className="text-slate-gray text-[11px] mt-4 max-w-[180px] leading-relaxed">
            The Outcome Intelligence Platform for skilling programmes.
          </p>
        </div>

        <div className="space-y-3">
          <div className="font-[480] text-primary-text mb-4">Platform</div>
          <div><button onClick={() => onNavigate('/platform')} className="text-slate-gray hover:text-primary-text transition-colors">Overview</button></div>
          <div><button onClick={() => onNavigate('/outcomes')} className="text-slate-gray hover:text-primary-text transition-colors">Outcomes & Retention</button></div>
          <div><button onClick={() => onNavigate('/impact')} className="text-slate-gray hover:text-primary-text transition-colors">Impact Dashboard</button></div>
          <div><button onClick={() => onNavigate('/app/overview')} className="text-slate-gray hover:text-primary-text transition-colors">Workspace</button></div>
        </div>

        <div className="space-y-3">
          <div className="font-[480] text-primary-text mb-4">Solutions</div>
          <div><button onClick={() => onNavigate('/for-providers')} className="text-slate-gray hover:text-primary-text transition-colors">For Providers</button></div>
          <div><button onClick={() => onNavigate('/for-employers')} className="text-slate-gray hover:text-primary-text transition-colors">For Employers</button></div>
          <div><button onClick={() => onNavigate('/for-programmes')} className="text-slate-gray hover:text-primary-text transition-colors">For Programmes</button></div>
          <div><button onClick={() => onNavigate('/security')} className="text-slate-gray hover:text-primary-text transition-colors">Privacy by Design</button></div>
        </div>

        <div className="space-y-3">
          <div className="font-[480] text-primary-text mb-4">Organisation</div>
          <div><button onClick={() => onNavigate('/about')} className="text-slate-gray hover:text-primary-text transition-colors">About WorkOS</button></div>
          <div><button onClick={() => onNavigate('/impact')} className="text-slate-gray hover:text-primary-text transition-colors">Case Studies</button></div>
          <div><button onClick={() => onNavigate('/security')} className="text-slate-gray hover:text-primary-text transition-colors">Security & Trust</button></div>
          <div><button onClick={() => onNavigate('/privacy')} className="text-slate-gray hover:text-primary-text transition-colors">Privacy Policy</button></div>
        </div>

        <div className="space-y-3">
          <div className="font-[480] text-primary-text mb-4">Contact</div>
          <div><a href="mailto:hello@workos.org" className="text-slate-gray hover:text-primary-text transition-colors">hello@workos.org</a></div>
          <div><button onClick={() => onNavigate('/contact')} className="text-slate-gray hover:text-primary-text transition-colors">Book a Walkthrough</button></div>
          <div><a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-slate-gray hover:text-primary-text transition-colors inline-flex items-center gap-1">LinkedIn <ArrowUpRight className="size-3" /></a></div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto pt-8 border-t border-black/10 flex flex-col sm:flex-row items-center justify-between text-slate-gray gap-4">
        <div className="flex items-center gap-6">
          <span>© WORKOS · Outcome Intelligence Platform</span>
          <button onClick={() => onNavigate('/privacy')} className="hover:text-primary-text transition-colors">Privacy Policy</button>
        </div>
        <div>
          <span>National Skills & Livelihood Operating Model</span>
        </div>
      </div>
    </footer>
  )
}

// --- WORKOS WALKTHROUGH DEMO MODAL ---
export function BookDemoModal({
  isOpen,
  onClose
}: {
  isOpen: boolean
  onClose: () => void
}) {
  const [submitted, setSubmitted] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [organisation, setOrganisation] = useState('')
  const [programmeType, setProgrammeType] = useState('State Skilling Mission')
  const [cohortSize, setCohortSize] = useState('5,000 – 25,000 trainees / yr')

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in-y">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative border border-black/5">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 size-8 rounded-full bg-trans-5 hover:bg-trans-10 flex items-center justify-center text-primary-text transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="size-4" />
        </button>

        {submitted ? (
          <div className="text-center py-8 space-y-4">
            <div className="size-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <Check className="size-6" />
            </div>
            <h3 className="font-serif text-3xl text-primary-text font-normal">Walkthrough Requested!</h3>
            <p className="text-sm text-slate-gray max-w-sm mx-auto leading-relaxed">
              Thanks {name || 'there'}! Our team will reach out to <strong className="text-primary-text">{email}</strong> to schedule your customized walkthrough of WorkOS.
            </p>
            <button
              onClick={onClose}
              className="mt-4 px-6 h-10 rounded-full bg-primary-text text-white text-sm font-book hover:opacity-90 transition-opacity cursor-pointer"
            >
              Done
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-6 text-left">
              <span className="text-xs uppercase tracking-wider text-slate-gray font-medium">Outcome Intelligence</span>
              <h3 className="font-serif text-3xl text-primary-text font-normal mt-1">Book a WorkOS Walkthrough</h3>
              <p className="text-sm text-slate-gray mt-1 leading-relaxed">
                See how WorkOS connects skilling programmes to verified livelihoods, 30/90/180-day retention, and wage progression.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-medium text-primary-text mb-1">Full name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Anand Verma"
                  className="w-full px-4 h-11 rounded-xl bg-mist-gray border-0 text-sm text-primary-text focus:outline-none focus:ring-2 focus:ring-primary-text"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-primary-text mb-1">Work email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="anand@programme.gov.in"
                  className="w-full px-4 h-11 rounded-xl bg-mist-gray border-0 text-sm text-primary-text focus:outline-none focus:ring-2 focus:ring-primary-text"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-primary-text mb-1">Organisation / Programme</label>
                  <input
                    type="text"
                    required
                    value={organisation}
                    onChange={(e) => setOrganisation(e.target.value)}
                    placeholder="e.g. State Skills Mission"
                    className="w-full px-4 h-11 rounded-xl bg-mist-gray border-0 text-sm text-primary-text focus:outline-none focus:ring-2 focus:ring-primary-text"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-primary-text mb-1">Programme Type</label>
                  <select
                    value={programmeType}
                    onChange={(e) => setProgrammeType(e.target.value)}
                    className="w-full px-3 h-11 rounded-xl bg-mist-gray border-0 text-sm text-primary-text focus:outline-none focus:ring-2 focus:ring-primary-text"
                  >
                    <option value="State Skilling Mission">State Skilling Mission</option>
                    <option value="Training Provider Network">Training Provider Network</option>
                    <option value="Employer / Enterprise">Employer / Enterprise</option>
                    <option value="CSR / Impact Funder">CSR / Impact Funder</option>
                    <option value="Apprenticeship Authority">Apprenticeship Authority</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-primary-text mb-1">Annual Trainee Volume</label>
                <select
                  value={cohortSize}
                  onChange={(e) => setCohortSize(e.target.value)}
                  className="w-full px-3 h-11 rounded-xl bg-mist-gray border-0 text-sm text-primary-text focus:outline-none focus:ring-2 focus:ring-primary-text"
                >
                  <option value="< 2,500 trainees / yr">&lt; 2,500 trainees / yr</option>
                  <option value="2,500 – 10,000 trainees / yr">2,500 – 10,000 trainees / yr</option>
                  <option value="10,000 – 50,000 trainees / yr">10,000 – 50,000 trainees / yr</option>
                  <option value="50,000+ trainees / yr">50,000+ trainees / yr</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full h-11 rounded-full bg-primary-text text-white text-base font-book hover:opacity-90 transition-opacity mt-4 cursor-pointer"
              >
                Schedule walkthrough
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}

