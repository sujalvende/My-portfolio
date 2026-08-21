import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { getAdminSession } from '../lib/adminAuth'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let active = true

    getAdminSession().then(({ session, isAdmin }) => {
      if (active && session && isAdmin) {
        navigate('/sujal9892/dashboard', { replace: true })
      }
    })

    return () => {
      active = false
    }
  }, [navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) {
      setError('Please enter your admin email.')
      return
    }
    if (!password) {
      setError('Please enter your password.')
      return
    }

    if (!isSupabaseConfigured) {
      setError('Supabase credentials not configured in .env. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      if (signInError) {
        throw new Error(signInError.message || 'Invalid login credentials.')
      }

      navigate('/sujal9892/dashboard', { replace: true })
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed.')
      setPassword('')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen bg-ivory flex items-center justify-center px-6"
      style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
    >
      <div className="w-full max-w-[380px]">
        {/* Logo */}
        <div className="mb-12 text-center">
          <a
            href="/"
            className="font-sans text-sm font-medium tracking-wide text-ink hover:text-ink-muted transition-colors duration-200"
            style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
          >
            Sujal Vende
          </a>
          <p
            className="mt-2 text-ink-muted"
            style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase' }}
          >
            Admin
          </p>
        </div>

        {/* Card */}
        <div className="border border-stroke p-8 bg-[#FAF8F5]">
          <h1
            className="text-ink mb-1"
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 22,
              lineHeight: 1.3,
              letterSpacing: '-0.01em',
            }}
          >
            Sign in
          </h1>
          <p className="text-ink-muted mb-8" style={{ fontSize: 14, lineHeight: 1.6 }}>
            Access your private inquiry dashboard.
          </p>

          <form onSubmit={handleSubmit} noValidate>
            {/* Email Field */}
            <div className="mb-5">
              <label
                htmlFor="admin-email"
                style={{
                  display: 'block',
                  fontSize: 10,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: '#6E6A66',
                  marginBottom: 8,
                }}
              >
                Admin Email
              </label>
              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setError('')
                }}
                placeholder="admin@example.com"
                autoFocus
                autoComplete="email"
                className="w-full bg-transparent border border-stroke px-4 py-3 text-ink focus:outline-none focus:border-ink/40 transition-colors duration-200"
                style={{ fontSize: 15 }}
                aria-describedby={error ? 'login-error' : undefined}
              />
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="admin-password"
                style={{
                  display: 'block',
                  fontSize: 10,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: '#6E6A66',
                  marginBottom: 8,
                }}
              >
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setError('')
                }}
                placeholder="Enter password"
                autoComplete="current-password"
                className="w-full bg-transparent border border-stroke px-4 py-3 text-ink focus:outline-none focus:border-ink/40 transition-colors duration-200"
                style={{ fontSize: 15 }}
                aria-describedby={error ? 'login-error' : undefined}
              />
            </div>

            {error && (
              <p
                id="login-error"
                role="alert"
                style={{ fontSize: 12, color: '#8C7355', marginTop: 12 }}
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 font-sans border border-ink/30 text-ink hover:bg-ink hover:text-ivory transition-all duration-250 py-3.5 inline-flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              style={{ fontSize: 13, fontWeight: 500 }}
            >
              {loading ? 'Signing in…' : 'Sign In →'}
            </button>
          </form>
        </div>

        {/* Back link */}
        <p className="text-center mt-6" style={{ fontSize: 12, color: '#6E6A66' }}>
          <a
            href="/"
            className="hover:text-ink transition-colors duration-200"
            style={{ color: 'inherit' }}
          >
            ← Back to portfolio
          </a>
        </p>
      </div>
    </div>
  )
}
