import { useEffect, useState } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
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
  const navigate = useNavigate()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    let active = true

    const checkAdminAccess = async () => {
      if (!isSupabaseConfigured) {
        navigate('/sujal9892/login', { replace: true })
        return
      }

      const { session, isAdmin } = await getAdminSession()

      if (!session) {
        navigate('/sujal9892/login', { replace: true })
        return
      }

      if (!isAdmin) {
        navigate('/', { replace: true })
        return
      }

      if (active) setChecking(false)
    }

    checkAdminAccess()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) navigate('/sujal9892/login', { replace: true })
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [navigate])

  if (checking) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center">
        <p className="text-sm text-ink-muted">Loading…</p>
      </div>
    )
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
