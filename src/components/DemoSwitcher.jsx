import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { DEMO_ACCOUNTS } from '../lib/storage'
import { Zap, ChevronUp, ChevronDown, Check, UserCheck, Shield, ShoppingBag, X } from 'lucide-react'

export function DemoSwitcher({ onSwitchRole }) {
  const { user, loginAsDemo, signOut } = useAuth()
  const { totalCount } = useCart()
  const [isOpen, setIsOpen] = useState(false)
  const [minimized, setMinimized] = useState(false)

  const hasStickyCart = user && totalCount > 0
  const bottomPositionClass = hasStickyCart 
    ? 'bottom-20 left-3 md:bottom-3 md:left-3' 
    : 'bottom-3 left-3'

  if (minimized) {
    return (
      <button
        onClick={() => setMinimized(false)}
        className={`fixed z-40 bg-stone-900/90 hover:bg-stone-850 text-amber-300 text-[11px] font-bold px-2.5 py-1.5 rounded-full border border-amber-500/30 shadow-lg backdrop-blur-md transition-all flex items-center gap-1.5 cursor-pointer ${bottomPositionClass}`}
        title="Open Demo Role Switcher"
      >
        <Zap className="w-3 h-3 text-amber-400 fill-amber-400" />
        <span>Demo</span>
      </button>
    )
  }

  const currentDemo = DEMO_ACCOUNTS.find(d => d.email === user?.email || d.id === user?.id)

  const handleSelect = (demo) => {
    loginAsDemo(demo.key)
    setIsOpen(false)
    onSwitchRole?.(demo.role === 'admin' ? 'admin-orders' : 'home')
  }

  const handleGuest = () => {
    signOut()
    setIsOpen(false)
    onSwitchRole?.('home')
  }

  return (
    <div className={`fixed z-40 select-none transition-all duration-300 ${bottomPositionClass}`}>
      {/* Dropdown Menu */}
      {isOpen && (
        <div className="mb-2 w-64 bg-[#161311]/95 backdrop-blur-md rounded-2xl border border-amber-500/30 shadow-[0_10px_30px_rgba(0,0,0,0.8)] p-2.5 animate-slideUp text-white">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-800 px-1">
            <span className="text-[11px] font-black text-amber-400 uppercase tracking-wider flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-400 fill-amber-400" /> Switch Demo Role
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-stone-400 hover:text-white p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-1">
            {DEMO_ACCOUNTS.map((demo) => {
              const isActive = user?.email === demo.email || user?.id === demo.id
              const isAdmin = demo.role === 'admin'
              return (
                <button
                  key={demo.id}
                  onClick={() => handleSelect(demo)}
                  className={`w-full text-left px-2.5 py-2 rounded-xl text-xs transition-all flex items-center justify-between cursor-pointer ${
                    isActive
                      ? 'bg-amber-400 text-stone-950 font-bold'
                      : 'hover:bg-stone-800 text-stone-300 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-xs">{isAdmin ? '👑' : '🍔'}</span>
                    <div className="truncate leading-tight">
                      <div className="font-bold truncate">{demo.name.split(' (')[0]}</div>
                      <div className={`text-[10px] ${isActive ? 'text-stone-800' : 'text-stone-400'}`}>
                        {isAdmin ? 'Cart Admin' : 'Customer'}
                      </div>
                    </div>
                  </div>
                  {isActive && <Check className="w-3.5 h-3.5 text-stone-950 stroke-[3]" />}
                </button>
              )
            })}

            {/* Guest Option */}
            <button
              onClick={handleGuest}
              className={`w-full text-left px-2.5 py-2 rounded-xl text-xs transition-all flex items-center justify-between cursor-pointer border-t border-stone-800/80 mt-1 pt-2 ${
                !user
                  ? 'bg-amber-400 text-stone-950 font-bold'
                  : 'hover:bg-stone-800 text-stone-400 hover:text-stone-200'
              }`}
            >
              <span className="flex items-center gap-2">
                <span>👤</span>
                <span>Guest (Logged Out)</span>
              </span>
              {!user && <Check className="w-3.5 h-3.5 text-stone-950 stroke-[3]" />}
            </button>
          </div>
        </div>
      )}

      {/* Main Trigger Bar Pill */}
      <div className="flex items-center gap-1 bg-[#161311]/90 backdrop-blur-md rounded-full border border-amber-500/30 shadow-lg px-2.5 py-1 text-xs text-stone-200">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 hover:text-amber-300 transition-colors cursor-pointer py-0.5"
        >
          <Zap className="w-3 h-3 text-amber-400 fill-amber-400" />
          <span className="text-[11px] font-bold text-amber-300">
            {user ? (currentDemo ? currentDemo.name.split(' (')[0] : user.name?.split(' ')[0]) : 'Guest'}
          </span>
          <span className="text-[10px] text-stone-400">
            ({user?.role === 'admin' ? 'Admin' : user ? 'User' : 'Guest'})
          </span>
          {isOpen ? <ChevronDown className="w-3 h-3 text-stone-400" /> : <ChevronUp className="w-3 h-3 text-stone-400" />}
        </button>

        <button
          onClick={() => setMinimized(true)}
          className="text-stone-500 hover:text-stone-300 p-0.5 ml-1 transition-colors"
          title="Minimize"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    </div>
  )
}
