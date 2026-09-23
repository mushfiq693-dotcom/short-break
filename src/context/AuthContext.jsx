import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { DEMO_ACCOUNTS, initializeStorage } from '../lib/storage'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  // Fetch or sync user profile from Supabase
  const fetchProfile = async (authUserId, fallbackEmail) => {
    try {
      if (!isSupabaseConfigured || !supabase) return null
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUserId)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.warn('Error fetching profile from Supabase:', error.message)
      }

      if (data) {
        return data
      }

      // If profile row doesn't exist yet, return basic user info
      return {
        id: authUserId,
        email: fallbackEmail,
        name: fallbackEmail?.split('@')[0] || 'User',
        role: 'user'
      }
    } catch (err) {
      console.warn('fetchProfile catch:', err)
      return null
    }
  }

  useEffect(() => {
    let mounted = true

    async function initAuth() {
      // Check for URL-based demo login parameter (e.g. ?demo=admin, ?demo=raj, ?demo=customer)
      try {
        const urlParams = new URLSearchParams(window.location.search)
        const hashQuery = window.location.hash.includes('?') 
          ? new URLSearchParams(window.location.hash.split('?')[1]) 
          : null
        const demoParam = urlParams.get('demo') || hashQuery?.get('demo')

        if (demoParam) {
          const match = DEMO_ACCOUNTS.find(
            d => d.key === demoParam || d.key.includes(demoParam) || d.role === demoParam
          )
          if (match) {
            setUser(match)
            localStorage.setItem('sb_current_user', JSON.stringify(match))
            setLoading(false)
            return
          }
        }
      } catch {}

      if (isSupabaseConfigured && supabase) {
        try {
          const { data: { session: currentSession } } = await supabase.auth.getSession()
          if (!mounted) return

          if (currentSession?.user) {
            setSession(currentSession)
            const profile = await fetchProfile(currentSession.user.id, currentSession.user.email)
            setUser({
              id: currentSession.user.id,
              email: currentSession.user.email,
              name: profile?.name || currentSession.user.user_metadata?.full_name || currentSession.user.email?.split('@')[0],
              phone: profile?.phone || currentSession.user.user_metadata?.phone || '',
              role: profile?.role || 'user'
            })
          } else {
            // Check local demo session fallback
            const stored = localStorage.getItem('sb_current_user')
            if (stored) {
              setUser(JSON.parse(stored))
            } else {
              setSession(null)
              setUser(null)
            }
          }

          const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
            if (!mounted) return
            setSession(newSession)
            if (newSession?.user) {
              const profile = await fetchProfile(newSession.user.id, newSession.user.email)
              setUser({
                id: newSession.user.id,
                email: newSession.user.email,
                name: profile?.name || newSession.user.user_metadata?.full_name || newSession.user.email?.split('@')[0],
                phone: profile?.phone || newSession.user.user_metadata?.phone || '',
                role: profile?.role || 'user'
              })
            } else {
              const stored = localStorage.getItem('sb_current_user')
              if (stored) {
                setUser(JSON.parse(stored))
              } else {
                setUser(null)
              }
            }
          })

          setLoading(false)
          return () => subscription.unsubscribe()
        } catch (e) {
          console.warn('Supabase auth init failed, fallback to LocalStorage:', e.message)
          const storedUser = localStorage.getItem('sb_current_user')
          if (storedUser) {
            try { setUser(JSON.parse(storedUser)) } catch { setUser(null) }
          }
          setLoading(false)
        }
      } else {
        // Standalone LocalStorage Auth (for Vercel without Supabase limits)
        initializeStorage()
        const storedUser = localStorage.getItem('sb_current_user')
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser))
          } catch {
            setUser(null)
          }
        } else {
          setUser(null)
        }
        setLoading(false)
      }
    }

    initAuth()

    return () => {
      mounted = false
    }
  }, [])

  // 1-Click Instant Demo Login Method
  const loginAsDemo = (demoKeyOrEmail = 'customer-tanvir') => {
    initializeStorage()
    const target = DEMO_ACCOUNTS.find(
      d => d.key === demoKeyOrEmail || 
           d.email === demoKeyOrEmail || 
           d.role === demoKeyOrEmail || 
           d.id === demoKeyOrEmail
    ) || DEMO_ACCOUNTS[2] // default to Tanvir (Customer)

    setUser(target)
    localStorage.setItem('sb_current_user', JSON.stringify(target))
    return target
  }

  const signIn = async (identifier, password) => {
    const raw = (identifier || '').trim()
    if (!raw) throw new Error('Please enter your email or phone number.')

    const isEmail = raw.includes('@')
    const digitsOnly = raw.replace(/\D/g, '')

    // Quick check for Demo Accounts first (Instant, No Quota, 100% Reliable)
    const demoMatch = DEMO_ACCOUNTS.find(d => {
      if (isEmail) return d.email.toLowerCase() === raw.toLowerCase()
      return d.phone.replace(/\D/g, '') === digitsOnly || d.phone === raw
    })

    if (demoMatch) {
      if (password && password !== demoMatch.password && password !== 'password123') {
        throw new Error('Incorrect password. For demo accounts, use password123 or click the 1-Click Demo buttons below.')
      }
      setUser(demoMatch)
      localStorage.setItem('sb_current_user', JSON.stringify(demoMatch))
      return demoMatch
    }

    if (isSupabaseConfigured && supabase) {
      try {
        let loginEmail = raw
        if (!isEmail) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('email')
            .or(`phone.eq.${digitsOnly},phone.eq.${raw}`)
            .maybeSingle()

          if (profile?.email) {
            loginEmail = profile.email
          } else {
            throw new Error('No account found with this phone number. Please create an account first.')
          }
        }

        const { data, error } = await supabase.auth.signInWithPassword({ email: loginEmail, password })
        if (error) throw new Error(error.message)
        const profile = await fetchProfile(data.user.id, data.user.email)
        const fullUser = {
          id: data.user.id,
          email: data.user.email,
          name: profile?.name || data.user.user_metadata?.full_name || data.user.email?.split('@')[0],
          phone: profile?.phone || '',
          role: profile?.role || 'user'
        }
        setUser(fullUser)
        return fullUser
      } catch (err) {
        console.warn('Supabase signIn encountered error:', err.message)
        // Check local storage users before throwing
        const localUsers = JSON.parse(localStorage.getItem('sb_users') || '[]')
        const matchedLocal = localUsers.find(u => {
          if (isEmail) return u.email && u.email.toLowerCase() === raw.toLowerCase()
          return (u.phone && u.phone.replace(/\D/g, '') === digitsOnly) || u.phone === raw
        })
        if (matchedLocal) {
          setUser(matchedLocal)
          localStorage.setItem('sb_current_user', JSON.stringify(matchedLocal))
          return matchedLocal
        }
        throw err
      }
    }

    // Local Storage Sign In
    initializeStorage()
    const users = JSON.parse(localStorage.getItem('sb_users') || '[]')
    const matched = users.find(u => {
      if (isEmail) {
        return u.email && u.email.toLowerCase() === raw.toLowerCase()
      } else {
        const uPhoneDigits = (u.phone || '').replace(/\D/g, '')
        return (uPhoneDigits && uPhoneDigits === digitsOnly) || u.phone === raw
      }
    })

    if (matched) {
      if (matched.password && matched.password !== password) {
        throw new Error('Incorrect password. Please verify your credentials.')
      }
      setUser(matched)
      localStorage.setItem('sb_current_user', JSON.stringify(matched))
      return matched
    }

    if (isEmail) {
      throw new Error('No account found with this email. Use a 1-Click Demo account or register below.')
    } else {
      throw new Error('No account found with this phone number. Use a 1-Click Demo account or register below.')
    }
  }

  const signUp = async (email, password, metadata = {}) => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: metadata.name,
              phone: metadata.phone,
              role: 'user'
            }
          }
        })
        if (!error && data?.user) return data
      } catch (err) {
        console.warn('Supabase signUp error, continuing with local storage:', err.message)
      }
    }

    // Local Storage Sign Up fallback
    initializeStorage()
    const users = JSON.parse(localStorage.getItem('sb_users') || '[]')
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error('An account with this email already exists. Please sign in.')
    }

    const newUser = {
      id: `user-${Date.now()}`,
      email,
      name: metadata.name || email.split('@')[0],
      phone: metadata.phone || '',
      role: 'user',
      password
    }
    users.push(newUser)
    localStorage.setItem('sb_users', JSON.stringify(users))
    localStorage.setItem('sb_current_user', JSON.stringify(newUser))
    setUser(newUser)
    return { user: newUser }
  }

  const signOut = async () => {
    if (isSupabaseConfigured && supabase) {
      try { await supabase.auth.signOut() } catch {}
    }
    localStorage.removeItem('sb_current_user')
    setUser(null)
    setSession(null)
  }

  const isAdmin = user?.role === 'admin'

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        role: user?.role || null,
        isAdmin,
        loading,
        signIn,
        signUp,
        signOut,
        loginAsDemo,
        isSupabaseConfigured
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}
