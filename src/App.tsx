import { useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { AppShell } from './components'
import { AppPage } from './appPages'
import { LoginPage } from './LoginPage'
import { PrivacyPage } from './PrivacyPage'
import { ContactPage, HomePage, MarketingLayout, SecondaryMarketingPage } from './marketing'
import { WorkosLogo } from './workosComponents'
import { AuthProvider, useAuth } from './lib/AuthContext'
import { ThemeProvider } from './lib/ThemeContext'

const publicRoutes = [
  '/',
  '/platform',
  '/outcomes',
  '/for-providers',
  '/for-employers',
  '/for-programmes',
  '/impact',
  '/security',
  '/about',
  '/contact',
  '/privacy'
]

const appRoutes = [
  '/app',
  '/app/overview',
  '/app/trainees',
  '/app/outcomes',
  '/app/employers',
  '/app/verifications',
  '/app/followups',
  '/app/skills',
  '/app/courses',
  '/app/providers',
  '/app/districts',
  '/app/impact',
  '/app/insights',
  '/app/interventions',
  '/app/audit',
  '/app/settings'
]

const titles: Record<string, string> = {
  '/': 'WORKOS — Outcome Intelligence Platform',
  '/platform': 'Platform — WorkOS',
  '/outcomes': 'Outcomes — WorkOS',
  '/for-providers': 'For Providers — WorkOS',
  '/for-employers': 'For Employers — WorkOS',
  '/for-programmes': 'For Programmes — WorkOS',
  '/impact': 'Impact — WorkOS',
  '/security': 'Security & Privacy by Design — WorkOS',
  '/about': 'About WorkOS',
  '/contact': 'Contact WorkOS',
  '/privacy': 'Privacy Policy — WorkOS',
  '/app': 'Sign in — WorkOS',
  '/app/overview': 'Outcome Overview — WorkOS',
  '/app/trainees': 'Trainees — WorkOS',
  '/app/outcomes': 'Outcome Analytics — WorkOS',
  '/app/employers': 'Employers — WorkOS',
  '/app/verifications': 'Verification Queue — WorkOS',
  '/app/followups': 'Follow-up Center — WorkOS',
  '/app/skills': 'Skill Intelligence — WorkOS',
  '/app/courses': 'Course Intelligence — WorkOS',
  '/app/providers': 'Provider Impact — WorkOS',
  '/app/districts': 'District Intelligence — WorkOS',
  '/app/impact': 'Impact Dashboard — WorkOS',
  '/app/insights': 'Outcome Intelligence — WorkOS',
  '/app/interventions': 'Interventions — WorkOS',
  '/app/audit': 'Audit & Governance — WorkOS',
  '/app/settings': 'Settings — WorkOS'
}

const descriptions: Record<string, string> = {
  '/': 'From training records to real-world outcomes: WorkOS connects placement, employment, retention and wage progression into one evidence-backed view.',
  '/platform': 'Explore the WorkOS outcome intelligence platform for tracking the full journey from training to career progression.',
  '/outcomes': 'Measure longitudinal employment, retention and wage outcomes with the evidence needed to understand what changed.',
  '/for-providers': 'Help training providers connect course relevance, skill gaps, placement and follow-up signals to better outcomes.',
  '/for-employers': 'Give employers a clearer verification workflow, confidence states and a practical way to share outcome signals.',
  '/for-programmes': 'Give programme teams the district, cohort and intervention intelligence needed to improve the next intake.',
  '/impact': 'Turn programme evidence into clear impact reporting across employment, retention, wage progression and career growth.',
  '/security': 'WorkOS is privacy-conscious by design, with consent, role-based access, privacy-safe identifiers and audit trails.',
  '/about': 'WorkOS helps the people behind skilling programmes understand outcomes and improve what happens next.',
  '/contact': 'Request a WorkOS walkthrough for your skilling programme, training network or impact team.',
  '/privacy': 'Learn how WorkOS protects your data, enforces authentication, and respects participant privacy.',
  '/app': 'Sign in to the WorkOS outcome intelligence workspace.'
}

function setMeta(path: string) {
  document.title = titles[path] ?? (path.startsWith('/app/trainees/') ? 'Trainee Outcome Profile — WorkOS' : 'WORKOS — Outcome Intelligence Platform')
  const descriptionKey = path.startsWith('/app/trainees/') ? '/app/trainees/:id' : path
  const description = descriptions[descriptionKey] ?? descriptions['/']
  let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null
  if (!meta) {
    meta = document.createElement('meta')
    meta.name = 'description'
    document.head.appendChild(meta)
  }
  meta.content = description
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </ThemeProvider>
  )
}

