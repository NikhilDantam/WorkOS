import { supabase } from '../supabase'
import type { Trainee, EmploymentEpisode, Evidence, SalarySnapshot, FollowUp, Verification } from '../../types'

function mapTrainee(row: any): Trainee {
  return {
    id: row.id,
    name: row.name,
    initials: row.initials || (row.name ? row.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2) : 'TR'),
    programme: row.programme,
    course: row.course,
    district: row.district,
    state: row.state,
    status: row.status,
    placement: row.placement || '—',
    employment: row.employment || 'Pending',
    retention: row.retention || '—',
    lastFollowUp: row.last_follow_up || '—',
    updated: row.updated || '—',
    employer: row.employer || '—',
    role: row.role || '—',
    wage: Number(row.wage) || 0,
    consent: row.consent || 'Active',
    provider: row.provider || '—',
    skills: row.skills || [],
  }
}

export async function getTrainees(options?: {
  query?: string
  status?: string
  limit?: number
  offset?: number
}): Promise<{ trainees: Trainee[]; total: number }> {
  let query = supabase.from('trainees').select('*', { count: 'exact' })

  if (options?.query && options.query.trim()) {
    const q = `%${options.query.trim()}%`
    query = query.or(`name.ilike.${q},id.ilike.${q},course.ilike.${q},district.ilike.${q}`)
  }

  if (options?.status && options.status !== 'All statuses') {
    query = query.eq('status', options.status)
  }

  query = query.order('id', { ascending: false })

  if (options?.limit) {
    const offset = options.offset || 0
    query = query.range(offset, offset + options.limit - 1)
  }

  const { data, count, error } = await query

  if (error) {
    console.error('Error fetching trainees:', error.message)
    return { trainees: [], total: 0 }
  }

  return {
    trainees: (data || []).map(mapTrainee),
    total: count ?? (data?.length || 0),
  }
}

export async function getTrainee(id: string): Promise<Trainee | null> {
  const { data, error } = await supabase
    .from('trainees')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (error || !data) {
    if (error) console.error('Error fetching trainee:', error.message)
    return null
  }

  return mapTrainee(data)
}

export async function getTraineeProfileDetails(id: string): Promise<{
  trainee: Trainee | null
  episodes: EmploymentEpisode[]
  evidence: Evidence[]
  salarySnapshots: SalarySnapshot[]
  followUps: FollowUp[]
  verifications: Verification[]
}> {
  const trainee = await getTrainee(id)
  if (!trainee) {
    return {
      trainee: null,
      episodes: [],
      evidence: [],
      salarySnapshots: [],
      followUps: [],
      verifications: [],
    }
  }

  const [episodesRes, salaryRes, followUpsRes, verificationsRes] = await Promise.all([
    supabase.from('employment_episodes').select('*').eq('trainee_id', id),
    supabase.from('salary_snapshots').select('*').eq('trainee_id', id).order('created_at', { ascending: true }),
    supabase.from('follow_ups').select('*').ilike('trainee', `%${trainee.name}%`),
    supabase.from('verifications').select('*').eq('trainee_id', id),
  ])

  const episodes: EmploymentEpisode[] = (episodesRes.data || []).map((row: any) => ({
    id: row.id,
    traineeId: row.trainee_id,
    employer: row.employer,
    role: row.role,
    startDate: row.start_date,
    endDate: row.end_date,
    monthlyWage: Number(row.monthly_wage) || 0,
    status: row.status,
    verificationId: row.verification_id,
  }))

  const episodeIds = episodes.map((e) => e.id)
  let evidence: Evidence[] = []
  if (episodeIds.length > 0) {
    const { data: evidenceData } = await supabase
      .from('evidence_records')
      .select('*')
      .in('employment_episode_id', episodeIds)

    evidence = (evidenceData || []).map((row: any) => ({
      id: row.id,
      employmentEpisodeId: row.employment_episode_id,
      type: row.type,
      source: row.source,
      capturedAt: row.captured_at,
      confidence: row.confidence,
    }))
  }

  const salarySnapshots: SalarySnapshot[] = (salaryRes.data || []).map((row: any) => ({
    id: row.id,
    traineeId: row.trainee_id,
    day: row.day,
    monthlyWage: Number(row.monthly_wage) || 0,
    source: row.source,
  }))

  const followUps: FollowUp[] = (followUpsRes.data || []).map((row: any) => ({
    id: row.id,
    trainee: row.trainee,
    due: row.due,
    channel: row.channel,
    status: row.status,
    lastResponse: row.last_response || '—',
    outcome: row.outcome,
    confidence: row.confidence,
  }))

  const verifications: Verification[] = (verificationsRes.data || []).map((row: any) => ({
    id: row.id,
    trainee: row.trainee,
    traineeId: row.trainee_id,
    employer: row.employer,
    role: row.role,
    startDate: row.start_date,
    evidence: row.evidence,
    confidence: row.confidence,
    updated: row.updated,
    employmentEpisodeId: row.employment_episode_id,
    evidenceId: row.evidence_id,
  }))

  return {
    trainee,
    episodes,
    evidence,
    salarySnapshots,
    followUps,
    verifications,
  }
}
