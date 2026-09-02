import React, { useState } from 'react'
import { Plus, Minus, ShoppingBag, Check, ArrowRight, LogIn } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

export function MenuItemCard({ item, rankNumber, onRequireLogin }) {
  const { user } = useAuth()
  const { addToCart, cartItems, updateQuantity } = useCart()
  const [addedAnimation, setAddedAnimation] = useState(false)

  const inCart = user ? cartItems.find(i => i.id === item.id) : null

  const handleAction = () => {
    // 1. If not logged in, STRICTLY redirect to login / registration page without adding to cart
    if (!user) {
      if (onRequireLogin) {
        onRequireLogin(item)
      } else {
        window.location.hash = '#login'
      }
      return
    }

    // 2. Only authenticated users can add to cart
    addToCart(item)
    setAddedAnimation(true)
    setTimeout(() => setAddedAnimation(false), 1200)
  }

  return (
    <div className="food-card-minimal rounded-3xl overflow-hidden flex flex-col justify-between group">
      
      {/* Top Image & Badge Container */}
      <div className="relative h-60 sm:h-64 overflow-hidden bg-stone-950">
        <img
          src={item.image_url}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#181512] via-stone-950/20 to-transparent pointer-events-none" />

        {/* Item Rank Number */}
        <div className="absolute top-3 left-3 bg-[#12100E]/80 backdrop-blur-md text-amber-300 border border-amber-400/40 font-black text-xs px-2.5 py-1 rounded-xl shadow-xs">
          #{rankNumber}
        </div>

        {/* Badge */}
        {item.badge && (
          <div className="absolute top-3 right-3 bg-gradient-to-r from-rose-600 to-rose-700 text-white font-black text-xs px-3 py-1 rounded-full shadow-md border border-rose-400/50">
            {item.badge}
          </div>
        )}

        {/* Floating Price Tag */}
        <div className="absolute bottom-3 right-3 bg-gradient-to-r from-amber-400 to-amber-500 text-stone-950 font-black text-xl sm:text-2xl px-3.5 py-1 rounded-xl shadow-md border border-amber-300/60 font-display">
          ৳{item.price}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 flex-1 flex flex-col justify-between bg-[#181512] text-stone-200">
        <div>
          <h3 className="text-xl sm:text-2xl font-black text-amber-50 mb-2 font-display group-hover:text-amber-400 transition-colors">
            {item.name}
          </h3>
          <p className="text-stone-300 text-xs sm:text-sm leading-relaxed mb-4">
            {item.description}
          </p>
        </div>

        {/* Action Controls */}
        <div className="pt-3 border-t border-white/10">
          {inCart ? (
            <div className="flex items-center justify-between bg-[#221E1A] border border-amber-400/40 rounded-xl p-1.5 shadow-xs">
              <span className="text-xs font-bold text-amber-300 px-2">In Cart:</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.id, inCart.quantity - 1)}
                  className="w-8 h-8 rounded-lg bg-[#2D2823] hover:bg-stone-700 border border-stone-600 text-white font-black flex items-center justify-center shadow-xs active:scale-95 transition-all cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
                <span className="font-black text-white w-6 text-center text-base">
                  {inCart.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item.id, inCart.quantity + 1)}
                  className="w-8 h-8 rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-black flex items-center justify-center shadow-xs active:scale-95 transition-all cursor-pointer"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={handleAction}
              className={`w-full py-3 px-4 rounded-xl flex items-center justify-center gap-2 font-black text-sm uppercase tracking-wide cursor-pointer transition-all ${
                addedAnimation 
                  ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-md' 
                  : user 
                    ? 'food-btn-primary' 
                    : 'hero-candle-cta'
              }`}
            >
              {addedAnimation ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Added to Order!</span>
                </>
              ) : user ? (
                <>
                  <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
                  <span>Add to Order (৳{item.price})</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4 stroke-[2.5]" />
                  <span>Order Now • ৳{item.price}</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </>
              )}
            </button>
          )}
        </div>

      </div>

    </div>
  )
}
