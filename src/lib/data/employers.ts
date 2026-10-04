import { supabase } from '../supabase'

export interface Employer {
  id: string
  name: string
  sector: string
  location: string
  verifiedHires: number
  retentionRate: number
  verificationSource: string
  createdAt?: string
}

export async function getEmployers(): Promise<Employer[]> {
  const { data, error } = await supabase
    .from('employers')
    .select('*')
    .order('name', { ascending: true })

  if (error || !data) {
    if (error) console.error('Error fetching employers:', error.message)
    return []
  }

  return data.map((r: any) => ({
    id: r.id,
    name: r.name,
    sector: r.sector,
    location: r.location,
    verifiedHires: Number(r.verified_hires) || 0,
    retentionRate: Number(r.retention_rate) || 0,
    verificationSource: r.verification_source || 'Portal',
    createdAt: r.created_at,
  }))
}
