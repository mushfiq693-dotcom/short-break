import React from 'react'
import { useAuth } from '../context/AuthContext'
import { ShieldAlert, ArrowLeft, KeyRound } from 'lucide-react'

export function AdminRoute({ children, onNavigateHome, onNavigateToLogin }) {
  const { user, isAdmin, loading, switchDemoRole, isSupabaseConfigured } = useAuth()

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-12 h-12 border-4 border-rose-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-stone-600 font-medium">Verifying kitchen supervisor credentials...</p>
      </div>
    )
  }

  if (!user || !isAdmin) {
    return (
      <div className="max-w-lg mx-auto my-16 p-8 bg-white border-2 border-stone-900 food-card-shadow rounded-2xl text-center">
        <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-stone-900">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <span className="inline-block px-3 py-1 bg-rose-100 text-rose-800 text-xs font-bold rounded-full mb-3 uppercase tracking-wider border border-rose-300">
          Admin Area Restricted
        </span>
        <h2 className="text-2xl font-black text-stone-900 mb-2">Access Denied</h2>
        <p className="text-stone-600 mb-6 text-sm leading-relaxed">
          {user 
            ? `You are logged in as "${user.name || user.email}" (Role: ${user.role}). Only users with role = "admin" in Supabase profiles can access the cart management portal.`
            : 'You must be logged in as an Admin to access the incoming orders manager and sales analytics.'}
        </p>

        <div className="space-y-3">
          {!isSupabaseConfigured && (
            <button
              onClick={() => switchDemoRole('admin')}
              className="w-full py-2.5 px-4 bg-amber-400 hover:bg-amber-500 text-stone-900 font-bold rounded-xl border-2 border-stone-900 flex items-center justify-center gap-2 text-sm transition-all"
            >
              <KeyRound className="w-4 h-4" />
              <span>Switch to Demo Admin Account (1-Click)</span>
            </button>
          )}

          <div className="flex gap-3">
            <button
              onClick={onNavigateHome}
              className="flex-1 py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold rounded-xl border-2 border-stone-900 flex items-center justify-center gap-2 text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Menu</span>
            </button>
            <button
              onClick={onNavigateToLogin}
              className="flex-1 py-2.5 px-4 food-btn-primary rounded-xl text-sm"
            >
              Login as Admin
            </button>
          </div>
        </div>

        {isSupabaseConfigured && (
          <div className="mt-6 pt-4 border-t border-stone-200 text-left">
            <p className="text-xs text-stone-500 font-mono">
              💡 Tip: To make this account an admin in Supabase, run:<br />
              <code className="block bg-stone-900 text-amber-300 p-2 rounded mt-1 font-mono text-[11px] overflow-x-auto">
                UPDATE public.profiles SET role = 'admin' WHERE email = '{user?.email || 'your-email@domain.com'}';
              </code>
            </p>
          </div>
        )}
      </div>
    )
  }

  return children
}
