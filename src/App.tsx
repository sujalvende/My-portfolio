import { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Intro from './components/Intro'
import Work from './components/Work'
import Services from './components/Services'
import About from './components/About'
import Skills from './components/Skills'
import Process from './components/Process'
import Contact from './components/Contact'
import Footer from './components/Footer'
import Cursor from './components/Cursor'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import { supabase, isSupabaseConfigured } from './lib/supabase'
import { getAdminSession } from './lib/adminAuth'

function ProtectedAdminRoute() {
  const [authState, setAuthState] = useState<
    'loading' | 'authorized' | 'unauthenticated' | 'unauthorized'
  >('loading')

  useEffect(() => {
    let active = true

    const checkAdminAccess = async () => {
      if (!isSupabaseConfigured) {
        if (active) setAuthState('unauthenticated')
        return
      }

      const { session, isAdmin } = await getAdminSession()
      if (!active) return

      if (!session) {
        setAuthState('unauthenticated')
      } else if (!isAdmin) {
        setAuthState('unauthorized')
      } else {
        setAuthState('authorized')
      }
    }

    checkAdminAccess()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!active) return
      if (event === 'SIGNED_OUT' || !session) {
        setAuthState('unauthenticated')
      } else if (event === 'SIGNED_IN') {
        checkAdminAccess()
      }
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [])

  if (authState === 'loading') {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center">
        <p className="text-sm text-ink-muted">Loading…</p>
      </div>
    )
  }

  if (authState === 'unauthorized') {
    return <Navigate to="/" replace />
  }

  if (authState === 'unauthenticated') {
    return <Navigate to="/sujal9892/login" replace />
  }

  return <AdminDashboard />
}

// Main portfolio page — all existing sections unchanged
function Portfolio() {
  return (
    <div className="bg-ivory min-h-screen">
      <Nav />
      <main>
        <Hero />
        <Intro />
        <Work />
        <Services />
        <About />
        <Skills />
        <Process />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <>
      <Cursor />
      <Routes>
        <Route path="/" element={<Portfolio />} />
        <Route path="/sujal9892/login" element={<AdminLogin />} />
        <Route path="/sujal9892/dashboard" element={<ProtectedAdminRoute />} />
        <Route path="/admin/*" element={<Navigate to="/" replace />} />
        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}
