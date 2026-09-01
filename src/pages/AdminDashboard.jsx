import React, { useEffect, useState } from 'react'
import { getAllOrders, updateOrderStatus, subscribeToOrders } from '../lib/storage'
import { OrderCard } from '../components/OrderCard'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { AmbientBackground } from '../components/AmbientBackground'
import { 
  ShieldCheck, 
  RotateCw, 
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

    // 1. Supabase Realtime channel
    let channel
    if (isSupabaseConfigured && supabase) {
      channel = supabase
        .channel('admin-orders-stream')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'orders' },
          (payload) => {
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
    <AmbientBackground>
      <div className="min-h-screen pb-24 pt-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Admin Header Banner */}
          <div className="glass-panel-dark rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-0.5 bg-rose-600/90 text-white text-xs font-black rounded-full uppercase tracking-wider border border-rose-400/40">
                  Cart Manager Portal
                </span>
                <span className="flex items-center gap-1.5 text-xs text-amber-300 font-bold bg-[#241F1A] px-2.5 py-0.5 rounded-full border border-amber-500/20">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Live Kitchen Stream
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-amber-50 font-display">
                Incoming Orders & Grill Queue
              </h1>
              <p className="text-stone-300 text-xs sm:text-sm mt-1">
                Real-time feed of orders placed by customers. Accept, prepare, and mark ready.
              </p>
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  soundEnabled 
                    ? 'bg-amber-400/20 text-amber-300 border-amber-400/50' 
                    : 'bg-stone-900 text-stone-400 border-stone-800'
                }`}
                title={soundEnabled ? 'Mute Alert Chime' : 'Enable Alert Chime'}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4" />}
                <span className="hidden sm:inline">{soundEnabled ? 'Chime ON' : 'Chime OFF'}</span>
              </button>

              <button
                onClick={loadOrders}
                disabled={refreshing}
                className="p-2.5 bg-stone-900/90 hover:bg-stone-800 text-stone-200 rounded-xl border border-stone-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCw className={`w-3.5 h-3.5 text-amber-400 ${refreshing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </button>

              <button
                onClick={onNavigateToSales}
                className="hero-candle-cta py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Sales Overview</span>
              </button>
            </div>
          </div>

          {/* Status Counters */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <button
              onClick={() => setStatusFilter('all')}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-amber-400/20 border-amber-400 text-amber-200 shadow-md'
                  : 'glass-panel-dark text-stone-300 hover:border-amber-500/40'
              }`}
            >
              <span className="text-xs font-bold uppercase tracking-wider opacity-70">All Orders</span>
              <div className="text-2xl sm:text-3xl font-black font-display mt-1 text-white">{orders.length}</div>
            </button>

            <button
              onClick={() => setStatusFilter('pending')}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                statusFilter === 'pending'
                  ? 'bg-amber-500/25 border-amber-400 text-amber-300 shadow-md ring-1 ring-amber-400'
                  : 'glass-panel-dark text-stone-300 hover:border-amber-500/40'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Needs Call</span>
                {pendingCount > 0 && <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />}
              </div>
              <div className="text-2xl sm:text-3xl font-black font-display mt-1 text-amber-300">{pendingCount}</div>
            </button>

            <button
              onClick={() => setStatusFilter('confirmed')}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                statusFilter === 'confirmed'
                  ? 'bg-orange-500/25 border-orange-400 text-orange-300 shadow-md'
                  : 'glass-panel-dark text-stone-300 hover:border-orange-500/40'
              }`}
            >
              <span className="text-xs font-bold uppercase tracking-wider text-orange-400">On Grill</span>
              <div className="text-2xl sm:text-3xl font-black font-display mt-1 text-orange-300">{confirmedCount}</div>
            </button>

            <button
              onClick={() => setStatusFilter('completed')}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                statusFilter === 'completed'
                  ? 'bg-emerald-500/25 border-emerald-400 text-emerald-300 shadow-md'
                  : 'glass-panel-dark text-stone-300 hover:border-emerald-500/40'
              }`}
            >
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Served</span>
              <div className="text-2xl sm:text-3xl font-black font-display mt-1 text-emerald-300">{completedCount}</div>
            </button>
          </div>

          {/* Search & Filter Bar */}
          <div className="glass-panel-dark rounded-xl p-3 flex items-center gap-3">
            <Search className="w-4 h-4 text-amber-400 shrink-0" />
            <input
              type="text"
              placeholder="Search by customer name, phone number, or order ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-0 text-white placeholder:text-stone-500 text-xs sm:text-sm focus:outline-hidden w-full"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-stone-400 hover:text-white px-2 py-1 bg-stone-800 rounded cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* Orders Stream Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3].map(n => (
                <div key={n} className="glass-panel-dark rounded-2xl h-64 animate-pulse p-6" />
              ))}
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="glass-panel-dark rounded-2xl p-12 text-center max-w-md mx-auto">
              <Clock className="w-10 h-10 text-amber-400 mx-auto mb-3 opacity-60" />
              <h3 className="text-lg font-black text-amber-50 mb-1 font-display">No Orders Found</h3>
              <p className="text-xs text-stone-400">
                {searchQuery ? 'No orders match your search term.' : 'There are currently no orders in this status category.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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
    </AmbientBackground>
  )
}
