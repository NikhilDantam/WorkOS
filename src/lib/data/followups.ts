import { supabase } from '../supabase'
import type { FollowUp, Confidence } from '../../types'

export async function getFollowUps(options?: { channel?: string; status?: string }): Promise<FollowUp[]> {
  let query = supabase.from('follow_ups').select('*').order('created_at', { ascending: false })

  if (options?.channel && options.channel !== 'All channels') {
    query = query.eq('channel', options.channel)
  }

  if (options?.status && options.status !== 'All') {
    query = query.eq('status', options.status)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching follow-ups:', error.message)
    return []
  }

  return (data || []).map((row: any) => ({
    id: row.id,
    trainee: row.trainee,
    due: row.due,
    channel: row.channel,
    status: row.status,
    lastResponse: row.last_response || '—',
    outcome: row.outcome,
    confidence: row.confidence as Confidence,
  }))
}

export async function updateFollowUpStatus(
  id: string,
  status: FollowUp['status'],
  outcome?: string,
  actorName: string = 'User'
): Promise<boolean> {
  const patch: any = {
    status,
    updated_at: new Date().toISOString(),
  }
  if (outcome) {
    patch.outcome = outcome
    patch.last_response = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) + ' · ' + new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
  }

  const { error } = await supabase
    .from('follow_ups')
    .update(patch)
    .eq('id', id)

  if (error) {
    console.error('Error updating follow-up:', error.message)
    return false
  }

  try {
    const { data: fu } = await supabase.from('follow_ups').select('trainee').eq('id', id).maybeSingle()
    const entity = fu ? `${id} · ${fu.trainee}` : id
    await supabase.from('audit_events').insert({
      id: `AU-${Date.now().toString().slice(-6)}`,
      actor: actorName,
      action: 'Updated follow-up status',
      entity,
      timestamp: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ' · ' + new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
      purpose: 'Retention tracking',
      result: status,
    })
  } catch (err) {
    console.warn('Could not record audit log for follow-up:', err)
  }

  return true
}
