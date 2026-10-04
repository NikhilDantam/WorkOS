import type { RouteItem } from './types'

export const navItems: RouteItem[] = [
  { path: '/app/overview', label: 'Overview', icon: 'layout-dashboard' },
  { path: '/app/trainees', label: 'Trainees', icon: 'users' },
  { path: '/app/outcomes', label: 'Outcomes', icon: 'chart-no-axes-combined' },
  { path: '/app/verifications', label: 'Verifications', icon: 'badge-check' },
  { path: '/app/followups', label: 'Follow-ups', icon: 'message-square-more' },
  { path: '/app/skills', label: 'Skills', icon: 'sparkles' },
  { path: '/app/courses', label: 'Courses', icon: 'book-open' },
  { path: '/app/providers', label: 'Providers', icon: 'landmark' },
  { path: '/app/districts', label: 'Districts', icon: 'map' },
  { path: '/app/impact', label: 'Impact', icon: 'activity' },
  { path: '/app/insights', label: 'AI Insights', icon: 'wand-sparkles' },
  { path: '/app/interventions', label: 'Interventions', icon: 'arrow-up-right' },
  { path: '/app/audit', label: 'Audit', icon: 'shield-check' },
  { path: '/app/settings', label: 'Settings', icon: 'settings-2' },
]

export const marketingNav = [
  { label: 'Platform', path: '/platform' },
  { label: 'Outcomes', path: '/outcomes' },
  { label: 'For providers', path: '/for-providers' },
  { label: 'For employers', path: '/for-employers' },
  { label: 'For programmes', path: '/for-programmes' },
  { label: 'Security', path: '/security' },
  { label: 'Privacy', path: '/privacy' },
]

export const outcomeJourney = [
  'Training',
  'Assessment',
  'Certification',
  'Placement',
  'Employment',
  'Verification',
  'Retention',
  'Progression',
]
