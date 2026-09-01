import React, { useEffect, useState } from 'react'
import { getMenuItems } from '../lib/storage'
import { MenuItemCard } from '../components/MenuItemCard'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { 
  Flame, 
  Sparkles, 
  ShoppingBag, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  Zap, 
  ArrowDown, 
  Check,
  ChevronDown,
  User,
  LogIn,
  UserPlus,
  LayoutDashboard,
  PhoneCall
} from 'lucide-react'

export function HomePage({ onNavigateToOrders, onNavigateToLogin }) {
  const { user } = useAuth()
  const [menuItems, setMenuItems] = useState([])
  const [loading, setLoading] = useState(true)
  const { totalCount, totalAmount, setIsCartOpen } = useCart()

  useEffect(() => {
    async function loadMenu() {
      try {
        const items = await getMenuItems()
        setMenuItems(items)
      } catch (err) {
        console.error('Failed to load menu items:', err)
      } finally {
        setLoading(false)
      }
    }
    loadMenu()
  }, [])

  return (
    <div className="bg-[#0E0C0A] min-h-screen pb-24 text-stone-100">
      
      {/* Full-Bleed Atmospheric Hero Section */}
      <section className="relative w-full h-[90vh] sm:h-[95vh] min-h-[600px] max-h-[1100px] overflow-hidden flex flex-col justify-end text-white border-b border-amber-500/20 select-none">
        
        {/* Background Real Hero Photograph */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <img
            src="/hero-cart.jpg"
            alt="শর্ট ব্রেক (Short Break) Roadside Food Cart at Night"
            className="w-full h-full object-cover object-[center_28%] sm:object-[center_32%] hero-ken-burns"
          />
          
          {/* Directional Scrim Overlay: Top stays luminous; Bottom darkens for UI text contrast */}
          <div 
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to bottom, rgba(14,12,10,0.4) 0%, rgba(14,12,10,0.05) 25%, rgba(14,12,10,0.4) 60%, rgba(14,12,10,0.88) 88%, rgba(14,12,10,0.98) 100%)'
            }}
          />

          {/* Dedicated Lower-Third Scrim for Bulletproof Text Contrast */}
          <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-[#0E0C0A] via-[#0E0C0A]/90 to-transparent" />
        </div>

        {/* Hero Content positioned strictly in the darkened lower third */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 sm:pb-14 w-full">
          <div className="max-w-2xl space-y-4">
            
            {/* Headline with Signage Serif Harmony */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-amber-50 font-signage leading-[1.12] drop-shadow-md">
              Evening Street Snacks, <br />
              <span className="text-amber-400 italic font-bold">
                Cooked Hot on the Roadside.
              </span>
            </h1>

            {/* Clean Tagline / Welcome Back User */}
            <p className="text-stone-300 text-sm sm:text-base font-normal max-w-lg leading-relaxed drop-shadow-xs">
              {user ? (
                <>Welcome back, <strong className="text-amber-300 font-bold">{user.name}</strong>!</>
              ) : (
                <>Sizzling Meat Boxes, grilled artisan chicken sandwiches, and crispy peri-peri fries in Kalapara.</>
              )}
            </p>

            {/* CTA Action Cluster */}
            <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-3.5 flex-wrap">
              
              {/* Warm Amber Candle-Flame Primary CTA with Smooth Scroll (No Hash Jump) */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-amber-500/40 rounded-2xl blur-md candle-glow-pulse group-hover:bg-amber-500/70 transition-all pointer-events-none" />
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('menu-section')
                    if (el) el.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="relative inline-flex items-center gap-2.5 hero-candle-cta px-7 py-3.5 rounded-xl text-sm sm:text-base font-extrabold uppercase tracking-wider cursor-pointer"
                >
                  <span>See The 3 Specials</span>
                  <ArrowDown className="w-4 h-4 stroke-[3]" />
                </button>
              </div>

              {/* Login Quick Action if guest */}
              {!user && (
                <button
                  onClick={onNavigateToLogin}
                  className="inline-flex items-center gap-2 bg-[#201C18]/90 hover:bg-[#2C2722] text-amber-300 font-black px-6 py-3.5 rounded-xl text-sm border border-amber-400/50 shadow-lg backdrop-blur-xs transition-all cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Sign In / Register</span>
                </button>
              )}

              {/* Fast Badges */}
              <div className="hidden sm:flex items-center gap-3 text-xs font-bold text-stone-300 bg-[#161412]/80 px-3.5 py-2.5 rounded-xl border border-white/10 backdrop-blur-xs">
                <span className="flex items-center gap-1 text-amber-400">
                  <MapPin className="w-3.5 h-3.5" /> Helipad, Kalapara
                </span>
                <span className="text-stone-600">•</span>
                <span className="flex items-center gap-1 text-amber-400">
                  <Zap className="w-3.5 h-3.5" /> 10-Min Live Prep
                </span>
                <span className="text-stone-600">•</span>
                <span className="flex items-center gap-1 text-emerald-400">
                  <ShieldCheck className="w-3.5 h-3.5" /> 100% Halal
                </span>
              </div>

            </div>

          </div>
        </div>

        {/* Bottom Arrow Anchor (Smooth Scroll Button) */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 hidden sm:block opacity-60 hover:opacity-100 transition-opacity">
          <button 
            type="button"
            onClick={() => {
              const el = document.getElementById('menu-section')
              if (el) el.scrollIntoView({ behavior: 'smooth' })
            }}
            className="text-amber-200/70 hover:text-amber-300 text-xs flex flex-col items-center gap-0.5 cursor-pointer bg-transparent border-0"
          >
            <span className="text-[10px] uppercase font-mono tracking-widest">Menu</span>
            <ChevronDown className="w-4 h-4 animate-bounce" />
          </button>
        </div>

      </section>

      {/* Main Menu Section (Cohesive Dark Ambient Background Below the Hero) */}
      <section id="menu-section" className="cart-pattern-bg max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        
        {/* Section Heading */}
        <div className="text-center max-w-xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400/15 text-amber-300 text-xs font-black rounded-full mb-3 uppercase tracking-widest border border-amber-400/30">
            <Flame className="w-3.5 h-3.5 text-rose-500" />
            <span>Hand-Crafted Menu • Helipad, Kalapara</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-amber-50 font-display">
            The Fixed 3 Specials
          </h2>
          <p className="text-stone-300 text-sm sm:text-base mt-2">
            No long waiting times. Choose your favorites and pick up fresh off the grill.
          </p>
        </div>

        {/* 3 Menu Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map(n => (
              <div key={n} className="glass-panel-dark rounded-3xl h-96 animate-pulse p-6 border border-white/10">
                <div className="bg-stone-800 h-48 rounded-2xl mb-4" />
                <div className="bg-stone-800 h-6 w-3/4 rounded mb-2" />
                <div className="bg-stone-800 h-4 w-full rounded mb-2" />
                <div className="bg-stone-800 h-10 w-full rounded mt-6" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {menuItems.map((item, index) => (
              <MenuItemCard
                key={item.id}
                item={item}
                rankNumber={index + 1}
                onRequireLogin={onNavigateToLogin}
              />
            ))}
          </div>
        )}

        {/* Roadside Spot & Ordering Banner */}
        <div className="mt-20 glass-panel-dark rounded-3xl p-8 sm:p-10 border border-amber-500/25 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            
            <div className="space-y-3 md:col-span-2">
              <span className="text-xs font-black text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-rose-500" /> Helipad, Kalapara, Patuakhali
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white font-display">
                Ready in Minutes • Collect from Cart or Home Delivery
              </h3>
              <p className="text-sm text-stone-300 leading-relaxed max-w-xl">
                Place your order with your phone number. Admin calls to confirm, grills your food fresh, and lets you know when it's ready!
              </p>

              {/* Direct Hotline Calls */}
              <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-mono">
                <span className="text-stone-400 font-bold uppercase tracking-wider text-[11px] font-sans">
                  Direct Hotline:
                </span>
                <a
                  href="tel:01641508111"
                  className="inline-flex items-center gap-1.5 bg-[#1F1C18] hover:bg-[#2A2621] text-amber-300 px-3.5 py-1.5 rounded-xl border border-amber-400/30 transition-all font-bold shadow-xs hover:border-amber-400/60"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Mahim: 01641508111</span>
                </a>
                <a
                  href="tel:01641508100"
                  className="inline-flex items-center gap-1.5 bg-[#1F1C18] hover:bg-[#2A2621] text-amber-300 px-3.5 py-1.5 rounded-xl border border-amber-400/30 transition-all font-bold shadow-xs hover:border-amber-400/60"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Raj: 01641508100</span>
                </a>
              </div>
            </div>

            <div className="text-center md:text-right">
              <button
                onClick={() => setIsCartOpen(true)}
                className="w-full sm:w-auto hero-candle-cta px-6 py-3.5 rounded-xl text-sm font-black uppercase tracking-wider inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
                <span>Open Cart ({totalCount})</span>
              </button>
            </div>

          </div>
        </div>

      </section>

      {/* Floating Bottom Sticky Bar on Mobile when items in cart */}
      {totalCount > 0 && (
        <div className="fixed bottom-4 left-4 right-4 z-40 md:hidden animate-slideUp">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full hero-candle-cta text-stone-950 py-3.5 px-5 rounded-2xl shadow-xl flex items-center justify-between font-black text-sm active:translate-y-1"
          >
            <div className="flex items-center gap-2">
              <span className="bg-stone-950 text-amber-300 w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono">
                {totalCount}
              </span>
              <span>View Cart Order</span>
            </div>
            <span className="text-base font-display font-bold">৳{totalAmount} →</span>
          </button>
        </div>
      )}

    </div>
  )
}
