import React, { useState } from 'react'
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react'
import { Button, WorkosMark } from './components'
import { useAuth } from './lib/AuthContext'
import { ThemeToggle } from './lib/ThemeContext'

export function LoginPage({ onNavigate }: { onNavigate: (path: string) => void }) {
  const { signIn, resetPassword, user } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [resetSent, setResetSent] = useState(false)
  const [resetLoading, setResetLoading] = useState(false)
  const [showResetModal, setShowResetModal] = useState(false)
  const [resetEmail, setResetEmail] = useState('')

  // If already logged in, navigate to /app/overview
  React.useEffect(() => {
    if (user) {
      onNavigate('/app/overview')
    }
  }, [user, onNavigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !password) {
      setError('Please provide both email and password.')
      return
    }

    setError(null)
    setLoading(true)

    try {
      const { error: signInError } = await signIn(email, password)
      if (signInError) {
        setError(signInError.message || 'Authentication failed. Please check your credentials.')
      } else {
        onNavigate('/app/overview')
      }
    } catch (err: any) {
      setError(err?.message || 'An unexpected error occurred during sign in.')
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!resetEmail.trim()) return

    setResetLoading(true)
    setError(null)

    try {
      const { error: resetErr } = await resetPassword(resetEmail)
      if (resetErr) {
        setError(resetErr.message)
      } else {
        setResetSent(true)
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to send password reset email.')
    } finally {
      setResetLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle className="topbar-icon-button" />
      </div>

      <div className="login-aside">
        <button className="brand-button" onClick={() => onNavigate('/')} aria-label="Go to WorkOS home">
          <span className="brand-mark brand-mark--light">
            <i className="brand-node brand-node--one" />
            <i className="brand-link brand-link--one" />
            <i className="brand-node brand-node--two" />
            <i className="brand-link brand-link--two" />
            <i className="brand-node brand-node--three" />
          </span>
          <span className="brand-wordmark">WORKOS</span>
        </button>

        <div className="login-aside-copy">
          <span className="page-eyebrow">Outcome Intelligence Platform</span>
          <h1>See what happens <em>after</em> the training.</h1>
          <p>
            Connect placement, employment verification, longitudinal retention and wage progression into one governed view.
          </p>

          <div className="login-aside-features">
            <div className="flex items-center gap-2 text-xs text-white/80">
              <ShieldCheck className="size-4 text-emerald-400 shrink-0" />
              <span>Evidence-backed outcome verification</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-white/80 mt-2">
              <LockKeyhole className="size-4 text-sky-400 shrink-0" />
              <span>Row-level security and governed data access</span>
            </div>
          </div>
        </div>

        <div className="login-footer">
          <span>© 2026 WorkOS</span>
          <button onClick={() => onNavigate('/privacy')} className="hover:underline text-left">
            Privacy Policy
          </button>
        </div>
      </div>

      <div className="login-form-side">
        <div className="login-form-wrap">
          <div className="login-form-head">
            <span className="page-eyebrow">Authentication</span>
            <h2>Sign in to WorkOS</h2>
            <p>Enter your authorized credentials to access your workspace.</p>
          </div>

          {error && (
            <div role="alert" className="auth-error-banner mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="size-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <label>
              Work email
              <div className="relative">
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@organisation.org"
                  disabled={loading}
                  autoComplete="email"
                />
              </div>
            </label>

            <label>
              Password
              <div className="input-with-action">
                <input
                  required
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  disabled={loading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </label>

            <div className="form-row">
              <span />
              <button
                type="button"
                className="inline-button"
                onClick={() => {
                  setResetEmail(email)
                  setShowResetModal(true)
                  setResetSent(false)
                  setError(null)
                }}
              >
                Forgot password?
              </button>
            </div>

            <Button
              type="submit"
              className="full-button"
              icon={loading ? undefined : 'arrow-up-right'}
              disabled={loading}
            >
              {loading ? 'Authenticating...' : 'Sign in'}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-black/[0.06] dark:border-white/[0.08] text-center">
            <button
              onClick={() => onNavigate('/privacy')}
              className="text-xs text-slate-gray hover:text-primary-text dark:hover:text-white transition-colors"
            >
              Privacy Policy & Security Architecture
            </button>
          </div>
        </div>
      </div>

      {showResetModal && (
        <div className="overlay" onMouseDown={() => setShowResetModal(false)}>
          <div className="command-dialog max-w-md p-6" onMouseDown={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Reset password">
            <h3 className="text-lg font-medium text-primary-text dark:text-white mb-2">Reset Password</h3>
            <p className="text-xs text-slate-gray mb-4">
              Enter your registered email address. If an account exists, a secure password recovery link will be sent.
            </p>

            {resetSent ? (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-emerald-800 dark:text-emerald-300 text-xs flex items-start gap-2.5 mb-4">
                <CheckCircle2 className="size-4 shrink-0 mt-0.5" />
                <span>Recovery instructions have been sent to your email. Check your inbox to proceed.</span>
              </div>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <input
                  type="email"
                  required
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="you@organisation.org"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-dark-card text-primary-text dark:text-white"
                  autoFocus
                />
                <div className="flex items-center justify-end gap-2">
                  <Button variant="ghost" onClick={() => setShowResetModal(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={resetLoading}>
                    {resetLoading ? 'Sending...' : 'Send reset email'}
                  </Button>
                </div>
              </form>
            )}

            {resetSent && (
              <div className="flex justify-end">
                <Button onClick={() => setShowResetModal(false)}>Close</Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
