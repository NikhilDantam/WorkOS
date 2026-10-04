export type Confidence = 'Verified' | 'Partially verified' | 'Self-reported' | 'Pending' | 'Rejected'
export type Status = 'Employed' | 'Self-employed' | 'Apprentice' | 'Further education' | 'Unemployed' | 'Inactive' | 'Unknown'
export type OutcomeDay = 'Start' | '30d' | '90d' | '180d' | '365d'

export interface Trainee {
  id: string
  name: string
  initials: string
  programme: string
  course: string
  district: string
  state: string
  status: Status
  placement: string
  employment: Confidence
  retention: string
  lastFollowUp: string
  updated: string
  employer: string
  role: string
  wage: number
  consent: 'Active' | 'Revoked' | 'Pending'
  provider: string
  skills: string[]
  employmentEpisodeId?: string
}

export interface EmploymentEpisode {
  id: string
  traineeId: string
  employer: string
  role: string
  startDate: string
  endDate?: string
  monthlyWage: number
  status: 'Active' | 'Ended' | 'Pending'
  verificationId?: string
}

export interface Evidence {
  id: string
  employmentEpisodeId: string
  type: 'Employer portal' | 'Payslip' | 'Employer response' | 'Field visit' | 'Trainee response'
  source: string
  capturedAt: string
  confidence: Confidence
}

export interface SalarySnapshot {
  id: string
  traineeId: string
  day: OutcomeDay
  monthlyWage: number
  source: string
}

export interface Skill {
  id: string
  name: string
  demand: number
  coverage: number
  gap: number
  affected: number
}

export interface Course {
  id: string
  name: string
  provider: string
  providerId: string
  cohort: string
  completion: string
  placement: string
  employment: string
  retention: string
  wage: string
  skillIds: string[]
}

export interface Provider {
  id: string
  name: string
  district: string
  completion: string
  placement: string
  employment: string
  retention: string
  wage: string
  followUp: string
}

export interface District {
  id: string
  name: string
  state: string
  programme: string
  retention: string
  change: string
}

export interface Insight {
  id: string
  title: string
  finding: string
  evidenceIds: string[]
  skillIds: string[]
  confidence: Confidence
  recommendation: string
}

export interface Verification {
  id: string
  trainee: string
  traineeId: string
  employer: string
  role: string
  startDate: string
  evidence: string
  confidence: Confidence
  updated: string
  employmentEpisodeId: string
  evidenceId: string
}

export interface FollowUp {
  id: string
  trainee: string
  due: string
  channel: 'SMS' | 'WhatsApp' | 'Web' | 'Assisted call'
  status: 'Due today' | 'Overdue' | 'Completed' | 'Awaiting response' | 'Needs review'
  lastResponse: string
  outcome: string
  confidence: Confidence
}

export interface Intervention {
  id: string
  problem: string
  cohort: string
  evidence: string
  action: string
  owner: string
  status: 'Proposed' | 'In progress' | 'Review'
  metric: string
  review: string
}

export interface AuditEvent {
  id: string
  actor: string
  action: string
  entity: string
  timestamp: string
  purpose: string
  result: string
}

export interface RouteItem {
  path: string
  label: string
  icon: string
}
