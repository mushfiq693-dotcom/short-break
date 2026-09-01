import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { getUserOrders, subscribeToOrders } from '../lib/storage'
import { OrderCard } from '../components/OrderCard'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { 
  ShoppingBag, 
  Clock, 
  RotateCw, 
  ArrowRight, 
  Utensils, 
  Flame, 
  CheckCircle2 
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
    <div className="cart-pattern-bg min-h-screen pb-24 pt-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Banner */}
        <div className="bg-white rounded-3xl border-4 border-stone-900 food-card-shadow p-6 sm:p-8 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="inline-block px-3 py-1 bg-amber-100 text-amber-900 text-xs font-black rounded-full mb-2 uppercase tracking-wide border border-amber-300">
              Foodie Dashboard
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-stone-900 font-display">
              Welcome, {user?.name || user?.email?.split('@')[0]}!
            </h1>
            <p className="text-stone-600 text-sm mt-1">
              Track your live food cart orders and browse your past delicious receipts.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadOrders}
              disabled={refreshing}
              className="p-3 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl border-2 border-stone-900 font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
              title="Refresh Orders"
            >
              <RotateCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <button
              onClick={onNavigateHome}
              className="food-btn-primary py-3 px-5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
            >
              <Utensils className="w-4 h-4" />
              <span>Order Food</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map(n => (
              <div key={n} className="bg-white rounded-2xl h-48 border-2 border-stone-200 animate-pulse p-6" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-3xl border-4 border-stone-900 food-card-shadow p-12 text-center max-w-lg mx-auto">
            <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-stone-900">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-stone-900 mb-2 font-display">No Orders Yet!</h3>
            <p className="text-stone-600 text-sm mb-6 leading-relaxed">
              Looks like you haven't ordered from Short Break yet. Pick a Meat Box, Chicken Sandwich, or Peri Peri Fries right now!
            </p>
            <button
              onClick={onNavigateHome}
              className="food-btn-primary py-3.5 px-6 rounded-xl font-black text-sm uppercase tracking-wider inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Explore Street Menu</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="space-y-10">
            
            {/* Active / In-Kitchen Orders */}
            {pendingOrders.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-amber-500 animate-ping" />
                  <h2 className="text-xl sm:text-2xl font-black text-stone-900 font-display">
                    Active Kitchen Orders ({pendingOrders.length})
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {pendingOrders.map(order => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      isAdmin={false}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Past Orders History */}
            {completedOrders.length > 0 && (
              <section>
                <h2 className="text-xl sm:text-2xl font-black text-stone-900 font-display mb-4">
                  Order History ({completedOrders.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {completedOrders.map(order => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      isAdmin={false}
                    />
                  ))}
                </div>
              </section>
            )}

          </div>
        )}

      </div>
    </div>
  )
}
