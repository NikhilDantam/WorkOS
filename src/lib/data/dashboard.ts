import { supabase } from '../supabase'

export interface DashboardMetrics {
  totalTrainees: number
  employedTrainees: number
  verifiedTrainees: number
  retained90dTrainees: number
  medianWage: number
  totalFollowUps: number
  completedFollowUps: number
  employmentConversionRate: number | null
  verifiedRate: number | null
  retentionRate: number | null
  followUpCompletionRate: number | null
}

export interface FunnelItem {
  label: string
  value: number
  display: string
  width: number
  color: string
}

export interface RetentionCurveItem {
  day: string
  retained: number
  employed: number
}

export interface DistributionItem {
  label: string
  value: number
  color: string
}

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const { data, error } = await supabase.rpc('get_dashboard_summary')

  if (error || !data) {
    if (error) console.error('Error fetching dashboard summary:', error.message)
    // Fallback: direct queries
    const [{ count: total }, { count: employed }, { count: verified }, { count: retained }] = await Promise.all([
      supabase.from('trainees').select('*', { count: 'exact', head: true }),
      supabase.from('trainees').select('*', { count: 'exact', head: true }).in('status', ['Employed', 'Self-employed', 'Apprentice']),
      supabase.from('trainees').select('*', { count: 'exact', head: true }).eq('employment', 'Verified'),
      supabase.from('trainees').select('*', { count: 'exact', head: true }).in('retention', ['90 days', '180 days', '365 days']),
    ])

    const totalT = total || 0
    const empT = employed || 0
    const verT = verified || 0
    const retT = retained || 0

    return {
      totalTrainees: totalT,
      employedTrainees: empT,
      verifiedTrainees: verT,
      retained90dTrainees: retT,
      medianWage: 0,
      totalFollowUps: 0,
      completedFollowUps: 0,
      employmentConversionRate: totalT > 0 ? Math.round((empT / totalT) * 1000) / 10 : null,
      verifiedRate: totalT > 0 ? Math.round((verT / totalT) * 1000) / 10 : null,
      retentionRate: totalT > 0 ? Math.round((retT / totalT) * 1000) / 10 : null,
      followUpCompletionRate: null,
    }
  }

  return {
    totalTrainees: Number(data.total_trainees) || 0,
    employedTrainees: Number(data.employed_trainees) || 0,
    verifiedTrainees: Number(data.verified_trainees) || 0,
    retained90dTrainees: Number(data.retained_90d) || 0,
    medianWage: Number(data.median_wage) || 0,
    totalFollowUps: Number(data.total_follow_ups) || 0,
    completedFollowUps: Number(data.completed_follow_ups) || 0,
    employmentConversionRate: data.employment_conversion_rate !== null ? Number(data.employment_conversion_rate) : null,
    verifiedRate: data.verified_rate !== null ? Number(data.verified_rate) : null,
    retentionRate: data.retention_rate !== null ? Number(data.retention_rate) : null,
    followUpCompletionRate: data.follow_up_completion_rate !== null ? Number(data.follow_up_completion_rate) : null,
  }
}

export async function getCohortFunnel(): Promise<FunnelItem[]> {
  const { data, error } = await supabase
    .from('cohort_funnel')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error || !data) {
    if (error) console.error('Error fetching cohort funnel:', error.message)
    return []
  }

  return data.map((row: any) => ({
    label: row.label,
    value: Number(row.value),
    display: row.display,
    width: Number(row.width),
    color: row.color,
  }))
}

export async function getRetentionCurves(): Promise<RetentionCurveItem[]> {
  const { data, error } = await supabase
    .from('retention_curves')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error || !data) {
    if (error) console.error('Error fetching retention curves:', error.message)
    return []
  }

  return data.map((row: any) => ({
    day: row.day,
    retained: Number(row.retained),
    employed: Number(row.employed),
  }))
}

export async function getEmploymentDistribution(): Promise<DistributionItem[]> {
  const { data, error } = await supabase
    .from('trainees')
    .select('status')

  if (error || !data || data.length === 0) {
    return []
  }

  const counts: Record<string, number> = {}
  data.forEach((row: any) => {
    const s = row.status || 'Unknown'
    counts[s] = (counts[s] || 0) + 1
  })

  const total = data.length
  const colors: Record<string, string> = {
    'Employed': '#4a63f6',
    'Self-employed': '#8b9afa',
    'Apprentice': '#b8c2fd',
    'Further education': '#d9defe',
    'Unemployed': '#f5c66d',
    'Inactive': '#d6dbe3',
    'Unknown': '#d6dbe3',
  }

  return Object.entries(counts).map(([label, count]) => ({
    label,
    value: Math.round((count / total) * 100),
    color: colors[label] || '#9ca3af',
  }))
}

export async function getWageData(): Promise<{ day: string; value: number }[]> {
  const { data, error } = await supabase
    .from('salary_snapshots')
    .select('day, monthly_wage')
    .order('created_at', { ascending: true })

  if (error || !data || data.length === 0) {
    return []
  }

  // Group by day and calculate median or average wage
  const grouped: Record<string, number[]> = {}
  data.forEach((row: any) => {
    if (!grouped[row.day]) grouped[row.day] = []
    grouped[row.day].push(Number(row.monthly_wage))
  })

  const order = ['Start', '30d', '90d', '180d', '365d']
  return order
    .filter((d) => grouped[d] && grouped[d].length > 0)
    .map((day) => {
      const wages = grouped[day].sort((a, b) => a - b)
      const median = wages[Math.floor(wages.length / 2)]
      return { day, value: median }
    })
}

export async function getAttritionReasons(): Promise<{ label: string; value: number }[]> {
  const { data, error } = await supabase
    .from('attrition_reasons')
    .select('label, value')
    .order('value', { ascending: false })

  if (error || !data) return []
  return data.map((r: any) => ({ label: r.label, value: Number(r.value) }))
}

export async function getNonPlacementReasons(): Promise<{ label: string; value: number }[]> {
  const { data, error } = await supabase
    .from('non_placement_reasons')
    .select('label, value')
    .order('value', { ascending: false })

  if (error || !data) return []
  return data.map((r: any) => ({ label: r.label, value: Number(r.value) }))
}
