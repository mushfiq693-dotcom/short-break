import { supabase, isSupabaseConfigured, DEFAULT_MENU_ITEMS } from './supabase'

const STORAGE_KEYS = {
  USERS: 'sb_users',
  ORDERS: 'sb_orders',
  CURRENT_USER: 'sb_current_user',
}

// Initial demo seed data
const DEMO_USERS = [
  {
    id: 'demo-admin-mahim',
    email: 'mahim@shortbreak.com',
    name: 'Mahim (Cart Owner)',
    phone: '01641508111',
    role: 'admin',
    password: 'password123'
  },
  {
    id: 'demo-admin-raj',
    email: 'raj@shortbreak.com',
    name: 'Raj (Cart Owner)',
    phone: '01641508100',
    role: 'admin',
    password: 'password123'
  },
  {
    id: 'demo-user-id',
    email: 'tanvir@gmail.com',
    name: 'Tanvir Hasan',
    phone: '01812-345678',
    role: 'user',
    password: 'password123'
  },
  {
    id: 'demo-user-2-id',
    email: 'sadia@gmail.com',
    name: 'Sadia Rahman',
    phone: '01913-987654',
    role: 'user',
    password: 'password123'
  }
]

const INITIAL_ORDERS = [
  {
    id: 'ord-101',
    user_id: 'demo-user-id',
    customer_name: 'Tanvir Hasan',
    customer_phone: '+880 1812-345678',
    status: 'pending',
    total_price: 210,
    notes: 'Extra garlic mayo on the side please!',
    created_at: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    items: [
      { menu_item_id: 'menu-1-meat-box', name: 'Meat Box', quantity: 1, price_at_order: 100 },
      { menu_item_id: 'menu-2-chicken-sandwich', name: 'Grilled Chicken Sandwich', quantity: 1, price_at_order: 60 },
      { menu_item_id: 'menu-3-french-fries', name: 'French Fries', quantity: 1, price_at_order: 50 }
    ]
  },
  {
    id: 'ord-102',
    user_id: 'demo-user-2-id',
    customer_name: 'Sadia Rahman',
    customer_phone: '+880 1913-987654',
    status: 'confirmed',
    total_price: 200,
    notes: 'Make it spicy 🌶️',
    created_at: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    items: [
      { menu_item_id: 'menu-1-meat-box', name: 'Meat Box', quantity: 2, price_at_order: 100 }
    ]
  },
  {
    id: 'ord-103',
    user_id: 'demo-user-id',
    customer_name: 'Tanvir Hasan',
    customer_phone: '+880 1812-345678',
    status: 'completed',
    total_price: 110,
    notes: 'Takeaway pack',
    created_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    items: [
      { menu_item_id: 'menu-2-chicken-sandwich', name: 'Grilled Chicken Sandwich', quantity: 1, price_at_order: 60 },
      { menu_item_id: 'menu-3-french-fries', name: 'French Fries', quantity: 1, price_at_order: 50 }
    ]
  }
]

// Initialize LocalStorage if empty
function initializeStorage() {
  if (typeof window === 'undefined') return
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(DEMO_USERS))
  }
  if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS))
  }
}

// Event Dispatcher for Realtime Local UI updates
const orderListeners = new Set()

export function subscribeToOrders(callback) {
  orderListeners.add(callback)
  return () => orderListeners.delete(callback)
}

function notifyOrderListeners(order, eventType = 'UPDATE') {
  orderListeners.forEach(cb => cb({ eventType, order }))
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('shortbreak:order-changed', { detail: { eventType, order } }))
  }
}

// -----------------------------------------------------------------------------
// MENU SERVICES
// -----------------------------------------------------------------------------
export async function getMenuItems() {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .order('price', { ascending: false })
    if (error) {
      console.warn('Supabase menu_items fetch error, falling back to default:', error.message)
      return DEFAULT_MENU_ITEMS
    }
    return data && data.length > 0 ? data : DEFAULT_MENU_ITEMS
  }
  return DEFAULT_MENU_ITEMS
}

