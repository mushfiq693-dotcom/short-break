import React from 'react'
import { useAuth } from '../context/AuthContext'
import { AmbientBackground } from './AmbientBackground'
import { ShieldAlert, ArrowLeft, LogIn } from 'lucide-react'

export function AdminRoute({ children, onNavigateHome, onNavigateToLogin }) {
  const { user, isAdmin, loading } = useAuth()

  if (loading) {
    return (
      <AmbientBackground>
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
          <div className="w-10 h-10 border-3 border-rose-500 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-stone-300 font-medium text-xs">Verifying kitchen supervisor credentials...</p>
        </div>
      </AmbientBackground>
    )
  }

  if (!user || !isAdmin) {
    return (
      <AmbientBackground>
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
          <div className="max-w-md w-full glass-panel-dark rounded-3xl p-8 border border-rose-500/30 shadow-2xl text-center space-y-4">
            <div className="w-14 h-14 bg-rose-500/10 text-rose-500 rounded-2xl flex items-center justify-center mx-auto border border-rose-500/30">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <span className="inline-block px-3 py-0.5 bg-rose-950/80 text-rose-300 text-[10px] font-bold rounded-full uppercase tracking-wider border border-rose-800/50">
              Admin Access Restricted
            </span>
            <h2 className="text-2xl font-black text-amber-50 font-display">Kitchen Manager Only</h2>
            <p className="text-stone-300 text-xs leading-relaxed">
              {user 
                ? `Logged in as "${user.name || user.email}". Only accounts with role = "admin" can access the live kitchen grill queue.`
                : 'You must be signed in as an Admin (Cart Owner) to view incoming live orders and sales analytics.'}
            </p>

            <div className="flex gap-2.5 pt-2">
              <button
                onClick={onNavigateHome}
                className="flex-1 py-2.5 px-4 bg-stone-900 hover:bg-stone-800 text-stone-200 rounded-xl border border-stone-700 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Menu</span>
              </button>
              <button
                onClick={onNavigateToLogin}
                className="flex-1 py-2.5 px-4 hero-candle-cta rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In as Admin</span>
              </button>
            </div>
          </div>
        </div>
      </AmbientBackground>
    )
  }

  return children
}
