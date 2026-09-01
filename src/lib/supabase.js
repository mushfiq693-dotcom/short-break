import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('placeholder') &&
  !supabaseAnonKey.includes('placeholder')
)

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null

export const DEFAULT_MENU_ITEMS = [
  {
    id: 'menu-1-meat-box',
    name: 'Meat Box',
    price: 100,
    badge: 'Best Seller 🔥',
    description: 'Crispy fried chicken bites loaded with sausage chunks, golden fries, signature garlic mayo & hot chili drizzle.',
    image_url: '/meatbox.jpg',
    category: 'Platter',
    is_available: true
  },
  {
    id: 'menu-2-chicken-sandwich',
    name: 'Grilled Chicken Sandwich',
    price: 60,
    badge: 'Chef Special ✨',
    description: 'Golden toasted bread stuffed with juicy shredded chicken, fresh lettuce, creamy house spread & black pepper seasoning.',
    image_url: '/sandwich.jpg',
    category: 'Sandwich',
    is_available: true
  },
  {
    id: 'menu-3-french-fries',
    name: 'Peri Peri French Fries',
    price: 50,
    badge: 'Snack Favorite 🍟',
    description: 'Crispy skin-on potato fries tossed in zesty peri-peri spice blend, served hot with tangy tomato ketchup dip.',
    image_url: '/fries.jpg',
    category: 'Snack',
    is_available: true
  }
]
