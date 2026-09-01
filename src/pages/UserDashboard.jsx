import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { getUserOrders, subscribeToOrders } from '../lib/storage'
import { OrderCard } from '../components/OrderCard'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { AmbientBackground } from '../components/AmbientBackground'
import { 
  ShoppingBag, 
  Clock, 
  RotateCw, 
  Utensils, 
  Flame, 
  CheckCircle2,
  Sparkles,
  User,
  Phone
} from 'lucide-react'

export function UserDashboard({ onNavigateHome }) {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const loadOrders = async () => {
    if (!user) return
    try {
      setRefreshing(true)
      const data = await getUserOrders(user.id)
      setOrders(data || [])
    } catch (err) {
      console.error('Failed to load user orders:', err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    loadOrders()

    // 1. Supabase Realtime channel subscription if configured
    let channel
    if (isSupabaseConfigured && supabase && user) {
      channel = supabase
        .channel(`user-orders-${user.id}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'orders',
            filter: `user_id=eq.${user.id}`
          },
          (payload) => {
            console.log('Realtime user order update:', payload)
            loadOrders()
          }
        )
        .subscribe()
    }

    // 2. Local store subscription for demo mode
    const unsubscribe = subscribeToOrders(() => {
      loadOrders()
    })

    return () => {
      if (channel) supabase.removeChannel(channel)
      unsubscribe()
    }
  }, [user])

  const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'confirmed')
  const completedOrders = orders.filter(o => o.status === 'completed' || o.status === 'cancelled')

  return (
    <AmbientBackground>
      <div className="min-h-screen pb-24 pt-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-6">
          
          {/* Header Glass Panel */}
          <div className="glass-panel-dark rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-amber-400/20 text-amber-300 text-xs font-black rounded-full border border-amber-400/40 uppercase tracking-wider">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>Foodie Customer Portal</span>
                </span>
                {user?.phone && (
                  <span className="text-xs text-stone-400 font-mono flex items-center gap-1">
                    <Phone className="w-3 h-3 text-amber-400" />
                    <span>{user.phone}</span>
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-amber-50 font-display">
                Welcome, {user?.name || user?.email?.split('@')[0]}!
              </h1>
              <p className="text-stone-300 text-xs sm:text-sm mt-1">
                Track your live food cart orders and browse your past receipts.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={loadOrders}
                disabled={refreshing}
                className="px-3.5 py-2.5 bg-stone-900/80 hover:bg-stone-800 text-stone-200 rounded-xl border border-stone-700 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                title="Refresh Orders"
              >
                <RotateCw className={`w-3.5 h-3.5 text-amber-400 ${refreshing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
              <button
                onClick={onNavigateHome}
                className="hero-candle-cta px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Utensils className="w-3.5 h-3.5" />
                <span>Order Food</span>
              </button>
            </div>
          </div>

          {/* Main Orders Feed */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[1, 2].map(n => (
                <div key={n} className="glass-panel-dark rounded-2xl h-48 animate-pulse p-6 border border-stone-800" />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="glass-panel-dark rounded-3xl p-12 text-center max-w-lg mx-auto border border-amber-500/20">
              <div className="w-16 h-16 bg-amber-400/10 text-amber-400 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-amber-400/30">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-amber-50 mb-2 font-display">No Orders Placed Yet</h3>
              <p className="text-stone-300 text-xs sm:text-sm mb-6 leading-relaxed">
                You haven't ordered any snacks yet. Explore our 3 signature specials and pick up fresh off the cart!
              </p>
              <button
                onClick={onNavigateHome}
                className="hero-candle-cta py-3 px-6 rounded-xl font-extrabold text-sm uppercase tracking-wider inline-flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Utensils className="w-4 h-4" />
                <span>Explore The 3 Specials</span>
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* Active / Pending Orders */}
              {pendingOrders.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-base font-black text-amber-400 flex items-center gap-2 font-display uppercase tracking-wider">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping inline-block" />
                    <span>Active Orders in Queue ({pendingOrders.length})</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {pendingOrders.map(order => (
                      <OrderCard key={order.id} order={order} />
                    ))}
                  </div>
                </div>
              )}

              {/* Completed / Past Orders */}
              {completedOrders.length > 0 && (
                <div className="space-y-3 pt-4">
                  <h3 className="text-sm font-bold text-stone-400 flex items-center gap-2 font-display uppercase tracking-wider">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Past Order Receipts ({completedOrders.length})</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {completedOrders.map(order => (
                      <OrderCard key={order.id} order={order} />
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

        </div>
      </div>
    </AmbientBackground>
  )
}
