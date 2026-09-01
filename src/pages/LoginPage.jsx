import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { LogIn, UserPlus, Flame, AlertCircle, Sparkles, KeyRound, Check, Phone, Mail, User, Lock, ArrowLeft } from 'lucide-react'

export function LoginPage({ onLoginSuccess, onNavigateHome }) {
  const { signIn, signUp, isSupabaseConfigured } = useAuth()
  const [isSignUp, setIsSignUp] = useState(true) // Default to Register for 1st-time visitors
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')

    if (!email || !password) {
      setErrorMsg('Please provide both email and password.')
      return
    }

    if (isSignUp && (!name.trim() || !phone.trim())) {
      setErrorMsg('Full Name and Phone Number are required. Admin will call this phone number to confirm your order!')
      return
    }

    try {
      setLoading(true)
      if (isSignUp) {
        await signUp(email, password, { name: name.trim(), phone: phone.trim() })
        setSuccessMsg('Account created successfully! Logging you in...')
        setTimeout(() => {
          onLoginSuccess?.()
        }, 800)
      } else {
        await signIn(email, password)
        onLoginSuccess?.()
      }
    } catch (err) {
      console.error('Auth error:', err)
      setErrorMsg(err.message || 'Authentication failed. Please check your details.')
    } finally {
      setLoading(false)
    }
  }

  // Quick fill demo credentials
  const fillDemoAccount = (role) => {
    if (role === 'admin') {
      setEmail('mahim@shortbreak.com')
      setPassword('password123')
      setName('Mahim (Cart Owner)')
      setPhone('01641508111')
    } else {
      setEmail('tanvir@gmail.com')
      setPassword('password123')
      setName('Tanvir Hasan')
      setPhone('01812-345678')
    }
    setErrorMsg('')
  }

  return (
    <div className="relative min-h-[92vh] flex items-center justify-center p-4 py-12 select-none overflow-hidden">
      
      {/* Real Food Cart Background Photograph */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src="/hero-cart.jpg"
          alt="শর্ট ব্রেক (Short Break) Cart Background"
          className="w-full h-full object-cover object-[center_30%]"
        />
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, rgba(14,12,10,0.65) 0%, rgba(14,12,10,0.85) 100%)'
          }}
        />
      </div>

      {/* Main Glassmorphic Card */}
      <div className="relative z-10 w-full max-w-md bg-[#161412]/95 text-white rounded-3xl border-4 border-amber-500 shadow-[8px_8px_0px_#000000] p-6 sm:p-8 backdrop-blur-md">
        
        {/* Top Header Badge */}
        <div className="flex items-center justify-center mb-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400/20 text-amber-300 border border-amber-400/40 rounded-full text-xs font-black uppercase tracking-wider">
            <Flame className="w-3.5 h-3.5 text-rose-500" />
            <span>শর্ট ব্রেক • Food Cart Portal</span>
          </div>
        </div>

        <div className="text-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-black text-amber-50 font-signage">
            {isSignUp ? 'Create Foodie Account' : 'Welcome to Short Break'}
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 mt-1">
            {isSignUp 
              ? 'Enter your name, email, phone & password to place orders'
              : 'Sign in to order and check your food cart receipts'}
          </p>
        </div>

        {/* Order Call Confirmation Notice */}
        <div className="mb-5 p-3 bg-amber-400/10 border border-amber-400/40 rounded-xl text-xs text-amber-200 flex items-start gap-2">
          <Phone className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="leading-tight">
            <strong>অর্ডার কনফার্মেশন:</strong> অর্ডার করার পর অ্যাডমিন এই নাম্বারে সরাসরি কল দিয়ে অর্ডার কনফার্ম করে গ্রিলে তুলবে!
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          
          {isSignUp && (
            <>
              {/* Full Name */}
              <div>
                <label className="block text-xs font-black text-stone-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-amber-400" />
                  Full Name (আপনার নাম) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tanvir Hasan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-stone-900/90 text-white rounded-xl border-2 border-stone-700 focus:border-amber-400 focus:outline-hidden font-medium placeholder:text-stone-500"
                />
              </div>

              {/* Phone Number - Mandatory */}
              <div>
                <label className="block text-xs font-black text-amber-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-amber-400" />
                  Phone Number (অর্ডার কনফার্মেশন নাম্বার) *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 01712-345678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-stone-900/90 text-amber-300 rounded-xl border-2 border-amber-500 focus:border-amber-300 focus:outline-hidden font-mono font-bold placeholder:text-stone-500"
                />
                <span className="text-[10px] text-stone-400 mt-1 block">
                  Admin will call this exact number to confirm your order.
                </span>
              </div>
            </>
          )}

          {/* Email */}
          <div>
            <label className="block text-xs font-black text-stone-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-amber-400" />
              Email Address (ইমেইল) *
            </label>
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-stone-900/90 text-white rounded-xl border-2 border-stone-700 focus:border-amber-400 focus:outline-hidden font-medium placeholder:text-stone-500"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-black text-stone-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              Password (পাসওয়ার্ড) *
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-stone-900/90 text-white rounded-xl border-2 border-stone-700 focus:border-amber-400 focus:outline-hidden font-medium placeholder:text-stone-500"
            />
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-950/80 border border-rose-500 text-rose-200 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-950/80 border border-emerald-500 text-emerald-200 rounded-xl text-xs flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 hero-candle-cta rounded-xl font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
            ) : isSignUp ? (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Create Account & Start Ordering</span>
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Sign In to Food Cart</span>
              </>
            )}
          </button>

        </form>

        {/* Toggle Login / SignUp */}
        <div className="mt-5 text-center text-xs font-bold text-stone-400">
          {isSignUp ? (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => { setIsSignUp(false); setErrorMsg('') }}
                className="text-amber-400 hover:underline font-black cursor-pointer ml-1"
              >
                Sign In here
              </button>
            </p>
          ) : (
            <p>
              New to Short Break?{' '}
              <button
                type="button"
                onClick={() => { setIsSignUp(true); setErrorMsg('') }}
                className="text-amber-400 hover:underline font-black cursor-pointer ml-1"
              >
                Create an account
              </button>
            </p>
          )}
        </div>

        {/* 1-Click Demo Logins */}
        <div className="mt-5 pt-4 border-t border-stone-800">
          <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-2 text-center">
            ⚡ Quick 1-Click Demo Credentials
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => fillDemoAccount('user')}
              className="py-2 px-2 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold rounded-lg border border-stone-600 flex items-center justify-center gap-1 cursor-pointer transition-colors"
            >
              <span>👤 Regular Customer</span>
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount('admin')}
              className="py-2 px-2 bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 text-xs font-bold rounded-lg border border-amber-400/40 flex items-center justify-center gap-1 cursor-pointer transition-colors"
            >
              <span>👑 Cart Admin</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
