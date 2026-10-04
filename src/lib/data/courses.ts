import { supabase } from '../supabase'
import type { Course } from '../../types'

export async function getCourses(search?: string): Promise<Course[]> {
  let query = supabase.from('courses').select('*').order('name', { ascending: true })

  if (search && search.trim()) {
    const q = `%${search.trim()}%`
    query = query.or(`name.ilike.${q},provider.ilike.${q}`)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching courses:', error.message)
    return []
  }

  return (data || []).map((row: any) => ({
    id: row.id,
    name: row.name,
    provider: row.provider,
    providerId: row.provider_id || '',
    cohort: row.cohort || '—',
    completion: row.completion || '—',
    placement: row.placement || '—',
    employment: row.employment || '—',
    retention: row.retention || '—',
    wage: row.wage || '—',
    skillIds: row.skill_ids || [],
  }))
}
