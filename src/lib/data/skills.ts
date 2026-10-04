import { supabase } from '../supabase'
import type { Skill } from '../../types'

export async function getSkills(): Promise<Skill[]> {
  const { data, error } = await supabase
    .from('skills')
    .select('*')
    .order('demand', { ascending: false })

  if (error) {
    console.error('Error fetching skills:', error.message)
    return []
  }

  return (data || []).map((row: any) => ({
    id: row.id,
    name: row.name,
    demand: Number(row.demand) || 0,
    coverage: Number(row.coverage) || 0,
    gap: Number(row.gap) || 0,
    affected: Number(row.affected) || 0,
  }))
}

export async function getSkillsMatrix(): Promise<{ role: string; skills: string[] }[]> {
  const { data, error } = await supabase
    .from('skills_matrix')
    .select('*')
    .order('id', { ascending: true })

  if (error) {
    console.error('Error fetching skills matrix:', error.message)
    return []
  }

  return (data || []).map((row: any) => ({
    role: row.role,
    skills: row.skills || [],
  }))
}
