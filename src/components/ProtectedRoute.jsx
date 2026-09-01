import React from 'react'
import { useAuth } from '../context/AuthContext'
import { Lock, LogIn } from 'lucide-react'

export function ProtectedRoute({ children, onNavigateToLogin }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-stone-600 font-medium">Checking your appetite...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white border-2 border-stone-900 food-card-shadow rounded-2xl text-center">
        <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-stone-900">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-stone-900 mb-2">Login Required</h2>
        <p className="text-stone-600 mb-6 text-sm">
          Please log in or create an account to view your past orders and track your food cart deliveries.
        </p>
        <button
          onClick={() => onNavigateToLogin ? onNavigateToLogin() : window.location.hash = '#login'}
          className="w-full py-3 px-6 food-btn-primary rounded-xl flex items-center justify-center gap-2 text-base"
        >
          <LogIn className="w-5 h-5" />
          <span>Login / Sign Up</span>
        </button>
      </div>
    )
  }

  return children
}
