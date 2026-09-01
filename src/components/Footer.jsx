import React from 'react'
import { MapPin, Clock, Flame, PhoneCall } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-[#100E0C] text-stone-300 border-t border-amber-500/20 pt-12 pb-8 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Top Grid: Brand & Cart Spot / Owner Hotlines (Clean 2-Column Layout) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Brand Info */}
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-7 h-7 bg-gradient-to-br from-rose-600 to-rose-700 rounded-lg flex items-center justify-center font-black text-white text-xs border border-amber-400/50 shadow-xs">
                SB
              </div>
              <span className="text-lg font-black text-white font-display tracking-tight">SHORT BREAK</span>
            </div>
            <p className="text-xs sm:text-sm text-stone-400 leading-relaxed mb-4 max-w-md">
              Your favorite food cart in Kalapara! Sizzling Meat Boxes, grilled artisan sandwiches, and crispy peri-peri fries crafted fresh on order.
            </p>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-300 bg-[#1A1815] px-3 py-1.5 rounded-xl w-fit border border-amber-500/20">
              <Flame className="w-3.5 h-3.5 text-rose-500" />
              <span>100% Fresh Halal Ingredients</span>
            </div>
          </div>

          {/* Cart Location & Owner Hotlines */}
          <div>
            <h3 className="text-white font-bold text-xs uppercase tracking-wider mb-3 flex items-center gap-2 font-display">
              <MapPin className="w-3.5 h-3.5 text-amber-400" /> Cart Spot & Hotlines
            </h3>
            <div className="space-y-2.5 text-xs sm:text-sm text-stone-400">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span className="text-stone-200 font-medium">Helipad, Kalapara, Patuakhali</span>
              </p>
              <p className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Open Everyday: 4:00 PM – 11:30 PM</span>
              </p>
              
              <div className="pt-2 border-t border-stone-800/80 space-y-1.5">
                <span className="text-[11px] text-amber-400 font-bold uppercase tracking-wider block">
                  Cart Owners (Direct Call / Home Delivery):
                </span>
                <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
                  <a 
                    href="tel:01641508111" 
                    className="inline-flex items-center gap-1.5 bg-[#1C1814] hover:bg-[#25201A] text-stone-300 hover:text-amber-400 px-3 py-1.5 rounded-xl border border-stone-800 transition-colors"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Mahim: <strong className="text-white">01641508111</strong></span>
                  </a>
                  <a 
                    href="tel:01641508100" 
                    className="inline-flex items-center gap-1.5 bg-[#1C1814] hover:bg-[#25201A] text-stone-300 hover:text-amber-400 px-3 py-1.5 rounded-xl border border-stone-800 transition-colors"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Raj: <strong className="text-white">01641508100</strong></span>
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-stone-850 text-xs text-stone-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Short Break Food Cart • Helipad, Kalapara, Patuakhali.</p>
          <p className="text-stone-400 text-xs">
            Crafted for street food lovers in Kalapara.
          </p>
        </div>

      </div>
    </footer>
  )
}
