import React, { useEffect, useState, useMemo } from 'react'
import { getAllOrders } from '../lib/storage'
import { AmbientBackground } from '../components/AmbientBackground'
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  Calendar, 
  BarChart3, 
  ArrowLeft, 
  RotateCw, 
  CheckCircle2, 
  Clock, 
  Download,
  Flame,
  User,
  Phone
} from 'lucide-react'

export function AdminSales({ onNavigateToOrders }) {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('all') // 'today', 'week', 'month', 'all'
  const [refreshing, setRefreshing] = useState(false)

  const loadData = async () => {
    try {
      setRefreshing(true)
      const data = await getAllOrders()
      setOrders(data || [])
    } catch (err) {
      console.error('Failed to load orders for sales:', err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // Filter orders based on timeRange
  const filteredOrders = useMemo(() => {
    if (timeRange === 'all') return orders

    const now = new Date()
    return orders.filter(order => {
      const orderDate = new Date(order.created_at)
      if (timeRange === 'today') {
        return (
          orderDate.getDate() === now.getDate() &&
          orderDate.getMonth() === now.getMonth() &&
          orderDate.getFullYear() === now.getFullYear()
        )
      }
      if (timeRange === 'week') {
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        return orderDate >= oneWeekAgo
      }
      if (timeRange === 'month') {
        return (
          orderDate.getMonth() === now.getMonth() &&
          orderDate.getFullYear() === now.getFullYear()
        )
      }
      return true
    })
  }, [orders, timeRange])

  // Aggregate Metrics & Best-Seller Breakdowns
  const stats = useMemo(() => {
    const validOrders = filteredOrders.filter(o => o.status !== 'cancelled')
    const totalRevenue = validOrders.reduce((acc, curr) => acc + (Number(curr.total_price) || 0), 0)
    const totalOrdersCount = filteredOrders.length
    const completedCount = filteredOrders.filter(o => o.status === 'completed').length
    const avgOrderValue = validOrders.length > 0 ? Math.round(totalRevenue / validOrders.length) : 0

    // Item sales breakdown
    const itemStats = {
      'Meat Box': { name: 'Meat Box', units: 0, revenue: 0, price: 100, emoji: '🍱' },
      'Grilled Chicken Sandwich': { name: 'Grilled Chicken Sandwich', units: 0, revenue: 0, price: 60, emoji: '🥪' },
      'French Fries': { name: 'French Fries', units: 0, revenue: 0, price: 50, emoji: '🍟' }
    }

    let totalUnitsSold = 0

    validOrders.forEach(order => {
      order.items?.forEach(item => {
        const itemName = Object.keys(itemStats).find(k => 
          item.name.toLowerCase().includes(k.toLowerCase()) || 
          (k.includes('Fries') && item.name.toLowerCase().includes('fries'))
        ) || item.name

        if (!itemStats[itemName]) {
          itemStats[itemName] = { name: itemName, units: 0, revenue: 0, price: item.price_at_order || 50, emoji: '🍽️' }
        }

        const qty = Number(item.quantity) || 1
        const price = Number(item.price_at_order) || itemStats[itemName].price
        itemStats[itemName].units += qty
        itemStats[itemName].revenue += (qty * price)
        totalUnitsSold += qty
      })
    })

    const sortedItems = Object.values(itemStats).sort((a, b) => b.units - a.units)

    return {
      totalRevenue,
      totalOrdersCount,
      completedCount,
      avgOrderValue,
      totalUnitsSold,
      sortedItems
    }
  }, [filteredOrders])

  // Simple CSV Export of sales data
  const exportCSV = () => {
    const headers = ['Order ID', 'Date', 'Customer', 'Items', 'Status', 'Total (BDT)']
    const rows = filteredOrders.map(o => [
      o.id,
      new Date(o.created_at).toLocaleString(),
      `"${o.customer_name || 'Customer'}"`,
      `"${o.items?.map(i => `${i.quantity}x ${i.name}`).join('; ')}"`,
      o.status,
      o.total_price
    ])
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `short_break_sales_${timeRange}_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <AmbientBackground>
      <div className="min-h-screen pb-24 pt-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Header Banner */}
          <div className="glass-panel-dark rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-0.5 bg-amber-400/20 text-amber-300 text-xs font-black rounded-full uppercase tracking-wider border border-amber-400/40">
                  Sales Analytics
                </span>
                <span className="text-xs text-stone-400 font-mono">
                  Short Break Food Cart Records
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-amber-50 font-display">
                Revenue & Best-Sellers Overview
              </h1>
              <p className="text-stone-300 text-xs sm:text-sm mt-1">
                Analyze cart sales, top selling items, and customer order history.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={onNavigateToOrders}
                className="py-2.5 px-4 bg-stone-900/90 hover:bg-stone-800 text-stone-200 rounded-xl border border-stone-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Kitchen Queue</span>
              </button>

              <button
                onClick={exportCSV}
                className="hero-candle-cta py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Download className="w-4 h-4" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {/* Time Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {[
              { id: 'all', label: 'All Time' },
              { id: 'today', label: 'Today (Live)' },
              { id: 'week', label: 'This Week' },
              { id: 'month', label: 'This Month' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setTimeRange(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  timeRange === tab.id
                    ? 'hero-candle-cta shadow-md'
                    : 'glass-panel-dark text-stone-300 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Key KPI Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Total Revenue */}
            <div className="glass-panel-dark rounded-2xl p-5 border border-amber-500/20">
              <div className="flex items-center justify-between text-stone-400 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Total Revenue</span>
                <span className="p-2 bg-amber-400/10 text-amber-400 rounded-lg">৳</span>
              </div>
              <div className="text-3xl font-black text-amber-300 font-display">
                ৳{stats.totalRevenue.toLocaleString()}
              </div>
              <p className="text-[11px] text-stone-400 mt-1">Excludes cancelled orders</p>
            </div>

            {/* Total Orders */}
            <div className="glass-panel-dark rounded-2xl p-5 border border-amber-500/20">
              <div className="flex items-center justify-between text-stone-400 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Total Orders</span>
                <ShoppingBag className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-3xl font-black text-white font-display">
                {stats.totalOrdersCount}
              </div>
              <p className="text-[11px] text-stone-400 mt-1">{stats.completedCount} successfully served</p>
            </div>

            {/* Units Sold */}
            <div className="glass-panel-dark rounded-2xl p-5 border border-amber-500/20">
              <div className="flex items-center justify-between text-stone-400 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Items Cooked</span>
                <Flame className="w-4 h-4 text-rose-500" />
              </div>
              <div className="text-3xl font-black text-white font-display">
                {stats.totalUnitsSold}
              </div>
              <p className="text-[11px] text-stone-400 mt-1">Across 3 fixed specials</p>
            </div>

            {/* Average Order Value */}
            <div className="glass-panel-dark rounded-2xl p-5 border border-amber-500/20">
              <div className="flex items-center justify-between text-stone-400 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Avg Order Value</span>
                <BarChart3 className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-3xl font-black text-amber-300 font-display">
                ৳{stats.avgOrderValue}
              </div>
              <p className="text-[11px] text-stone-400 mt-1">Per paying customer</p>
            </div>

          </div>

          {/* 3 Best-Seller Breakdown Showcase */}
          <div className="glass-panel-dark rounded-2xl p-6 sm:p-8 space-y-5">
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Product Performance</span>
              <h3 className="text-xl font-black text-white font-display">The 3 Signature Items Breakdown</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {stats.sortedItems.map((item, idx) => {
                const percentage = stats.totalUnitsSold > 0 
                  ? Math.round((item.units / stats.totalUnitsSold) * 100) 
                  : 0

                return (
                  <div key={item.name} className="bg-[#1C1814] rounded-xl p-4 border border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{item.emoji}</span>
                        <div>
                          <h4 className="font-bold text-white text-sm">{item.name}</h4>
                          <span className="text-xs text-amber-400 font-mono">৳{item.price} each</span>
                        </div>
                      </div>
                      <span className="text-xs font-mono bg-white/5 px-2 py-1 rounded text-stone-400">
                        Rank #{idx + 1}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-medium text-stone-300">
                        <span>{item.units} units sold</span>
                        <span className="font-bold text-amber-300">৳{item.revenue.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-stone-800 h-2 rounded-full overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-amber-400 to-amber-500 h-full rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Comprehensive Order History Table */}
          <div className="glass-panel-dark rounded-2xl p-6 overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-black text-white font-display">All Registered Orders</h3>
              <span className="text-xs text-stone-400 font-mono">Showing {filteredOrders.length} records</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-stone-400 text-[11px] uppercase tracking-wider">
                    <th className="py-3 px-3">Order ID</th>
                    <th className="py-3 px-3">Time</th>
                    <th className="py-3 px-3">Customer</th>
                    <th className="py-3 px-3">Items Ordered</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-medium">
                  {filteredOrders.map(order => (
                    <tr key={order.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-3 font-mono text-amber-300 font-bold">
                        #{order.id.slice(-6).toUpperCase()}
                      </td>
                      <td className="py-3 px-3 text-stone-400 text-xs">
                        {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="py-3 px-3">
                        <div className="text-stone-200 font-bold">{order.customer_name || 'Customer'}</div>
                        <div className="text-[11px] text-stone-400 font-mono">{order.customer_phone || 'No phone'}</div>
                      </td>
                      <td className="py-3 px-3 text-stone-300">
                        {order.items?.map(i => `${i.quantity}x ${i.name}`).join(', ') || 'N/A'}
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                          order.status === 'pending'
                            ? 'bg-amber-500/20 text-amber-300'
                            : order.status === 'confirmed'
                              ? 'bg-orange-500/20 text-orange-300'
                              : order.status === 'completed'
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : 'bg-rose-500/20 text-rose-300'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-amber-300">
                        ৳{order.total_price}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </AmbientBackground>
  )
}
