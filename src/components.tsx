import { useEffect, useMemo, useState, type ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import {
  Activity,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Bell,
  BookOpen,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  Circle,
  CircleHelp,
  Command,
  FileCheck2,
  Filter,
  LayoutDashboard,
  Landmark,
  LaptopMinimal,
  LayoutGrid,
  LogOut,
  Map,
  Menu,
  MessageSquareMore,
  Moon,
  MoreHorizontal,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Settings2,
  ShieldCheck,
  Sparkles,
  Users,
  WandSparkles,
  X,
  Zap,
  ChartNoAxesCombined,
  ArrowUpDown,
  SlidersHorizontal,
} from 'lucide-react'
import { navItems, marketingNav } from './data'
import type { RouteItem, Trainee } from './types'
import { DemoProvider, useDemoState } from './demoState'
import { useAuth } from './lib/AuthContext'
import { useTheme, ThemeToggle } from './lib/ThemeContext'
import { getTrainees } from './lib/data/trainees'

const iconMap: Record<string, LucideIcon> = {
  'layout-dashboard': LayoutDashboard,
  users: Users,
  'chart-no-axes-combined': ChartNoAxesCombined,
  'badge-check': BadgeCheck,
  'message-square-more': MessageSquareMore,
  sparkles: Sparkles,
  'book-open': BookOpen,
  landmark: Landmark,
  map: Map,
  activity: Activity,
  'wand-sparkles': WandSparkles,
  'arrow-up-right': ArrowUpRight,
  'shield-check': ShieldCheck,
  'settings-2': Settings2,
  'file-check': FileCheck2,
  'layout-grid': LayoutGrid,
  laptop: LaptopMinimal,
}

export function Icon({ name, size = 18, strokeWidth = 1.8 }: { name: string; size?: number; strokeWidth?: number }) {
  const Comp = iconMap[name] ?? Circle
  return <Comp size={size} strokeWidth={strokeWidth} aria-hidden="true" />
}

export function WorkosMark({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`brand-lockup ${compact ? 'brand-lockup--compact' : ''}`}>
      <span className="brand-mark" aria-hidden="true">
        <i className="brand-node brand-node--one" />
        <i className="brand-link brand-link--one" />
        <i className="brand-node brand-node--two" />
        <i className="brand-link brand-link--two" />
        <i className="brand-node brand-node--three" />
      </span>
      {!compact && <span className="brand-wordmark">WORKOS</span>}
    </div>
  )
}

export function Button({ children, onClick, variant = 'primary', icon, className = '', type = 'button', disabled = false }: { children: ReactNode; onClick?: () => void; variant?: 'primary' | 'secondary' | 'ghost' | 'dark' | 'danger'; icon?: string; className?: string; type?: 'button' | 'submit'; disabled?: boolean }) {
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`button button--${variant} ${className}`}>
      <span>{children}</span>
      {icon && <Icon name={icon} size={16} />}
    </button>
  )
}

export function Badge({ children, tone = 'neutral', dot = false }: { children: ReactNode; tone?: string; dot?: boolean }) {
  return <span className={`badge badge--${tone}`}>{dot && <span className="badge-dot" />}{children}</span>
}

export function Panel({ children, className = '', title, action }: { children: ReactNode; className?: string; title?: string; action?: ReactNode }) {
  return (
    <section className={`panel ${className}`}>
      {(title || action) && <div className="panel-head"><h3>{title}</h3>{action}</div>}
      {children}
    </section>
  )
}