function AppRouter() {
  const [path, setPath] = useState(() => window.location.pathname.replace(/\/$/, '') || '/')
  const { user, loading } = useAuth()

  useEffect(() => {
    setMeta(path)
    const onPop = () => setPath(window.location.pathname.replace(/\/$/, '') || '/')
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [path])

  const navigate = (next: string) => {
    if (next === path) return
    window.history.pushState({}, '', next)
    setPath(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Handle privacy policy page
  if (path === '/privacy') {
    return <PrivacyPage onNavigate={navigate} />
  }

  // Handle protected /app routes
  const isAppRoute = path === '/app' || path.startsWith('/app/')
  const isTraineeDetail = path.startsWith('/app/trainees/')

  if (isAppRoute) {
    if (loading) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white dark:bg-canvas">
          <WorkosLogo />
          <div className="mt-6 flex items-center gap-2 text-slate-gray text-xs">
            <span className="loader" />
            <span>Resolving authentication session...</span>
          </div>
        </div>
      )
    }

    // Unauthenticated visitors trying to access any /app route redirect to /app
    if (!user) {
      if (path !== '/app') {
        window.history.replaceState({}, '', '/app')
        setPath('/app')
      }
      return <LoginPage onNavigate={navigate} />
    }

    // Authenticated user at /app root -> redirect to /app/overview
    if (path === '/app') {
      window.history.replaceState({}, '', '/app/overview')
      setPath('/app/overview')
      return (
        <AppShell path="/app/overview" onNavigate={navigate}>
          <AppPage path="/app/overview" onNavigate={navigate} />
        </AppShell>
      )
    }

    // Authenticated user on subroutes
    if (appRoutes.includes(path) || isTraineeDetail) {
      return (
        <AppShell path={path} onNavigate={navigate}>
          <AppPage path={path} onNavigate={navigate} />
        </AppShell>
      )
    }
  }

  // WorkOS Marketing pages
  if (path === '/' || publicRoutes.includes(path)) {
    return (
      <MarketingLayout onNavigate={navigate}>
        {path === '/' ? (
          <HomePage onNavigate={navigate} />
        ) : path === '/contact' ? (
          <ContactPage onNavigate={navigate} />
        ) : (
          <SecondaryMarketingPage path={path} onNavigate={navigate} />
        )}
      </MarketingLayout>
    )
  }

  return <NotFound onNavigate={navigate} />
}

function NotFound({ onNavigate }: { onNavigate: (path: string) => void }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-white dark:bg-canvas">
      <div className="mb-4">
        <WorkosLogo />
      </div>
      <span className="text-xs uppercase tracking-wider text-slate-gray font-medium mb-2 block">
        404 · Page not found
      </span>
      <h1 className="font-serif text-4xl sm:text-5xl font-normal text-primary-text dark:text-white mb-4">
        The outcome path ends here.
      </h1>
      <p className="text-slate-gray max-w-sm mb-8 text-sm">
        This page does not exist in the current WorkOS workspace.
      </p>
      <div className="flex items-center gap-3">
        <button
          onClick={() => onNavigate('/')}
          className="rounded-full bg-primary-text dark:bg-white text-white dark:text-ink-black px-5 h-10 text-sm font-book hover:opacity-90 inline-flex items-center gap-2"
        >
          <ArrowLeft className="size-4" />
          <span>Back to home</span>
        </button>
        <button
          onClick={() => onNavigate('/app')}
          className="rounded-full bg-mist-gray dark:bg-dark-card hover:bg-black/10 dark:hover:bg-white/10 text-primary-text dark:text-white px-5 h-10 text-sm font-book"
        >
          Open workspace
        </button>
      </div>
    </div>
  )
}
