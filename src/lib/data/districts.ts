import { supabase } from '../supabase'
import type { District } from '../../types'

export async function getDistricts(): Promise<District[]> {
  const { data, error } = await supabase
    .from('districts')
    .select('*')
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching districts:', error.message)
    return []
  }

  return (data || []).map((row: any) => ({
    id: row.id,
    name: row.name,
    state: row.state,
    programme: row.programme,
    retention: row.retention || '—',
    change: row.change || '—',
  }))
}
