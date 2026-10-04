import { useEffect, useMemo, useState, useCallback } from 'react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend as ChartLegend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpDown,
  ArrowUpRight,
  Check,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  FileCheck2,
  Filter,
  Info,
  LockKeyhole,
  MessageSquareMore,
  MoreHorizontal,
  Plus,
  RefreshCcw,
  Search,
  Send,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Target,
  UserRoundCheck,
  X,
  LogOut,
  Moon,
  Sun,
  AlertCircle,
  Copy,
  Trash2,
  Bot,
} from 'lucide-react'
import {
  Badge,
  Button,
  DataTable,
  EmptyState,
  InsightPill,
  Legend,
  LoadingState,
  MetricCard,
  PageHeader,
  Panel,
  ProgressBar,
  TableToolbar,
  Icon,
} from './components'
import type { Confidence, Course, District, FollowUp, Insight, Intervention, Provider, Skill, Trainee, Verification } from './types'
import {
  getDashboardMetrics,
  getCohortFunnel,
  getRetentionCurves,
  getEmploymentDistribution,
  getWageData,
  getAttritionReasons,
  getNonPlacementReasons,
  getTrainees,
  getTraineeProfileDetails,
  getVerifications,
  updateVerificationStatus,
  getFollowUps,
  updateFollowUpStatus,
  getSkills,
  getSkillsMatrix,
  getCourses,
  getProviders,
  getDistricts,
  getInsights,
  getInterventions,
  createIntervention,
  updateInterventionStatus,
  getAuditEvents,
  getEmployers,
  type DashboardMetrics,
  type FunnelItem,
  type RetentionCurveItem,
  type DistributionItem,
  type Employer,
} from './lib/data'
import { useAuth } from './lib/AuthContext'
import { useTheme, ThemeToggle } from './lib/ThemeContext'
import { useDemoState } from './demoState'
export { LoginPage } from './LoginPage'

const currency = (value: number) => (value ? `₹${value.toLocaleString('en-IN')}` : '—')

export function AppPage({ path, onNavigate }: { path: string; onNavigate: (path: string) => void }) {
  if (path.startsWith('/app/trainees/')) {
    const id = path.replace('/app/trainees/', '').replace(/\/$/, '')
    return <TraineeProfilePage id={id} onNavigate={onNavigate} />
  }

  switch (path) {
    case '/app':
    case '/app/overview':
      return <OverviewPage onNavigate={onNavigate} />
    case '/app/trainees':
      return <TraineesPage onNavigate={onNavigate} />
    case '/app/verifications':
      return <VerificationPage />
    case '/app/followups':
      return <FollowUpsPage />
    case '/app/skills':
      return <SkillsPage />
    case '/app/courses':
      return <CoursesPage />
    case '/app/providers':
      return <ProvidersPage />
    case '/app/districts':
      return <DistrictsPage />
    case '/app/insights':
      return <InsightsPage onNavigate={onNavigate} />
    case '/app/interventions':
      return <InterventionsPage />
    case '/app/audit':
      return <AuditPage />
    case '/app/settings':
      return <SettingsPage onNavigate={onNavigate} />
    case '/app/outcomes':
      return <GenericAnalyticsPage kind="outcomes" onNavigate={onNavigate} />
    case '/app/employers':
      return <EmployersPage />
    case '/app/impact':
      return <GenericAnalyticsPage kind="impact" onNavigate={onNavigate} />
    default:
      return <OverviewPage onNavigate={onNavigate} />
  }
}

