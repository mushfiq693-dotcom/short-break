import React, { useState } from 'react'
import { MapPin, Phone, Clock, Heart, Flame, PhoneCall, Globe, Code2, ExternalLink, X } from 'lucide-react'

// Custom Clean Brand SVG Icons
function LinkedInIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" {...props}>
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
    </svg>
  )
}

function FacebookIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" {...props}>
      <path d="M12 2.04c-5.5 0-10 4.49-10 10.02 0 5 3.66 9.15 8.44 9.9v-7H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.89 3.78-3.89 1.09 0 2.23.19 2.23.19v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33v7a10 10 0 0 0 8.44-9.9c0-5.53-4.5-10.02-10-10.02z"/>
    </svg>
  )
}

export function Footer() {
  const [devModalOpen, setDevModalOpen] = useState(false)

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

        {/* Bottom Bar with Circular Developer Credit Trigger */}
        <div className="pt-6 border-t border-stone-850 text-xs text-stone-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Short Break Food Cart • Helipad, Kalapara, Patuakhali.</p>
          
          {/* Circular Developer Credit Trigger Button */}
          <div className="flex items-center gap-2">
            <span className="text-stone-400 text-xs">Developed with passion by</span>
            <button
              onClick={() => setDevModalOpen(true)}
              className="group relative inline-flex items-center gap-2 bg-[#1A1815] hover:bg-[#25211D] text-stone-200 py-1 px-2.5 rounded-full border border-amber-500/30 hover:border-amber-400 shadow-md transition-all cursor-pointer active:scale-95"
              title="Click to view developer profile"
            >
              <div className="relative">
                <img
                  src="/developer.jpg"
                  alt="Mushfiq"
                  className="w-6 h-6 rounded-full object-cover border border-amber-400 ring-1 ring-rose-500 group-hover:scale-110 transition-transform"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 ring-1 ring-stone-900 animate-pulse" />
              </div>
              <span className="text-xs font-bold text-amber-300 group-hover:text-amber-200">
                Mushfiq
              </span>
              <Code2 className="w-3 h-3 text-stone-400 group-hover:text-amber-400" />
            </button>
          </div>
        </div>

      </div>

      {/* Interactive Developer Credit Modal / Circle Pop-up */}
      {devModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            onClick={() => setDevModalOpen(false)}
            className="absolute inset-0 bg-stone-950/80 backdrop-blur-sm animate-fadeIn cursor-pointer"
          />

          {/* Modal Pop-up Card */}
          <div className="relative z-10 w-full max-w-sm glass-panel-dark rounded-3xl p-6 border border-amber-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.8)] text-center animate-slideUp">
            
            {/* Close Button */}
            <button
              onClick={() => setDevModalOpen(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-white p-1.5 rounded-xl hover:bg-stone-800 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Glowing Circular Avatar */}
            <div className="relative w-24 h-24 mx-auto mb-4">
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 via-rose-500 to-amber-500 rounded-full blur-sm animate-spin-slow opacity-80" />
              <img
                src="/developer.jpg"
                alt="Mushfiq - Full-Stack Engineer"
                className="relative w-24 h-24 rounded-full object-cover border-2 border-amber-400 shadow-xl"
              />
              <div className="absolute bottom-0 right-0 bg-rose-600 text-white p-1 rounded-full border-2 border-stone-900 shadow-md">
                <Code2 className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Dev Details */}
            <div className="space-y-1 mb-4">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-rose-950/80 text-rose-300 border border-rose-800/50 rounded-full text-[10px] font-bold uppercase tracking-wider mb-1">
                Developer Profile
              </div>
              <h3 className="text-xl font-black text-amber-50 font-display">
                Mushfiq
              </h3>
              <p className="text-xs text-amber-400 font-mono font-bold">
                Full-Stack Software Engineer
              </p>
              <p className="text-xs text-stone-400 max-w-xs mx-auto pt-1 leading-relaxed">
                Specialized in high-performance web apps with React, Tailwind CSS, Vite & Supabase.
              </p>
            </div>

            {/* Social / Portfolio Links */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10">
              
              {/* Portfolio */}
              <a
                href="https://mushfiq.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-2.5 bg-[#221D18] hover:bg-[#2D2720] text-amber-300 rounded-2xl border border-amber-500/25 transition-all shadow-xs group"
              >
                <Globe className="w-4 h-4 mb-1 text-amber-400 group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-bold">Portfolio</span>
              </a>

              {/* LinkedIn */}
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-2.5 bg-[#0077B5]/15 hover:bg-[#0077B5]/30 text-[#38bdf8] rounded-2xl border border-[#0077B5]/30 transition-all shadow-xs group"
              >
                <LinkedInIcon className="mb-1 text-[#38bdf8] group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-bold">LinkedIn</span>
              </a>

              {/* Facebook */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-2.5 bg-[#1877F2]/15 hover:bg-[#1877F2]/30 text-[#60a5fa] rounded-2xl border border-[#1877F2]/30 transition-all shadow-xs group"
              >
                <FacebookIcon className="mb-1 text-[#60a5fa] group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-bold">Facebook</span>
              </a>

            </div>

          </div>
        </div>
      )}
    </footer>
  )
}
