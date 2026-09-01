import React from 'react'

export function AmbientBackground({ children }) {
  return (
    <div className="relative min-h-[calc(100vh-64px)] text-stone-100 overflow-hidden">
      {/* 1. Base Layer: Blurred Ambient Hero Cart Photo */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
        style={{
          backgroundImage: 'url(/hero-cart.jpg)',
          backgroundPosition: 'center 30%',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          filter: 'blur(22px) saturate(0.92)',
          transform: 'scale(1.08)' // Avoid blurred edge artifacts
        }}
      />

      {/* 2. Scrim Layer: Warm Charcoal Dark Overlay + Top Bulb Light Bloom */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 20%, rgba(245, 158, 11, 0.12) 0%, rgba(14, 12, 10, 0.78) 55%, rgba(10, 8, 6, 0.94) 100%)'
        }}
      />

      {/* 3. Content Layer: Lantern-lit glass panels and UI */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}
