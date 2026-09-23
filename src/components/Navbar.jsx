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
  ArrowLeft,
  Sparkles
} from 'lucide-react'

export function Navbar({ activePage, setActivePage }) {
  const { user, isAdmin, signOut } = useAuth()
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

  const handleNav = (page, scrollToMenu = false) => {
    setActivePage(page, scrollToMenu)
    setProfileDropdownOpen(false)
  }

  // 1. MINIMALIST NAVBAR FOR LOGIN / REGISTRATION PAGE
  if (activePage === 'login') {
    return (
      <header className="sticky top-0 z-40 bg-[#0E0C0A]/90 backdrop-blur-md text-white border-b border-white/10 transition-all select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <Logo 
              size="md" 
              onClick={() => handleNav('home')} 
            />

            <button
              onClick={() => handleNav('home', true)}
              className="px-3.5 py-1.5 bg-stone-900/90 hover:bg-stone-800 text-stone-200 hover:text-amber-300 font-bold text-xs rounded-xl border border-stone-800 hover:border-amber-400/40 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Menu</span>
            </button>
          </div>
        </div>
      </header>
    )
  }

  // 2. MAIN MODERN SLEEK NAVBAR
  return (
    <header className="sticky top-0 z-40 bg-[#0E0C0A]/90 backdrop-blur-md text-white border-b border-white/10 transition-all select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          
          {/* Brand Logo */}
          <Logo 
            size="md" 
            onClick={() => handleNav('home')} 
          />

          {/* Right Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {user ? (
              <>
                {/* Minimal Cart Button */}
                <button
                  onClick={() => setIsCartOpen(true)}
                  className="relative px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold rounded-xl border border-amber-300/40 flex items-center gap-1.5 text-xs transition-all active:scale-95 cursor-pointer shadow-xs"
                  aria-label="Open Cart"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline font-bold">Cart</span>
                  {totalCount > 0 && (
                    <span className="px-1.5 py-0.2 bg-rose-600 text-white text-[10px] font-black rounded-full">
                      {totalCount}
                    </span>
                  )}
                </button>

                {/* Profile / Auth Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  
                  {/* Profile Trigger Button (Minimal Sleek Pill) */}
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className={`flex items-center gap-2 bg-[#171412] hover:bg-[#201C18] text-stone-200 py-1.5 px-2.5 rounded-xl border transition-all cursor-pointer ${
                      profileDropdownOpen 
                        ? 'border-amber-400/60 shadow-xs' 
                        : 'border-stone-800 hover:border-stone-700'
                    }`}
                    aria-expanded={profileDropdownOpen}
                  >
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-rose-600 to-rose-700 text-white font-bold flex items-center justify-center text-[11px] border border-white/10 shadow-xs">
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
                    <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-[#161311]/95 text-white rounded-2xl border border-white/10 shadow-[0_16px_40px_rgba(0,0,0,0.8)] p-3 z-50 animate-slideUp backdrop-blur-xl">
                      
                      {/* User Profile Header Card */}
                      <div className="bg-[#201C18] rounded-xl p-3 border border-stone-800 mb-2.5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-600 to-rose-700 text-white font-black text-sm flex items-center justify-center border border-white/10 shadow-xs shrink-0">
                            {user.name?.[0]?.toUpperCase() || 'U'}
                          </div>
                          <div className="overflow-hidden">
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-bold text-white truncate">{user.name || 'Foodie'}</h4>
                              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                                isAdmin ? 'bg-rose-600 text-white' : 'bg-amber-400 text-stone-950'
                              }`}>
                                {isAdmin ? 'Admin' : 'Customer'}
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
                      <div className="space-y-1 text-xs sm:text-sm font-semibold">
                        
                        {/* Browse Menu */}
                        <button
                          onClick={() => handleNav('home', true)}
                          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all cursor-pointer ${
                            activePage === 'home'
                              ? 'bg-amber-400 text-stone-950 font-bold shadow-xs'
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
                            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all cursor-pointer ${
                              activePage === 'user-dashboard'
                                ? 'bg-amber-400 text-stone-950 font-bold shadow-xs'
                                : 'text-stone-300 hover:text-white hover:bg-stone-850'
                            }`}
                          >
                            <LayoutDashboard className="w-4 h-4 text-amber-400" />
                            <span>My Orders Dashboard</span>
                          </button>
                        )}

                        {/* Admin: Kitchen Live Orders */}
                        {isAdmin && (
                          <>
                            <button
                              onClick={() => handleNav('admin-orders')}
                              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all cursor-pointer ${
                                activePage === 'admin-orders'
                                  ? 'bg-rose-600 text-white font-bold shadow-xs'
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
                              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all cursor-pointer ${
                                activePage === 'admin-sales'
                                  ? 'bg-amber-400 text-stone-950 font-bold shadow-xs'
                                  : 'text-stone-300 hover:text-white hover:bg-stone-850'
                              }`}
                            >
                              <TrendingUp className="w-4 h-4 text-amber-400" />
                              <span>Sales & Analytics</span>
                            </button>
                          </>
                        )}
                      </div>

                      {/* Sign Out Button */}
                      <div className="mt-2.5 pt-2.5 border-t border-stone-800">
                        <button
                          onClick={() => {
                            setProfileDropdownOpen(false)
                            signOut()
                          }}
                          className="w-full flex items-center justify-center gap-2 py-2 bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-rose-300 rounded-xl border border-stone-800 text-xs font-semibold transition-all cursor-pointer"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Sign Out</span>
                        </button>
                      </div>

                    </div>
                  )}

                </div>
              </>
            ) : (
              /* Guest: Minimal Sign In Button */
              <button
                onClick={() => handleNav('login')}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold bg-amber-400 hover:bg-amber-300 text-stone-950 rounded-xl transition-all shadow-xs cursor-pointer active:scale-95"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In / Demo</span>
              </button>
            )}

          </div>

        </div>
      </div>
    </header>
  )
}
