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
        customer_phone: contactPhone
      })

      // Celebration Confetti!
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      })

      setPlacedOrder(order)
      clearCart()
      setNotes('')
    } catch (err) {
      console.error('Order creation error:', err)
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
        className="absolute inset-0 bg-stone-950/70 backdrop-blur-xs transition-opacity animate-fadeIn" 
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FFFDF9] border-l-4 border-stone-900 shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-5 bg-stone-900 text-white flex items-center justify-between border-b-2 border-amber-400">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-400 text-stone-950 flex items-center justify-center font-black">
                <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div>
                <h2 className="text-lg font-black font-display text-white">Your Food Cart Order</h2>
                <p className="text-xs text-amber-400 font-medium">{totalCount} item{totalCount !== 1 ? 's' : ''} selected</p>
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
            <div className="p-6 flex-1 flex flex-col justify-center items-center text-center">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4 border-2 border-stone-900 animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs font-bold rounded-full mb-2 uppercase tracking-wide border border-amber-300">
                Order Placed Successfully!
              </span>
              <h3 className="text-2xl font-black text-stone-900 mb-2 font-display">
                Awaiting Phone Confirmation
              </h3>
              
              <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 text-xs text-amber-900 mb-6 text-left space-y-2">
                <div className="flex items-center gap-2 font-black text-sm text-stone-900">
                  <PhoneCall className="w-4 h-4 text-amber-600 animate-bounce" />
                  <span>Admin Call Confirmation:</span>
                </div>
                <p className="leading-relaxed">
                  অ্যাডমিন কিছুক্ষণের মধ্যে আপনার <strong>{placedOrder.customer_phone}</strong> নাম্বারে ফোন দিয়ে অর্ডারটি কনফার্ম করে গ্রিলে তুলবে!
                </p>
              </div>

              <div className="w-full bg-white p-4 rounded-xl border-2 border-stone-900 food-card-shadow mb-6 text-left text-xs space-y-2">
                <div className="flex justify-between font-bold text-stone-900 border-b border-stone-200 pb-2">
                  <span>Order ID:</span>
                  <span className="font-mono text-stone-900">#{placedOrder.id.slice(-6).toUpperCase()}</span>
                </div>
                <div className="flex justify-between font-bold text-stone-900 border-b border-stone-200 pb-2">
                  <span>Total Bill:</span>
                  <span className="text-rose-600 font-black text-sm">৳{placedOrder.total_price}</span>
                </div>
                <div className="text-stone-600">
                  <span className="font-bold">Items: </span>
                  {placedOrder.items?.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                </div>
              </div>

              <div className="w-full space-y-3">
                <button
                  onClick={() => {
                    handleClose()
                    onNavigateToOrders?.()
                  }}
                  className="w-full py-3 px-4 food-btn-primary rounded-xl font-bold flex items-center justify-center gap-2 text-sm cursor-pointer"
                >
                  <span>Track Live Order Status</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={handleClose}
                  className="w-full py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold rounded-xl border-2 border-stone-900 text-sm cursor-pointer"
                >
                  Back to Menu
                </button>
              </div>
            </div>
          ) : (
            /* Items & Checkout Form */
            <>
              <div className="p-5 flex-1 overflow-y-auto space-y-4">
                {cartItems.length === 0 ? (
                  <div className="py-16 text-center">
                    <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-stone-900">
                      <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
                    </div>
                    <h3 className="text-lg font-black text-stone-900 mb-1 font-display">Your Cart is Empty</h3>
                    <p className="text-stone-500 text-xs max-w-xs mx-auto mb-6">
                      Add delicious Meat Boxes, Grilled Sandwiches, or French Fries from our street menu!
                    </p>
                    <button
                      onClick={handleClose}
                      className="food-btn-secondary px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider cursor-pointer"
                    >
                      Browse Food Menu
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Item list */}
                    <div className="space-y-3">
                      {cartItems.map(item => (
                        <div 
                          key={item.id}
                          className="bg-white p-3 rounded-xl border-2 border-stone-900 shadow-[2px_2px_0px_#1C1917] flex items-center justify-between gap-3"
                        >
                          <div className="flex-1 min-w-0">
                            <h4 className="font-black text-stone-900 text-sm truncate font-display">
                              {item.name}
                            </h4>
                            <p className="text-xs text-rose-600 font-bold">
                              ৳{item.price} each
                            </p>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-lg border border-stone-300">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-6 h-6 rounded bg-white hover:bg-stone-200 border border-stone-400 flex items-center justify-center text-xs font-bold cursor-pointer"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-5 text-center font-black text-xs text-stone-900">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-6 h-6 rounded bg-amber-400 hover:bg-amber-300 border border-stone-900 flex items-center justify-center text-xs font-bold cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <div className="text-right min-w-[50px]">
                            <span className="font-black text-stone-900 text-sm font-display">
                              ৳{Number(item.price) * item.quantity}
                            </span>
                          </div>

                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-stone-400 hover:text-rose-600 p-1 cursor-pointer"
                            title="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Order Details Form */}
                    <div className="mt-4 pt-4 border-t-2 border-stone-200 space-y-3">
                      
                      {/* Phone Number Field */}
                      <div>
                        <label className="block text-xs font-black text-stone-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-amber-600" />
                          Confirmation Phone Number (কল কনফার্মেশন নাম্বার) *
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="e.g. 01712-345678"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-white rounded-lg border-2 border-stone-900 focus:outline-hidden focus:ring-2 focus:ring-amber-400 font-mono font-bold"
                        />
                        <span className="text-[10px] text-stone-500 mt-1 block">
                          📞 Admin will call this number to confirm before cooking.
                        </span>
                      </div>

                      {/* Notes Field */}
                      <div>
                        <label className="block text-xs font-black text-stone-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-stone-500" />
                          Kitchen Notes / Special Requests
                        </label>
                        <textarea
                          rows={2}
                          placeholder="e.g. Extra mayo, make it extra crispy, less spicy..."
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-white rounded-lg border-2 border-stone-900 focus:outline-hidden focus:ring-2 focus:ring-amber-400 font-medium resize-none"
                        />
                      </div>
                    </div>

                    {errorMsg && (
                      <div className="p-3 bg-rose-100 border border-rose-400 text-rose-800 rounded-lg text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{errorMsg}</span>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Footer Summary & Place Order Action */}
              {cartItems.length > 0 && (
                <div className="p-5 bg-white border-t-2 border-stone-900 space-y-3">
                  <div className="space-y-1.5 text-xs text-stone-600">
                    <div className="flex justify-between">
                      <span>Subtotal ({totalCount} items)</span>
                      <span className="font-bold text-stone-900">৳{totalAmount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Food Cart Packaging</span>
                      <span className="font-bold text-emerald-600">FREE</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-stone-200 text-base font-black text-stone-900 font-display">
                      <span>Grand Total</span>
                      <span className="text-rose-600 text-xl font-display">৳{totalAmount}</span>
                    </div>
                  </div>

                  {!user ? (
                    <button
                      onClick={() => {
                        setIsCartOpen(false)
                        onNavigateToLogin?.()
                      }}
                      className="w-full py-3 px-4 food-btn-secondary rounded-xl text-center text-sm font-black flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Sign In / Register to Place Order (৳{totalAmount})</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleCheckout}
                      disabled={submitting}
                      className="w-full py-3.5 px-4 food-btn-primary rounded-xl text-center text-sm font-black flex items-center justify-center gap-2 uppercase tracking-wide cursor-pointer disabled:opacity-50"
                    >
                      {submitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
