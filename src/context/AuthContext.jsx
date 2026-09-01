import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

const AuthContext = createContext(null)

const DEMO_USERS = {
  admin: {
    id: 'demo-admin-mahim',
    email: 'mahim@shortbreak.com',
    name: 'Mahim (Cart Owner)',
    phone: '01641508111',
    role: 'admin'
  },
  user: {
    id: 'demo-user-id',
    email: 'tanvir@gmail.com',
    name: 'Tanvir Hasan',
    phone: '01812-345678',
    role: 'user'
  }
}

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
      console.error('fetchProfile catch:', err)
      return null
    }
  }

  useEffect(() => {
    let mounted = true

    async function initAuth() {
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
            setSession(null)
            setUser(null)
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
              setUser(null)
            }
          })

          setLoading(false)
          return () => subscription.unsubscribe()
        } catch (e) {
          console.error('Supabase auth init failed:', e)
          setLoading(false)
        }
      } else {
        // Fallback demo auth in localStorage
        const storedUser = localStorage.getItem('sb_current_user')
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser))
          } catch {
            setUser(DEMO_USERS.user)
          }
        } else {
          // Default to regular user in demo mode
          setUser(DEMO_USERS.user)
        }
        setLoading(false)
      }
    }

    initAuth()

    return () => {
      mounted = false
    }
  }, [])

  const signIn = async (email, password) => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
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
    }

    // Demo Mode Sign In
    const users = JSON.parse(localStorage.getItem('sb_users') || '[]')
    const matched = users.find(u => u.email.toLowerCase() === email.toLowerCase())
    
    if (matched) {
      if (matched.password && matched.password !== password) {
        throw new Error('Incorrect password. (Try "password123" for demo accounts)')
      }
      setUser(matched)
      localStorage.setItem('sb_current_user', JSON.stringify(matched))
      return matched
    }

    // If matches admin email
    if (email.toLowerCase().includes('admin')) {
      const adminUser = DEMO_USERS.admin
      setUser(adminUser)
      localStorage.setItem('sb_current_user', JSON.stringify(adminUser))
      return adminUser
    }

    // Auto-create demo user
    const newUser = {
      id: `user-${Date.now()}`,
      email,
      name: email.split('@')[0],
      phone: '+880 1700-000000',
      role: 'user'
    }
    setUser(newUser)
    localStorage.setItem('sb_current_user', JSON.stringify(newUser))
    return newUser
  }

  const signUp = async (email, password, metadata = {}) => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: metadata.name,
            phone: metadata.phone,
            role: 'user' // Default to user role
          }
        }
      })
      if (error) throw new Error(error.message)
      return data
    }

    // Demo Mode Sign Up
    const users = JSON.parse(localStorage.getItem('sb_users') || '[]')
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error('An account with this email already exists.')
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
      await supabase.auth.signOut()
    } else {
      localStorage.removeItem('sb_current_user')
    }
    setUser(null)
    setSession(null)
  }

  // Switch demo account on the fly for testing
  const switchDemoRole = (targetRole) => {
    const targetUser = targetRole === 'admin' ? DEMO_USERS.admin : DEMO_USERS.user
    setUser(targetUser)
    localStorage.setItem('sb_current_user', JSON.stringify(targetUser))
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
        switchDemoRole,
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
