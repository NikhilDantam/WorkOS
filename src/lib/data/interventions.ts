import { supabase } from '../supabase'
import type { Intervention } from '../../types'

export async function getInterventions(): Promise<Intervention[]> {
  const { data, error } = await supabase
    .from('interventions')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching interventions:', error.message)
    return []
  }

  return (data || []).map((row: any) => ({
    id: row.id,
    problem: row.problem,
    cohort: row.cohort,
    evidence: row.evidence,
    action: row.action,
    owner: row.owner,
    status: row.status as Intervention['status'],
    metric: row.metric,
    review: row.review,
  }))
}

export async function createIntervention(
  draft: {
    problem: string
    action: string
    owner: string
    metric: string
    cohort?: string
    evidence?: string
    review?: string
  },
  actorName: string = 'User'
): Promise<Intervention | null> {
  const id = `IN-${Date.now().toString().slice(-4)}`
  const record = {
    id,
    problem: draft.problem.trim(),
    cohort: draft.cohort || 'Current active cohort',
    evidence: draft.evidence || 'Identified through outcome signal review',
    action: draft.action.trim(),
    owner: draft.owner || 'Programme design team',
    status: 'Proposed',
    metric: draft.metric || 'Training-to-role relevance',
    review: draft.review || '30 Jun 2026',
    created_at: new Date().toISOString(),
  }

  const { data, error } = await supabase
    .from('interventions')
    .insert(record)
    .select()
    .single()

  if (error) {
    console.error('Error creating intervention:', error.message)
    return null
  }

  try {
    await supabase.from('audit_events').insert({
      id: `AU-${Date.now().toString().slice(-6)}`,
      actor: actorName,
      action: 'Created intervention',
      entity: `${id} · ${record.problem.slice(0, 30)}`,
      timestamp: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ' · ' + new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
      purpose: 'Programme improvement',
      result: 'Proposed',
    })
  } catch (err) {
    console.warn('Could not record audit log for intervention creation:', err)
  }

  return {
    id: data.id,
    problem: data.problem,
    cohort: data.cohort,
    evidence: data.evidence,
    action: data.action,
    owner: data.owner,
    status: data.status,
    metric: data.metric,
    review: data.review,
  }
}

export async function updateInterventionStatus(
  id: string,
  status: Intervention['status'],
  owner?: string,
  actorName: string = 'User'
): Promise<boolean> {
  const patch: any = {
    status,
    updated_at: new Date().toISOString(),
  }
  if (owner) patch.owner = owner

  const { error } = await supabase
    .from('interventions')
    .update(patch)
    .eq('id', id)

  if (error) {
    console.error('Error updating intervention:', error.message)
    return false
  }

  try {
    await supabase.from('audit_events').insert({
      id: `AU-${Date.now().toString().slice(-6)}`,
      actor: actorName,
      action: `Updated intervention ${id}`,
      entity: id,
      timestamp: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ' · ' + new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
      purpose: 'Intervention progress',
      result: status,
    })
  } catch (err) {
    console.warn('Could not record audit log for intervention update:', err)
  }

  return true
}
