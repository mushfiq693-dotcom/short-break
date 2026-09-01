import React, { useState, useRef, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { Logo } from './Logo'
import { 
  ShoppingBag, 
  Utensils, 
  ShieldCheck, 
  LogOut, 
  LogIn, 
  LayoutDashboard, 
  TrendingUp, 
  ChevronDown,
  Phone,
  ArrowLeft
} from 'lucide-react'

export function Navbar({ activePage, setActivePage }) {
  const { user, isAdmin, signOut, switchDemoRole, isSupabaseConfigured } = useAuth()
  const { totalCount, setIsCartOpen } = useCart()
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleNav = (page) => {
    setActivePage(page)
    setProfileDropdownOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // ---------------------------------------------------------------------------
  // 1. MINIMALIST SLEEK NAVBAR FOR LOGIN / REGISTRATION PAGE
  // ---------------------------------------------------------------------------
  if (activePage === 'login') {
    return (
      <header className="sticky top-0 z-40 bg-[#0E0C0A]/90 backdrop-blur-md text-white border-b border-amber-500/20 shadow-lg transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <Logo 
              size="md" 
              showSubtitle={true}
              onClick={() => handleNav('home')} 
            />

            <button
              onClick={() => handleNav('home')}
              className="px-3 py-1.5 bg-stone-900/90 hover:bg-stone-800 text-amber-300 font-bold text-xs rounded-xl border border-stone-700 hover:border-amber-400 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Menu</span>
            </button>
          </div>
        </div>
      </header>
    )
  }

  // ---------------------------------------------------------------------------
  // 2. ULTRA-COMPACT BG-RELEVANT NAVBAR (NO CLUTTER, SLIM HEIGHT)
  // ---------------------------------------------------------------------------
  return (
    <header className="sticky top-0 z-40 bg-[#0E0C0A]/85 backdrop-blur-md text-white border-b border-amber-500/20 shadow-xl transition-all select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          
          {/* Brand Logo */}
          <Logo 
            size="md" 
            showSubtitle={true}
            onClick={() => handleNav('home')} 
          />

          {/* Right Controls: Cart & Profile Dropdown (Sleek & Compact) */}
          <div className="flex items-center gap-2.5">
            
            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-stone-950 font-black rounded-xl border-2 border-stone-950 shadow-[2px_2px_0px_#BE123C] flex items-center gap-1.5 text-xs transition-all active:translate-y-0.5 cursor-pointer"
              aria-label="Open Cart"
            >
              <ShoppingBag className="w-3.5 h-3.5 stroke-[2.5]" />
              <span className="hidden sm:inline">Cart</span>
              {totalCount > 0 && (
                <span className="px-1.5 py-0.2 bg-rose-600 text-white text-[10px] font-black rounded-full animate-bounce">
                  {totalCount}
                </span>
              )}
            </button>

            {/* Profile / Auth Dropdown */}
            {user ? (
              <div className="relative" ref={dropdownRef}>
                
                {/* Profile Trigger Button */}
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className={`flex items-center gap-2 bg-[#1B1815]/90 hover:bg-[#25201C] text-stone-200 py-1 px-2.5 rounded-xl border-2 transition-all cursor-pointer ${
                    profileDropdownOpen 
                      ? 'border-amber-400 shadow-[0px_0px_10px_rgba(245,158,11,0.35)]' 
                      : 'border-stone-700/80 hover:border-amber-400/60'
                  }`}
                  aria-expanded={profileDropdownOpen}
                >
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-gradient-to-br from-rose-600 to-rose-700 text-white font-black flex items-center justify-center text-[11px] border border-amber-400 shadow-xs">
                    {user.name?.[0]?.toUpperCase() || 'U'}
                  </div>

                  <div className="hidden sm:block text-left leading-tight pr-0.5">
                    <div className="text-xs font-bold text-white truncate max-w-[95px]">
                      {user.name?.split(' ')[0] || user.email?.split('@')[0]}
                    </div>
                  </div>

                  <ChevronDown className={`w-3.5 h-3.5 text-stone-400 transition-transform duration-200 ${
                    profileDropdownOpen ? 'rotate-180 text-amber-400' : ''
                  }`} />
                </button>

                {/* Dropdown Menu Modal / Card */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-[#161412] text-white rounded-2xl border-3 border-amber-400 shadow-[8px_8px_0px_#000000] p-3.5 z-50 animate-slideUp backdrop-blur-md">
                    
                    {/* User Profile Header Card */}
                    <div className="bg-[#24201C] rounded-xl p-3 border border-stone-800 mb-2.5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-rose-600 text-white font-black text-sm flex items-center justify-center border-2 border-amber-400 shadow-xs shrink-0">
                          {user.name?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div className="overflow-hidden">
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-black text-white truncate">{user.name || 'Foodie'}</h4>
                            <span className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider ${
                              isAdmin ? 'bg-rose-600 text-white' : 'bg-amber-400 text-stone-950'
                            }`}>
                              {isAdmin ? 'Cart Admin' : 'Customer'}
                            </span>
                          </div>
                          {user.phone && (
                            <p className="text-xs text-amber-300 font-mono flex items-center gap-1 mt-0.5">
                              <Phone className="w-3 h-3" />
                              <span>{user.phone}</span>
                            </p>
                          )}
                          <p className="text-[11px] text-stone-400 truncate">{user.email}</p>
                        </div>
                      </div>
                    </div>

                    {/* Navigation Menu Options */}
                    <div className="space-y-1 text-xs sm:text-sm font-bold">
                      
                      {/* Browse Menu */}
                      <button
                        onClick={() => handleNav('home')}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all cursor-pointer ${
                          activePage === 'home'
                            ? 'bg-amber-400 text-stone-950 font-black shadow-xs'
                            : 'text-stone-300 hover:text-white hover:bg-stone-850'
                        }`}
                      >
                        <Utensils className="w-4 h-4 text-amber-400" />
                        <span>Browse 3 Specials Menu</span>
                      </button>

                      {/* Customer: User Dashboard */}
                      {!isAdmin && (
                        <button
                          onClick={() => handleNav('user-dashboard')}
                          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all cursor-pointer ${
                            activePage === 'user-dashboard'
                              ? 'bg-amber-400 text-stone-950 font-black shadow-xs'
                              : 'text-stone-300 hover:text-white hover:bg-stone-850'
                          }`}
                        >
                          <LayoutDashboard className="w-4 h-4 text-amber-400" />
                          <span>User Dashboard (My Orders)</span>
                        </button>
                      )}

                      {/* Admin: Kitchen Live Orders */}
                      {isAdmin && (
                        <>
                          <button
                            onClick={() => handleNav('admin-orders')}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all cursor-pointer ${
                              activePage === 'admin-orders'
                                ? 'bg-rose-600 text-white font-black shadow-xs'
                                : 'text-stone-300 hover:text-white hover:bg-stone-850'
                            }`}
                          >
                            <span className="flex items-center gap-2.5">
                              <ShieldCheck className="w-4 h-4 text-rose-400" />
                              <span>Kitchen Grill Orders</span>
                            </span>
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                          </button>

                          <button
                            onClick={() => handleNav('admin-sales')}
                            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all cursor-pointer ${
                              activePage === 'admin-sales'
                                ? 'bg-amber-400 text-stone-950 font-black shadow-xs'
                                : 'text-stone-300 hover:text-white hover:bg-stone-850'
                            }`}
                          >
                            <TrendingUp className="w-4 h-4 text-amber-400" />
                            <span>Sales & Revenue Analytics</span>
                          </button>
                        </>
                      )}
                    </div>

                    {/* Demo Mode Role Switch (Neatly placed inside dropdown) */}
                    {!isSupabaseConfigured && (
                      <div className="mt-2.5 pt-2.5 border-t border-stone-800">
                        <div className="flex items-center justify-between bg-[#1f1b18] p-2 rounded-xl border border-stone-800 text-xs">
                          <span className="text-stone-400 font-medium">Demo Role:</span>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => switchDemoRole('user')}
                              className={`px-2 py-0.5 rounded font-bold transition-all cursor-pointer ${
                                !isAdmin ? 'bg-amber-400 text-stone-950 font-black' : 'text-stone-400 hover:text-white'
                              }`}
                            >
                              User
                            </button>
                            <button
                              onClick={() => switchDemoRole('admin')}
                              className={`px-2 py-0.5 rounded font-bold transition-all cursor-pointer ${
                                isAdmin ? 'bg-rose-600 text-white font-black' : 'text-stone-400 hover:text-white'
                              }`}
                            >
                              Admin
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Sign Out Button */}
                    <div className="mt-2.5 pt-2.5 border-t border-stone-800">
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false)
                          signOut()
                        }}
                        className="w-full flex items-center justify-center gap-2 py-2 bg-stone-900 hover:bg-rose-950/80 text-rose-400 hover:text-rose-200 rounded-xl border border-rose-900/40 text-xs font-bold transition-all cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>

                  </div>
                )}

              </div>
            ) : (
              <button
                onClick={() => handleNav('login')}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-black bg-amber-400 hover:bg-amber-300 text-stone-950 rounded-xl transition-all shadow-[2px_2px_0px_#000] cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Sign In</span>
              </button>
            )}

          </div>

        </div>
      </div>
    </header>
  )
}
