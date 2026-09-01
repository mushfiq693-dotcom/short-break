import React, { useEffect, useState } from 'react'
import { getAllOrders, updateOrderStatus, subscribeToOrders } from '../lib/storage'
import { OrderCard } from '../components/OrderCard'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { 
  ShieldCheck, 
  RotateCw, 
  Filter, 
  Flame, 
  Search, 
  CheckCircle2, 
  Clock, 
  ChefHat, 
  Volume2, 
  VolumeX,
  TrendingUp,
  AlertCircle
} from 'lucide-react'

export function AdminDashboard({ onNavigateToSales }) {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [statusFilter, setStatusFilter] = useState('all') // all, pending, confirmed, completed
  const [searchQuery, setSearchQuery] = useState('')
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(new Date())

  // Play audio alert on new pending order
  const playAlertSound = () => {
    if (!soundEnabled) return
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)()
      const osc = audioCtx.createOscillator()
      const gain = audioCtx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime) // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15) // A5
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3)
      osc.connect(gain)
      gain.connect(audioCtx.destination)
      osc.start()
      osc.stop(audioCtx.currentTime + 0.3)
    } catch {
      // Ignore if audio context blocked
    }
  }

  const loadOrders = async () => {
    try {
      setRefreshing(true)
      const data = await getAllOrders()
      setOrders(data || [])
      setLastUpdated(new Date())
    } catch (err) {
      console.error('Failed to load admin orders:', err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    loadOrders()

    // 1. Supabase Realtime channel subscription for all orders
    let channel
    if (isSupabaseConfigured && supabase) {
      channel = supabase
        .channel('admin-all-orders')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'orders' },
          (payload) => {
            console.log('Admin Realtime Order Event:', payload)
            if (payload.eventType === 'INSERT') {
              playAlertSound()
            }
            loadOrders()
          }
        )
        .subscribe()
    }

    // 2. Local demo storage subscription
    const unsubscribe = subscribeToOrders((event) => {
      if (event.eventType === 'INSERT') {
        playAlertSound()
      }
      loadOrders()
    })

    return () => {
      if (channel) supabase.removeChannel(channel)
      unsubscribe()
    }
  }, [soundEnabled])

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      // Optimistic UI update
      setOrders(prev =>
        prev.map(o => (o.id === orderId ? { ...o, status: newStatus } : o))
      )
      await updateOrderStatus(orderId, newStatus)
    } catch (err) {
      console.error('Failed to update order status:', err)
      loadOrders()
    }
  }

  // Filter & search logic
  const filteredOrders = orders.filter(order => {
    const matchesFilter = statusFilter === 'all' || order.status === statusFilter
    const matchesSearch = searchQuery === '' || 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer_phone?.includes(searchQuery) ||
      order.items?.some(i => i.name.toLowerCase().includes(searchQuery.toLowerCase()))

    return matchesFilter && matchesSearch
  })

  const pendingCount = orders.filter(o => o.status === 'pending').length
  const confirmedCount = orders.filter(o => o.status === 'confirmed').length
  const completedCount = orders.filter(o => o.status === 'completed').length

  return (
    <div className="cart-pattern-bg min-h-screen pb-24 pt-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Admin Header Banner */}
        <div className="bg-[#18181B] text-white rounded-3xl border-4 border-amber-400 p-6 sm:p-8 shadow-[6px_6px_0px_#1C1917] flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-rose-600 text-white text-xs font-black rounded-full uppercase tracking-wider border border-rose-400">
                Cart Manager Portal
              </span>
              <span className="flex items-center gap-1.5 text-xs text-amber-400 font-bold bg-stone-800 px-2.5 py-1 rounded-full">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Live Kitchen Stream
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white font-display">
              Incoming Orders & Grill Queue
            </h1>
            <p className="text-stone-300 text-xs sm:text-sm mt-1">
              Real-time feed of orders placed by customers. Accept, prepare, and mark ready.
            </p>
          </div>

          {/* Action Bar */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-3 rounded-xl border-2 border-stone-700 text-xs font-bold flex items-center gap-1.5 transition-colors ${
                soundEnabled ? 'bg-amber-400 text-stone-900 border-amber-400' : 'bg-stone-800 text-stone-400'
              }`}
              title={soundEnabled ? 'Mute Alert Chime' : 'Enable Alert Chime'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span className="hidden sm:inline">{soundEnabled ? 'Chime ON' : 'Chime OFF'}</span>
            </button>

            <button
              onClick={loadOrders}
              disabled={refreshing}
              className="p-3 bg-stone-800 hover:bg-stone-700 text-white rounded-xl border-2 border-stone-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>

            <button
              onClick={onNavigateToSales}
              className="food-btn-secondary py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
            >
              <TrendingUp className="w-4 h-4" />
              <span>Sales Overview</span>
            </button>
          </div>
        </div>

        {/* Status Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <button
            onClick={() => setStatusFilter('all')}
            className={`p-4 rounded-2xl border-2 border-stone-900 text-left transition-all ${
              statusFilter === 'all'
                ? 'bg-stone-900 text-white shadow-[4px_4px_0px_#F59E0B]'
                : 'bg-white text-stone-900 food-card-shadow'
            }`}
          >
            <span className="text-xs font-bold uppercase tracking-wider opacity-70">All Orders</span>
            <div className="text-2xl sm:text-3xl font-black font-display mt-1">{orders.length}</div>
          </button>

          <button
            onClick={() => setStatusFilter('pending')}
            className={`p-4 rounded-2xl border-2 border-stone-900 text-left transition-all relative ${
              statusFilter === 'pending'
                ? 'bg-amber-400 text-stone-900 shadow-[4px_4px_0px_#1C1917]'
                : 'bg-white text-stone-900 food-card-shadow'
            }`}
          >
            {pendingCount > 0 && (
              <span className="absolute top-3 right-3 w-3 h-3 rounded-full bg-rose-600 animate-ping" />
            )}
            <span className="text-xs font-bold uppercase tracking-wider opacity-80">Pending ⏳</span>
            <div className="text-2xl sm:text-3xl font-black font-display mt-1 text-amber-900">{pendingCount}</div>
          </button>

          <button
            onClick={() => setStatusFilter('confirmed')}
            className={`p-4 rounded-2xl border-2 border-stone-900 text-left transition-all ${
              statusFilter === 'confirmed'
                ? 'bg-blue-600 text-white shadow-[4px_4px_0px_#1C1917]'
                : 'bg-white text-stone-900 food-card-shadow'
            }`}
          >
            <span className="text-xs font-bold uppercase tracking-wider opacity-80">On Grill 👨‍🍳</span>
            <div className="text-2xl sm:text-3xl font-black font-display mt-1">{confirmedCount}</div>
          </button>

          <button
            onClick={() => setStatusFilter('completed')}
            className={`p-4 rounded-2xl border-2 border-stone-900 text-left transition-all ${
              statusFilter === 'completed'
                ? 'bg-emerald-600 text-white shadow-[4px_4px_0px_#1C1917]'
                : 'bg-white text-stone-900 food-card-shadow'
            }`}
          >
            <span className="text-xs font-bold uppercase tracking-wider opacity-80">Completed 🎉</span>
            <div className="text-2xl sm:text-3xl font-black font-display mt-1">{completedCount}</div>
          </button>
        </div>

        {/* Filter & Search Toolbar */}
        <div className="bg-white p-4 rounded-2xl border-2 border-stone-900 food-card-shadow flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Search by customer, item, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs bg-stone-50 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-amber-400 font-medium"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto text-xs font-bold">
            <span className="text-stone-500 whitespace-nowrap">Filter Status:</span>
            {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg capitalize whitespace-nowrap transition-colors ${
                  statusFilter === st
                    ? 'bg-stone-900 text-white'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Orders Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(n => (
              <div key={n} className="bg-white rounded-2xl h-64 border-2 border-stone-200 animate-pulse p-6" />
            ))}
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-3xl border-4 border-stone-900 food-card-shadow p-12 text-center max-w-md mx-auto">
            <CheckCircle2 className="w-16 h-16 text-stone-400 mx-auto mb-3" />
            <h3 className="text-xl font-black text-stone-900 font-display">No Orders Found</h3>
            <p className="text-stone-500 text-xs mt-1">
              No orders matching current filter "{statusFilter}".
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOrders.map(order => (
              <OrderCard
                key={order.id}
                order={order}
                isAdmin={true}
                onUpdateStatus={handleStatusChange}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  )
}
