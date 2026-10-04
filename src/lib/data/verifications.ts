import { supabase } from '../supabase'
import type { Verification, Confidence } from '../../types'

export async function getVerifications(filter?: string): Promise<Verification[]> {
  let query = supabase.from('verifications').select('*').order('created_at', { ascending: false })

  if (filter && filter !== 'All claims') {
    query = query.eq('confidence', filter)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching verifications:', error.message)
    return []
  }

  return (data || []).map((row: any) => ({
    id: row.id,
    trainee: row.trainee,
    traineeId: row.trainee_id,
    employer: row.employer,
    role: row.role,
    startDate: row.start_date,
    evidence: row.evidence,
    confidence: row.confidence as Confidence,
    updated: row.updated || 'Just now',
    employmentEpisodeId: row.employment_episode_id,
    evidenceId: row.evidence_id,
  }))
}

export async function updateVerificationStatus(
  id: string,
  confidence: Confidence,
  actorName: string = 'User'
): Promise<boolean> {
  const { error } = await supabase
    .from('verifications')
    .update({
      confidence,
      updated: 'Just now',
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)

  if (error) {
    console.error('Error updating verification:', error.message)
    return false
  }

  // Also record audit event
  try {
    const { data: ver } = await supabase.from('verifications').select('trainee, trainee_id').eq('id', id).maybeSingle()
    const entity = ver ? `${id} · ${ver.trainee}` : id
    await supabase.from('audit_events').insert({
      id: `AU-${Date.now().toString().slice(-6)}`,
      actor: actorName,
      action: confidence === 'Verified' ? 'Approved verification' : `Set confidence to ${confidence}`,
      entity,
      timestamp: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ' · ' + new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
      purpose: 'Employer verification',
      result: confidence,
    })
  } catch (err) {
    console.warn('Could not record audit log for verification:', err)
  }

  return true
}
