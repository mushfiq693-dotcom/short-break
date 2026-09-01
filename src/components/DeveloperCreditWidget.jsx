import React, { useState, useRef, useEffect } from 'react'
import { 
  Globe, 
  Sparkles, 
  ExternalLink, 
  X, 
  Code2 
} from 'lucide-react'

// Facebook SVG Icon
function FacebookIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" {...props}>
      <path d="M12 2.04c-5.5 0-10 4.49-10 10.02 0 5 3.66 9.15 8.44 9.9v-7H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.89 3.78-3.89 1.09 0 2.23.19 2.23.19v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33v7a10 10 0 0 0 8.44-9.9c0-5.53-4.5-10.02-10-10.02z"/>
    </svg>
  )
}

// LinkedIn SVG Icon
function LinkedInIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" {...props}>
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
    </svg>
  )
}

export function DeveloperCreditWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const widgetRef = useRef(null)

  // Close popup when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (widgetRef.current && !widgetRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="fixed bottom-5 right-5 z-50 select-none" ref={widgetRef}>
      
      {/* Pop-up Card (Floating above the circular avatar, matching dark ambient food cart palette) */}
      {isOpen && (
        <div 
          className="absolute bottom-16 right-0 w-[320px] sm:w-[360px] bg-[#15120F]/95 text-stone-100 rounded-[28px] p-5 sm:p-6 shadow-[0_25px_70px_rgba(0,0,0,0.9),0_0_35px_rgba(245,158,11,0.15)] border border-amber-500/30 backdrop-blur-2xl animate-slideUp origin-bottom-right"
          style={{ animationDuration: '200ms' }}
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-3.5">
            <div className="flex items-center gap-3">
              <img
                src="/developer.jpg"
                alt="Mushfiqur Rahman"
                className="w-12 h-12 rounded-2xl object-cover shadow-md border border-amber-400/50 shrink-0"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-base sm:text-lg font-black text-amber-50 font-display leading-tight">
                    Mushfiqur Rahman
                  </h3>
                  <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400" />
                </div>
                <p className="text-xs font-bold text-amber-400 font-mono tracking-wide mt-0.5">
                  Full-stack Developer
                </p>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="text-stone-400 hover:text-white p-1.5 rounded-xl hover:bg-stone-800 transition-colors cursor-pointer -mr-1 -mt-1"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Bio Subtitle */}
          <p className="text-xs text-stone-300 leading-relaxed mb-4">
            Architected & developed with modern web standards by Mushfiq.
          </p>

          {/* Divider */}
          <hr className="border-t border-white/10 mb-4" />

          {/* Link Buttons */}
          <div className="space-y-2 mb-4">
            
            {/* Portfolio Website */}
            <a
              href="https://mushfiq-dev.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-3.5 bg-[#201C18] hover:bg-[#2A2520] text-stone-200 hover:text-white rounded-2xl border border-white/10 hover:border-amber-400/60 flex items-center justify-between transition-all group shadow-xs"
            >
              <div className="flex items-center gap-2.5">
                <Globe className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                <span className="text-xs sm:text-sm font-bold">
                  Portfolio Website
                </span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-stone-400 group-hover:text-amber-300 transition-colors" />
            </a>

            {/* Facebook Profile (Replaced GitHub) */}
            <a
              href="https://www.facebook.com/km.rahman.376"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-3.5 bg-[#201C18] hover:bg-[#2A2520] text-stone-200 hover:text-white rounded-2xl border border-white/10 hover:border-[#1877F2]/60 flex items-center justify-between transition-all group shadow-xs"
            >
              <div className="flex items-center gap-2.5">
                <FacebookIcon className="text-[#60a5fa] group-hover:scale-110 transition-transform" />
                <span className="text-xs sm:text-sm font-bold">
                  Facebook Profile
                </span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-stone-400 group-hover:text-amber-300 transition-colors" />
            </a>

            {/* LinkedIn Profile */}
            <a
              href="https://www.linkedin.com/in/mushfique693"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-3.5 bg-[#201C18] hover:bg-[#2A2520] text-stone-200 hover:text-white rounded-2xl border border-white/10 hover:border-[#0077B5]/60 flex items-center justify-between transition-all group shadow-xs"
            >
              <div className="flex items-center gap-2.5">
                <LinkedInIcon className="text-[#38bdf8] group-hover:scale-110 transition-transform" />
                <span className="text-xs sm:text-sm font-bold">
                  LinkedIn Profile
                </span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-stone-400 group-hover:text-amber-300 transition-colors" />
            </a>

          </div>

          {/* Footer Signature */}
          <div className="flex items-center justify-between text-[11px] text-stone-400 font-mono pt-1">
            <span className="flex items-center gap-1.5 font-bold text-stone-300">
              <Code2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Developer Signature</span>
            </span>
            <span className="tracking-wider uppercase text-[10px] text-stone-400 font-semibold">
              GSTU CSE Sync
            </span>
          </div>

        </div>
      )}

      {/* Floating Circular Trigger Avatar (Slightly smaller, sleek and compact) */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="group relative w-11 h-11 sm:w-12 sm:h-12 rounded-full p-0.5 bg-stone-950 hover:bg-stone-900 transition-all duration-300 shadow-[0_8px_25px_rgba(0,0,0,0.7)] border-2 border-amber-400 ring-2 ring-amber-500/40 hover:ring-amber-400/80 active:scale-95 cursor-pointer flex items-center justify-center"
        aria-label="Toggle Developer Info"
        title="Developer Info"
      >
        <img
          src="/developer.jpg"
          alt="Mushfiqur Rahman"
          className="w-full h-full rounded-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Top-Right Glowing Status Pip */}
        <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-amber-400 rounded-full border-2 border-stone-950 shadow-xs flex items-center justify-center">
          <span className="w-1 h-1 bg-amber-950 rounded-full animate-ping" />
        </span>
      </button>

    </div>
  )
}
