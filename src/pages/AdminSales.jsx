import React, { useEffect, useState, useMemo } from 'react'
import { getAllOrders } from '../lib/storage'
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
  Flame
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

  // Compute Metrics
  const metrics = useMemo(() => {
    const validOrders = filteredOrders.filter(o => o.status !== 'cancelled')
    const totalRevenue = validOrders.reduce((sum, o) => sum + Number(o.total_price), 0)
    const totalOrdersCount = filteredOrders.length
    const completedCount = filteredOrders.filter(o => o.status === 'completed').length
    const avgOrderValue = validOrders.length > 0 ? (totalRevenue / validOrders.length).toFixed(0) : 0

    // Item sales breakdown
    const itemStats = {
      'Meat Box': { name: 'Meat Box', units: 0, revenue: 0, price: 100, emoji: '📦' },
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
    link.setAttribute('download', `short_break_sales_${timeRange}_${new Date().toISOString().slice(0,10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="cart-pattern-bg min-h-screen pb-24 pt-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Banner */}
        <div className="bg-[#18181B] text-white rounded-3xl border-4 border-amber-400 p-6 sm:p-8 shadow-[6px_6px_0px_#1C1917] flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-amber-400 text-stone-900 text-xs font-black rounded-full uppercase tracking-wider">
                Sales Analytics
              </span>
              <span className="text-xs text-stone-400 font-mono">
                Short Break Food Cart Records
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white font-display">
              Revenue & Best-Sellers Overview
            </h1>
            <p className="text-stone-300 text-xs sm:text-sm mt-1">
              Analyze cart sales, top selling items, and customer order history.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onNavigateToOrders}
              className="py-3 px-4 bg-stone-800 hover:bg-stone-700 text-white rounded-xl border-2 border-stone-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kitchen Orders</span>
            </button>

            <button
              onClick={exportCSV}
              className="food-btn-secondary py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Time Range Filter Selector */}
        <div className="bg-white p-3 rounded-2xl border-2 border-stone-900 food-card-shadow flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2 text-xs font-black text-stone-700">
            <Calendar className="w-4 h-4 text-rose-600" />
            <span>Time Window:</span>
          </div>

          <div className="flex items-center gap-2">
            {[
              { id: 'today', label: 'Today' },
              { id: 'week', label: 'This Week' },
              { id: 'month', label: 'This Month' },
              { id: 'all', label: 'All Time' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setTimeRange(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  timeRange === tab.id
                    ? 'bg-amber-400 text-stone-950 border-2 border-stone-900 shadow-[2px_2px_0px_#1C1917]'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-white p-5 rounded-2xl border-2 border-stone-900 food-card-shadow">
            <span className="text-xs font-black text-stone-500 uppercase tracking-wider">Total Sales Revenue</span>
            <div className="text-3xl sm:text-4xl font-black text-rose-600 font-display mt-2">
              ৳{metrics.totalRevenue}
            </div>
            <p className="text-xs text-stone-500 font-medium mt-1">Across {timeRange} orders</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border-2 border-stone-900 food-card-shadow">
            <span className="text-xs font-black text-stone-500 uppercase tracking-wider">Total Orders Count</span>
            <div className="text-3xl sm:text-4xl font-black text-stone-900 font-display mt-2">
              {metrics.totalOrdersCount}
            </div>
            <p className="text-xs text-emerald-600 font-bold mt-1">
              {metrics.completedCount} successfully completed
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border-2 border-stone-900 food-card-shadow">
            <span className="text-xs font-black text-stone-500 uppercase tracking-wider">Average Order Value (AOV)</span>
            <div className="text-3xl sm:text-4xl font-black text-amber-500 font-display mt-2">
              ৳{metrics.avgOrderValue}
            </div>
            <p className="text-xs text-stone-500 font-medium mt-1">Per customer checkout</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border-2 border-stone-900 food-card-shadow">
            <span className="text-xs font-black text-stone-500 uppercase tracking-wider">Food Portions Cooked</span>
            <div className="text-3xl sm:text-4xl font-black text-stone-900 font-display mt-2">
              {metrics.totalUnitsSold}
            </div>
            <p className="text-xs text-stone-500 font-medium mt-1">Total units served</p>
          </div>

        </div>

        {/* Best-Selling Item Breakdown */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border-4 border-stone-900 food-card-shadow space-y-6">
          <div className="flex items-center justify-between border-b-2 border-stone-200 pb-4">
            <div>
              <span className="inline-block px-3 py-0.5 bg-rose-100 text-rose-800 text-xs font-black rounded-full mb-1 uppercase tracking-wider">
                Top Performers
              </span>
              <h2 className="text-2xl font-black text-stone-900 font-display">
                Best-Selling Item Breakdown
              </h2>
            </div>
            <span className="text-xs font-bold text-stone-500 font-mono">
              3-Item Performance
            </span>
          </div>

          <div className="space-y-5">
            {metrics.sortedItems.map((item, idx) => {
              const percentage = metrics.totalUnitsSold > 0 
                ? Math.round((item.units / metrics.totalUnitsSold) * 100) 
                : 0

              return (
                <div key={item.name} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{item.emoji}</span>
                      <span className="font-black text-stone-900 font-display text-base">
                        #{idx + 1} {item.name}
                      </span>
                      <span className="text-xs text-stone-500 font-medium">
                        (৳{item.price}/unit)
                      </span>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="font-mono font-bold text-stone-700 text-xs">
                        {item.units} units sold
                      </span>
                      <span className="font-black text-rose-600 font-display text-base">
                        ৳{item.revenue}
                      </span>
                    </div>
                  </div>

                  {/* Visual Progress Bar */}
                  <div className="w-full bg-stone-100 h-4 rounded-full overflow-hidden border border-stone-300 relative">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        idx === 0 
                          ? 'bg-rose-600' 
                          : idx === 1 
                            ? 'bg-amber-400' 
                            : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.max(percentage, 5)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] font-bold text-stone-500">
                    <span>{percentage}% of total units</span>
                    <span>Revenue Share: {metrics.totalRevenue > 0 ? Math.round((item.revenue / metrics.totalRevenue) * 100) : 0}%</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Data-Dense All Orders Log Table */}
        <div className="bg-white rounded-3xl border-4 border-stone-900 food-card-shadow overflow-hidden">
          <div className="p-6 border-b-2 border-stone-200 flex items-center justify-between">
            <h2 className="text-xl font-black text-stone-900 font-display">
              All Customer Orders Log ({filteredOrders.length})
            </h2>
            <span className="text-xs text-stone-500 font-mono">Live DB Sync</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-900 text-amber-300 uppercase tracking-wider font-mono font-bold text-[11px]">
                <tr>
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Time</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Items Breakdown</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Total Bill</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-stone-500">
                      No order records found for this time window.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map(order => (
                    <tr key={order.id} className="hover:bg-amber-50/50 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-stone-900">
                        #{order.id.slice(-6).toUpperCase()}
                      </td>
                      <td className="py-3 px-4 text-stone-600 whitespace-nowrap">
                        {new Date(order.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })} at {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="py-3 px-4 font-bold text-stone-900">
                        {order.customer_name || 'Customer'}
                        {order.customer_phone && (
                          <span className="block text-[10px] text-stone-500 font-mono font-normal">
                            {order.customer_phone}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-stone-700">
                        {order.items?.map(i => `${i.quantity}x ${i.name}`).join(', ') || '3-Item Combo'}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-block px-2 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                          order.status === 'completed' 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : order.status === 'confirmed'
                              ? 'bg-blue-100 text-blue-800'
                              : order.status === 'cancelled'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-amber-100 text-amber-800'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-black text-sm text-stone-900">
                        ৳{order.total_price}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  )
}
