import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { AmbientBackground } from '../components/AmbientBackground'
import { DEMO_ACCOUNTS } from '../lib/storage'
import { 
  Lock, 
  Mail, 
  User, 
  ArrowRight, 
  AlertCircle, 
  Phone,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Zap,
  KeyRound
} from 'lucide-react'

export function LoginPage({ onLoginSuccess, onNavigateHome }) {
  const { signIn, signUp, loginAsDemo } = useAuth()
  const [isSignUp, setIsSignUp] = useState(false)
  
  const [loginIdentifier, setLoginIdentifier] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  // 1-Click Demo Fast Login
  const handleQuickDemoLogin = (demoAccount) => {
    setErrorMsg('')
    setLoading(true)
    try {
      loginAsDemo(demoAccount.key)
      setSuccessMsg(`Logged in as ${demoAccount.name}!`)
      setTimeout(() => {
        onLoginSuccess?.()
      }, 400)
    } catch (err) {
      setErrorMsg('Failed to login as demo user.')
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')
    setLoading(true)

    try {
      if (isSignUp) {
        if (!name.trim()) throw new Error('Please enter your full name')
        
        const digitsOnly = phone.replace(/\D/g, '')
        if (!digitsOnly) {
          throw new Error('Phone number is required for order confirmation')
        }
        if (digitsOnly.length !== 11) {
          throw new Error('Phone number must be exactly 11 digits')
        }
        if (!/^01\d{9}$/.test(digitsOnly)) {
          throw new Error('Please enter a valid 11-digit mobile number starting with 01 (e.g. 01712345678)')
        }
        
        await signUp(email, password, { name: name.trim(), phone: digitsOnly })
        setSuccessMsg('Account created successfully! Welcome to Short Break.')
        setTimeout(() => {
          onLoginSuccess?.()
        }, 600)
      } else {
        await signIn(loginIdentifier, password)
        onLoginSuccess?.()
      }
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed. Please check your details.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AmbientBackground>
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 py-10 select-none">
        
        {/* Main Clean Minimal Glassmorphic Card */}
        <div className="glass-panel-dark relative z-10 w-full max-w-lg rounded-3xl p-6 sm:p-8 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-xl">
          
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 text-amber-300 text-xs font-bold mb-2.5 border border-amber-400/20">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Client Review & Demo Access</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-amber-50 font-signage">
              {isSignUp ? 'Create Foodie Account' : 'Sign In to Short Break'}
            </h2>
            <p className="text-stone-400 text-xs sm:text-sm mt-1">
              Select a 1-click demo role below or sign in with your credentials
            </p>
          </div>

          {/* 1-Click Instant Demo Login Panel */}
          <div className="mb-6 p-4 rounded-2xl bg-[#171412] border border-amber-500/20 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> 1-Click Demo Logins
              </span>
              <span className="text-[10px] text-stone-400 font-medium">No Password Required</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {DEMO_ACCOUNTS.map((demo) => {
                const isAdmin = demo.role === 'admin'
                return (
                  <button
                    key={demo.id}
                    type="button"
                    onClick={() => handleQuickDemoLogin(demo)}
                    className="group text-left p-2.5 rounded-xl bg-stone-900/90 hover:bg-stone-850 border border-stone-800 hover:border-amber-400/40 transition-all cursor-pointer flex items-center gap-2.5 shadow-xs"
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs shrink-0 border ${
                      isAdmin 
                        ? 'bg-rose-600/20 text-rose-400 border-rose-500/40 group-hover:bg-rose-600 group-hover:text-white transition-colors' 
                        : 'bg-amber-400/20 text-amber-300 border-amber-400/40 group-hover:bg-amber-400 group-hover:text-stone-950 transition-colors'
                    }`}>
                      {isAdmin ? '👑' : '🍔'}
                    </div>
                    <div className="overflow-hidden leading-tight flex-1">
                      <div className="text-xs font-bold text-white group-hover:text-amber-300 truncate transition-colors">
                        {demo.name.split(' (')[0]}
                      </div>
                      <div className="text-[10px] text-stone-400 font-mono truncate">
                        {isAdmin ? 'Cart Admin' : 'Customer'}
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-1 rounded-md bg-stone-800 text-stone-300 group-hover:bg-amber-400 group-hover:text-stone-950 font-bold transition-colors shrink-0">
                      Login →
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="relative flex py-1 items-center mb-5">
            <div className="flex-grow border-t border-stone-800" />
            <span className="shrink-0 mx-3 text-stone-500 text-[11px] uppercase font-bold tracking-widest">
              Or Manual Sign In
            </span>
            <div className="flex-grow border-t border-stone-800" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            
            {isSignUp ? (
              <>
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-amber-400" />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    autoComplete="name"
                    placeholder="e.g. Tanvir Hasan"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-3 text-base sm:text-sm bg-[#181512] text-white rounded-xl border border-stone-800 focus:border-amber-400 focus:outline-hidden font-medium placeholder:text-stone-600 transition-colors"
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-stone-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-amber-400" />
                      Phone Number *
                    </label>
                    <span className={`text-[10px] font-mono font-bold ${
                      phone.length === 11 ? 'text-emerald-400' : 'text-stone-500'
                    }`}>
                      {phone.length}/11 digits
                    </span>
                  </div>
                  <input
                    type="tel"
                    required
                    maxLength={11}
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="e.g. 01712345678"
                    value={phone}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 11)
                      setPhone(val)
                    }}
                    className="w-full px-3.5 py-3 text-base sm:text-sm bg-[#181512] text-white rounded-xl border border-stone-800 focus:border-amber-400 focus:outline-hidden font-mono placeholder:text-stone-600 transition-colors"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-amber-400" />
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    inputMode="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-3 text-base sm:text-sm bg-[#181512] text-white rounded-xl border border-stone-800 focus:border-amber-400 focus:outline-hidden font-medium placeholder:text-stone-600 transition-colors"
                  />
                </div>
              </>
            ) : (
              /* Sign In Identifier: Email or Phone Number */
              <div>
                <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-amber-400" />
                  Email or Phone Number
                </label>
                <input
                  type="text"
                  required
                  autoCapitalize="none"
                  autoCorrect="off"
                  autoComplete="username"
                  placeholder="e.g. mahim@shortbreak.com or 01641508111"
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  className="w-full px-3.5 py-3 text-base sm:text-sm bg-[#181512] text-white rounded-xl border border-stone-800 focus:border-amber-400 focus:outline-hidden font-medium placeholder:text-stone-600 transition-colors"
                />
              </div>
            )}

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                Password
              </label>
              <input
                type="password"
                required
                autoComplete="current-password"
                placeholder="password123 for demo"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-3 text-base sm:text-sm bg-[#181512] text-white rounded-xl border border-stone-800 focus:border-amber-400 focus:outline-hidden font-medium placeholder:text-stone-600 transition-colors"
              />
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="p-3 bg-rose-950/70 border border-rose-900/60 text-rose-200 text-xs rounded-xl flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Success Message */}
            {successMsg && (
              <div className="p-3 bg-emerald-950/70 border border-emerald-900/60 text-emerald-200 text-xs rounded-xl flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Minimal Clean Primary Submit CTA */}
            <button
              type="submit"
              disabled={loading}
              className="w-full min-h-[48px] py-3 px-4 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-bold rounded-xl text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow-md transition-all active:scale-[0.99] disabled:opacity-50 mt-3"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

          </form>

          {/* Toggle Sign In / Sign Up */}
          <div className="mt-5 text-center text-xs text-stone-400">
            {isSignUp ? (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(false)
                    setErrorMsg('')
                  }}
                  className="text-amber-400 hover:text-amber-300 font-bold transition-colors cursor-pointer"
                >
                  Sign In
                </button>
              </p>
            ) : (
              <p>
                New to Short Break?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(true)
                    setErrorMsg('')
                  }}
                  className="text-amber-400 hover:text-amber-300 font-bold transition-colors cursor-pointer"
                >
                  Create account
                </button>
              </p>
            )}
          </div>

        </div>

      </div>
    </AmbientBackground>
  )
}
