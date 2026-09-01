import React from 'react'
import { Flame } from 'lucide-react'

export function Logo({ size = 'md', onClick }) {
  const isLarge = size === 'lg'
  const isSmall = size === 'sm'

  return (
    <div 
      onClick={onClick}
      className={`inline-flex items-center gap-2.5 select-none ${onClick ? 'cursor-pointer group' : ''}`}
    >
      {/* Sleek Compact Food Cart Emblem */}
      <div className="relative shrink-0">
        <div 
          className={`bg-gradient-to-br from-[#E11D48] via-[#D90429] to-[#990000] border-2 border-[#FBBF24] rounded-xl flex items-center justify-center text-white shadow-[2px_2px_0px_#F59E0B] transition-transform duration-300 ${
            onClick ? 'group-hover:scale-105 group-hover:rotate-3' : ''
          } ${
            isLarge ? 'w-12 h-12' : isSmall ? 'w-7 h-7' : 'w-8 h-8 sm:w-9 sm:h-9'
          }`}
        >
          {/* Monogram */}
          <span className={`font-black tracking-tighter text-amber-200 font-display leading-none ${
            isLarge ? 'text-xl' : isSmall ? 'text-xs' : 'text-sm sm:text-base'
          }`}>
            SB
          </span>

          {/* Sizzling Flame Accent */}
          <div className="absolute -top-1 -right-1 bg-amber-400 text-stone-950 p-0.5 rounded-full border border-stone-900 shadow-xs">
            <Flame className="w-2.5 h-2.5 fill-rose-600 text-rose-600" />
          </div>
        </div>
      </div>

      {/* Brand Typography */}
      <div className="flex items-center gap-1.5 flex-wrap leading-tight">
        <span className={`font-black tracking-tight text-white transition-colors font-display ${
          isLarge 
            ? 'text-xl sm:text-2xl' 
            : isSmall 
              ? 'text-sm' 
              : 'text-base sm:text-lg'
        } ${onClick ? 'group-hover:text-amber-400' : ''}`}>
          SHORT BREAK
        </span>
        
        <span className="px-1.5 py-0.5 bg-gradient-to-r from-amber-400 to-amber-500 text-stone-950 font-black text-[9px] sm:text-[10px] rounded shadow-xs uppercase tracking-wide">
          শর্ট ব্রেক
        </span>
      </div>
    </div>
  )
}
