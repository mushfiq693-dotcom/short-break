import React, { useState, useEffect } from 'react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { createOrder } from '../lib/storage'
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  Sparkles, 
  Phone, 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  PhoneCall
} from 'lucide-react'
import confetti from 'canvas-confetti'

export function CartDrawer({ onNavigateToOrders, onNavigateToLogin }) {
  const { cartItems, updateQuantity, removeFromCart, clearCart, totalAmount, totalCount, isCartOpen, setIsCartOpen } = useCart()
  const { user } = useAuth()

  const [notes, setNotes] = useState('')
  const [phone, setPhone] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [placedOrder, setPlacedOrder] = useState(null)

  useEffect(() => {
    if (user?.phone) {
      setPhone(user.phone)
    }
  }, [user])

  if (!isCartOpen) return null

  if (!user) {
    setIsCartOpen(false)
    onNavigateToLogin?.()
    return null
  }

  const handleCheckout = async () => {
    setErrorMsg('')
    if (cartItems.length === 0) return

    if (!user) {
      // Prompt user to login
      setIsCartOpen(false)
      onNavigateToLogin?.()
      return
    }

    const contactPhone = (phone || user.phone || '').trim()
    if (!contactPhone) {
      setErrorMsg('Please provide a valid phone number. Admin will call this number to confirm your order!')
      return
    }

    try {
      setSubmitting(true)
      const order = await createOrder({
        user,
        items: cartItems,
        notes,
        customerPhone: contactPhone,
        customerName: user.name || user.email?.split('@')[0]
      })

      // Trigger party confetti
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.7 }
        })
      } catch {
        // Ignore confetti if not supported
      }

      setPlacedOrder(order)
      clearCart()
      setNotes('')
    } catch (err) {
      console.error('Checkout error:', err)
      setErrorMsg(err.message || 'Failed to place order. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleClose = () => {
    setIsCartOpen(false)
    setPlacedOrder(null)
    setErrorMsg('')
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={handleClose}
        className="absolute inset-0 bg-stone-950/80 backdrop-blur-xs transition-opacity animate-fadeIn" 
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#13110F] border-l border-amber-500/25 shadow-2xl flex flex-col justify-between text-stone-100">
          
          {/* Header */}
          <div className="p-4 sm:p-5 bg-[#1A1714] text-white flex items-center justify-between border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 text-stone-950 flex items-center justify-center font-black shadow-xs">
                <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black font-display text-white">Your Food Cart Order</h2>
                <p className="text-[11px] text-amber-300 font-medium">{totalCount} item{totalCount !== 1 ? 's' : ''} selected</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Success State */}
          {placedOrder ? (
            <div className="p-6 flex-1 flex flex-col justify-center items-center text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-500/15 text-emerald-400 rounded-full flex items-center justify-center border border-emerald-500/30 animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <span className="px-3 py-0.5 bg-amber-400/20 text-amber-300 text-xs font-bold rounded-full uppercase tracking-wider border border-amber-400/40">
                Order Placed Successfully!
              </span>
              <h3 className="text-2xl font-black text-amber-50 font-display">
                Awaiting Phone Confirmation
              </h3>
              
              <div className="bg-[#1D1915] border border-amber-400/30 rounded-2xl p-4 text-xs text-amber-200 text-left space-y-2 w-full">
                <div className="flex items-center gap-2 font-black text-sm text-white">
                  <PhoneCall className="w-4 h-4 text-amber-400 animate-pulse" />
                  <span>Admin Call Confirmation:</span>
                </div>
                <p className="leading-relaxed text-stone-300">
                  অ্যাডমিন কিছুক্ষণের মধ্যে আপনার <strong className="text-amber-300 font-mono">{placedOrder.customer_phone}</strong> নাম্বারে ফোন দিয়ে অর্ডারটি কনফার্ম করে গ্রিলে তুলবে!
                </p>
              </div>

              <div className="w-full bg-[#1A1714] p-4 rounded-xl border border-white/10 text-left text-xs space-y-2">
                <div className="flex justify-between font-bold text-stone-300 border-b border-white/10 pb-2">
                  <span>Order ID:</span>
                  <span className="font-mono text-amber-300 font-bold">#{placedOrder.id.slice(-6).toUpperCase()}</span>
                </div>
                <div className="flex justify-between font-bold text-stone-300 border-b border-white/10 pb-2">
                  <span>Total Bill:</span>
                  <span className="text-amber-300 font-black text-sm">৳{placedOrder.total_price}</span>
                </div>
                <div className="text-stone-400">
                  <span className="font-bold text-stone-300">Items: </span>
                  {placedOrder.items?.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                </div>
              </div>

              <div className="w-full space-y-2 pt-2">
                <button
                  onClick={() => {
                    handleClose()
                    onNavigateToOrders?.()
                  }}
                  className="w-full py-3 px-4 hero-candle-cta rounded-xl font-bold flex items-center justify-center gap-2 text-xs uppercase tracking-wider cursor-pointer shadow-md"
                >
                  <span>Track Live Order Status</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={handleClose}
                  className="w-full py-2.5 px-4 bg-stone-900 hover:bg-stone-800 text-stone-300 font-bold rounded-xl border border-stone-700 text-xs cursor-pointer"
                >
                  Back to Menu
                </button>
              </div>
            </div>
          ) : (
            /* Items & Checkout Form */
            <>
              <div className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-4">
                {cartItems.length === 0 ? (
                  <div className="py-16 text-center">
                    <div className="w-14 h-14 bg-amber-400/10 text-amber-400 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-amber-400/20">
                      <ShoppingBag className="w-7 h-7 stroke-[1.5]" />
                    </div>
                    <h3 className="text-base font-black text-amber-50 mb-1 font-display">Your Cart is Empty</h3>
                    <p className="text-stone-400 text-xs max-w-xs mx-auto mb-5">
                      Add delicious Meat Boxes, Grilled Sandwiches, or French Fries from our street menu!
                    </p>
                    <button
                      onClick={handleClose}
                      className="hero-candle-cta px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer"
                    >
                      Browse Food Menu
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Item list */}
                    <div className="space-y-2.5">
                      {cartItems.map(item => (
                        <div 
                          key={item.id}
                          className="bg-[#1C1815] p-3 rounded-xl border border-white/10 flex items-center justify-between gap-3"
                        >
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-white text-sm truncate font-display">
                              {item.name}
                            </h4>
                            <p className="text-xs text-amber-300 font-mono font-bold">
                              ৳{item.price} each
                            </p>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-1.5 bg-[#141210] p-1 rounded-lg border border-stone-800">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-6 h-6 rounded bg-[#221E1A] hover:bg-stone-800 text-stone-300 flex items-center justify-center text-xs font-bold cursor-pointer transition-all"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-5 text-center font-black text-xs text-white">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-6 h-6 rounded bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 flex items-center justify-center text-xs font-bold cursor-pointer transition-all"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <div className="text-right min-w-[50px]">
                            <span className="font-bold text-amber-300 text-sm font-mono">
                              ৳{Number(item.price) * item.quantity}
                            </span>
                          </div>

                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-stone-500 hover:text-rose-400 p-1 cursor-pointer transition-colors"
                            title="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Order Details Form */}
                    <div className="mt-4 pt-4 border-t border-white/10 space-y-3">
                      
                      {/* Phone Number Field */}
                      <div>
                        <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-amber-400" />
                          Confirmation Phone Number (কল কনফার্মেশন নাম্বার) *
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="e.g. 01712-345678"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-[#1C1815] text-amber-300 rounded-lg border border-amber-400/40 focus:outline-hidden focus:ring-1 focus:ring-amber-400 font-mono font-bold"
                        />
                        <span className="text-[10px] text-stone-400 mt-1 block">
                          📞 Admin will call this number to confirm before cooking.
                        </span>
                      </div>

                      {/* Notes Field */}
                      <div>
                        <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-stone-400" />
                          Kitchen Notes / Special Requests
                        </label>
                        <textarea
                          rows={2}
                          placeholder="e.g. Extra mayo, make it extra crispy, less spicy..."
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-[#1C1815] text-white rounded-lg border border-stone-700 focus:outline-hidden focus:ring-1 focus:ring-amber-400 font-medium resize-none placeholder:text-stone-600"
                        />
                      </div>
                    </div>

                    {errorMsg && (
                      <div className="p-3 bg-rose-950/80 border border-rose-800 text-rose-200 rounded-lg text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                        <span>{errorMsg}</span>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Footer Summary & Place Order Action */}
              {cartItems.length > 0 && (
                <div className="p-4 sm:p-5 bg-[#181512] border-t border-white/10 space-y-3">
                  <div className="space-y-1.5 text-xs text-stone-400">
                    <div className="flex justify-between">
                      <span>Subtotal ({totalCount} items)</span>
                      <span className="font-bold text-white font-mono">৳{totalAmount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Packaging</span>
                      <span className="font-bold text-emerald-400">FREE</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-white/10 text-sm sm:text-base font-bold text-white">
                      <span>Grand Total</span>
                      <span className="text-amber-300 font-black text-lg font-display">৳{totalAmount}</span>
                    </div>
                  </div>

                  {!user ? (
                    <button
                      onClick={() => {
                        setIsCartOpen(false)
                        onNavigateToLogin?.()
                      }}
                      className="w-full py-3 px-4 hero-candle-cta rounded-xl text-center text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-md"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Sign In / Register to Place Order (৳{totalAmount})</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleCheckout}
                      disabled={submitting}
                      className="w-full py-3 px-4 hero-candle-cta rounded-xl text-center text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
                    >
                      {submitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                          <span>Placing Order & Notifying Kitchen...</span>
                        </>
                      ) : (
                        <>
                          <PhoneCall className="w-4 h-4 stroke-[2.5]" />
                          <span>Place Order • ৳{totalAmount} (Call Confirmation)</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              )}
            </>
          )}

        </div>
      </div>
    </div>
  )
}
