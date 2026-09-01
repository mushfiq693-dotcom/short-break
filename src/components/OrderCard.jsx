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
          bg: 'bg-amber-100 text-amber-900 border-amber-400',
          icon: <PhoneCall className="w-3.5 h-3.5 text-amber-600 animate-bounce" />,
          label: 'Awaiting Call Confirmation 📞'
        }
      case 'confirmed':
        return {
          bg: 'bg-blue-100 text-blue-900 border-blue-400',
          icon: <ChefHat className="w-3.5 h-3.5 text-blue-600" />,
          label: 'Confirmed by Call • On Grill 👨‍🍳'
        }
      case 'completed':
        return {
          bg: 'bg-emerald-100 text-emerald-900 border-emerald-400',
          icon: <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />,
          label: 'Ready / Served 🎉'
        }
      case 'cancelled':
        return {
          bg: 'bg-rose-100 text-rose-900 border-rose-400',
          icon: <XCircle className="w-3.5 h-3.5 text-rose-600" />,
          label: 'Cancelled'
        }
      default:
        return {
          bg: 'bg-stone-100 text-stone-800 border-stone-300',
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
    <div className={`bg-white rounded-2xl border-2 border-stone-900 food-card-shadow p-5 flex flex-col justify-between transition-all ${
      order.status === 'pending' ? 'ring-2 ring-amber-400 ring-offset-2' : ''
    }`}>
      
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-stone-200 gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="font-mono font-black text-sm text-stone-900 bg-amber-200/80 px-2 py-0.5 rounded-md border border-stone-900">
              #{order.id.slice(-6).toUpperCase()}
            </span>
            <span className="text-xs text-stone-500 font-medium">
              {formattedDay} at {formattedDate}
            </span>
          </div>

          <div className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 border ${badge.bg}`}>
            {badge.icon}
            <span>{badge.label}</span>
          </div>
        </div>

        {/* Customer & Phone Banner */}
        <div className="mt-3 bg-amber-50/80 p-3 rounded-xl border-2 border-amber-300/80 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-stone-500 font-bold uppercase text-[10px]">Customer Details</span>
            <span className="text-stone-500 font-mono text-[10px]">Call for verification</span>
          </div>

          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 font-black text-stone-900 text-sm">
              <User className="w-4 h-4 text-rose-600" />
              <span>{order.customer_name || 'Customer'}</span>
            </div>

            {order.customer_phone ? (
              <a
                href={`tel:${order.customer_phone}`}
                className="inline-flex items-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-stone-950 px-2.5 py-1 rounded-lg font-mono font-black text-xs border border-stone-900 shadow-[1px_1px_0px_#000] transition-colors"
                title="Click to Call"
              >
                <Phone className="w-3.5 h-3.5 text-stone-900" />
                <span>{order.customer_phone}</span>
              </a>
            ) : (
              <span className="text-xs text-stone-400 italic">No phone attached</span>
            )}
          </div>
        </div>

        {/* User confirmation status tip */}
        {!isAdmin && order.status === 'pending' && (
          <div className="mt-2.5 p-2.5 bg-amber-100/90 rounded-xl border border-amber-300 text-xs text-amber-900 flex items-start gap-2">
            <PhoneCall className="w-4 h-4 text-amber-700 shrink-0 mt-0.5 animate-bounce" />
            <p className="leading-snug font-medium">
              অ্যাডমিন কিছুক্ষণের মধ্যে আপনার নাম্বারে (<strong>{order.customer_phone}</strong>) কল দিয়ে অর্ডারটি কনফার্ম করে গ্রিলে তুলবে!
            </p>
          </div>
        )}

        {!isAdmin && order.status === 'confirmed' && (
          <div className="mt-2.5 p-2.5 bg-blue-50 rounded-xl border border-blue-300 text-xs text-blue-900 flex items-start gap-2">
            <ChefHat className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
            <p className="leading-snug font-medium">
              কল কনফার্মেশন সম্পন্ন! আপনার পছন্দের আইটেমটি এখন গ্রিলে তৈরি হচ্ছে 🔥
            </p>
          </div>
        )}

        {/* Items List */}
        <div className="my-4 space-y-2">
          {order.items?.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-stone-900 text-amber-300 font-black text-xs flex items-center justify-center font-mono">
                  {item.quantity}x
                </span>
                <span className="font-bold text-stone-800 font-display">{item.name}</span>
              </div>
              <span className="font-mono font-bold text-stone-600 text-xs">
                ৳{Number(item.price_at_order) * item.quantity}
              </span>
            </div>
          ))}
        </div>

        {/* Kitchen Notes */}
        {order.notes && (
          <div className="my-2 p-2.5 bg-amber-50 rounded-xl border border-amber-300 text-xs text-amber-900 flex items-start gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
            <p className="font-medium italic">"{order.notes}"</p>
          </div>
        )}
      </div>

      {/* Footer Total & Admin Actions */}
      <div className="pt-3 border-t border-stone-200 space-y-2.5">
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Total Bill</span>
          <span className="text-xl font-black text-rose-600 font-display">৳{order.total_price}</span>
        </div>

        {/* Admin Call & Status Action Stepper */}
        {isAdmin && onUpdateStatus && (
          <div className="space-y-2 pt-1">
            {order.status === 'pending' && (
              <>
                {order.customer_phone && (
                  <a
                    href={`tel:${order.customer_phone}`}
                    className="w-full py-2.5 px-3 bg-amber-400 hover:bg-amber-300 text-stone-950 font-black rounded-xl text-xs border-2 border-stone-900 shadow-[2px_2px_0px_#000] flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    <PhoneCall className="w-4 h-4 text-stone-900" />
                    <span>Call Customer: {order.customer_phone}</span>
                  </a>
                )}

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onUpdateStatus(order.id, 'confirmed')}
                    className="flex-1 py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl text-xs border-2 border-stone-900 shadow-[2px_2px_0px_#000] flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                  >
                    <ChefHat className="w-4 h-4" />
                    <span>Call Done & Confirm</span>
                  </button>
                  <button
                    onClick={() => onUpdateStatus(order.id, 'cancelled')}
                    className="py-2.5 px-3 bg-stone-100 hover:bg-rose-100 text-stone-700 hover:text-rose-700 font-bold rounded-xl text-xs border border-stone-300 transition-colors"
                    title="Cancel order"
                  >
                    Reject
                  </button>
                </div>
              </>
            )}

            {order.status === 'confirmed' && (
              <button
                onClick={() => onUpdateStatus(order.id, 'completed')}
                className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl text-xs border-2 border-stone-900 shadow-[2px_2px_0px_#000] flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Mark Food as Ready / Served</span>
              </button>
            )}

            {order.status === 'completed' && (
              <div className="w-full py-2 px-3 bg-emerald-50 border border-emerald-300 rounded-xl text-center text-xs font-bold text-emerald-800 flex items-center justify-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>Order Picked Up & Completed</span>
              </div>
            )}

            {order.status === 'cancelled' && (
              <div className="w-full py-2 px-3 bg-rose-50 border border-rose-300 rounded-xl text-center text-xs font-bold text-rose-800">
                Order Cancelled
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  )
}
