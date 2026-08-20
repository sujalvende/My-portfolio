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
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}
