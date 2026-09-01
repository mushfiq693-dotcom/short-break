import React from 'react'
import { MapPin, Phone, Clock, Heart, Flame, PhoneCall, Globe, Code2, ExternalLink } from 'lucide-react'

// Custom Clean Brand SVG Icons
function LinkedInIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor" {...props}>
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
    </svg>
  )
}

function FacebookIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor" {...props}>
      <path d="M12 2.04c-5.5 0-10 4.49-10 10.02 0 5 3.66 9.15 8.44 9.9v-7H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.89 3.78-3.89 1.09 0 2.23.19 2.23.19v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33v7a10 10 0 0 0 8.44-9.9c0-5.53-4.5-10.02-10-10.02z"/>
    </svg>
  )
}

export function Footer() {
  return (
    <footer className="bg-[#110F0D] text-stone-300 border-t border-amber-500/20 pt-14 pb-8 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Top Grid: Brand, Spot/Hotlines, Menu */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Brand Info */}
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-7 h-7 bg-gradient-to-br from-rose-600 to-rose-700 rounded-lg flex items-center justify-center font-black text-white text-xs border border-amber-400/50 shadow-xs">
                SB
              </div>
              <span className="text-lg font-black text-white font-display tracking-tight">SHORT BREAK</span>
            </div>
            <p className="text-xs sm:text-sm text-stone-400 leading-relaxed mb-4">
              Your favorite food cart in Kalapara! Sizzling Meat Boxes, grilled artisan sandwiches, and crispy peri-peri fries crafted fresh on order.
            </p>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-300 bg-[#1A1815] px-3 py-1.5 rounded-xl w-fit border border-amber-500/20">
              <Flame className="w-3.5 h-3.5 text-rose-500" />
              <span>100% Fresh Halal Ingredients</span>
            </div>
          </div>

          {/* Cart Location & Owner Hotlines */}
          <div>
            <h3 className="text-white font-bold text-xs uppercase tracking-wider mb-4 flex items-center gap-2 font-display">
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
                <div className="flex flex-col gap-1.5 text-xs font-mono">
                  <a 
                    href="tel:01641508111" 
                    className="flex items-center gap-2 text-stone-300 hover:text-amber-400 transition-colors"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Mahim: <strong className="text-white">01641508111</strong></span>
                  </a>
                  <a 
                    href="tel:01641508100" 
                    className="flex items-center gap-2 text-stone-300 hover:text-amber-400 transition-colors"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Raj: <strong className="text-white">01641508100</strong></span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* 3 Items Showcase Quick Links */}
          <div>
            <h3 className="text-white font-bold text-xs uppercase tracking-wider mb-4 font-display">
              Signature Menu
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-stone-400">
              <li className="flex justify-between items-center py-1 border-b border-stone-850">
                <span className="text-stone-200 font-medium">1. Meat Box (Chicken & Sausage)</span>
                <span className="font-bold text-amber-400">৳100</span>
              </li>
              <li className="flex justify-between items-center py-1 border-b border-stone-850">
                <span className="text-stone-200 font-medium">2. Grilled Chicken Sandwich</span>
                <span className="font-bold text-amber-400">৳60</span>
              </li>
              <li className="flex justify-between items-center py-1">
                <span className="text-stone-200 font-medium">3. Peri Peri French Fries</span>
                <span className="font-bold text-amber-400">৳50</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Developer Credit Section */}
        <div className="bg-[#181614] rounded-2xl p-5 sm:p-6 border border-stone-800 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-5">
          
          {/* Developer Bio with Photo */}
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="relative shrink-0">
              <img
                src="/developer.jpg"
                alt="Developer - Mushfiq"
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border border-rose-500/70 shadow-md ring-2 ring-amber-400/25"
              />
              <div className="absolute -bottom-1 -right-1 bg-gradient-to-br from-rose-600 to-rose-700 text-white p-1 rounded-lg text-[9px] font-black border border-stone-900 shadow-xs">
                <Code2 className="w-2.5 h-2.5" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-0.5">
                <span className="px-2 py-0.5 bg-rose-950/80 text-rose-300 border border-rose-800/50 rounded text-[9px] font-bold uppercase tracking-wider">
                  Developer Credit
                </span>
                <span className="text-stone-400 text-xs font-mono">• Full-Stack Engineer</span>
              </div>
              <h4 className="text-base sm:text-lg font-black text-white font-display">
                Designed & Built by <span className="text-amber-400">Mushfiq</span>
              </h4>
              <p className="text-[11px] text-stone-400">
                Crafted with React, Tailwind CSS & Supabase for Short Break Food Cart.
              </p>
            </div>
          </div>

          {/* Social / Portfolio Links */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {/* Portfolio */}
            <a
              href="https://mushfiq.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#201D1A] hover:bg-[#2A2622] text-amber-300 rounded-xl border border-amber-500/25 text-xs font-bold transition-all shadow-xs"
              title="View Portfolio"
            >
              <Globe className="w-3 h-3 text-amber-400" />
              <span>Portfolio</span>
              <ExternalLink className="w-2.5 h-2.5 opacity-60" />
            </a>

            {/* LinkedIn */}
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0077B5]/15 hover:bg-[#0077B5]/30 text-[#38bdf8] rounded-xl border border-[#0077B5]/40 text-xs font-bold transition-all shadow-xs"
              title="Connect on LinkedIn"
            >
              <LinkedInIcon className="text-[#38bdf8]" />
              <span>LinkedIn</span>
            </a>

            {/* Facebook */}
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1877F2]/15 hover:bg-[#1877F2]/30 text-[#60a5fa] rounded-xl border border-[#1877F2]/40 text-xs font-bold transition-all shadow-xs"
              title="Connect on Facebook"
            >
              <FacebookIcon className="text-[#60a5fa]" />
              <span>Facebook</span>
            </a>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-6 border-t border-stone-850 text-center text-xs text-stone-500 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} Short Break Food Cart • Helipad, Kalapara, Patuakhali.</p>
          <p className="flex items-center gap-1">
            Crafted with <Heart className="w-3 h-3 text-rose-500 fill-rose-500 inline" /> for street food lovers.
          </p>
        </div>

      </div>
    </footer>
  )
}
