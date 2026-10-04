import { supabase } from '../supabase'
import type { Insight, Confidence } from '../../types'

export async function getInsights(): Promise<Insight[]> {
  const { data, error } = await supabase
    .from('insights')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching insights:', error.message)
    return []
  }

  return (data || []).map((row: any) => ({
    id: row.id,
    title: row.title,
    finding: row.finding,
    evidenceIds: row.evidence_ids || [],
    skillIds: row.skill_ids || [],
    confidence: row.confidence as Confidence,
    recommendation: row.recommendation,
  }))
}
