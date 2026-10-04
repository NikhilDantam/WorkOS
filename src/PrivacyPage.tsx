import React from 'react'
import { ArrowLeft, ShieldCheck, Lock, Database, UserCheck, Key, FileText } from 'lucide-react'
import { WorkosMark } from './components'
import { ThemeToggle } from './lib/ThemeContext'

export function PrivacyPage({ onNavigate }: { onNavigate: (path: string) => void }) {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-white dark:bg-canvas text-primary-text dark:text-dark-text transition-colors">
      <header className="border-b border-black/[0.06] dark:border-white/[0.08] sticky top-0 bg-white/90 dark:bg-canvas/90 backdrop-blur-md z-30">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <button
            onClick={() => onNavigate('/')}
            className="flex items-center gap-2 text-sm text-slate-gray hover:text-primary-text dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="size-4" />
            <span>Back to WorkOS</span>
          </button>
          <div className="flex items-center gap-4">
            <ThemeToggle className="topbar-icon-button" />
            <button
              onClick={() => onNavigate('/app')}
              className="rounded-full bg-primary-text dark:bg-white text-white dark:text-ink-black px-4 py-1.5 text-xs font-medium hover:opacity-90 transition-opacity"
            >
              Sign in
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto px-6 py-16 w-full">
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-mist-gray dark:bg-dark-card text-xs font-medium text-slate-gray mb-4">
            <ShieldCheck className="size-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Governance & Privacy by Design</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl text-primary-text dark:text-white font-normal tracking-tight mb-4">
            Privacy Policy
          </h1>
          <p className="text-slate-gray text-base leading-relaxed">
            Effective Date: October 2026 · Last updated: October 2026
          </p>
        </div>

        <div className="space-y-12 text-sm leading-relaxed text-slate-gray">
          <section className="space-y-3">
            <h2 className="text-lg font-medium text-primary-text dark:text-white flex items-center gap-2">
              <FileText className="size-4 text-emerald-600 dark:text-emerald-400" />
              1. Overview
            </h2>
            <p>
              WorkOS is an outcome intelligence platform designed to connect vocational training records,
              employment verification, longitudinal retention, and wage progression into evidence-backed insights.
              This Privacy Policy explains how information is collected, processed, stored, and protected when you
              use the WorkOS platform and associated services.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-medium text-primary-text dark:text-white flex items-center gap-2">
              <UserCheck className="size-4 text-emerald-600 dark:text-emerald-400" />
              2. Information Collected
            </h2>
            <p>
              Depending on your interactions with the platform, WorkOS processes the following categories of data:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong className="text-primary-text dark:text-white">Account Information:</strong> Business email address, authentication credentials, full name, and assigned administrative role.
              </li>
              <li>
                <strong className="text-primary-text dark:text-white">Application & Outcome Data:</strong> Training participant records, cohort metadata, course enrolments, placement milestones, employment verification records, salary snapshots, follow-up interactions, and programme interventions.
              </li>
              <li>
                <strong className="text-primary-text dark:text-white">Operational & Audit Logs:</strong> Access records, timestamped administrative events, verification determinations, and consent status modifications.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-medium text-primary-text dark:text-white flex items-center gap-2">
              <Key className="size-4 text-emerald-600 dark:text-emerald-400" />
              3. Authentication & Access Control
            </h2>
            <p>
              User authentication is managed securely via Supabase Auth. Sessions are established through JSON Web Tokens (JWTs) with cryptographic verification.
              Application routes under <code className="px-1.5 py-0.5 rounded bg-mist-gray dark:bg-dark-card font-mono text-xs text-primary-text dark:text-white">/app/*</code> require a valid authenticated Supabase session.
              Row-Level Security (RLS) policies are enforced at the database level so that requests without appropriate authentication are denied access.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-medium text-primary-text dark:text-white flex items-center gap-2">
              <Database className="size-4 text-emerald-600 dark:text-emerald-400" />
              4. Backend Processing & Data Storage
            </h2>
            <p>
              All primary application data is stored in a relational PostgreSQL database hosted and managed through Supabase infrastructure.
              Data transfer occurs exclusively over encrypted TLS/HTTPS channels.
              Frontend client queries use scoped publishable anonymous keys, with access privileges governed strictly by database-level Row Level Security policies.
              Service-role keys and administrative credentials are never embedded in or exposed to client-side code.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-medium text-primary-text dark:text-white flex items-center gap-2">
              <Lock className="size-4 text-emerald-600 dark:text-emerald-400" />
              5. How Information is Used
            </h2>
            <p>
              Collected information is utilized solely for:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Authenticating authorized personnel and maintaining secure workspace sessions.</li>
              <li>Calculating aggregate outcome analytics, retention rates, and wage progression indicators.</li>
              <li>Tracking verification queues and audit logs for operational accountability.</li>
              <li>Managing longitudinal follow-up schedules and evidence trails for programme evaluation.</li>
            </ul>
            <p>
              WorkOS does not sell participant or organizational data to third parties, nor do we use outcome data for cross-platform behavioural advertising.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-medium text-primary-text dark:text-white">
              6. Cookies & Local Storage
            </h2>
            <p>
              The platform utilizes minimal client-side storage strictly necessary for application functionality:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong className="text-primary-text dark:text-white">Supabase Auth Session:</strong> Stored to maintain your authenticated login state across browser refreshes.
              </li>
              <li>
                <strong className="text-primary-text dark:text-white">Theme Preference:</strong> Stored under <code className="px-1.5 py-0.5 rounded bg-mist-gray dark:bg-dark-card font-mono text-xs">workos-theme-preference</code> to preserve your preferred light or dark mode selection.
              </li>
            </ul>
            <p>
              No third-party tracking cookies or advertising pixels are used in the authenticated application.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-medium text-primary-text dark:text-white">
              7. Data Retention & User Rights
            </h2>
            <p>
              Data is retained for the duration of the active skilling programme and in accordance with institutional data agreements.
              Authorized administrators may request access to, correction of, or deletion of specific records in accordance with the governing programme policies.
              Participants whose consent status is marked as revoked are excluded from downstream analytical reporting.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-medium text-primary-text dark:text-white">
              8. Contact & Policy Updates
            </h2>
            <p>
              We may update this Privacy Policy from time to time to reflect operational or technological changes.
              For inquiries regarding data governance, privacy practices, or custom configuration, contact your workspace administrator or reach out through our designated contact channels.
            </p>
            <div className="p-4 rounded-xl bg-mist-gray/60 dark:bg-dark-card border border-black/[0.05] dark:border-white/[0.05]">
              <p className="text-xs text-slate-gray">
                Organization: WorkOS Platform Administration · Support contact: <code className="font-mono text-primary-text dark:text-white">privacy@workos.org</code> (or your organization's designated data officer).
              </p>
            </div>
          </section>
        </div>
      </main>

      <footer className="border-t border-black/[0.06] dark:border-white/[0.08] py-8 text-center text-xs text-slate-gray bg-fog-white dark:bg-canvas">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>© 2026 WorkOS. Privacy by design · Evidence over assumptions</span>
          <div className="flex items-center gap-6">
            <button onClick={() => onNavigate('/')} className="hover:text-primary-text dark:hover:text-white transition-colors">Home</button>
            <button onClick={() => onNavigate('/security')} className="hover:text-primary-text dark:hover:text-white transition-colors">Security</button>
            <button onClick={() => onNavigate('/privacy')} className="hover:text-primary-text dark:hover:text-white font-medium text-primary-text dark:text-white">Privacy Policy</button>
            <button onClick={() => onNavigate('/app')} className="hover:text-primary-text dark:hover:text-white transition-colors">Sign in</button>
          </div>
        </div>
      </footer>
    </div>
  )
}
