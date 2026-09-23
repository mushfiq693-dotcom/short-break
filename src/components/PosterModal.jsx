import React, { useState } from 'react'
import { X, Download, PhoneCall, Sparkles, Check, Flame } from 'lucide-react'

export function PosterModal({ isOpen, onClose }) {
  const [selectedFormat, setSelectedFormat] = useState('vertical') // 'vertical' | 'square'
  const [copied, setCopied] = useState(false)

  if (!isOpen) return null

  const handleCopyPhone = () => {
    navigator.clipboard.writeText('01641508100')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const posterSrc = selectedFormat === 'vertical' ? '/poster.jpg' : '/poster-square.jpg'
  const posterDownloadName = selectedFormat === 'vertical' ? 'ShortBreak_Official_Poster.jpg' : 'ShortBreak_Social_Poster.jpg'

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md animate-fadeIn select-none"
      onClick={onClose}
    >
      {/* Modal Container */}
      <div 
        className="relative w-full max-w-4xl bg-[#141210] border-2 border-amber-500/40 rounded-3xl shadow-[0_0_50px_rgba(245,158,11,0.2)] overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-stone-800 flex items-center justify-between bg-[#1A1714]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-600 to-rose-700 flex items-center justify-center text-white font-black text-xs border border-amber-400/60 shadow-xs">
              SB
            </div>
            <div>
              <h3 className="text-white font-black text-base sm:text-lg font-display tracking-tight flex items-center gap-2">
                Short Break Official Poster
                <span className="px-2 py-0.5 bg-amber-400 text-stone-950 text-[10px] font-black rounded-md uppercase tracking-wider">
                  HD Quality
                </span>
              </h3>
              <p className="text-stone-400 text-xs">
                Featuring Meat Box, Sandwich, Fries, Tea & Coffee with Owner Raj's Hotline
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-850 hover:bg-stone-750 text-stone-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-stone-700"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Left Preview Image Box */}
          <div className="md:col-span-7 flex flex-col items-center justify-center">
            <div className="relative group w-full max-w-[380px] rounded-2xl overflow-hidden border-2 border-amber-500/30 shadow-[0_10px_30px_rgba(0,0,0,0.8)] bg-stone-950 flex items-center justify-center">
              <img
                src={posterSrc}
                alt="Short Break Promo Poster"
                className="w-full h-auto object-contain max-h-[480px] rounded-xl transition-transform duration-300 group-hover:scale-[1.02]"
              />
              <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 text-[11px] text-amber-300 font-bold flex items-center gap-1.5 shadow-md">
                <Sparkles className="w-3 h-3 text-amber-400" />
                {selectedFormat === 'vertical' ? '3:4 Print & Story Flyer' : '1:1 Square Post'}
              </div>
            </div>

            {/* Format Switcher */}
            <div className="flex items-center gap-2 mt-4 bg-stone-900/90 p-1.5 rounded-2xl border border-stone-800">
              <button
                type="button"
                onClick={() => setSelectedFormat('vertical')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedFormat === 'vertical'
                    ? 'bg-amber-400 text-stone-950 shadow-md font-black'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                <span>Vertical Flyer (3:4)</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedFormat('square')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedFormat === 'square'
                    ? 'bg-amber-400 text-stone-950 shadow-md font-black'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                <span>Square Post (1:1)</span>
              </button>
            </div>
          </div>

          {/* Right Controls & Details */}
          <div className="md:col-span-5 space-y-4">
            <div className="bg-[#1C1814] p-4 rounded-2xl border border-stone-800 space-y-3">
              <h4 className="text-white text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5 font-display">
                <Flame className="w-3.5 h-3.5 text-rose-500" /> Poster Highlights
              </h4>
              <ul className="text-xs text-stone-300 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                  <span><strong>Minimal Brand Identity:</strong> Sleek 'SB' Emblem & 'SHORT BREAK (শর্ট ব্রেক)' typography.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                  <span><strong>3 Floating Core Delicacies:</strong> Sizzling Meat Box, Grilled Chicken Sandwich, and Golden French Fries.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                  <span><strong>Floating Warm Sips:</strong> Traditional Steaming Dudh Cha (clay matka) & frothy Latte Coffee.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                  <span><strong>Order Info:</strong> Bottom right hotline pill with <strong>Raj: 01641508100</strong>.</span>
                </li>
              </ul>
            </div>

            {/* Quick Contact Box */}
            <div className="bg-[#1A1612] p-3.5 rounded-2xl border border-amber-500/30 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider block">
                  For Order (Owner Raj)
                </span>
                <span className="text-sm font-black text-amber-300 font-mono">
                  01641508100
                </span>
              </div>
              <button
                type="button"
                onClick={handleCopyPhone}
                className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold rounded-xl border border-stone-600 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <PhoneCall className="w-3.5 h-3.5 text-amber-400" />}
                <span>{copied ? 'Copied!' : 'Copy Number'}</span>
              </button>
            </div>

            {/* Download & Action Buttons */}
            <div className="space-y-2 pt-2">
              <a
                href={posterSrc}
                download={posterDownloadName}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 border border-amber-300/50 shadow-xs transition-all cursor-pointer active:scale-98 text-center"
              >
                <Download className="w-4 h-4" />
                <span>Download High-Res Poster ({selectedFormat === 'vertical' ? 'Flyer' : 'Square'})</span>
              </a>

              <a
                href="tel:01641508100"
                className="w-full py-2 px-4 bg-stone-900 hover:bg-stone-850 text-stone-200 hover:text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 border border-stone-800 hover:border-emerald-500/40 transition-colors"
              >
                <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                <span>Call Owner Raj Directly</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
