import React, { useState } from 'react'
import {
  WorkosHeader,
  WorkosHero,
  EcosystemMarquee,
  TheShiftCards,
  StakeholderShowcase,
  ProgrammeStories,
  GovernanceSection,
  OutcomeIntelligenceSection,
  WorkosClosingCTA,
  WorkosFooter,
  BookDemoModal
} from './workosComponents'
import { WorkosSecondaryPage, WorkosContactPage } from './workosPages'

export function MarketingLayout({
  children,
  onNavigate
}: {
  children: React.ReactNode
  onNavigate: (path: string) => void
}) {
  const [demoModalOpen, setDemoModalOpen] = useState(false)
  const currentPath = window.location.pathname.replace(/\/$/, '') || '/'

  return (
    <div className="min-h-screen flex flex-col justify-between bg-white text-primary-text font-sans antialiased selection:bg-blush-peach selection:text-sienna-brown">
      <WorkosHeader
        onNavigate={onNavigate}
        onOpenDemoModal={() => setDemoModalOpen(true)}
        currentPath={currentPath}
      />
      <main className="flex-1">{children}</main>
      <WorkosFooter onNavigate={onNavigate} />
      <BookDemoModal isOpen={demoModalOpen} onClose={() => setDemoModalOpen(false)} />
    </div>
  )
}

export function HomePage({ onNavigate }: { onNavigate: (path: string) => void }) {
  const [demoModalOpen, setDemoModalOpen] = useState(false)

  return (
    <>
      <WorkosHero onNavigate={onNavigate} onOpenDemoModal={() => setDemoModalOpen(true)} />
      <EcosystemMarquee />
      <TheShiftCards onNavigate={onNavigate} />
      <StakeholderShowcase onNavigate={onNavigate} />
      <ProgrammeStories onNavigate={onNavigate} />
      <GovernanceSection onNavigate={onNavigate} />
      <OutcomeIntelligenceSection onNavigate={onNavigate} />
      <WorkosClosingCTA onNavigate={onNavigate} onOpenDemoModal={() => setDemoModalOpen(true)} />
      <BookDemoModal isOpen={demoModalOpen} onClose={() => setDemoModalOpen(false)} />
    </>
  )
}

export function SecondaryMarketingPage({
  path,
  onNavigate
}: {
  path: string
  onNavigate: (path: string) => void
}) {
  const [demoModalOpen, setDemoModalOpen] = useState(false)

  return (
    <>
      <WorkosSecondaryPage
        path={path}
        onNavigate={onNavigate}
        onOpenDemoModal={() => setDemoModalOpen(true)}
      />
      <BookDemoModal isOpen={demoModalOpen} onClose={() => setDemoModalOpen(false)} />
    </>
  )
}

export function ContactPage({ onNavigate }: { onNavigate: (path: string) => void }) {
  return <WorkosContactPage onNavigate={onNavigate} />
}
