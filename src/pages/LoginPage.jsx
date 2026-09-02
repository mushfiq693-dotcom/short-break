import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { AmbientBackground } from '../components/AmbientBackground'
import { 
  Lock, 
  Mail, 
  User, 
  ArrowRight, 
  AlertCircle, 
  Phone,
  Flame,
  CheckCircle2,
  PhoneCall
} from 'lucide-react'

export function LoginPage({ onLoginSuccess, onNavigateHome }) {
  const { signIn, signUp } = useAuth()
  const [isSignUp, setIsSignUp] = useState(false)
  
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
    setLoading(true)

    try {
      if (isSignUp) {
        if (!name.trim()) throw new Error('Please enter your full name')
        if (!phone.trim()) throw new Error('Phone number is required for order confirmation')
        
        await signUp(email, password, { name, phone })
        setSuccessMsg('Account created successfully! Welcome to Short Break.')
        setTimeout(() => {
          onLoginSuccess?.()
        }, 1200)
      } else {
        await signIn(email, password)
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
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 py-12 select-none">
        
        {/* Main Glassmorphic Card */}
        <div className="glass-panel-dark relative z-10 w-full max-w-md rounded-3xl p-6 sm:p-8 border border-[rgba(255,235,200,0.18)] shadow-[0_16px_48px_rgba(0,0,0,0.65)]">
          
          {/* Top Header Badge */}
          <div className="flex items-center justify-center mb-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-amber-400/20 text-amber-300 border border-amber-400/40 rounded-full text-xs font-black uppercase tracking-wider">
              <Flame className="w-3 h-3 text-rose-500" />
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
          <div className="mb-5 p-3 bg-amber-400/10 border border-amber-400/30 rounded-xl text-xs text-amber-200 flex items-start gap-2">
            <PhoneCall className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
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
                  <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-amber-400" />
                    Full Name (আপনার নাম) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tanvir Hasan"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-[#1A1613] text-white rounded-xl border border-stone-700 focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50 focus:outline-hidden font-medium placeholder:text-stone-500 transition-all"
                  />
                </div>

                {/* Phone Number - Mandatory */}
                <div>
                  <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-amber-400" />
                    Phone Number (অর্ডার কনফার্মেশন নাম্বার) *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 01712-345678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-[#1A1613] text-amber-300 rounded-xl border border-amber-400/50 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 focus:outline-hidden font-mono font-bold placeholder:text-stone-600 transition-all"
                  />
                  <p className="text-[10px] text-stone-400 mt-1">Admin will call this exact number to confirm your order.</p>
                </div>
              </>
            )}

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                Email Address (ইমেইল) *
              </label>
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-[#1A1613] text-white rounded-xl border border-stone-700 focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50 focus:outline-hidden font-medium placeholder:text-stone-500 transition-all"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                Password (পাসওয়ার্ড) *
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-[#1A1613] text-white rounded-xl border border-stone-700 focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50 focus:outline-hidden font-medium placeholder:text-stone-500 transition-all"
              />
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="p-3 bg-rose-950/80 border border-rose-800 text-rose-200 text-xs rounded-xl flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Success Message */}
            {successMsg && (
              <div className="p-3 bg-emerald-950/80 border border-emerald-800 text-emerald-200 text-xs rounded-xl flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Submit CTA */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 hero-candle-cta rounded-xl font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50 transition-all mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-stone-900 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>{isSignUp ? 'Create Account & Start Ordering' : 'Sign In & Order Food'}</span>
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
                  className="text-amber-400 hover:text-amber-300 font-bold underline cursor-pointer"
                >
                  Sign In here
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
                  className="text-amber-400 hover:text-amber-300 font-bold underline cursor-pointer"
                >
                  Create an account
                </button>
              </p>
            )}
          </div>

        </div>

      </div>
    </AmbientBackground>
  )
}