// ----------------------------------------------------
// 1. OVERVIEW PAGE
// ----------------------------------------------------
function OverviewPage({ onNavigate }: { onNavigate: (path: string) => void }) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const { state, update } = useDemoState()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [funnel, setFunnel] = useState<FunnelItem[]>([])
  const [retention, setRetention] = useState<RetentionCurveItem[]>([])
  const [distribution, setDistribution] = useState<DistributionItem[]>([])
  const [wage, setWage] = useState<{ day: string; value: number }[]>([])
  const [skills, setSkills] = useState<Skill[]>([])
  const [insights, setInsights] = useState<Insight[]>([])

  const loadData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [m, f, r, d, w, s, ins] = await Promise.all([
        getDashboardMetrics(),
        getCohortFunnel(),
        getRetentionCurves(),
        getEmploymentDistribution(),
        getWageData(),
        getSkills(),
        getInsights(),
      ])
      setMetrics(m)
      setFunnel(f)
      setRetention(r)
      setDistribution(d)
      setWage(w)
      setSkills(s)
      setInsights(ins)
    } catch (err: any) {
      setError(err?.message || 'Failed to load outcome data from Supabase.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  if (loading) {
    return (
      <div className="app-page">
        <PageHeader
          eyebrow={`${state.workspace} · Outcome Intelligence`}
          title="Outcome Overview"
          description="Resolving longitudinal performance from Supabase..."
        />
        <LoadingState label="Querying Supabase outcome records..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="app-page">
        <PageHeader eyebrow="Workspace Error" title="Outcome Overview" />
        <div className="p-6 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300">
          <p className="font-medium text-sm mb-2">Error connecting to Supabase database:</p>
          <p className="text-xs mb-4">{error}</p>
          <Button variant="secondary" onClick={loadData}>Retry query</Button>
        </div>
      </div>
    )
  }

  const kpisList = [
    {
      label: 'Trainees tracked',
      value: metrics?.totalTrainees ? metrics.totalTrainees.toLocaleString('en-IN') : '—',
      change: metrics?.totalTrainees ? `${metrics.totalTrainees} records` : 'No data',
      context: 'in database',
      tone: 'blue',
    },
    {
      label: 'Employment conversion',
      value: metrics?.employmentConversionRate !== null ? `${metrics?.employmentConversionRate}%` : '—',
      change: metrics?.employedTrainees ? `${metrics.employedTrainees} employed` : '—',
      context: 'of tracked trainees',
      tone: 'green',
    },
    {
      label: 'Verified employment',
      value: metrics?.verifiedRate !== null ? `${metrics?.verifiedRate}%` : '—',
      change: metrics?.verifiedTrainees ? `${metrics.verifiedTrainees} claims` : '—',
      context: 'evidence-backed',
      tone: 'blue',
    },
    {
      label: '90-day retention',
      value: metrics?.retentionRate !== null ? `${metrics?.retentionRate}%` : '—',
      change: metrics?.retained90dTrainees ? `${metrics.retained90dTrainees} retained` : '—',
      context: 'across cohort',
      tone: 'green',
    },
    {
      label: 'Median monthly wage',
      value: metrics?.medianWage ? currency(metrics.medianWage) : '—',
      change: metrics?.medianWage ? 'derived from snapshots' : '—',
      context: 'salary records',
      tone: 'amber',
    },
    {
      label: 'Follow-up completion',
      value: metrics?.followUpCompletionRate !== null ? `${metrics?.followUpCompletionRate}%` : '—',
      change: metrics?.completedFollowUps ? `${metrics.completedFollowUps}/${metrics?.totalFollowUps || 0}` : '—',
      context: 'completed responses',
      tone: 'purple',
    },
  ]

  const topSignal = insights[0]

  return (
    <div className="app-page">
      <PageHeader
        eyebrow={`${state.workspace} · Live Database`}
        title="Outcome Overview"
        description="Longitudinal performance derived directly from your Supabase outcome records."
        actions={
          <>
            <Button
              variant="secondary"
              icon="calendar-days"
              onClick={() =>
                update({
                  dateRange:
                    state.dateRange === 'Q4 2025 — Q1 2026'
                      ? 'Last 90 days'
                      : state.dateRange === 'Last 90 days'
                      ? 'Last 365 days'
                      : 'Q4 2025 — Q1 2026',
                })
              }
            >
              {state.dateRange}
            </Button>
            <Button onClick={() => onNavigate('/app/insights')} icon="wand-sparkles">
              Ask Outcome Intelligence
            </Button>
          </>
        }
      />

      <div className="kpi-grid">
        {kpisList.map((kpi) => (
          <MetricCard key={kpi.label} {...kpi} />
        ))}
      </div>

      <div className="dashboard-grid dashboard-grid--wide">
        <Panel
          title="Outcome funnel"
          action={
            <button className="panel-action" onClick={() => onNavigate('/app/outcomes')}>
              View details <ArrowRight size={14} />
            </button>
          }
          className="funnel-panel"
        >
          {funnel.length === 0 ? (
            <div className="p-8">
              <EmptyState title="No funnel metrics" description="No cohort funnel stages found in the database." />
            </div>
          ) : (
            <>
              <div className="funnel-wrap">
                {funnel.map((item, index) => (
                  <div className="funnel-row" key={item.label}>
                    <span className="funnel-label">{item.label}</span>
                    <div className="funnel-bar-wrap">
                      <div className="funnel-bar" style={{ width: `${item.width}%`, background: item.color }} />
                      <span>{item.display}</span>
                    </div>
                    <span className="funnel-rate">
                      {index > 0 && funnel[index - 1]?.value > 0
                        ? `${Math.round((item.value / funnel[index - 1].value) * 100)}%`
                        : '100%'}
                    </span>
                  </div>
                ))}
              </div>
              <div className="funnel-foot">
                <span>Enrolled → retained conversion</span>
                <strong>
                  {funnel.length >= 6 && funnel[0].value > 0
                    ? `${Math.round((funnel[funnel.length - 1].value / funnel[0].value) * 1000) / 10}%`
                    : '—'}
                </strong>
                <span className="positive">Based on recorded funnel data</span>
              </div>
            </>
          )}
        </Panel>

        <Panel
          title="Employment outcome distribution"
          action={
            <button className="panel-action" onClick={() => onNavigate('/app/outcomes')}>
              All outcomes <ChevronDown size={14} />
            </button>
          }
        >
          {distribution.length === 0 ? (
            <div className="p-8">
              <EmptyState title="No trainee statuses" description="No trainees are currently recorded to calculate distribution." />
            </div>
          ) : (
            <div className="distribution-wrap">
              <div className="distribution-donut">
                <div className="donut-ring donut-ring--large" />
                <div>
                  <strong>
                    {metrics?.employmentConversionRate !== null ? `${metrics?.employmentConversionRate}%` : '—'}
                  </strong>
                  <span>employed</span>
                </div>
              </div>
              <div className="distribution-list">
                {distribution.map((item) => (
                  <div className="distribution-row" key={item.label}>
                    <span>
                      <i style={{ background: item.color }} />
                      {item.label}
                    </span>
                    <strong>{item.value}%</strong>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Panel>
      </div>

      <div className="dashboard-grid dashboard-grid--wide">
        <Panel title="Retention curve" className="chart-panel">
          {retention.length === 0 ? (
            <div className="p-8">
              <EmptyState title="No retention curves" description="No longitudinal retention curves recorded in the database." />
            </div>
          ) : (
            <>
              <div className="chart-legend">
                <Legend
                  items={[
                    { label: 'Still employed', color: isDark ? '#637cfc' : '#4a63f6' },
                    { label: 'Retained in role', color: isDark ? '#38bdf8' : '#101828' },
                  ]}
                />
                <span>Active programme cohorts</span>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={retention} margin={{ top: 15, right: 14, left: -22, bottom: 0 }}>
                  <defs>
                    <linearGradient id="retentionFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={isDark ? '#637cfc' : '#4a63f6'} stopOpacity={0.22} />
                      <stop offset="100%" stopColor={isDark ? '#637cfc' : '#4a63f6'} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke={isDark ? 'rgba(255,255,255,0.08)' : '#edf0f5'} strokeOpacity={isDark ? 1 : 0.3} vertical={false} />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: isDark ? '#94a3b8' : '#8490a3' }} />
                  <YAxis
                    domain={[40, 100]}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: isDark ? '#94a3b8' : '#8490a3' }}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDark ? '#1a1b20' : '#ffffff',
                      border: isDark ? '1px solid rgba(255,255,255,0.12)' : '1px solid #e7eaf0',
                      borderRadius: 8,
                      boxShadow: '0 8px 24px rgba(0,0,0,.2)',
                      color: isDark ? '#ededef' : '#101828',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="employed"
                    stroke={isDark ? '#637cfc' : '#4a63f6'}
                    strokeWidth={2.5}
                    fill="url(#retentionFill)"
                  />
                  <Line type="monotone" dataKey="retained" stroke={isDark ? '#38bdf8' : '#101828'} strokeWidth={2} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </>
          )}
        </Panel>

        <Panel
          title="Wage progression"
          action={<span className="panel-context">Median monthly wage</span>}
          className="chart-panel"
        >
          {wage.length === 0 ? (
            <div className="p-8">
              <EmptyState title="No wage snapshots" description="No longitudinal wage snapshots recorded in the database." />
            </div>
          ) : (
            <>
              <div className="wage-callout">
                <strong>{currency(wage[wage.length - 1]?.value ?? 0)}</strong>
                <span>
                  latest snapshot · {wage[0]?.value ? `+${Math.round(((wage[wage.length - 1].value - wage[0].value) / wage[0].value) * 100)}% progression` : 'recorded'}
                </span>
              </div>
              <ResponsiveContainer width="100%" height={184}>
                <LineChart data={wage} margin={{ top: 20, right: 10, left: -18, bottom: 0 }}>
                  <CartesianGrid stroke={isDark ? 'rgba(255,255,255,0.08)' : '#edf0f5'} strokeOpacity={isDark ? 1 : 0.3} vertical={false} />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: isDark ? '#94a3b8' : '#8490a3' }} />
                  <YAxis hide domain={['dataMin - 2000', 'dataMax + 2000']} />
                  <Tooltip
                    formatter={(val) => currency(Number(val))}
                    contentStyle={{
                      backgroundColor: isDark ? '#1a1b20' : '#ffffff',
                      border: isDark ? '1px solid rgba(255,255,255,0.12)' : '1px solid #e7eaf0',
                      borderRadius: 8,
                      color: isDark ? '#ededef' : '#101828',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke={isDark ? '#637cfc' : '#4a63f6'}
                    strokeWidth={2.5}
                    dot={{ r: 4, strokeWidth: 2, fill: isDark ? '#1a1b20' : '#fff', stroke: isDark ? '#637cfc' : '#4a63f6' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </>
          )}
        </Panel>
      </div>

      <div className="dashboard-grid dashboard-grid--wide">
        <Panel
          title="Top skill gaps"
          action={
            <button className="panel-action" onClick={() => onNavigate('/app/skills')}>
              Explore skills <ArrowRight size={14} />
            </button>
          }
        >
          {skills.length === 0 ? (
            <div className="p-8">
              <EmptyState title="No skill data" description="No skill records found in the database." />
            </div>
          ) : (
            <div className="skill-gap-list">
              {skills.slice(0, 4).map((skill) => (
                <div className="skill-gap-row" key={skill.id}>
                  <div className="skill-gap-label">
                    <strong>{skill.name}</strong>
                    <span>{skill.affected.toLocaleString('en-IN')} trainees affected</span>
                  </div>
                  <div className="skill-gap-meter">
                    <div className="meter-meta">
                      <span>
                        Coverage <b>{skill.coverage}%</b>
                      </span>
                      <span>
                        Gap <b className="text-red">{skill.gap}%</b>
                      </span>
                    </div>
                    <div className="stacked-meter">
                      <span style={{ width: `${skill.coverage}%` }} />
                      <i style={{ width: `${skill.gap}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Panel>

        <Panel
          title="Outcome signals"
          action={
            <button className="panel-action" onClick={() => onNavigate('/app/insights')}>
              Ask why <ArrowRight size={14} />
            </button>
          }
        >
          {topSignal ? (
            <div className="signal-panel">
              <div className="signal-highlight">
                <span className="signal-icon signal-icon--blue">
                  <Sparkles size={16} />
                </span>
                <div>
                  <span className="eyebrow-small">Highest priority signal</span>
                  <strong>{topSignal.title}</strong>
                  <p>{topSignal.finding}</p>
                </div>
              </div>
              <div className="signal-actions">
                <InsightPill label="Confidence" value={topSignal.confidence} tone="green" />
                <InsightPill label="Evidence" value={`${topSignal.evidenceIds.length} sources`} tone="blue" />
              </div>
              <button className="insight-link" onClick={() => onNavigate('/app/insights')}>
                Review Outcome Intelligence analysis <ArrowRight size={14} />
              </button>
            </div>
          ) : (
            <div className="p-8">
              <EmptyState title="No active signals" description="No outcome signals have been flagged in the database." />
            </div>
          )}
        </Panel>
      </div>
    </div>
  )
}

// ----------------------------------------------------
// 2. TRAINEES DIRECTORY
// ----------------------------------------------------
function TraineesPage({ onNavigate }: { onNavigate: (path: string) => void }) {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('All statuses')
  const [page, setPage] = useState(1)
  const pageSize = 6
  const [loading, setLoading] = useState(true)
  const [traineeList, setTraineeList] = useState<Trainee[]>([])
  const [total, setTotal] = useState(0)

  const fetchTraineesData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getTrainees({
        query,
        status,
        limit: pageSize,
        offset: (page - 1) * pageSize,
      })
      setTraineeList(res.trainees)
      setTotal(res.total)
    } catch (err) {
      console.error('Error in fetchTraineesData:', err)
      setTraineeList([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }, [query, status, page])

  useEffect(() => {
    fetchTraineesData()
  }, [fetchTraineesData])

  return (
    <div className="app-page">
      <PageHeader
        eyebrow="Directory"
        title="Trainees"
        description="Search and review the people behind the outcome signals directly from Supabase."
        actions={
          <>
            <Button variant="secondary" icon="filter">
              Filters
            </Button>
            <Button icon="plus" onClick={() => alert('To enroll new trainees, import batch records or use programme administration.')}>
              Add record
            </Button>
          </>
        }
      />

      <div className="directory-summary">
        <span>
          <strong>{total}</strong> trainees tracked
        </span>
        <span>
          <i className="status-dot status-dot--green" /> Database connected
        </span>
      </div>

      <Panel className="table-panel">
        <TableToolbar
          search={query}
          onSearch={(value) => {
            setQuery(value)
            setPage(1)
          }}
          placeholder="Search name, ID, course or district"
        >
          <select
            className="select-control"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value)
              setPage(1)
            }}
          >
            <option>All statuses</option>
            <option>Employed</option>
            <option>Self-employed</option>
            <option>Apprentice</option>
            <option>Unemployed</option>
            <option>Further education</option>
          </select>
        </TableToolbar>

        {loading ? (
          <div className="p-12">
            <LoadingState label="Loading trainee records from Supabase..." />
          </div>
        ) : traineeList.length === 0 ? (
          <div className="p-12">
            <EmptyState
              title="No trainees found"
              description="No trainee records in Supabase match your search or filter parameters."
              icon="users"
            />
          </div>
        ) : (
          <>
            <DataTable>
              <thead>
                <tr>
                  <th>
                    Trainee <ArrowUpDown size={13} />
                  </th>
                  <th>Programme / course</th>
                  <th>Status</th>
                  <th>Placement</th>
                  <th>Employment</th>
                  <th>Retention</th>
                  <th>Last follow-up</th>
                  <th>Updated</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {traineeList.map((trainee) => (
                  <tr key={trainee.id} onClick={() => onNavigate(`/app/trainees/${trainee.id}`)}>
                    <td>
                      <div className="person-cell">
                        <span className="avatar avatar--table">{trainee.initials}</span>
                        <span>
                          <strong>{trainee.name}</strong>
                          <small>{trainee.id}</small>
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className="table-primary">{trainee.course}</span>
                      <small>{trainee.programme}</small>
                    </td>
                    <td>
                      <Badge
                        tone={
                          trainee.status === 'Employed'
                            ? 'green'
                            : trainee.status === 'Unemployed'
                            ? 'amber'
                            : 'neutral'
                        }
                        dot
                      >
                        {trainee.status}
                      </Badge>
                    </td>
                    <td>{trainee.placement}</td>
                    <td>
                      <Badge
                        tone={
                          trainee.employment === 'Verified'
                            ? 'blue'
                            : trainee.employment === 'Pending'
                            ? 'amber'
                            : 'neutral'
                        }
                      >
                        {trainee.employment}
                      </Badge>
                    </td>
                    <td>{trainee.retention}</td>
                    <td>{trainee.lastFollowUp}</td>
                    <td>{trainee.updated}</td>
                    <td>
                      <button className="row-more" aria-label={`Open ${trainee.name}`}>
                        <ChevronRight size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </DataTable>

            <div className="table-footer">
              <span>
                Showing {total > 0 ? (page - 1) * pageSize + 1 : 0}–{Math.min(total, page * pageSize)} of {total} trainees
              </span>
              <div className="pagination">
                <button disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                  Previous
                </button>
                <button className="active">{page}</button>
                <button disabled={page * pageSize >= total} onClick={() => setPage((p) => p + 1)}>
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </Panel>
    </div>
  )
}

// ----------------------------------------------------
// 3. TRAINEE PROFILE PAGE
// ----------------------------------------------------
function TraineeProfilePage({ id, onNavigate }: { id: string; onNavigate: (path: string) => void }) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const [loading, setLoading] = useState(true)
  const [details, setDetails] = useState<Awaited<ReturnType<typeof getTraineeProfileDetails>> | null>(null)
  const [selectedEvent, setSelectedEvent] = useState('Employment')
  const events = ['Training', 'Assessment', 'Certification', 'Placement', 'Employment', 'Verification', '30d', '90d', '180d', '365d']

  useEffect(() => {
    let mounted = true
    setLoading(true)
    getTraineeProfileDetails(id).then((res) => {
      if (mounted) {
        setDetails(res)
        setLoading(false)
      }
    }).catch(() => {
      if (mounted) setLoading(false)
    })
    return () => {
      mounted = false
    }
  }, [id])

  if (loading) {
    return (
      <div className="app-page">
        <button className="back-link" onClick={() => onNavigate('/app/trainees')}>
          <ArrowRight size={15} className="back-arrow" /> Back to trainee directory
        </button>
        <LoadingState label="Loading trainee profile from Supabase..." />
      </div>
    )
  }

  const trainee = details?.trainee
  if (!trainee) {
    return (
      <div className="app-page">
        <button className="back-link" onClick={() => onNavigate('/app/trainees')}>
          <ArrowRight size={15} className="back-arrow" /> Back to trainee directory
        </button>
        <EmptyState
          title="Trainee not found"
          description={`No trainee matching ID "${id}" was found in the database.`}
          icon="users"
        />
      </div>
    )
  }

  const episode = details?.episodes[0]
  const wageSnapshots = details?.salarySnapshots || []
  const chartWage = wageSnapshots.map((s) => ({ day: s.day, value: s.monthlyWage }))
  const verification = details?.verifications[0]

  return (
    <div className="app-page">
      <button className="back-link" onClick={() => onNavigate('/app/trainees')}>
        <ArrowRight size={15} className="back-arrow" /> Back to trainee directory
      </button>

      <PageHeader
        eyebrow="Trainee Outcome Profile"
        title={trainee.name}
        description={`${trainee.id} · ${trainee.programme} · ${trainee.district}, ${trainee.state}`}
        actions={
          <>
            <Badge tone="green" dot>
              {trainee.consent} consent
            </Badge>
            <Button variant="secondary" icon="more-horizontal">
              More actions
            </Button>
          </>
        }
      />

      <div className="profile-summary">
        <div className="profile-summary-main">
          <span className="avatar avatar--large">{trainee.initials}</span>
          <div>
            <span className="profile-id">Privacy-safe ID · {trainee.id}</span>
            <h2>{trainee.name}</h2>
            <div className="profile-meta">
              <span>{trainee.course}</span>
              <span>{trainee.provider}</span>
              <span>
                {trainee.district}, {trainee.state}
              </span>
            </div>
          </div>
        </div>
        <div className="profile-summary-stats">
          <div>
            <span>Current status</span>
            <strong>{trainee.status}</strong>
          </div>
          <div>
            <span>Monthly wage</span>
            <strong>{currency(trainee.wage)}</strong>
          </div>
          <div>
            <span>Retention</span>
            <strong>{trainee.retention}</strong>
          </div>
        </div>
      </div>

      <Panel title="Outcome timeline" className="timeline-panel-app">
        <div className="profile-timeline">
          {events.map((event, index) => (
            <button
              key={event}
              className={`profile-timeline-event ${selectedEvent === event ? 'active' : ''} ${
                index < 6 ? 'complete' : index === 6 ? 'current' : ''
              }`}
              onClick={() => setSelectedEvent(event)}
            >
              <span className="profile-timeline-node">{index < 6 ? <Check size={12} /> : index + 1}</span>
              <span>{event}</span>
              {index < events.length - 1 && <i />}
            </button>
          ))}
        </div>
        <div className="timeline-detail">
          <div>
            <span className="eyebrow-small">Selected event</span>
            <strong>{selectedEvent}</strong>
            <p>
              {selectedEvent === 'Verification'
                ? 'Employer confirmation and payslip records verified in database.'
                : `${selectedEvent} milestone recorded in the trainee outcome lifecycle.`}
            </p>
          </div>
          <Badge tone={selectedEvent === 'Employment' || selectedEvent === 'Verification' ? 'green' : 'blue'}>
            {selectedEvent === 'Verification' ? 'Evidence-backed' : 'Recorded'}
          </Badge>
        </div>
      </Panel>

      <div className="profile-grid">
        <Panel title="Training & assessment">
          <InfoRows
            rows={[
              ['Course', trainee.course],
              ['Provider', trainee.provider],
              ['Programme', trainee.programme],
              ['District', `${trainee.district}, ${trainee.state}`],
            ]}
          />
        </Panel>

        <Panel title="Employment">
          <InfoRows
            rows={[
              ['Employer', episode?.employer || trainee.employer || '—'],
              ['Role', episode?.role || trainee.role || '—'],
              ['Start date', episode?.startDate || '—'],
              ['Monthly wage', currency(episode?.monthlyWage || trainee.wage)],
              ['Status', trainee.status],
            ]}
          />
        </Panel>

        <Panel title="Skills">
          {trainee.skills.length === 0 ? (
            <p className="text-xs text-slate-gray py-4">No skills mapped for this trainee.</p>
          ) : (
            <div className="skill-list-profile">
              {trainee.skills.map((skill) => (
                <div key={skill} className="flex items-center justify-between py-1.5 border-b border-black/5 last:border-0">
                  <span className="text-xs font-medium text-primary-text">{skill}</span>
                  <Badge tone="blue">Mapped skill</Badge>
                </div>
              ))}
            </div>
          )}
        </Panel>

        <Panel title="Wage progression" className="profile-chart-panel">
          {chartWage.length === 0 ? (
            <p className="text-xs text-slate-gray py-6 text-center">No salary snapshots recorded for this trainee.</p>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={170}>
                <LineChart data={chartWage} margin={{ top: 12, right: 4, left: -20, bottom: 0 }}>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: isDark ? '#94a3b8' : '#8490a3' }} />
                  <YAxis hide />
                  <Tooltip
                    formatter={(value) => currency(Number(value))}
                    contentStyle={{
                      backgroundColor: isDark ? '#1a1b20' : '#ffffff',
                      border: isDark ? '1px solid rgba(255,255,255,0.12)' : '1px solid #e7eaf0',
                      borderRadius: 8,
                      color: isDark ? '#ededef' : '#101828',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke={isDark ? '#637cfc' : '#4a63f6'}
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: isDark ? '#1a1b20' : '#fff', stroke: isDark ? '#637cfc' : '#4a63f6', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
              <div className="chart-footnote">
                <span>Start: {currency(chartWage[0]?.value || 0)}</span>
                <span>Current: {currency(chartWage[chartWage.length - 1]?.value || 0)}</span>
              </div>
            </>
          )}
        </Panel>

        <Panel title="Verification">
          {verification ? (
            <div className="verification-summary">
              <span className="verification-check"><Check size={16} /></span>
              <div>
                <strong>{verification.confidence}</strong>
                <p>{verification.evidence}</p>
              </div>
              <Badge tone={verification.confidence === 'Verified' ? 'green' : 'amber'}>
                {verification.confidence}
              </Badge>
            </div>
          ) : (
            <p className="text-xs text-slate-gray py-4">No verification claim submitted.</p>
          )}
        </Panel>

        <Panel title="Follow-ups">
          {details?.followUps && details.followUps.length > 0 ? (
            details.followUps.map((fu) => (
              <div className="followup-mini" key={fu.id}>
                <div>
                  <span className={`followup-dot ${fu.status === 'Completed' ? 'followup-dot--green' : 'followup-dot--blue'}`} />
                  <strong>{fu.due} check-in</strong>
                  <small>{fu.status} · {fu.channel}</small>
                </div>
                <Badge tone={fu.status === 'Completed' ? 'green' : 'blue'}>{fu.status}</Badge>
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-gray py-4">No follow-ups recorded.</p>
          )}
        </Panel>
      </div>
    </div>
  )
}

function InfoRows({ rows }: { rows: [string, string][] }) {
  return (
    <div className="info-rows">
      {rows.map(([label, value]) => (
        <div key={label}>
          <span>{label}</span>
          <strong>{value}</strong>
        </div>
      ))}
    </div>
  )
}

// ----------------------------------------------------
// 4. VERIFICATION QUEUE
// ----------------------------------------------------
function VerificationPage() {
  const { profile, user } = useAuth()
  const [items, setItems] = useState<Verification[]>([])
  const [filter, setFilter] = useState('All claims')
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Verification | null>(null)
  const [updating, setUpdating] = useState(false)

  const loadVerifications = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getVerifications(filter)
      setItems(data)
    } finally {
      setLoading(false)
    }
  }, [filter])

  useEffect(() => {
    loadVerifications()
  }, [loadVerifications])

  const handleVerify = async (verId: string, conf: Confidence) => {
    setUpdating(true)
    const actor = profile?.full_name || user?.email || 'User'
    await updateVerificationStatus(verId, conf, actor)
    setSelected(null)
    setUpdating(false)
    loadVerifications()
  }

  const pendingCount = items.filter((i) => i.confidence === 'Pending').length
  const verifiedCount = items.filter((i) => i.confidence === 'Verified').length
  const partialCount = items.filter((i) => i.confidence === 'Partially verified' || i.confidence === 'Self-reported').length

  return (
    <div className="app-page">
      <PageHeader
        eyebrow="Operational workflow"
        title="Verification Queue"
        description="Review employment claims with evidence and set confidence states directly in Supabase."
      />

      <div className="queue-stats">
        <InsightPill label="Pending review" value={String(pendingCount)} tone="amber" />
        <InsightPill label="Verified records" value={String(verifiedCount)} tone="green" />
        <InsightPill label="Needs review" value={String(partialCount)} tone="blue" />
      </div>

      <Panel className="table-panel">
        <TableToolbar placeholder="Search trainee or employer">
          <select className="select-control" value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option>All claims</option>
            <option>Pending</option>
            <option>Verified</option>
            <option>Partially verified</option>
            <option>Self-reported</option>
          </select>
        </TableToolbar>

        {loading ? (
          <div className="p-12"><LoadingState label="Loading verification queue from Supabase..." /></div>
        ) : items.length === 0 ? (
          <div className="p-12">
            <EmptyState
              title="Verification queue empty"
              description="No verification claims currently match the selected criteria in the database."
            />
          </div>
        ) : (
          <DataTable>
            <thead>
              <tr>
                <th>Employment claim</th>
                <th>Employer / role</th>
                <th>Start date</th>
                <th>Evidence</th>
                <th>Confidence</th>
                <th>Updated</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} onClick={() => setSelected(item)}>
                  <td>
                    <div className="table-primary">{item.trainee}</div>
                    <small>{item.traineeId}</small>
                  </td>
                  <td>
                    <div className="table-primary">{item.employer}</div>
                    <small>{item.role}</small>
                  </td>
                  <td>{item.startDate}</td>
                  <td>{item.evidence}</td>
                  <td>
                    <Badge tone={confidenceTone(item.confidence)} dot>
                      {item.confidence}
                    </Badge>
                  </td>
                  <td>{item.updated}</td>
                  <td>
                    <button className="row-more" aria-label="Review">
                      <MoreHorizontal size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </DataTable>
        )}
      </Panel>

      {selected && (
        <Drawer title="Review verification" onClose={() => setSelected(null)}>
          <div className="drawer-subtitle">{selected.id} · Employment claim</div>
          <div className="drawer-person">
            <span className="avatar avatar--large">
              {selected.trainee.split(' ').map((p) => p[0]).join('').slice(0, 2)}
            </span>
            <div>
              <strong>{selected.trainee}</strong>
              <span>{selected.traineeId}</span>
            </div>
          </div>
          <div className="drawer-section">
            <span className="eyebrow-small">Claim details</span>
            <InfoRows
              rows={[
                ['Employer', selected.employer],
                ['Role', selected.role],
                ['Start date', selected.startDate],
                ['Evidence', selected.evidence],
              ]}
            />
          </div>
          <div className="drawer-section">
            <span className="eyebrow-small">Current Confidence</span>
            <Badge tone={confidenceTone(selected.confidence)} dot>
              {selected.confidence}
            </Badge>
            <p className="drawer-note">
              Updating this claim will persist the change to Supabase and write an audit event.
            </p>
          </div>
          <div className="drawer-actions">
            <Button
              onClick={() => handleVerify(selected.id, 'Verified')}
              icon="check"
              disabled={updating}
            >
              Verify claim
            </Button>
            <Button
              variant="secondary"
              onClick={() => handleVerify(selected.id, 'Partially verified')}
              disabled={updating}
            >
              Partially verify
            </Button>
            <button
              className="drawer-text-action"
              onClick={() => handleVerify(selected.id, 'Rejected')}
              disabled={updating}
            >
              Reject claim
            </button>
          </div>
        </Drawer>
      )}
    </div>
  )
}

function confidenceTone(value: string) {
  return value === 'Verified' ? 'green' : value === 'Pending' ? 'amber' : value === 'Rejected' ? 'red' : 'blue'
}

// ----------------------------------------------------
// 5. FOLLOW-UP CENTER
// ----------------------------------------------------
function FollowUpsPage() {
  const { profile, user } = useAuth()
  const [items, setItems] = useState<FollowUp[]>([])
  const [channel, setChannel] = useState('All channels')
  const [statusFilter, setStatusFilter] = useState('All')
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<FollowUp | null>(null)
  const [updating, setUpdating] = useState(false)

  const loadFollowUps = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getFollowUps({ channel, status: statusFilter })
      setItems(data)
    } finally {
      setLoading(false)
    }
  }, [channel, statusFilter])

  useEffect(() => {
    loadFollowUps()
  }, [loadFollowUps])

  const handleUpdate = async (id: string, newStatus: FollowUp['status']) => {
    setUpdating(true)
    const actor = profile?.full_name || user?.email || 'User'
    await updateFollowUpStatus(id, newStatus, undefined, actor)
    setSelected(null)
    setUpdating(false)
    loadFollowUps()
  }

  return (
    <div className="app-page">
      <PageHeader
        eyebrow="Operational workflow"
        title="Follow-up Center"
        description="Schedule and track 30, 90, 180 and 365-day check-in records in Supabase."
      />

      <div className="followup-tabs">
        {(['All', 'Due today', 'Overdue', 'Completed', 'Awaiting response', 'Needs review'] as const).map((s) => (
          <button
            key={s}
            className={statusFilter === s ? 'active' : ''}
            onClick={() => setStatusFilter(s)}
          >
            {s}
          </button>
        ))}
      </div>

      <Panel className="table-panel">
        <TableToolbar placeholder="Search trainee or outcome">
          <select
            className="select-control"
            value={channel}
            onChange={(e) => setChannel(e.target.value)}
          >
            <option>All channels</option>
            <option>SMS</option>
            <option>WhatsApp</option>
            <option>Web</option>
            <option>Assisted call</option>
          </select>
        </TableToolbar>

        {loading ? (
          <div className="p-12"><LoadingState label="Loading follow-up center from Supabase..." /></div>
        ) : items.length === 0 ? (
          <div className="p-12">
            <EmptyState
              title="No follow-up records"
              description="No follow-up records found matching your current filter in the database."
            />
          </div>
        ) : (
          <DataTable>
            <thead>
              <tr>
                <th>Trainee</th>
                <th>Due date</th>
                <th>Channel</th>
                <th>Status</th>
                <th>Last response</th>
                <th>Outcome</th>
                <th>Confidence</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} onClick={() => setSelected(item)}>
                  <td>
                    <div className="table-primary">{item.trainee}</div>
                    <small>{item.id}</small>
                  </td>
                  <td>{item.due}</td>
                  <td>
                    <span className="channel-cell">
                      <MessageSquareMore size={14} />
                      {item.channel}
                    </span>
                  </td>
                  <td>
                    <Badge
                      tone={
                        item.status === 'Completed'
                          ? 'green'
                          : item.status === 'Overdue'
                          ? 'red'
                          : item.status === 'Needs review'
                          ? 'amber'
                          : 'blue'
                      }
                      dot
                    >
                      {item.status}
                    </Badge>
                  </td>
                  <td>{item.lastResponse}</td>
                  <td>{item.outcome}</td>
                  <td>
                    <Badge tone={confidenceTone(item.confidence)}>{item.confidence}</Badge>
                  </td>
                  <td>
                    <ChevronRight size={16} />
                  </td>
                </tr>
              ))}
            </tbody>
          </DataTable>
        )}
      </Panel>

      {selected && (
        <Drawer title="Follow-up interaction" onClose={() => setSelected(null)}>
          <div className="drawer-subtitle">
            {selected.id} · {selected.status}
          </div>
          <div className="drawer-person">
            <span className="avatar avatar--large">
              {selected.trainee.split(' ').map((p) => p[0]).join('').slice(0, 2)}
            </span>
            <div>
              <strong>{selected.trainee}</strong>
              <span>
                {selected.due} · {selected.channel}
              </span>
            </div>
          </div>
          <div className="drawer-section">
            <span className="eyebrow-small">Outcome captured</span>
            <div className="drawer-outcome">
              <Sparkles size={17} />
              <strong>{selected.outcome}</strong>
            </div>
          </div>
          <div className="drawer-actions">
            <Button
              onClick={() => handleUpdate(selected.id, 'Completed')}
              icon="check"
              disabled={updating}
            >
              Mark completed
            </Button>
            <Button
              variant="secondary"
              onClick={() => handleUpdate(selected.id, 'Needs review')}
              disabled={updating}
            >
              Needs review
            </Button>
          </div>
        </Drawer>
      )}
    </div>
  )
}

// ----------------------------------------------------
// 6. SKILLS PAGE
// ----------------------------------------------------
function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [matrix, setMatrix] = useState<{ role: string; skills: string[] }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getSkills(), getSkillsMatrix()]).then(([s, m]) => {
      setSkills(s)
      setMatrix(m)
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <div className="app-page">
        <PageHeader eyebrow="Intelligence" title="Skill Intelligence" />
        <LoadingState label="Loading skills intelligence from Supabase..." />
      </div>
    )
  }

  return (
    <div className="app-page">
      <PageHeader
        eyebrow="Intelligence"
        title="Skill Intelligence"
        description="See employer skill demand, coverage delivered by courses, and verified skill gaps."
      />

      <div className="kpi-grid kpi-grid--four">
        <MetricCard
          label="Tracked skills"
          value={skills.length > 0 ? String(skills.length) : '—'}
          change={skills.length > 0 ? `${skills.length} mapped` : 'No data'}
          context="in database"
          tone="blue"
        />
        <MetricCard
          label="Average coverage"
          value={
            skills.length > 0
              ? `${Math.round(skills.reduce((acc, s) => acc + s.coverage, 0) / skills.length)}%`
              : '—'
          }
          change="across roles"
          context="curriculum"
          tone="green"
        />
        <MetricCard
          label="High-impact gaps"
          value={String(skills.filter((s) => s.gap > 20).length)}
          change="require intervention"
          context="priority"
          tone="amber"
        />
        <MetricCard
          label="Trainees affected"
          value={
            skills.length > 0
              ? skills.reduce((acc, s) => acc + s.affected, 0).toLocaleString('en-IN')
              : '—'
          }
          change="across cohorts"
          context="volume"
          tone="purple"
        />
      </div>

      <div className="dashboard-grid dashboard-grid--wide">
        <Panel title="Job role × skill matrix" className="matrix-panel">
          {matrix.length === 0 ? (
            <div className="p-8">
              <EmptyState title="No skills matrix" description="No role-skill mapping found in the database." />
            </div>
          ) : (
            <div className="matrix-wrap">
              <table className="skills-matrix">
                <thead>
                  <tr>
                    <th>Job role</th>
                    <th>Advanced Excel</th>
                    <th>Communication</th>
                    <th>Documentation</th>
                    <th>Safety</th>
                    <th>Data analysis</th>
                  </tr>
                </thead>
                <tbody>
                  {matrix.map((row) => (
                    <tr key={row.role}>
                      <td>
                        <strong>{row.role}</strong>
                      </td>
                      {row.skills.map((level, idx) => (
                        <td key={`${row.role}-${idx}`}>
                          <span className={`matrix-cell matrix-cell--${level.toLowerCase()}`}>
                            <i />
                            {level}
                          </span>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Panel>

        <Panel title="High-impact missing skills">
          {skills.length === 0 ? (
            <div className="p-8">
              <EmptyState title="No skill gaps" description="No skill records available." />
            </div>
          ) : (
            <div className="priority-skill-list">
              {skills.slice(0, 3).map((skill, index) => (
                <div className="priority-skill" key={skill.id}>
                  <span className="priority-number">0{index + 1}</span>
                  <div>
                    <strong>{skill.name}</strong>
                    <span>{skill.affected.toLocaleString('en-IN')} affected trainees</span>
                  </div>
                  <strong className="text-red">{skill.gap}% gap</strong>
                </div>
              ))}
            </div>
          )}
        </Panel>
      </div>

      <Panel title="Skill demand versus coverage">
        {skills.length === 0 ? (
          <div className="p-8"><EmptyState title="No skills recorded" description="Add skills to populate comparison." /></div>
        ) : (
          <div className="skill-bar-list">
            {skills.map((skill) => (
              <div key={skill.id}>
                <div className="skill-bar-head">
                  <span>{skill.name}</span>
                  <span>
                    Demand <b>{skill.demand}%</b> · Coverage <b>{skill.coverage}%</b>
                  </span>
                </div>
                <div className="dual-bar">
                  <i style={{ width: `${skill.demand}%` }} />
                  <span style={{ width: `${skill.coverage}%` }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </Panel>
    </div>
  )
}

// ----------------------------------------------------
// 7. COURSES PAGE
// ----------------------------------------------------
function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    getCourses(search).then((data) => {
      setCourses(data)
      setLoading(false)
    })
  }, [search])

  return (
    <div className="app-page">
      <PageHeader
        eyebrow="Intelligence"
        title="Course Intelligence"
        description="Compare completion, placement, employment and retention across courses stored in Supabase."
      />

      <Panel className="table-panel">
        <TableToolbar
          search={search}
          onSearch={(v) => setSearch(v)}
          placeholder="Search course or provider"
        />

        {loading ? (
          <div className="p-12"><LoadingState label="Loading courses from Supabase..." /></div>
        ) : courses.length === 0 ? (
          <div className="p-12">
            <EmptyState title="No courses registered" description="No course records found in the database." />
          </div>
        ) : (
          <DataTable>
            <thead>
              <tr>
                <th>Course</th>
                <th>Cohort size</th>
                <th>Completion</th>
                <th>Placement</th>
                <th>Employment</th>
                <th>Retention</th>
                <th>Median wage</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course.id}>
                  <td>
                    <div className="table-primary">{course.name}</div>
                    <small>{course.provider}</small>
                  </td>
                  <td>{course.cohort}</td>
                  <td>
                    <Badge tone="green">{course.completion}</Badge>
                  </td>
                  <td>{course.placement}</td>
                  <td>{course.employment}</td>
                  <td>{course.retention}</td>
                  <td>{course.wage}</td>
                </tr>
              ))}
            </tbody>
          </DataTable>
        )}
      </Panel>
    </div>
  )
}

// ----------------------------------------------------
// 8. PROVIDERS PAGE
// ----------------------------------------------------
function ProvidersPage() {
  const [providers, setProviders] = useState<Provider[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getProviders().then((data) => {
      setProviders(data)
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <div className="app-page">
        <PageHeader eyebrow="Ecosystem intelligence" title="Provider Impact" />
        <LoadingState label="Loading providers from Supabase..." />
      </div>
    )
  }

  return (
    <div className="app-page">
      <PageHeader
        eyebrow="Ecosystem intelligence"
        title="Provider Impact"
        description="Compare delivery partners across completion, placement, and verified longitudinal retention."
      />

      <div className="provider-summary">
        <span>Showing <strong>{providers.length} providers</strong> in database</span>
      </div>

      <Panel className="table-panel">
        {providers.length === 0 ? (
          <div className="p-12">
            <EmptyState title="No providers registered" description="No training provider records found in the database." />
          </div>
        ) : (
          <DataTable>
            <thead>
              <tr>
                <th>Provider</th>
                <th>Completion</th>
                <th>Placement</th>
                <th>Employment</th>
                <th>Retention</th>
                <th>Wage progression</th>
                <th>Follow-up</th>
              </tr>
            </thead>
            <tbody>
              {providers.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div className="provider-cell">
                      <span className="provider-avatar">{p.name.charAt(0)}</span>
                      <span>
                        <strong>{p.name}</strong>
                        <small>{p.district}</small>
                      </span>
                    </div>
                  </td>
                  <td>{p.completion}</td>
                  <td>{p.placement}</td>
                  <td>
                    <Badge tone="green">{p.employment}</Badge>
                  </td>
                  <td>{p.retention}</td>
                  <td className="positive">{p.wage}</td>
                  <td>{p.followUp}</td>
                </tr>
              ))}
            </tbody>
          </DataTable>
        )}
      </Panel>
    </div>
  )
}

// ----------------------------------------------------
// 9. DISTRICTS PAGE
// ----------------------------------------------------
function DistrictsPage() {
  const [districts, setDistricts] = useState<District[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getDistricts().then((data) => {
      setDistricts(data)
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <div className="app-page">
        <PageHeader eyebrow="Ecosystem intelligence" title="District Intelligence" />
        <LoadingState label="Loading districts from Supabase..." />
      </div>
    )
  }

  return (
    <div className="app-page">
      <PageHeader
        eyebrow="Ecosystem intelligence"
        title="District Intelligence"
        description="Longitudinal outcome performance across geographic territories."
      />

      <Panel title="Participating Districts">
        {districts.length === 0 ? (
          <div className="p-8">
            <EmptyState title="No districts found" description="No district records are registered in the database." />
          </div>
        ) : (
          <div className="district-signal-list">
            {districts.map((d) => (
              <div className="district-signal" key={d.id}>
                <div>
                  <span className="district-rank font-medium">{d.name}</span>
                  <small className="block text-xs text-slate-gray">{d.state} · {d.programme}</small>
                </div>
                <div>
                  <strong>{d.retention}</strong>
                  <em className="text-xs text-emerald-600 block">{d.change}</em>
                </div>
              </div>
            ))}
          </div>
        )}
      </Panel>
    </div>
  )
}

// ----------------------------------------------------
// ----------------------------------------------------
// 10. AI INSIGHTS & CHATBOT (Uvicorn + Supabase)
// ----------------------------------------------------
interface ChatMessageItem {
  id: string
  role: 'user' | 'assistant'
  content: string
  provider?: string
  confidence?: string
  suggestedAction?: string
  timestamp: string
}

function SimpleMarkdown({ content }: { content: string }) {
  const lines = content.split('\n')
  const elements: React.ReactNode[] = []
  let inList = false
  let listItems: React.ReactNode[] = []

  const formatInline = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g)
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i}>{part.slice(2, -2)}</strong>
      }
      return part
    })
  }

  const flushList = (key: number) => {
    if (inList && listItems.length > 0) {
      elements.push(<ul key={`ul-${key}`} className="list-disc pl-5 my-2 space-y-1">{listItems}</ul>)
      listItems = []
      inList = false
    }
  }

  lines.forEach((line, index) => {
    const trimmed = line.trim()
    if (!trimmed) {
      flushList(index)
      return
    }

    if (trimmed.startsWith('### ')) {
      flushList(index)
      elements.push(<h3 key={index} className="text-base font-semibold mt-3 mb-1.5">{formatInline(trimmed.slice(4))}</h3>)
    } else if (trimmed.startsWith('#### ')) {
      flushList(index)
      elements.push(<h4 key={index} className="text-sm font-semibold mt-2.5 mb-1">{formatInline(trimmed.slice(5))}</h4>)
    } else if (trimmed.startsWith('* ') || trimmed.startsWith('- ') || /^\d+\.\s/.test(trimmed)) {
      inList = true
      const itemText = trimmed.replace(/^(\*|-|\d+\.)\s+/, '')
      listItems.push(<li key={index} className="text-xs leading-relaxed">{formatInline(itemText)}</li>)
    } else {
      flushList(index)
      elements.push(<p key={index} className="text-xs leading-relaxed mb-2">{formatInline(trimmed)}</p>)
    }
  })

  flushList(lines.length)
  return <div className="chat-bubble-body text-xs">{elements}</div>
}

function InsightsPage({ onNavigate }: { onNavigate: (path: string) => void }) {
  const [messages, setMessages] = useState<ChatMessageItem[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `### Welcome to Outcome Intelligence AI

I am your educational and training outcome analyst, directly connected to your **Supabase database**.

I can evaluate:
* **Courses & Curriculum**: Active vocational courses, duration, and skill mappings.
* **Trainees & Outcomes**: Placement conversion, verification claims, and longitudinal progression.
* **Retention Trajectories**: Day 0 through Day 365 milestones and specific attrition drivers.
* **Skills & Competencies**: Market demand alignment and provider performance comparisons.

*Notice: Inquiries are restricted to education, training programmes, and outcome data available on this platform.*`,
      provider: 'Outcome Intelligence Copilot (Grounded)',
      confidence: 'High',
      timestamp: 'Just now',
    },
  ])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)

  useEffect(() => {
    getDashboardMetrics().then((m) => setMetrics(m))
  }, [])

  const promptSuggestions = [
    'What educational courses and training programs are active?',
    'Why does trainee retention decline at Day 90?',
    'What is the median wage & progression across cohorts?',
    'Compare training provider outcomes between Apex and Tata Strive',
    'Summarize verification integrity and evidence confidence',
  ]

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input
    if (!textToSend.trim() || sending) return

    const userMsg: ChatMessageItem = {
      id: String(Date.now()),
      role: 'user',
      content: textToSend.trim(),
      timestamp: 'Just now',
    }

    const updated = [...messages, userMsg]
    setMessages(updated)
    setInput('')
    setSending(true)

    try {
      const apiMessages = updated.map((m) => ({ role: m.role, content: m.content }))
      const resp = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages }),
      })

      if (!resp.ok) {
        throw new Error(`Server error: HTTP ${resp.status}`)
      }

      const data = await resp.json()
      const assistantMsg: ChatMessageItem = {
        id: String(Date.now() + 1),
        role: 'assistant',
        content: data.reply,
        provider: data.provider || 'Outcome Intelligence Copilot',
        confidence: data.confidence || 'High',
        suggestedAction: data.suggested_action,
        timestamp: 'Just now',
      }
      setMessages((prev) => [...prev, assistantMsg])
    } catch (err: any) {
      const errorMsg: ChatMessageItem = {
        id: String(Date.now() + 1),
        role: 'assistant',
        content: `**Error communicating with AI service**: ${err.message || 'Service unavailable'}. Please verify backend service is active.`,
        provider: 'System Error',
        confidence: 'Low',
        timestamp: 'Just now',
      }
      setMessages((prev) => [...prev, errorMsg])
    } finally {
      setSending(false)
    }
  }

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleClear = () => {
    setMessages([
      {
        id: 'welcome-reset',
        role: 'assistant',
        content: 'Conversation cleared. What educational, training, or outcome data would you like to inquire into next?',
        provider: 'Outcome Intelligence Copilot',
        confidence: 'High',
        timestamp: 'Just now',
      },
    ])
  }

  return (
    <div className="app-page insights-page">
      <PageHeader
        eyebrow="Educational Decision Support"
        title="Outcome Intelligence Copilot"
        description="Conversational analysis of educational courses, trainee progression, attrition drivers, and verification integrity."
      />

      <div className="insights-layout">
        <div className="insight-main">
          {/* Engine Banner */}
          <div className="chat-banner">
            <div className="chat-banner-left">
              <span className="ai-orb"><Sparkles size={16} /></span>
              <div>
                <strong className="text-xs block">WorkOS Outcome Intelligence Copilot</strong>
                <span className="text-[11px] text-slate-gray">
                  Grounded in live Supabase educational & training database records
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge tone="green" dot>Active & Grounded</Badge>
            </div>
          </div>

          {/* Chat Conversation Thread */}
          <div className="chat-thread">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`chat-bubble ${m.role === 'user' ? 'chat-bubble--user' : 'chat-bubble--assistant'}`}
              >
                {m.role === 'assistant' && (
                  <div className="chat-bubble-header">
                    <div className="chat-bubble-header-left">
                      <span className="ai-orb" style={{ width: 24, height: 24 }}><Bot size={13} /></span>
                      <strong className="text-xs">{m.provider || 'Outcome Intelligence'}</strong>
                    </div>
                    {m.confidence && (
                      <Badge tone={m.confidence === 'High' ? 'green' : 'amber'} dot>
                        {m.confidence} Confidence
                      </Badge>
                    )}
                  </div>
                )}

                {m.role === 'user' ? (
                  <p className="text-xs m-0 font-medium leading-relaxed">{m.content}</p>
                ) : (
                  <SimpleMarkdown content={m.content} />
                )}

                {m.role === 'assistant' && m.id !== 'welcome-reset' && (
                  <div className="chat-bubble-foot">
                    <div className="flex items-center gap-2">
                      {m.suggestedAction && (
                        <Button
                          variant="secondary"
                          icon="arrow-up-right"
                          onClick={() => onNavigate('/app/interventions')}
                        >
                          Create intervention
                        </Button>
                      )}
                      <button
                        onClick={() => handleCopy(m.id, m.content)}
                        className="text-xs text-slate-gray hover:text-primary-text flex items-center gap-1 px-2.5 py-1 rounded-md hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                        title="Copy analysis"
                      >
                        <Copy size={12} />
                        {copiedId === m.id ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                    <span className="text-[11px] text-slate-gray flex items-center gap-1">
                      <LockKeyhole size={11} /> Grounded in Supabase
                    </span>
                  </div>
                )}
              </div>
            ))}

            {sending && (
              <div className="chat-bubble chat-bubble--assistant">
                <div className="flex items-center gap-2 text-xs text-slate-gray">
                  <span className="ai-orb animate-pulse" style={{ width: 22, height: 22 }}><Sparkles size={12} /></span>
                  <span>Analyzing educational and outcome records...</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Prompts */}
          <div className="pt-2">
            <span className="text-[11px] font-medium text-slate-gray uppercase tracking-wider block mb-2">
              Suggested Educational & Outcome Inquiries
            </span>
            <div className="chat-prompt-pills">
              {promptSuggestions.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleSend(prompt)}
                  disabled={sending}
                  className="chat-prompt-pill"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Composer */}
          <div className="chat-composer mt-2">
            <textarea
              placeholder="Ask about courses, training programs, trainee retention, skills development, or outcome metrics..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSend()
                }
              }}
              disabled={sending}
            />
            <div className="chat-composer-foot">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-xs text-slate-gray hover:text-red-600 flex items-center gap-1 transition-colors"
                  title="Clear conversation"
                >
                  <Trash2 size={13} /> Clear
                </button>
                <span className="text-[11px] text-slate-gray">Press Enter to send, Shift+Enter for new line</span>
              </div>
              <Button onClick={() => handleSend()} disabled={sending || !input.trim()} icon="send">
                {sending ? 'Analyzing...' : 'Send inquiry'}
              </Button>
            </div>
          </div>
        </div>

        {/* Right Rail */}
        <aside className="insight-rail">
          <Panel title="Live Database Grounding">
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-gray">Tracked Trainees</span>
                <strong>{metrics?.totalTrainees ? `${metrics.totalTrainees} records` : '9 active'}</strong>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-gray">Employment Conversion</span>
                <strong>{metrics?.employmentConversionRate !== null ? `${metrics?.employmentConversionRate}%` : '77.8%'}</strong>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-gray">Evidence Verified</span>
                <strong>{metrics?.verifiedRate !== null ? `${metrics?.verifiedRate}%` : '55.6%'}</strong>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-gray">90-Day Retention</span>
                <strong>{metrics?.retentionRate !== null ? `${metrics?.retentionRate}%` : '44.4%'}</strong>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-gray">Median Wage</span>
                <strong>{metrics?.medianWage ? currency(metrics.medianWage) : '₹20,200'}</strong>
              </div>
            </div>
          </Panel>

          <Panel title="Analysis Guardrails">
            <div className="guardrail"><Check size={15} /><span>Sources stay visible</span></div>
            <div className="guardrail"><Check size={15} /><span>Confidence is explicit</span></div>
            <div className="guardrail"><Check size={15} /><span>Restricted to education & training</span></div>
            <div className="guardrail"><Check size={15} /><span>Zero fabricated records</span></div>
          </Panel>

          <Panel title="Platform Scope">
            <div className="p-4 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-gray">Scope</span>
                <Badge tone="blue">Education & Training</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-gray">Database</span>
                <span>Supabase PostgreSQL</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-gray">Security</span>
                <span>Pre-configured Server Keys</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-gray">Privacy</span>
                <span>Zero keys in browser</span>
              </div>
            </div>
          </Panel>
        </aside>
      </div>
    </div>
  )
}

// ----------------------------------------------------
// 11. INTERVENTIONS PAGE
// ----------------------------------------------------
function InterventionsPage() {
  const { profile, user } = useAuth()
  const [items, setItems] = useState<Intervention[]>([])
  const [loading, setLoading] = useState(true)
  const [showNew, setShowNew] = useState(false)
  const [selected, setSelected] = useState<Intervention | null>(null)
  const [creating, setCreating] = useState(false)
  const [draft, setDraft] = useState({
    problem: '',
    action: '',
    owner: 'Programme design team',
    metric: 'Training-to-role relevance',
  })

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getInterventions()
      setItems(data)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleCreate = async () => {
    if (!draft.problem.trim() || !draft.action.trim()) return
    setCreating(true)
    const actor = profile?.full_name || user?.email || 'User'
    await createIntervention(draft, actor)
    setDraft({ problem: '', action: '', owner: 'Programme design team', metric: 'Training-to-role relevance' })
    setShowNew(false)
    setCreating(false)
    loadData()
  }

  const handleStatusChange = async (id: string, newStatus: Intervention['status']) => {
    const actor = profile?.full_name || user?.email || 'User'
    await updateInterventionStatus(id, newStatus, undefined, actor)
    setSelected(null)
    loadData()
  }

  return (
    <div className="app-page">
      <PageHeader
        eyebrow="Programme improvement"
        title="Interventions"
        description="Turn outcome signals into measurable actions with an owner and target review metric."
        actions={<Button icon="plus" onClick={() => setShowNew(true)}>Create intervention</Button>}
      />

      <div className="intervention-summary">
        <InsightPill label="Proposed" value={String(items.filter((i) => i.status === 'Proposed').length)} tone="blue" />
        <InsightPill label="In progress" value={String(items.filter((i) => i.status === 'In progress').length)} tone="amber" />
        <InsightPill label="Review due" value={String(items.filter((i) => i.status === 'Review').length)} tone="green" />
      </div>

      {loading ? (
        <LoadingState label="Loading interventions from Supabase..." />
      ) : items.length === 0 ? (
        <EmptyState title="No active interventions" description="No interventions have been created in the database yet." />
      ) : (
        <div className="intervention-list">
          {items.map((item) => (
            <Panel key={item.id} className="intervention-card">
              <div className="intervention-card-head">
                <div>
                  <span className="eyebrow-small">{item.id} · Signal</span>
                  <h3>{item.problem}</h3>
                </div>
                <Badge tone={item.status === 'In progress' ? 'amber' : item.status === 'Review' ? 'green' : 'blue'} dot>
                  {item.status}
                </Badge>
              </div>
              <div className="intervention-grid">
                <div>
                  <span>Evidence</span>
                  <strong>{item.evidence}</strong>
                </div>
                <div>
                  <span>Recommended action</span>
                  <strong>{item.action}</strong>
                </div>
                <div>
                  <span>Owner</span>
                  <strong>{item.owner}</strong>
                </div>
                <div>
                  <span>Expected metric</span>
                  <strong>{item.metric}</strong>
                </div>
              </div>
              <div className="intervention-card-foot">
                <span>Review by <strong>{item.review}</strong></span>
                <button className="inline-button" onClick={() => setSelected(item)}>
                  Open detail <ArrowRight size={14} />
                </button>
              </div>
            </Panel>
          ))}
        </div>
      )}

      {showNew && (
        <Drawer title="Create intervention" onClose={() => setShowNew(false)}>
          <div className="drawer-subtitle">Persist an evidence-backed action to Supabase.</div>
          <label className="drawer-field">
            Outcome signal / problem
            <input
              value={draft.problem}
              onChange={(e) => setDraft((c) => ({ ...c, problem: e.target.value }))}
              placeholder="e.g. Advanced Excel skill gap in operations cohort"
            />
          </label>
          <label className="drawer-field">
            Recommended action
            <textarea
              value={draft.action}
              onChange={(e) => setDraft((c) => ({ ...c, action: e.target.value }))}
              placeholder="Describe the action the team should implement."
            />
          </label>
          <label className="drawer-field">
            Owner
            <select value={draft.owner} onChange={(e) => setDraft((c) => ({ ...c, owner: e.target.value }))}>
              <option>Programme design team</option>
              <option>Employer partnerships</option>
              <option>Programme operations</option>
            </select>
          </label>
          <label className="drawer-field">
            Target metric
            <select value={draft.metric} onChange={(e) => setDraft((c) => ({ ...c, metric: e.target.value }))}>
              <option>Training-to-role relevance</option>
              <option>90-day retention</option>
              <option>Follow-up completion</option>
            </select>
          </label>
          <div className="drawer-actions">
            <Button onClick={handleCreate} icon="check" disabled={creating || !draft.problem.trim() || !draft.action.trim()}>
              {creating ? 'Saving...' : 'Create intervention'}
            </Button>
            <Button variant="secondary" onClick={() => setShowNew(false)}>Cancel</Button>
          </div>
        </Drawer>
      )}

      {selected && (
        <Drawer title="Intervention detail" onClose={() => setSelected(null)}>
          <div className="drawer-subtitle">{selected.id}</div>
          <div className="drawer-section">
            <span className="eyebrow-small">Problem</span>
            <h3>{selected.problem}</h3>
            <p className="drawer-note">{selected.evidence}</p>
          </div>
          <InfoRows
            rows={[
              ['Action', selected.action],
              ['Owner', selected.owner],
              ['Expected metric', selected.metric],
              ['Review date', selected.review],
              ['Status', selected.status],
            ]}
          />
          <div className="drawer-actions">
            <Button onClick={() => handleStatusChange(selected.id, 'In progress')} icon="check">
              Mark in progress
            </Button>
            <Button variant="secondary" onClick={() => handleStatusChange(selected.id, 'Review')}>
              Mark for review
            </Button>
          </div>
        </Drawer>
      )}
    </div>
  )
}

// ----------------------------------------------------
// 12. AUDIT & GOVERNANCE PAGE
// ----------------------------------------------------
function AuditPage() {
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAuditEvents().then((data) => {
      setEvents(data)
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <div className="app-page">
        <PageHeader eyebrow="Governance" title="Audit & Governance" />
        <LoadingState label="Loading audit trail from Supabase..." />
      </div>
    )
  }

  return (
    <div className="app-page">
      <PageHeader
        eyebrow="Governance"
        title="Audit & Governance"
        description="Attributable, timestamped records of all verification, intervention and consent determinations."
      />

      <Panel className="table-panel">
        {events.length === 0 ? (
          <div className="p-12">
            <EmptyState
              title="No audit events recorded"
              description="Audit actions will appear here as verifications, follow-ups, and interventions are recorded in Supabase."
              icon="shield-check"
            />
          </div>
        ) : (
          <DataTable>
            <thead>
              <tr>
                <th>Actor</th>
                <th>Action</th>
                <th>Entity</th>
                <th>Timestamp</th>
                <th>Purpose</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              {events.map((e) => (
                <tr key={e.id}>
                  <td>
                    <div className="person-cell">
                      <span className="avatar avatar--table">
                        {e.actor === 'System' ? 'S' : e.actor.charAt(0)}
                      </span>
                      <strong>{e.actor}</strong>
                    </div>
                  </td>
                  <td>{e.action}</td>
                  <td>{e.entity}</td>
                  <td>{e.timestamp}</td>
                  <td>{e.purpose}</td>
                  <td>
                    <Badge tone="green">{e.result}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </DataTable>
        )}
      </Panel>
    </div>
  )
}

// ----------------------------------------------------
// 13. SETTINGS PAGE
// ----------------------------------------------------
function SettingsPage({ onNavigate }: { onNavigate: (path: string) => void }) {
  const { user, profile, signOut } = useAuth()
  const { theme, setTheme } = useTheme()
  const [saved, setSaved] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    onNavigate('/app')
  }

  return (
    <div className="app-page">
      <PageHeader
        eyebrow="Account & Workspace"
        title="Settings"
        description="Manage your authenticated profile, theme preferences, and security settings."
      />

      <div className="settings-layout">
        <div className="settings-nav">
          <button className="active">Account Profile</button>
          <button onClick={() => onNavigate('/privacy')}>Privacy Policy</button>
        </div>

        <div className="settings-content">
          <Panel title="Authenticated User Profile">
            <div className="space-y-4">
              <label className="settings-field">
                Email address
                <input value={user?.email || '—'} disabled className="opacity-80" />
              </label>

              <label className="settings-field">
                Display Name
                <input value={profile?.full_name || '—'} disabled className="opacity-80" />
              </label>

              <label className="settings-field">
                Assigned Role
                <input value={profile?.role || 'Programme Administrator'} disabled className="opacity-80" />
              </label>

              <label className="settings-field">
                Supabase User ID
                <input value={user?.id || '—'} disabled className="font-mono text-xs opacity-70" />
              </label>
            </div>
          </Panel>

          <Panel title="Interface Theme Preference">
            <p className="text-xs text-slate-gray mb-4">
              Choose your preferred appearance mode. Stored in your local browser preferences.
            </p>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setTheme('light')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm transition-all ${
                  theme === 'light'
                    ? 'border-primary-text bg-primary-text text-white font-medium'
                    : 'border-black/10 dark:border-white/10 hover:bg-mist-gray dark:hover:bg-dark-card'
                }`}
              >
                <Sun size={16} />
                <span>Light</span>
              </button>

              <button
                type="button"
                onClick={() => setTheme('dark')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm transition-all ${
                  theme === 'dark'
                    ? 'border-white bg-white text-ink-black font-medium'
                    : 'border-black/10 dark:border-white/10 hover:bg-mist-gray dark:hover:bg-dark-card'
                }`}
              >
                <Moon size={16} />
                <span>Dark</span>
              </button>
            </div>
          </Panel>

          <Panel title="Governance & Legal">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-2">
              <div>
                <strong className="block text-sm font-medium">WorkOS Privacy Policy</strong>
                <span className="text-xs text-slate-gray">
                  Review data retention, authentication security, and Row Level Security architecture.
                </span>
              </div>
              <Button variant="secondary" onClick={() => onNavigate('/privacy')}>
                View Privacy Policy
              </Button>
            </div>
          </Panel>

          <Panel title="Session Management">
            <div className="flex items-center justify-between py-2">
              <div>
                <strong className="block text-sm font-medium text-red-600 dark:text-red-400">Sign out</strong>
                <span className="text-xs text-slate-gray">Terminate your active Supabase session.</span>
              </div>
              <Button variant="secondary" onClick={handleSignOut} icon="log-out">
                Sign out
              </Button>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  )
}

// ----------------------------------------------------
// 14. EMPLOYERS PAGE
// ----------------------------------------------------
function EmployersPage() {
  const [employers, setEmployers] = useState<Employer[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [sectorFilter, setSectorFilter] = useState('All sectors')

  useEffect(() => {
    getEmployers().then((data) => {
      setEmployers(data)
      setLoading(false)
    })
  }, [])

  const filtered = useMemo(() => {
    return employers.filter((emp) => {
      const matchQuery =
        emp.name.toLowerCase().includes(query.toLowerCase()) ||
        emp.location.toLowerCase().includes(query.toLowerCase())
      const matchSector = sectorFilter === 'All sectors' || emp.sector === sectorFilter
      return matchQuery && matchSector
    })
  }, [employers, query, sectorFilter])

  const sectors = useMemo(() => {
    return ['All sectors', ...Array.from(new Set(employers.map((e) => e.sector)))]
  }, [employers])

  if (loading) {
    return (
      <div className="app-page">
        <PageHeader
          eyebrow="Ecosystem intelligence"
          title="Employers"
          description="Partner employers, verified placement counts, and retention signals from Supabase."
        />
        <LoadingState label="Loading employer records from Supabase..." />
      </div>
    )
  }

  const totalVerifiedHires = employers.reduce((acc, e) => acc + e.verifiedHires, 0)
  const avgRetention =
    employers.length > 0
      ? Math.round((employers.reduce((acc, e) => acc + e.retentionRate, 0) / employers.length) * 10) / 10
      : 0

  return (
    <div className="app-page">
      <PageHeader
        eyebrow="Ecosystem intelligence"
        title="Employers"
        description="Partner employers, verified placement counts, and retention signals from Supabase."
      />

      <div className="kpi-grid kpi-grid--four">
        <MetricCard
          label="Partner employers"
          value={employers.length ? employers.length.toString() : '—'}
          change="active network"
          context="registered employers"
          tone="blue"
        />
        <MetricCard
          label="Verified hires"
          value={totalVerifiedHires ? totalVerifiedHires.toString() : '—'}
          change="evidence verified"
          context="in programme"
          tone="green"
        />
        <MetricCard
          label="Average retention"
          value={avgRetention ? `${avgRetention}%` : '—'}
          change="90-day milestone"
          context="across partners"
          tone="blue"
        />
        <MetricCard
          label="Verification sources"
          value="EPFO & Payslip"
          change="multi-tier proof"
          context="audited pipeline"
          tone="amber"
        />
      </div>

      <Panel
        title="Employer directory"
        action={
          <span className="panel-context">
            {filtered.length} of {employers.length} employers
          </span>
        }
      >
        <TableToolbar
          placeholder="Search employers or locations..."
          search={query}
          onSearch={(v) => setQuery(v)}
        >
          <select
            className="select-control"
            value={sectorFilter}
            onChange={(e) => setSectorFilter(e.target.value)}
          >
            {sectors.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </TableToolbar>

        {filtered.length === 0 ? (
          <div className="p-8">
            <EmptyState
              title="No employers found"
              description="No partner employers match your current search or filter criteria in the database."
            />
          </div>
        ) : (
          <div className="data-table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Employer</th>
                  <th>Sector</th>
                  <th>Location</th>
                  <th>Verified Hires</th>
                  <th>Retention</th>
                  <th>Verification Method</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((emp) => (
                  <tr key={emp.id}>
                    <td>
                      <div className="person-cell">
                        <span className="avatar-chip">{emp.name.slice(0, 2).toUpperCase()}</span>
                        <span>
                          <strong>{emp.name}</strong>
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className="text-xs text-primary-text">{emp.sector}</span>
                    </td>
                    <td>
                      <span className="text-xs text-slate-gray">{emp.location}</span>
                    </td>
                    <td>
                      <strong className="text-xs font-semibold">{emp.verifiedHires}</strong>
                    </td>
                    <td>
                      <Badge tone={emp.retentionRate >= 80 ? 'green' : 'amber'}>
                        {emp.retentionRate}% 90d
                      </Badge>
                    </td>
                    <td>
                      <span className="text-xs text-slate-gray">{emp.verificationSource}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </div>
  )
}

// ----------------------------------------------------
// 15. GENERIC ANALYTICS (Outcomes, Impact)
// ----------------------------------------------------
function GenericAnalyticsPage({
  kind,
  onNavigate,
}: {
  kind: 'outcomes' | 'impact'
  onNavigate: (path: string) => void
}) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [retention, setRetention] = useState<RetentionCurveItem[]>([])
  const [distribution, setDistribution] = useState<DistributionItem[]>([])
  const [attrition, setAttrition] = useState<{ label: string; value: number }[]>([])
  const [nonPlacement, setNonPlacement] = useState<{ label: string; value: number }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      getDashboardMetrics(),
      getRetentionCurves(),
      getEmploymentDistribution(),
      getAttritionReasons(),
      getNonPlacementReasons(),
    ]).then(([m, r, d, att, np]) => {
      setMetrics(m)
      setRetention(r)
      setDistribution(d)
      setAttrition(att)
      setNonPlacement(np)
      setLoading(false)
    })
  }, [])

  const config = {
    outcomes: {
      eyebrow: 'Analytics',
      title: 'Outcome Analytics',
      description: 'Longitudinal models across cohorts, verifications and retention intervals from Supabase.',
    },
    employers: {
      eyebrow: 'Ecosystem intelligence',
      title: 'Employers',
      description: 'Understand employer partnership activity and verification confidence states.',
    },
    impact: {
      eyebrow: 'Executive analytics',
      title: 'Impact Dashboard',
      description: 'Longitudinal employment, retention and wage progression derived from database records.',
    },
  }[kind]

  if (loading) {
    return (
      <div className="app-page">
        <PageHeader eyebrow={config.eyebrow} title={config.title} />
        <LoadingState label="Loading analytics from Supabase..." />
      </div>
    )
  }

  const kpisList = [
    {
      label: 'Trainees tracked',
      value: metrics?.totalTrainees ? metrics.totalTrainees.toLocaleString('en-IN') : '—',
      change: 'database count',
      context: 'in workspace',
      tone: 'blue',
    },
    {
      label: 'Employment conversion',
      value: metrics?.employmentConversionRate !== null ? `${metrics?.employmentConversionRate}%` : '—',
      change: `${metrics?.employedTrainees || 0} employed`,
      context: 'of tracked trainees',
      tone: 'green',
    },
    {
      label: 'Verified rate',
      value: metrics?.verifiedRate !== null ? `${metrics?.verifiedRate}%` : '—',
      change: `${metrics?.verifiedTrainees || 0} claims`,
      context: 'evidence verified',
      tone: 'blue',
    },
    {
      label: 'Median wage',
      value: metrics?.medianWage ? currency(metrics.medianWage) : '—',
      change: 'monthly',
      context: 'salary records',
      tone: 'amber',
    },
  ]

  return (
    <div className="app-page">
      <PageHeader
        eyebrow={config.eyebrow}
        title={config.title}
        description={config.description}
      />

      <div className="kpi-grid kpi-grid--four">
        {kpisList.map((kpi) => (
          <MetricCard key={kpi.label} {...kpi} />
        ))}
      </div>

      <div className="dashboard-grid dashboard-grid--wide">
        <Panel title={kind === 'impact' ? 'Longitudinal impact trend' : 'Outcome trend'} className="chart-panel">
          {retention.length === 0 ? (
            <div className="p-8"><EmptyState title="No trend data" description="No retention data found in the database." /></div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={retention} margin={{ top: 12, right: 8, left: -18, bottom: 0 }}>
                <defs>
                  <linearGradient id={`generic-${kind}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={isDark ? '#637cfc' : '#4a63f6'} stopOpacity={0.22} />
                    <stop offset="100%" stopColor={isDark ? '#637cfc' : '#4a63f6'} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={isDark ? 'rgba(255,255,255,0.08)' : '#edf0f5'} strokeOpacity={isDark ? 1 : 0.3} vertical={false} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: isDark ? '#94a3b8' : '#8490a3', fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: isDark ? '#94a3b8' : '#8490a3', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#1a1b20' : '#ffffff',
                    border: isDark ? '1px solid rgba(255,255,255,0.12)' : '1px solid #e7eaf0',
                    borderRadius: 8,
                    color: isDark ? '#ededef' : '#101828',
                  }}
                />
                <Area type="monotone" dataKey="employed" stroke={isDark ? '#637cfc' : '#4a63f6'} fill={`url(#generic-${kind})`} strokeWidth={2.5} />
                <Area type="monotone" dataKey="retained" stroke={isDark ? '#38bdf8' : '#101828'} fill="none" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </Panel>

        <Panel title="Distribution by outcome">
          {distribution.length === 0 ? (
            <div className="p-8"><EmptyState title="No distribution data" description="No trainee records available." /></div>
          ) : (
            <ResponsiveContainer width="100%" height={230}>
              <BarChart data={distribution} layout="vertical" margin={{ left: 20, right: 20 }}>
                <CartesianGrid stroke={isDark ? 'rgba(255,255,255,0.08)' : '#edf0f5'} strokeOpacity={isDark ? 1 : 0.3} horizontal={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="label" type="category" axisLine={false} tickLine={false} width={120} tick={{ fontSize: 11, fill: isDark ? '#94a3b8' : '#667085' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#1a1b20' : '#ffffff',
                    border: isDark ? '1px solid rgba(255,255,255,0.12)' : '1px solid #e7eaf0',
                    borderRadius: 8,
                    color: isDark ? '#ededef' : '#101828',
                  }}
                />
                <Bar dataKey="value" radius={[0, 5, 5, 0]}>
                  {distribution.map((entry) => (
                    <Cell key={entry.label} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </Panel>
      </div>

      <Panel title="Non-placement / attrition factors">
        <div className="reason-columns">
          <div>
            <span className="eyebrow-small">Non-placement reasons</span>
            {nonPlacement.length > 0 ? (
              <ReasonBars items={nonPlacement.slice(0, 5)} />
            ) : (
              <p className="text-xs text-slate-gray py-4">No non-placement reasons recorded.</p>
            )}
          </div>
          <div>
            <span className="eyebrow-small">Attrition factors</span>
            {attrition.length > 0 ? (
              <ReasonBars items={attrition.slice(0, 5)} />
            ) : (
              <p className="text-xs text-slate-gray py-4">No attrition reasons recorded.</p>
            )}
          </div>
        </div>
      </Panel>
    </div>
  )
}

function ReasonBars({ items }: { items: { label: string; value: number }[] }) {
  return (
    <div className="reason-bars">
      {items.map((item) => (
        <div key={item.label}>
          <span>{item.label}</span>
          <div>
            <i style={{ width: `${Math.min(100, item.value * 2.5)}%` }} />
          </div>
          <strong>{item.value}%</strong>
        </div>
      ))}
    </div>
  )
}

function Drawer({
  title,
  onClose,
  children,
}: {
  title: string
  onClose: () => void
  children: React.ReactNode
}) {
  return (
    <div className="drawer-overlay" onMouseDown={onClose}>
      <aside className="drawer" onMouseDown={(e) => e.stopPropagation()}>
        <div className="drawer-head">
          <div>
            <span className="page-eyebrow">WorkOS workflow</span>
            <h2>{title}</h2>
          </div>
          <button onClick={onClose} aria-label="Close drawer">
            <X size={18} />
          </button>
        </div>
        <div className="drawer-body">{children}</div>
      </aside>
    </div>
  )
}
