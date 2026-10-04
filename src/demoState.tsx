import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'

export type DemoRole = 'Programme Administrator' | 'Trainee' | 'Training Provider' | 'Employer' | 'Policy / Government' | 'Analyst / Evaluator'
export type DemoDay = 0 | 30 | 90 | 180 | 365

export interface DemoState {
  role: DemoRole
  day: DemoDay
  workspace: 'National Skills Programme' | 'State Livelihood Mission'
  dateRange: 'Q4 2025 — Q1 2026' | 'Last 90 days' | 'Last 365 days'
}

export const defaultDemoState: DemoState = {
  role: 'Programme Administrator',
  day: 0,
  workspace: 'National Skills Programme',
  dateRange: 'Q4 2025 — Q1 2026',
}

type DemoContextValue = { state: DemoState; update: (patch: Partial<DemoState>) => void }
const DemoContext = createContext<DemoContextValue | null>(null)

export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DemoState>(defaultDemoState)
  const update = (patch: Partial<DemoState>) =>
    setState((current) => ({ ...current, ...patch }))
  const value = useMemo(() => ({ state, update }), [state])
  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>
}

export function useDemoState() {
  const value = useContext(DemoContext)
  if (!value) throw new Error('useDemoState must be used inside DemoProvider')
  return value
}
