import React, { useState, useEffect, Component } from 'react'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { CartDrawer } from './components/CartDrawer'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AdminRoute } from './components/AdminRoute'

import { HomePage } from './pages/HomePage'
import { LoginPage } from './pages/LoginPage'
import { UserDashboard } from './pages/UserDashboard'
import { AdminDashboard } from './pages/AdminDashboard'
import { AdminSales } from './pages/AdminSales'

const VALID_PAGES = ['home', 'login', 'user-dashboard', 'admin-orders', 'admin-sales']

// Error Boundary to prevent white screen
class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('App ErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#141210] text-white flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 bg-rose-600/20 text-rose-500 rounded-2xl flex items-center justify-center mb-4 border border-rose-500/40 text-2xl font-black">
            SB
          </div>
          <h1 className="text-2xl font-black text-amber-300 font-display mb-2">Short Break Food Cart</h1>
          <p className="text-stone-400 text-sm max-w-md mb-6">
            Something unexpected occurred. Click below to reload the fresh food cart menu.
          </p>
          <button
            onClick={() => {
              window.location.hash = ''
              window.location.reload()
            }}
            className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-stone-950 font-black rounded-xl text-sm transition-all shadow-lg cursor-pointer"
          >
            Reload Menu
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

function AppContent() {
  // Simple, fast state & hash routing with bulletproof fallback to 'home'
  const [activePage, setActivePage] = useState(() => {
    try {
      const hash = window.location.hash.replace('#', '')
      return VALID_PAGES.includes(hash) ? hash : 'home'
    } catch {
      return 'home'
    }
  })

  useEffect(() => {
    const handleHashChange = () => {
      try {
        const hash = window.location.hash.replace('#', '')
        if (VALID_PAGES.includes(hash)) {
          setActivePage(hash)
        } else {
          setActivePage('home')
        }
      } catch {
        setActivePage('home')
      }
    }
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const handleNavigate = (page) => {
    const target = VALID_PAGES.includes(page) ? page : 'home'
    window.location.hash = target === 'home' ? '' : target
    setActivePage(target)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#0E0C0A] text-stone-100 selection:bg-amber-400 selection:text-stone-950">
      
      {/* Navigation */}
      <Navbar activePage={activePage} setActivePage={handleNavigate} />

      {/* Main Page Content */}
      <main className="flex-1">
        {activePage === 'login' ? (
          <LoginPage
            onLoginSuccess={() => handleNavigate('home')}
            onNavigateHome={() => handleNavigate('home')}
          />
        ) : activePage === 'user-dashboard' ? (
          <ProtectedRoute onNavigateToLogin={() => handleNavigate('login')}>
            <UserDashboard onNavigateHome={() => handleNavigate('home')} />
          </ProtectedRoute>
        ) : activePage === 'admin-orders' ? (
          <AdminRoute 
            onNavigateHome={() => handleNavigate('home')}
            onNavigateToLogin={() => handleNavigate('login')}
          >
            <AdminDashboard onNavigateToSales={() => handleNavigate('admin-sales')} />
          </AdminRoute>
        ) : activePage === 'admin-sales' ? (
          <AdminRoute 
            onNavigateHome={() => handleNavigate('home')}
            onNavigateToLogin={() => handleNavigate('login')}
          >
            <AdminSales onNavigateToOrders={() => handleNavigate('admin-orders')} />
          </AdminRoute>
        ) : (
          /* Default to HomePage */
          <HomePage 
            onNavigateToOrders={() => handleNavigate('user-dashboard')} 
            onNavigateToLogin={() => handleNavigate('login')}
          />
        )}
      </main>

      {/* Cart Drawer */}
      <CartDrawer
        onNavigateToOrders={() => handleNavigate('user-dashboard')}
        onNavigateToLogin={() => handleNavigate('login')}
      />

      {/* Footer */}
      <Footer />
      
    </div>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </ErrorBoundary>
  )
}