export function SectionEyebrow({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return <div className={`section-eyebrow ${light ? 'section-eyebrow--light' : ''}`}><span className="eyebrow-line" />{children}</div>
}

export function MetricCard({ label, value, change, context, tone = 'blue', spark = [2, 3, 2, 4, 5, 4, 7] }: { label: string; value: string; change: string; context: string; tone?: string; spark?: number[] }) {
  const positive = !change.startsWith('-')
  return (
    <div className="metric-card">
      <div className="metric-top"><span className="metric-label">{label}</span><span className={`metric-dot metric-dot--${tone}`} /></div>
      <div className="metric-value-row"><strong>{value}</strong><MiniBars values={spark} tone={tone} /></div>
      <div className={`metric-change ${positive ? 'metric-change--positive' : 'metric-change--negative'}`}><span>{positive ? '↑' : '↓'} {change.replace('-', '')}</span><span className="metric-context">{context}</span></div>
    </div>
  )
}

export function MiniBars({ values, tone = 'blue' }: { values: number[]; tone?: string }) {
  const max = Math.max(...values)
  return <span className={`mini-bars mini-bars--${tone}`} aria-hidden="true">{values.map((value, index) => <i key={index} style={{ height: `${Math.max(20, (value / max) * 100)}%` }} />)}</span>
}

export function TableToolbar({ children, onFilter, search, onSearch, placeholder = 'Search records' }: { children?: ReactNode; onFilter?: () => void; search?: string; onSearch?: (value: string) => void; placeholder?: string }) {
  return <div className="table-toolbar"><div className="table-search"><Search size={16} /><input value={search ?? ''} onChange={(e) => onSearch?.(e.target.value)} placeholder={placeholder} aria-label={placeholder} /></div><div className="toolbar-actions">{children}{onFilter && <Button variant="secondary" icon="settings-2" onClick={onFilter}>Filters</Button>}</div></div>
}

export function DataTable({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`data-table-wrap ${className}`}><table className="data-table">{children}</table></div>
}

export function ProgressBar({ value, tone = 'blue' }: { value: number; tone?: string }) {
  return <div className="progress-track"><span className={`progress-fill progress-fill--${tone}`} style={{ width: `${value}%` }} /></div>
}

export function OutcomeJourney({ compact = false }: { compact?: boolean }) {
  const steps = ['Training', 'Assessment', 'Certification', 'Placement', 'Employment', 'Verification', 'Retention', 'Progression']
  return <div className={`outcome-journey ${compact ? 'outcome-journey--compact' : ''}`}>{steps.map((step, index) => <div className="journey-step" key={step}><span className={`journey-node ${index > 3 ? 'journey-node--accent' : ''}`}>{index + 1}</span><span>{step}</span>{index < steps.length - 1 && <span className="journey-connector" />}</div>)}</div>
}

export function MarketingHeader({ onNavigate }: { onNavigate: (path: string) => void }) {
  const [open, setOpen] = useState(false)
  return <header className="marketing-header"><div className="marketing-header-inner"><button className="brand-button" onClick={() => onNavigate('/')} aria-label="WorkOS home"><WorkosMark /></button><nav className={`marketing-nav ${open ? 'marketing-nav--open' : ''}`}>{marketingNav.map((item) => <button key={item.path} onClick={() => { onNavigate(item.path); setOpen(false) }}>{item.label}</button>)}<button onClick={() => { onNavigate('/about'); setOpen(false) }}>About</button></nav><div className="marketing-actions"><button className="text-button marketing-login" onClick={() => onNavigate('/app')}>Sign in</button><Button onClick={() => onNavigate('/contact')} icon="arrow-up-right">Book a demo</Button></div><button className="mobile-menu-button" onClick={() => setOpen((v) => !v)} aria-label="Toggle menu">{open ? <X size={20} /> : <Menu size={20} />}</button></div></header>
}

export function MarketingFooter({ onNavigate }: { onNavigate: (path: string) => void }) {
  return (
    <footer className="marketing-footer">
      <div className="footer-top">
        <div>
          <button className="brand-button" onClick={() => onNavigate('/')} aria-label="WorkOS home">
            <WorkosMark />
          </button>
          <p>Outcome intelligence for the people who make skilling programmes work.</p>
        </div>
        <div className="footer-links">
          <div>
            <span>Product</span>
            <button onClick={() => onNavigate('/platform')}>Platform</button>
            <button onClick={() => onNavigate('/outcomes')}>Outcomes</button>
            <button onClick={() => onNavigate('/impact')}>Impact</button>
          </div>
          <div>
            <span>Use cases</span>
            <button onClick={() => onNavigate('/for-providers')}>For providers</button>
            <button onClick={() => onNavigate('/for-employers')}>For employers</button>
            <button onClick={() => onNavigate('/for-programmes')}>For programmes</button>
          </div>
          <div>
            <span>Governance</span>
            <button onClick={() => onNavigate('/about')}>About</button>
            <button onClick={() => onNavigate('/security')}>Security</button>
            <button onClick={() => onNavigate('/privacy')}>Privacy Policy</button>
            <button onClick={() => onNavigate('/contact')}>Contact</button>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 WorkOS. Built for better outcomes.</span>
        <span>
          <button onClick={() => onNavigate('/privacy')} className="hover:underline">Privacy Policy</button> · Evidence over assumptions
        </span>
      </div>
    </footer>
  )
}

export function AppShell({ path, onNavigate, children }: { path: string; onNavigate: (path: string) => void; children: ReactNode }) {
  return <DemoProvider><AppShellFrame path={path} onNavigate={onNavigate}>{children}</AppShellFrame></DemoProvider>
}

function AppShellFrame({ path, onNavigate, children }: { path: string; onNavigate: (path: string) => void; children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [menu, setMenu] = useState<'notifications' | 'help' | 'profile' | 'workspace' | 'date' | null>(null)
  const { state, update } = useDemoState()
  const { user, profile, signOut } = useAuth()
  const current = navItems.find((item) => path === item.path || (path.startsWith('/app/trainees/') && item.path === '/app/trainees')) ?? navItems[0]

  const displayName = profile?.full_name || (user?.email ? user.email.split('@')[0] : 'User')
  const userRole = profile?.role || 'Programme Administrator'
  const initials = displayName
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'WO'

  const handleSignOut = async () => {
    await signOut()
    onNavigate('/app')
  }

  return (
    <div className={`app-shell ${collapsed ? 'app-shell--collapsed' : ''}`}>
      <aside className={`app-sidebar ${mobileOpen ? 'app-sidebar--mobile-open' : ''}`}>
        <div className="sidebar-head">
          <button className="brand-button" onClick={() => onNavigate('/app/overview')} aria-label="WorkOS Home">
            <WorkosMark compact={collapsed} />
          </button>
          <button className="sidebar-close mobile-only" onClick={() => setMobileOpen(false)} aria-label="Close sidebar">
            <X size={18} />
          </button>
        </div>

        <div className="workspace-switcher">
          <button className="workspace-button" onClick={() => setMenu(menu === 'workspace' ? null : 'workspace')}>
            <span className="workspace-icon">
              <Landmark size={16} />
            </span>
            <span className="workspace-copy">
              <strong>{state.workspace}</strong>
              <span>Outcome Workspace</span>
            </span>
            <ChevronDown size={15} />
          </button>
          {menu === 'workspace' && (
            <div className="popover workspace-popover">
              <strong>Switch workspace</strong>
              <button onClick={() => { update({ workspace: 'National Skills Programme' }); setMenu(null) }}>
                <span className="workspace-icon workspace-icon--small">N</span>
                <span>National Skills Programme</span>
                {state.workspace === 'National Skills Programme' && <Check size={14} />}
              </button>
              <button onClick={() => { update({ workspace: 'State Livelihood Mission' }); setMenu(null) }}>
                <span className="workspace-icon workspace-icon--small">S</span>
                <span>State Livelihood Mission</span>
                {state.workspace === 'State Livelihood Mission' && <Check size={14} />}
              </button>
            </div>
          )}
        </div>

        <div className="sidebar-scroll">
          <div className="sidebar-group">
            <span className="sidebar-label">Workspace</span>
            {navItems.slice(0, 10).map((item) => (
              <SidebarLink
                key={item.path}
                item={item}
                active={path === item.path || (path.startsWith('/app/trainees/') && item.path === '/app/trainees')}
                collapsed={collapsed}
                onNavigate={onNavigate}
              />
            ))}
          </div>
          <div className="sidebar-group">
            <span className="sidebar-label">Improve outcomes</span>
            {navItems.slice(10, 12).map((item) => (
              <SidebarLink key={item.path} item={item} active={path === item.path} collapsed={collapsed} onNavigate={onNavigate} />
            ))}
          </div>
          <div className="sidebar-group">
            <span className="sidebar-label">Governance</span>
            {navItems.slice(12).map((item) => (
              <SidebarLink key={item.path} item={item} active={path === item.path} collapsed={collapsed} onNavigate={onNavigate} />
            ))}
          </div>
        </div>

        <div className="sidebar-foot">
          <button className="sidebar-profile" onClick={() => setMenu(menu === 'profile' ? null : 'profile')}>
            <span className="avatar avatar--small">{initials}</span>
            <span className="profile-copy">
              <strong>{displayName}</strong>
              <span>{userRole}</span>
            </span>
            <MoreHorizontal size={15} />
          </button>
          {menu === 'profile' && (
            <div className="popover profile-popover">
              <div className="px-3 py-2 border-b border-black/[0.05] dark:border-white/[0.05] mb-1">
                <p className="text-xs font-medium text-primary-text dark:text-white truncate">{displayName}</p>
                <p className="text-[11px] text-slate-gray truncate">{user?.email}</p>
              </div>
              <button onClick={() => { setMenu(null); onNavigate('/app/settings') }}>
                <Settings2 size={15} /> Account settings
              </button>
              <button onClick={() => { setMenu(null); onNavigate('/privacy') }}>
                <ShieldCheck size={15} /> Privacy policy
              </button>
              <button onClick={handleSignOut} className="text-red-600 dark:text-red-400">
                <LogOut size={15} /> Sign out
              </button>
            </div>
          )}
        </div>
      </aside>

      <main className="app-main">
        <header className="app-topbar">
          <div className="topbar-left">
            <button className="mobile-menu-button app-mobile-menu" onClick={() => setMobileOpen(true)} aria-label="Open navigation menu">
              <Menu size={20} />
            </button>
            <button className="collapse-button desktop-only" onClick={() => setCollapsed((v) => !v)} aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
              {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
            </button>
            <div className="breadcrumb">
              <span>Workspace</span>
              <ChevronRight size={13} />
              <strong>{current.label}</strong>
            </div>
          </div>

          <div className="topbar-actions">
            <button className="global-search-trigger" onClick={() => setSearchOpen(true)}>
              <Search size={16} />
              <span>Search records</span>
              <kbd><Command size={11} /> K</kbd>
            </button>

            <button className="date-range-button" aria-label="Select date range" onClick={() => setMenu(menu === 'date' ? null : 'date')}>
              <CalendarDays size={17} />
              <span>{state.dateRange}</span>
            </button>

            <ThemeToggle className="topbar-icon-button" />

            <button className="topbar-avatar" onClick={() => setMenu(menu === 'profile' ? null : 'profile')} aria-label="User menu">
              <span className="avatar">{initials}</span>
              <ChevronDown size={14} />
            </button>

            {menu === 'date' && (
              <div className="popover date-popover">
                <strong>Filter date range</strong>
                {(['Q4 2025 — Q1 2026', 'Last 90 days', 'Last 365 days'] as const).map((range) => (
                  <button key={range} onClick={() => { update({ dateRange: range }); setMenu(null) }}>
                    {range}
                    {state.dateRange === range && <Check size={14} />}
                  </button>
                ))}
              </div>
            )}

            {menu === 'profile' && (
              <div className="popover topbar-popover">
                <div className="px-2 py-2 border-b border-black/[0.05] dark:border-white/[0.05] mb-2">
                  <p className="text-xs font-semibold text-primary-text dark:text-white truncate">{displayName}</p>
                  <p className="text-[11px] text-slate-gray truncate">{user?.email}</p>
                  <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-medium">
                    {userRole}
                  </span>
                </div>
                <button onClick={() => { setMenu(null); onNavigate('/app/settings') }}>
                  <Settings2 size={15} /> Account settings
                </button>
                <button onClick={() => { setMenu(null); onNavigate('/privacy') }}>
                  <ShieldCheck size={15} /> Privacy policy
                </button>
                <button onClick={handleSignOut} className="text-red-600 dark:text-red-400">
                  <LogOut size={15} /> Sign out
                </button>
              </div>
            )}
          </div>
        </header>

        <div className="app-content">{children}</div>
      </main>

      {searchOpen && (
        <SearchOverlay
          onClose={() => setSearchOpen(false)}
          onNavigate={(route) => {
            setSearchOpen(false)
            onNavigate(route)
          }}
        />
      )}
    </div>
  )
}

function SidebarLink({ item, active, collapsed, onNavigate }: { item: RouteItem; active: boolean; collapsed: boolean; onNavigate: (path: string) => void }) {
  return <button className={`sidebar-link ${active ? 'sidebar-link--active' : ''}`} onClick={() => onNavigate(item.path)} title={collapsed ? item.label : undefined}><Icon name={item.icon} size={17} /><span>{item.label}</span>{item.label === 'AI Insights' && <span className="nav-new">New</span>}</button>
}

function SearchOverlay({ onClose, onNavigate }: { onClose: () => void; onNavigate: (path: string) => void }) {
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const [liveTrainees, setLiveTrainees] = useState<Trainee[]>([])

  useEffect(() => {
    let active = true
    if (query.trim().length > 1) {
      getTrainees({ query: query.trim(), limit: 5 }).then((res) => {
        if (active) setLiveTrainees(res.trainees)
      })
    } else {
      setLiveTrainees([])
    }
    return () => { active = false }
  }, [query])

  const q = query.toLowerCase()
  const pageMatches = useMemo(
    () =>
      navItems
        .filter((item) => !q || item.label.toLowerCase().includes(q))
        .map((item) => ({ label: item.label, meta: 'Workspace page', path: item.path, icon: item.icon })),
    [q]
  )

  const traineeMatches = useMemo(
    () =>
      liveTrainees.map((t) => ({
        label: t.name,
        meta: `${t.id} · ${t.course}`,
        path: `/app/trainees/${t.id}`,
        icon: 'users',
      })),
    [liveTrainees]
  )

  const matches = useMemo(() => [...pageMatches, ...traineeMatches].slice(0, 8), [pageMatches, traineeMatches])

  useEffect(() => setActiveIndex(0), [q])
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowDown') { event.preventDefault(); setActiveIndex((index) => matches.length ? (index + 1) % matches.length : 0) }
      if (event.key === 'ArrowUp') { event.preventDefault(); setActiveIndex((index) => matches.length ? (index - 1 + matches.length) % matches.length : 0) }
      if (event.key === 'Enter' && matches[activeIndex]) { event.preventDefault(); onNavigate(matches[activeIndex].path) }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [activeIndex, matches, onClose, onNavigate])

  return (
    <div className="overlay" onMouseDown={onClose}>
      <div className="command-dialog" onMouseDown={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Search WorkOS">
        <div className="command-input">
          <Search size={18} />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search trainees, pages, or entities"
            aria-label="Search trainees, pages, or entities"
          />
          <kbd>ESC</kbd>
          <button onClick={onClose} aria-label="Close search">
            <X size={18} />
          </button>
        </div>
        <div className="command-results">
          {matches.length ? (
            matches.map((item, index) => (
              <button
                className={index === activeIndex ? 'command-result-active' : ''}
                aria-selected={index === activeIndex}
                key={item.path + item.label}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => onNavigate(item.path)}
              >
                <span className="command-icon">
                  <Icon name={item.icon} size={16} />
                </span>
                <span>
                  <strong>{item.label}</strong>
                  <small>{item.meta}</small>
                </span>
                <ArrowUpRight size={15} />
              </button>
            ))
          ) : (
            <div className="command-empty">
              <Search size={22} />
              <strong>No matching records</strong>
              <span>Try a name, page or privacy-safe ID.</span>
            </div>
          )}
        </div>
        <div className="command-foot">
          <span><kbd>↑</kbd><kbd>↓</kbd> Navigate</span>
          <span><kbd>↵</kbd> Open</span>
          <span><kbd>ESC</kbd> Close</span>
        </div>
      </div>
    </div>
  )
}
export function PageHeader({ eyebrow, title, description, actions }: { eyebrow: string; title: string; description?: string; actions?: React.ReactNode }) {
  return <div className="page-header"><div><div className="page-eyebrow">{eyebrow}</div><h1>{title}</h1>{description && <p>{description}</p>}</div>{actions && <div className="page-header-actions">{actions}</div>}</div>
}

export function EmptyState({ title, description, icon = 'file-check' }: { title: string; description: string; icon?: string }) {
  return <div className="empty-state"><span className="empty-icon"><Icon name={icon} size={22} /></span><strong>{title}</strong><p>{description}</p></div>
}

export function LoadingState({ label = 'Loading outcome data' }: { label?: string }) {
  return <div className="loading-state"><span className="loader" /><span>{label}</span></div>
}

export function InsightPill({ label, value, tone = 'blue' }: { label: string; value: string; tone?: string }) {
  return <div className="insight-pill"><span className={`insight-pill-dot insight-pill-dot--${tone}`} /><span>{label}</span><strong>{value}</strong></div>
}

export function Legend({ items }: { items: { label: string; color: string }[] }) {
  return <div className="legend">{items.map((item) => <span key={item.label}><i style={{ background: item.color }} />{item.label}</span>)}</div>
}

export { ArrowDownRight, ArrowRight, ArrowUpDown, CalendarDays, ChevronDown, Filter, MoreHorizontal, Moon, Search, SlidersHorizontal }
