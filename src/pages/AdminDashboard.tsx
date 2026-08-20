import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

// ── Types ──────────────────────────────────────────────────────────────────
type Status = 'New' | 'Contacted' | 'In Progress' | 'Closed'

interface Inquiry {
  id: string
  name: string
  email: string
  phone: string
  service: string
  budget: string
  message: string
  status: Status
  createdAt: string
}

// ── Status Chips ────────────────────────────────────────────────────────────
const STATUS_COLORS: Record<Status, string> = {
  New: '#8C7355',           // bronze
  Contacted: '#3D6B5A',     // muted emerald
  'In Progress': '#2A5A8C', // muted slate blue
  Closed: '#6E6A66',        // muted grey
}

const STATUS_BG: Record<Status, string> = {
  New: 'rgba(140,115,85,0.12)',
  Contacted: 'rgba(61,107,90,0.12)',
  'In Progress': 'rgba(42,90,140,0.12)',
  Closed: 'rgba(110,106,102,0.1)',
}

function StatusBadge({ status }: { status: Status }) {
  return (
    <span
      style={{
        display: 'inline-block',
        fontFamily: "'DM Sans', system-ui, sans-serif",
        fontSize: 9,
        fontWeight: 600,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color: STATUS_COLORS[status] || '#6E6A66',
        background: STATUS_BG[status] || 'transparent',
        padding: '3px 8px',
        borderRadius: 2,
      }}
    >
      {status}
    </span>
  )
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return iso
  }
}

