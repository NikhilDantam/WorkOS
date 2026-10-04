import { supabase } from '../supabase'
import type { AuditEvent } from '../../types'

export async function getAuditEvents(): Promise<AuditEvent[]> {
  const { data, error } = await supabase
    .from('audit_events')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching audit events:', error.message)
    return []
  }

  return (data || []).map((row: any) => ({
    id: row.id,
    actor: row.actor,
    action: row.action,
    entity: row.entity,
    timestamp: row.timestamp,
    purpose: row.purpose,
    result: row.result,
  }))
}

export async function logAuditEvent(event: {
  actor: string
  action: string
  entity: string
  purpose: string
  result: string
  actor_id?: string
}): Promise<boolean> {
  const id = `AU-${Date.now().toString().slice(-6)}`
  const timestamp = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ' · ' + new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })

  const { error } = await supabase.from('audit_events').insert({
    id,
    actor: event.actor,
    actor_id: event.actor_id ?? null,
    action: event.action,
    entity: event.entity,
    timestamp,
    purpose: event.purpose,
    result: event.result,
    created_at: new Date().toISOString(),
  })

  if (error) {
    console.error('Error recording audit event:', error.message)
    return false
  }

  return true
}
