import React from 'react'
import { useAuth } from '../context/AuthContext'
import { AmbientBackground } from './AmbientBackground'
import { Lock, LogIn } from 'lucide-react'

export function ProtectedRoute({ children, onNavigateToLogin }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <AmbientBackground>
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
          <div className="w-10 h-10 border-3 border-amber-400 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-stone-300 font-medium text-xs">Checking authorization...</p>
        </div>
      </AmbientBackground>
    )
  }

  if (!user) {
    return (
      <AmbientBackground>
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
          <div className="max-w-md w-full glass-panel-dark rounded-3xl p-8 border border-amber-500/25 shadow-2xl text-center space-y-4">
            <div className="w-14 h-14 bg-amber-400/10 text-amber-400 rounded-2xl flex items-center justify-center mx-auto border border-amber-400/30">
              <Lock className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-black text-amber-50 font-display">Authentication Required</h2>
            <p className="text-stone-300 text-xs leading-relaxed">
              Please sign in or create an account to view your past food cart receipts and order live street food.
            </p>
            <button
              onClick={() => onNavigateToLogin ? onNavigateToLogin() : window.location.hash = '#login'}
              className="w-full py-3 px-6 hero-candle-cta rounded-xl font-bold uppercase tracking-wider flex items-center justify-center gap-2 text-xs cursor-pointer shadow-md"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In / Register</span>
            </button>
          </div>
        </div>
      </AmbientBackground>
    )
  }

  return children
}