// ── Restored Compact Inquiry Card ──────────────────────────────────────────
function InquiryCard({
  inquiry,
  onStatusChange,
  onDelete,
  expanded,
  onToggle,
}: {
  inquiry: Inquiry
  onStatusChange: (id: string, status: Status) => void
  onDelete: (id: string) => void
  expanded: boolean
  onToggle: () => void
}) {
  const [deleting, setDeleting] = useState(false)

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!confirm(`Delete inquiry from ${inquiry.name}? This cannot be undone.`)) return
    setDeleting(true)
    onDelete(inquiry.id)
  }

  return (
    <div
      style={{
        border: '1px solid #E3DDD7',
        backgroundColor: '#FDFCFB',
        marginBottom: 10,
        transition: 'box-shadow 0.2s',
      }}
    >
      {/* Card Header Button */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full text-left"
        style={{
          padding: '16px 20px',
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          gap: 16,
          alignItems: 'center',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0,1.2fr) minmax(0,1.2fr) minmax(0,0.8fr)',
            gap: '8px 16px',
            alignItems: 'center',
          }}
        >
          {/* Name + Service */}
          <div>
            <p style={{ fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: 14, fontWeight: 500, color: '#0D0C0B', margin: '0 0 2px' }}>
              {inquiry.name}
            </p>
            <p style={{ fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: 11, color: '#6E6A66', letterSpacing: '0.04em', margin: 0 }}>
              {inquiry.service}
            </p>
          </div>

          {/* Email / Phone */}
          <div>
            <p style={{ fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: 12, color: '#3D3937', margin: 0 }}>
              {inquiry.email}
            </p>
            {inquiry.phone && (
              <p style={{ fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: 11, color: '#8C7355', margin: '2px 0 0' }}>
                {inquiry.phone}
              </p>
            )}
          </div>

          {/* Date */}
          <p style={{ fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: 11, color: '#6E6A66', margin: 0 }}>
            {formatDate(inquiry.createdAt)}
          </p>
        </div>

        {/* Status + Expand indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
          <StatusBadge status={inquiry.status} />
          <span
            style={{
              fontSize: 11,
              color: '#B8B1AA',
              display: 'inline-block',
              transition: 'transform 0.2s',
              transform: expanded ? 'rotate(180deg)' : 'none',
            }}
          >
            ↓
          </span>
        </div>
      </button>

      {/* Expanded Details Panel */}
      {expanded && (
        <div style={{ borderTop: '1px solid #E3DDD7', padding: '20px' }}>
          {/* Message */}
          <div style={{ marginBottom: 18 }}>
            <p style={{ fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#6E6A66', margin: '0 0 8px' }}>
              Message
            </p>
            <p style={{ fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: 14, color: '#3D3937', lineHeight: 1.7, margin: 0, whiteSpace: 'pre-wrap' }}>
              {inquiry.message}
            </p>
          </div>

          {/* Meta Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
              gap: '12px 24px',
              marginBottom: 18,
              padding: '12px 16px',
              backgroundColor: '#F7F5F2',
            }}
          >
            {inquiry.phone && (
              <div>
                <p style={{ fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#6E6A66', margin: '0 0 4px' }}>
                  Phone
                </p>
                <a href={`tel:${inquiry.phone}`} style={{ fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: 13, color: '#0D0C0B', textDecoration: 'none' }}>
                  {inquiry.phone}
                </a>
              </div>
            )}
            <div>
              <p style={{ fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#6E6A66', margin: '0 0 4px' }}>
                Budget
              </p>
              <p style={{ fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: 13, color: '#0D0C0B', margin: 0 }}>
                {inquiry.budget || 'Not specified'}
              </p>
            </div>
            <div>
              <p style={{ fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#6E6A66', margin: '0 0 4px' }}>
                Email Direct
              </p>
              <a href={`mailto:${inquiry.email}`} style={{ fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: 13, color: '#0D0C0B', textDecoration: 'none' }}>
                {inquiry.email}
              </a>
            </div>
          </div>

          {/* Action Row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <label style={{ fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#6E6A66' }}>
                Status
              </label>
              <select
                value={inquiry.status}
                onChange={(e) => onStatusChange(inquiry.id, e.target.value as Status)}
                style={{
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  fontSize: 12,
                  color: '#0D0C0B',
                  background: '#F9F7F4',
                  border: '1px solid #E3DDD7',
                  padding: '4px 24px 4px 8px',
                  appearance: 'none',
                  cursor: 'pointer',
                }}
              >
                {(['New', 'Contacted', 'In Progress', 'Closed'] as Status[]).map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <a
              href={`mailto:${inquiry.email}?subject=Re: Your inquiry on Sujal Vende Portfolio`}
              style={{
                fontFamily: "'DM Sans', system-ui, sans-serif",
                fontSize: 12,
                color: '#0D0C0B',
                border: '1px solid #E3DDD7',
                padding: '5px 12px',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              Reply ↗
            </a>

            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              style={{
                marginLeft: 'auto',
                fontFamily: "'DM Sans', system-ui, sans-serif",
                fontSize: 11,
                color: '#B8B1AA',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px 0',
              }}
            >
              {deleting ? 'Deleting…' : 'Delete'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Admin Dashboard Component ───────────────────────────────────────────────
export default function AdminDashboard() {
  const navigate = useNavigate()
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<Status | 'All'>('All')
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const token = localStorage.getItem('admin_token')

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current))
    }, 2500)
  }

  const fetchInquiries = useCallback(async () => {
    if (!token) {
      navigate('/admin', { replace: true })
      return
    }
    try {
      const res = await fetch('/api/inquiries', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.status === 401) {
        logout()
        return
      }
      if (!res.ok) throw new Error('Failed to load inquiries.')
      const data: Inquiry[] = await res.json()
      setInquiries(data)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error loading data.')
    } finally {
      setLoading(false)
    }
  }, [token, navigate])

  useEffect(() => {
    if (!token) {
      navigate('/admin', { replace: true })
      return
    }
    fetchInquiries()
  }, [fetchInquiries, navigate, token])

  const logout = () => {
    localStorage.removeItem('admin_token')
    navigate('/admin', { replace: true })
  }

  const handleStatusChange = async (id: string, status: Status) => {
    // Optimistic local update
    setInquiries((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)))
    showToast(`Status updated to ${status}`)

    try {
      const res = await fetch(`/api/inquiries/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      })
      if (res.status === 401) {
        logout()
        return
      }
      if (!res.ok) {
        // Revert on failure
        fetchInquiries()
      }
    } catch {
      fetchInquiries()
    }
  }

  const handleDelete = async (id: string) => {
    // Immediate local removal
    setInquiries((prev) => prev.filter((i) => i.id !== id))
    if (expandedId === id) setExpandedId(null)
    showToast('Inquiry deleted')

    try {
      const res = await fetch(`/api/inquiries/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.status === 401) {
        logout()
        return
      }
      if (!res.ok) {
        fetchInquiries()
      }
    } catch {
      fetchInquiries()
    }
  }

  // Filter + search + sort (newest inquiries first by default)
  const filtered = inquiries
    .filter((i) => {
      if (filterStatus !== 'All' && i.status !== filterStatus) return false
      if (search) {
        const q = search.toLowerCase()
        return (
          i.name.toLowerCase().includes(q) ||
          i.email.toLowerCase().includes(q) ||
          i.service.toLowerCase().includes(q) ||
          i.message.toLowerCase().includes(q)
        )
      }
      return true
    })
    .sort((a, b) => {
      const diff = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      return sortOrder === 'newest' ? diff : -diff
    })

  const total = inquiries.length
  const countNew = inquiries.filter((i) => i.status === 'New').length
  const countContacted = inquiries.filter((i) => i.status === 'Contacted').length

  const sans = "'DM Sans', system-ui, sans-serif"
  const serif = "'Playfair Display', Georgia, serif"

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#F9F7F4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ fontFamily: sans, fontSize: 13, color: '#6E6A66', letterSpacing: '0.1em' }}>Loading…</p>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F9F7F4', fontFamily: sans }}>
      {/* Subtle floating notification toast */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            backgroundColor: '#0D0C0B',
            color: '#F9F7F4',
            padding: '10px 18px',
            borderRadius: 4,
            fontSize: 12,
            fontFamily: sans,
            letterSpacing: '0.04em',
            zIndex: 100,
            boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
            animation: 'fadeIn 0.2s ease-out',
          }}
        >
          ✓ {toastMessage}
        </div>
      )}

      {/* ── Compact Admin Header: Sujal Vende | Admin | Visit Site ↗ | Log Out ── */}
      <header style={{ borderBottom: '1px solid #E3DDD7', background: '#F9F7F4', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <a href="/" style={{ fontFamily: sans, fontSize: 13, fontWeight: 500, color: '#0D0C0B', textDecoration: 'none', letterSpacing: '0.04em' }}>
              Sujal Vende
            </a>
            <span style={{ width: 1, height: 16, background: '#E3DDD7', display: 'inline-block' }} />
            <span style={{ fontFamily: sans, fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#6E6A66' }}>
              Admin Dashboard
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: sans,
                fontSize: 12,
                color: '#0D0C0B',
                border: '1px solid #E3DDD7',
                padding: '6px 14px',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              Visit Site ↗
            </a>

            <button
              type="button"
              onClick={logout}
              style={{ fontFamily: sans, fontSize: 12, color: '#6E6A66', background: 'none', border: '1px solid #E3DDD7', padding: '6px 14px', cursor: 'pointer' }}
            >
              Log Out
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Content ────────────────────────────────────────────────── */}
      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '36px 24px 80px' }}>
        {/* Page title with inquiries count */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontFamily: serif, fontSize: 32, color: '#0D0C0B', lineHeight: 1.15, margin: '0 0 8px' }}>
            Inquiries
          </h1>
          <p style={{ fontFamily: sans, fontSize: 13, color: '#6E6A66', margin: 0 }}>
            {total} {total === 1 ? 'inquiry' : 'inquiries'}
            {countNew > 0 && (
              <> · <span style={{ color: '#8C7355', fontWeight: 600 }}>{countNew} new</span></>
            )}
            {countContacted > 0 && (
              <> · {countContacted} contacted</>
            )}
          </p>
        </div>

        {error && (
          <div style={{ border: '1px solid #E3DDD7', padding: '12px 16px', marginBottom: 24, background: '#FFF8F0' }}>
            <p style={{ fontFamily: sans, fontSize: 13, color: '#8C7355', margin: 0 }}>{error}</p>
          </div>
        )}

        {/* Toolbar: Search, Filter, Sort, Refresh */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 22, alignItems: 'center' }}>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, service or message…"
            style={{
              fontFamily: sans,
              fontSize: 13,
              color: '#0D0C0B',
              background: '#F9F7F4',
              border: '1px solid #E3DDD7',
              padding: '9px 14px',
              flex: '1 1 240px',
              outline: 'none',
            }}
          />

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as Status | 'All')}
            style={{
              fontFamily: sans,
              fontSize: 12,
              color: '#0D0C0B',
              background: '#F9F7F4',
              border: '1px solid #E3DDD7',
              padding: '9px 28px 9px 12px',
              appearance: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="All">All Statuses</option>
            {(['New', 'Contacted', 'In Progress', 'Closed'] as Status[]).map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')}
            style={{
              fontFamily: sans,
              fontSize: 12,
              color: '#0D0C0B',
              background: '#F9F7F4',
              border: '1px solid #E3DDD7',
              padding: '9px 28px 9px 12px',
              appearance: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>

          <button
            type="button"
            onClick={fetchInquiries}
            style={{
              fontFamily: sans,
              fontSize: 12,
              color: '#6E6A66',
              background: 'none',
              border: '1px solid #E3DDD7',
              padding: '9px 16px',
              cursor: 'pointer',
            }}
          >
            Refresh
          </button>
        </div>

        {/* Inquiry Card List */}
        {filtered.length === 0 ? (
          <div style={{ border: '1px solid #E3DDD7', padding: '48px 24px', textAlign: 'center', backgroundColor: '#FDFCFB' }}>
            <p style={{ fontFamily: sans, fontSize: 14, color: '#6E6A66', margin: 0 }}>
              {inquiries.length === 0
                ? 'No inquiries yet. Your form submissions will appear here.'
                : 'No inquiries match your current search/filter.'}
            </p>
          </div>
        ) : (
          <div>
            {/* Column Headers */}
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.2fr) minmax(0,1.2fr) minmax(0,0.8fr) auto', gap: '8px 16px', padding: '0 20px 8px', alignItems: 'center' }}>
              {['Name / Service', 'Email / Phone', 'Date', 'Status'].map((h) => (
                <p key={h} style={{ fontFamily: sans, fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#B8B1AA', margin: 0 }}>
                  {h}
                </p>
              ))}
            </div>

            {filtered.map((inquiry) => (
              <InquiryCard
                key={inquiry.id}
                inquiry={inquiry}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
                expanded={expandedId === inquiry.id}
                onToggle={() => setExpandedId(expandedId === inquiry.id ? null : inquiry.id)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