// -----------------------------------------------------------------------------
// ORDER SERVICES
// -----------------------------------------------------------------------------
export async function createOrder({ user, items, notes = '', customer_phone = '' }) {
  const totalPrice = items.reduce((acc, item) => acc + (Number(item.price) * item.quantity), 0)

  if (isSupabaseConfigured && supabase) {
    // 1. Insert into orders table
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        status: 'pending',
        total_price: totalPrice,
        customer_name: user.name || user.email?.split('@')[0] || 'Customer',
        customer_phone: customer_phone || user.phone || '',
        notes: notes.trim()
      })
      .select()
      .single()

    if (orderError) throw new Error(orderError.message)

    // 2. Insert into order_items table
    const orderItemRows = items.map(item => ({
      order_id: orderData.id,
      menu_item_id: item.id,
      quantity: item.quantity,
      price_at_order: item.price
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItemRows)

    if (itemsError) throw new Error(itemsError.message)

    return {
      ...orderData,
      items: items.map(i => ({
        menu_item_id: i.id,
        name: i.name,
        quantity: i.quantity,
        price_at_order: i.price
      }))
    }
  }

  // Fallback local storage
  initializeStorage()
  const orders = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]')
  const newOrder = {
    id: `ord-${Math.floor(1000 + Math.random() * 9000)}`,
    user_id: user.id,
    customer_name: user.name || user.email?.split('@')[0] || 'Customer',
    customer_phone: customer_phone || user.phone || '+880 1700-000000',
    status: 'pending',
    total_price: totalPrice,
    notes: notes.trim(),
    created_at: new Date().toISOString(),
    items: items.map(i => ({
      menu_item_id: i.id,
      name: i.name,
      quantity: i.quantity,
      price_at_order: i.price
    }))
  }

  orders.unshift(newOrder)
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders))
  notifyOrderListeners(newOrder, 'INSERT')
  return newOrder
}

export async function getUserOrders(userId) {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        id,
        user_id,
        status,
        total_price,
        customer_name,
        customer_phone,
        notes,
        created_at,
        order_items (
          id,
          quantity,
          price_at_order,
          menu_items ( id, name, price, badge, image_url )
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)
    
    // Map joined structure
    return (data || []).map(ord => ({
      ...ord,
      items: (ord.order_items || []).map(oi => ({
        menu_item_id: oi.menu_items?.id || oi.menu_item_id,
        name: oi.menu_items?.name || 'Item',
        quantity: oi.quantity,
        price_at_order: oi.price_at_order,
        image_url: oi.menu_items?.image_url
      }))
    }))
  }

  initializeStorage()
  const orders = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]')
  return orders.filter(o => o.user_id === userId)
}

export async function getAllOrders() {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        id,
        user_id,
        status,
        total_price,
        customer_name,
        customer_phone,
        notes,
        created_at,
        order_items (
          id,
          quantity,
          price_at_order,
          menu_items ( id, name, price, badge, image_url )
        )
      `)
      .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)

    return (data || []).map(ord => ({
      ...ord,
      items: (ord.order_items || []).map(oi => ({
        menu_item_id: oi.menu_items?.id || oi.menu_item_id,
        name: oi.menu_items?.name || 'Item',
        quantity: oi.quantity,
        price_at_order: oi.price_at_order,
        image_url: oi.menu_items?.image_url
      }))
    }))
  }

  initializeStorage()
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]')
}

export async function updateOrderStatus(orderId, newStatus) {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data
  }

  initializeStorage()
  const orders = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]')
  const index = orders.findIndex(o => o.id === orderId)
  if (index !== -1) {
    orders[index] = { ...orders[index], status: newStatus }
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders))
    notifyOrderListeners(orders[index], 'UPDATE')
    return orders[index]
  }
  throw new Error('Order not found')
}
