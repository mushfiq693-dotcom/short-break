import React from 'react'
import { 
  Clock, 
  CheckCircle, 
  Flame, 
  XCircle, 
  User, 
  Phone, 
  MessageSquare, 
  ChefHat, 
  Sparkles,
  ArrowRight,
  PhoneCall
} from 'lucide-react'

export function OrderCard({ order, isAdmin = false, onUpdateStatus }) {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return {
          bg: 'bg-amber-500/20 text-amber-300 border-amber-400/40',
          icon: <PhoneCall className="w-3.5 h-3.5 text-amber-400 animate-bounce" />,
          label: 'Awaiting Call Confirmation'
        }
      case 'confirmed':
        return {
          bg: 'bg-orange-500/20 text-orange-300 border-orange-400/40',
          icon: <ChefHat className="w-3.5 h-3.5 text-orange-400" />,
          label: 'Confirmed • On Grill 👨‍🍳'
        }
      case 'completed':
        return {
          bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40',
          icon: <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />,
          label: 'Ready / Served 🎉'
        }
      case 'cancelled':
        return {
          bg: 'bg-rose-950/60 text-rose-300 border-rose-800/50',
          icon: <XCircle className="w-3.5 h-3.5 text-rose-400" />,
          label: 'Cancelled'
        }
      default:
        return {
          bg: 'bg-stone-800 text-stone-300 border-stone-700',
          icon: <Clock className="w-3.5 h-3.5" />,
          label: status
        }
    }
  }

  const badge = getStatusBadge(order.status)
  const formattedDate = new Date(order.created_at).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  })
  const formattedDay = new Date(order.created_at).toLocaleDateString([], {
    month: 'short',
    day: 'numeric'
  })

  return (
    <div className={`glass-panel-dark rounded-2xl p-5 flex flex-col justify-between transition-all ${
      order.status === 'pending' ? 'ring-1 ring-amber-400/50' : ''
    }`}>
      
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-white/10 gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="font-mono font-black text-xs text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/30">
              #{order.id.slice(-6).toUpperCase()}
            </span>
            <span className="text-xs text-stone-400 font-medium">
              {formattedDay} at {formattedDate}
            </span>
          </div>

          <div className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 border ${badge.bg}`}>
            {badge.icon}
            <span>{badge.label}</span>
          </div>
        </div>

        {/* Customer & Phone Banner */}
        <div className="mt-3 bg-[#1D1915] p-3 rounded-xl border border-amber-500/20 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-stone-400 font-bold uppercase text-[10px] tracking-wider">Customer Contact</span>
            <span className="text-stone-400 font-mono text-[10px]">Verification Line</span>
          </div>

          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 font-bold text-white text-sm">
              <User className="w-3.5 h-3.5 text-rose-400" />
              <span>{order.customer_name || 'Customer'}</span>
            </div>

            {order.customer_phone ? (
              <a
                href={`tel:${order.customer_phone}`}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 rounded-lg text-xs font-mono font-bold border border-emerald-500/40 transition-colors shadow-xs"
                title="Tap to Call Customer"
              >
                <PhoneCall className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span>{order.customer_phone}</span>
                <span className="text-[10px] font-sans underline ml-0.5 hidden sm:inline">Call</span>
              </a>
            ) : (
              <span className="text-xs text-stone-500 italic">No phone attached</span>
            )}
          </div>
        </div>

        {/* Items List */}
        <div className="mt-3.5 space-y-2">
          {order.items?.map((item, idx) => (
            <div 
              key={idx} 
              className="flex justify-between items-center text-xs py-1.5 px-2.5 bg-white/[0.03] rounded-lg border border-white/[0.04]"
            >
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded bg-amber-400/20 text-amber-300 font-black flex items-center justify-center text-xs border border-amber-400/30">
                  {item.quantity}
                </span>
                <span className="font-bold text-stone-200 text-xs">{item.name}</span>
              </div>
              <span className="font-mono text-stone-300">
                ৳{(item.price_at_order || 50) * item.quantity}
              </span>
            </div>
          ))}
        </div>

        {/* Special Instructions / Notes */}
        {order.notes && (
          <div className="mt-3 bg-stone-900/60 p-2.5 rounded-lg border border-white/5 text-xs text-stone-300 flex items-start gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
            <span className="italic leading-tight">{order.notes}</span>
          </div>
        )}
      </div>

      {/* Bottom Summary & Status Update Actions */}
      <div className="mt-4 pt-3 border-t border-white/10">
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs text-stone-400 uppercase font-bold tracking-wider">Total Bill</span>
          <span className="text-xl font-black text-amber-300 font-display">৳{order.total_price}</span>
        </div>

        {/* Status Action Buttons for Kitchen Admin */}
        {isAdmin && onUpdateStatus && (
          <div className="space-y-2 pt-1">
            
            {order.status === 'pending' && (
              <div className="flex gap-2">
                <button
                  onClick={() => onUpdateStatus(order.id, 'confirmed')}
                  className="flex-1 py-2 px-3 hero-candle-cta rounded-xl font-extrabold text-xs uppercase tracking-wide flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                >
                  <ChefHat className="w-3.5 h-3.5" />
                  <span>Call Done & Confirm</span>
                </button>
                <button
                  onClick={() => onUpdateStatus(order.id, 'cancelled')}
                  className="py-2 px-3 bg-rose-950/80 hover:bg-rose-900 text-rose-300 rounded-xl border border-rose-800/60 font-bold text-xs cursor-pointer"
                  title="Cancel Order"
                >
                  <XCircle className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {order.status === 'confirmed' && (
              <button
                onClick={() => onUpdateStatus(order.id, 'completed')}
                className="w-full py-2.5 px-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Mark Food Ready / Served</span>
              </button>
            )}

            {order.status === 'completed' && (
              <div className="text-center py-1 text-xs text-emerald-400 font-bold flex items-center justify-center gap-1 bg-emerald-950/40 rounded-lg border border-emerald-500/20">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>Order Completed</span>
              </div>
            )}

            {order.status === 'cancelled' && (
              <div className="text-center py-1 text-xs text-rose-400 font-bold flex items-center justify-center gap-1 bg-rose-950/40 rounded-lg border border-rose-800/30">
                <XCircle className="w-3.5 h-3.5 text-rose-400" />
                <span>Order Cancelled</span>
              </div>
            )}

          </div>
        )}

      </div>

    </div>
  )
}
