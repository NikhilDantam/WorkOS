import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react'
import type { User, Session } from '@supabase/supabase-js'
import { supabase } from './supabase'

export interface UserProfile {
  id: string
  email: string | null
  full_name: string | null
  role: string | null
  avatar_url: string | null
}

interface AuthContextValue {
  user: User | null
  session: Session | null
  profile: UserProfile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
  signOut: () => Promise<{ error: Error | null }>
  resetPassword: (email: string) => Promise<{ error: Error | null }>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = useCallback(async (userId: string, userEmail?: string | null) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, full_name, role, avatar_url')
        .eq('id', userId)
        .maybeSingle()

      if (error) {
        console.error('Error fetching profile:', error.message)
      }

      if (data) {
        setProfile(data as UserProfile)
      } else {
        // Fall back to authenticated email
        setProfile({
          id: userId,
          email: userEmail ?? null,
          full_name: userEmail ? userEmail.split('@')[0] : 'User',
          role: 'Programme Administrator',
          avatar_url: null,
        })
      }
    } catch (err) {
      console.error('Error in fetchProfile:', err)
      setProfile({
        id: userId,
        email: userEmail ?? null,
        full_name: userEmail ? userEmail.split('@')[0] : 'User',
        role: 'Programme Administrator',
        avatar_url: null,
      })
    }
  }, [])

  useEffect(() => {
    let mounted = true

    // Retrieve initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id, session.user.email).finally(() => {
          if (mounted) setLoading(false)
        })
      } else {
        setProfile(null)
        setLoading(false)
      }
    }).catch((err) => {
      console.error('Error getting initial session:', err)
      if (mounted) setLoading(false)
    })

    // Listen to auth changes: SIGNED_IN, SIGNED_OUT, TOKEN_REFRESHED, INITIAL_SESSION
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      if (!mounted) return
      setSession(newSession)
      setUser(newSession?.user ?? null)

      if (newSession?.user) {
        await fetchProfile(newSession.user.id, newSession.user.email)
      } else {
        setProfile(null)
      }
      setLoading(false)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [fetchProfile])

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })
      return { error: error as Error | null }
    } catch (err) {
      return { error: err as Error }
    }
  }, [])

  const signOut = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut()
      setUser(null)
      setSession(null)
      setProfile(null)
      return { error: error as Error | null }
    } catch (err) {
      return { error: err as Error }
    }
  }, [])

  const resetPassword = useCallback(async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/app`,
      })
      return { error: error as Error | null }
    } catch (err) {
      return { error: err as Error }
    }
  }, [])

  const refreshProfile = useCallback(async () => {
    if (user?.id) {
      await fetchProfile(user.id, user.email)
    }
  }, [user, fetchProfile])

  const value = useMemo<AuthContextValue>(() => ({
    user,
    session,
    profile,
    loading,
    signIn,
    signOut,
    resetPassword,
    refreshProfile,
  }), [user, session, profile, loading, signIn, signOut, resetPassword, refreshProfile])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
