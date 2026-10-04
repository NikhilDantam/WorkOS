import { supabase } from '../supabase'
import type { Provider } from '../../types'

export async function getProviders(): Promise<Provider[]> {
  const { data, error } = await supabase
    .from('providers')
    .select('*')
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching providers:', error.message)
    return []
  }

  return (data || []).map((row: any) => ({
    id: row.id,
    name: row.name,
    district: row.district,
    completion: row.completion || '—',
    placement: row.placement || '—',
    employment: row.employment || '—',
    retention: row.retention || '—',
    wage: row.wage || '—',
    followUp: row.follow_up || '—',
  }))
}
