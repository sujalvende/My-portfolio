import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase, isSupabaseConfigured, type Inquiry, type InquiryStatus } from '../lib/supabase'

// ── Status Display Mapping ──────────────────────────────────────────────────
const STATUS_LABELS: Record<InquiryStatus, string> = {
  new: 'NEW',
  contacted: 'CONTACTED',
  in_progress: 'IN PROGRESS',
  closed: 'CLOSED',
}

const STATUS_COLORS: Record<InquiryStatus, string> = {
  new: '#8C7355',           // bronze
  contacted: '#3D6B5A',     // muted emerald
  in_progress: '#2A5A8C',   // muted slate blue
  closed: '#6E6A66',        // muted grey
}

const STATUS_BG: Record<InquiryStatus, string> = {
  new: 'rgba(140,115,85,0.12)',
  contacted: 'rgba(61,107,90,0.12)',
  in_progress: 'rgba(42,90,140,0.12)',
  closed: 'rgba(110,106,102,0.1)',
}

function StatusBadge({ status }: { status: InquiryStatus }) {
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
      {STATUS_LABELS[status] || status}
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

// ── Compact Inquiry Card ───────────────────────────────────────────────────
function InquiryCard({
  inquiry,
  onStatusChange,
  onDelete,
  expanded,
  onToggle,
}: {
  inquiry: Inquiry
  onStatusChange: (id: string, status: InquiryStatus) => void
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
        className="w-full text-left cursor-pointer p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 bg-transparent border-none"
      >
        <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,1.2fr)_minmax(0,1.2fr)_minmax(0,0.8fr)] gap-2 sm:gap-4 items-start sm:items-center w-full min-w-0 flex-1">
          {/* Name + Service */}
          <div className="min-w-0">
            <p
              style={{
                fontFamily: "'DM Sans', system-ui, sans-serif",
                fontSize: 14,
                fontWeight: 500,
                color: '#0D0C0B',
                margin: '0 0 2px',
              }}
            >
              {inquiry.name}
            </p>
            <p
              style={{
                fontFamily: "'DM Sans', system-ui, sans-serif",
                fontSize: 11,
                color: '#6E6A66',
                letterSpacing: '0.04em',
                margin: 0,
              }}
            >
              {inquiry.service}
            </p>
          </div>

          {/* Email / Phone */}
          <div className="min-w-0">
            <p
              style={{
                fontFamily: "'DM Sans', system-ui, sans-serif",
                fontSize: 12,
                color: '#3D3937',
                margin: 0,
                wordBreak: 'break-all',
              }}
            >
              {inquiry.email}
            </p>
            {inquiry.phone && (
              <p
                style={{
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  fontSize: 11,
                  color: '#8C7355',
                  margin: '2px 0 0',
                }}
              >
                {inquiry.phone}
              </p>
            )}
          </div>

          {/* Date */}
          <p
            style={{
              fontFamily: "'DM Sans', system-ui, sans-serif",
              fontSize: 11,
              color: '#6E6A66',
              margin: 0,
            }}
          >
            {formatDate(inquiry.created_at)}
          </p>
        </div>

        {/* Status + Expand indicator */}
        <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto shrink-0 pt-2 sm:pt-0 border-t border-stroke/40 sm:border-t-0">
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
            <p
              style={{
                fontFamily: "'DM Sans', system-ui, sans-serif",
                fontSize: 10,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: '#6E6A66',
                margin: '0 0 8px',
              }}
            >
              Message
            </p>
            <p
              style={{
                fontFamily: "'DM Sans', system-ui, sans-serif",
                fontSize: 14,
                color: '#3D3937',
                lineHeight: 1.7,
                margin: 0,
                whiteSpace: 'pre-wrap',
              }}
            >
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
                <p
                  style={{
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                    fontSize: 10,
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    color: '#6E6A66',
                    margin: '0 0 4px',
                  }}
                >
                  Phone
                </p>
                <a
                  href={`tel:${inquiry.phone}`}
                  style={{
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                    fontSize: 13,
                    color: '#0D0C0B',
                    textDecoration: 'none',
                  }}
                >
                  {inquiry.phone}
                </a>
              </div>
            )}
            <div>
              <p
                style={{
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  fontSize: 10,
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: '#6E6A66',
                  margin: '0 0 4px',
                }}
              >
                Budget
              </p>
              <p
                style={{
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  fontSize: 13,
                  color: '#0D0C0B',
                  margin: 0,
                }}
              >
                {inquiry.budget || 'Not specified'}
              </p>
            </div>
            <div>
              <p
                style={{
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  fontSize: 10,
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: '#6E6A66',
                  margin: '0 0 4px',
                }}
              >
                Email Direct
              </p>
              <a
                href={`mailto:${inquiry.email}`}
                style={{
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  fontSize: 13,
                  color: '#0D0C0B',
                  textDecoration: 'none',
                }}
              >
                {inquiry.email}
              </a>
            </div>
          </div>

          {/* Action Row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <label
                style={{
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  fontSize: 10,
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: '#6E6A66',
                }}
              >
                Status
              </label>
              <select
                value={inquiry.status}
                onChange={(e) => onStatusChange(inquiry.id, e.target.value as InquiryStatus)}
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
                {(['new', 'contacted', 'in_progress', 'closed'] as InquiryStatus[]).map((s) => (
                  <option key={s} value={s}>
                    {STATUS_LABELS[s]}
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
  const [unauthorizedUserId, setUnauthorizedUserId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<InquiryStatus | 'all'>('all')
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current))
    }, 2500)
  }

  const logout = useCallback(async () => {
    try {
      await supabase.auth.signOut()
    } catch {
      // ignore
    }
    navigate('/admin', { replace: true })
  }, [navigate])

  const fetchInquiries = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setError('Supabase is not configured yet. Please provide valid credentials in .env.')
      setLoading(false)
      return
    }

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        navigate('/admin', { replace: true })
        return
      }

      // Check if user exists in admin_users table
      const { data: adminCheck, error: adminCheckError } = await supabase
        .from('admin_users')
        .select('user_id')
        .eq('user_id', session.user.id)
        .maybeSingle()

      if (adminCheckError || !adminCheck) {
        setUnauthorizedUserId(session.user.id)
        setError(
          'Your account is authenticated, but not authorized in the admin_users table. Please run the SQL snippet in Supabase to grant access.',
        )
      } else {
        setUnauthorizedUserId(null)
        setError('')
      }

      // Fetch inquiries via Supabase (PostgreSQL RLS ensures access)
      const { data, error: fetchError } = await supabase
        .from('inquiries')
        .select('*')
        .order('created_at', { ascending: false })

      if (fetchError) {
        throw new Error(fetchError.message)
      }

      setInquiries(data || [])
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error loading inquiries.')
    } finally {
      setLoading(false)
    }
  }, [navigate])

  useEffect(() => {
    // Check session on mount and listen to changes
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate('/admin', { replace: true })
      } else {
        fetchInquiries()
      }
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate('/admin', { replace: true })
      }
    })

    return () => subscription.unsubscribe()
  }, [fetchInquiries, navigate])

  const handleStatusChange = async (id: string, status: InquiryStatus) => {
    // Optimistic local update
    const previous = [...inquiries]
    setInquiries((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)))
    showToast(`Status updated to ${STATUS_LABELS[status]}`)

    try {
      const { error: updateError } = await supabase
        .from('inquiries')
        .update({ status })
        .eq('id', id)

      if (updateError) {
        throw new Error(updateError.message)
      }
    } catch (err: unknown) {
      // Revert on failure
      setInquiries(previous)
      showToast(err instanceof Error ? `Failed: ${err.message}` : 'Failed to update status')
    }
  }

  const handleDelete = async (id: string) => {
    // Immediate local removal
    const previous = [...inquiries]
    setInquiries((prev) => prev.filter((i) => i.id !== id))
    if (expandedId === id) setExpandedId(null)
    showToast('Inquiry deleted')

    try {
      const { error: deleteError } = await supabase
        .from('inquiries')
        .delete()
        .eq('id', id)

      if (deleteError) {
        throw new Error(deleteError.message)
      }
    } catch (err: unknown) {
      // Revert on failure
      setInquiries(previous)
      showToast(err instanceof Error ? `Failed: ${err.message}` : 'Failed to delete inquiry')
    }
  }

  // Filter + search + sort (newest inquiries first by default)
  const filtered = inquiries
    .filter((i) => {
      if (filterStatus !== 'all' && i.status !== filterStatus) return false
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
      const diff = new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      return sortOrder === 'newest' ? diff : -diff
    })

  const total = inquiries.length
  const countNew = inquiries.filter((i) => i.status === 'new').length
  const countContacted = inquiries.filter((i) => i.status === 'contacted').length

  const sans = "'DM Sans', system-ui, sans-serif"
  const serif = "'Playfair Display', Georgia, serif"

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: '#F9F7F4',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <p style={{ fontFamily: sans, fontSize: 13, color: '#6E6A66', letterSpacing: '0.1em' }}>
          Loading…
        </p>
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
          }}
        >
          ✓ {toastMessage}
        </div>
      )}

      {/* ── Compact Admin Header: Sujal Vende | Admin | Visit Site ↗ | Log Out ── */}
      <header
        style={{
          borderBottom: '1px solid #E3DDD7',
          background: '#F9F7F4',
          position: 'sticky',
          top: 0,
          zIndex: 50,
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: '0 auto',
            padding: '0 16px',
            height: 60,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 8,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
            <a
              href="/"
              style={{
                fontFamily: sans,
                fontSize: 13,
                fontWeight: 500,
                color: '#0D0C0B',
                textDecoration: 'none',
                letterSpacing: '0.04em',
                whiteSpace: 'nowrap',
              }}
            >
              Sujal Vende
            </a>
            <span
              style={{ width: 1, height: 16, background: '#E3DDD7', display: 'inline-block', flexShrink: 0 }}
            />
            {/* Label hidden on very small screens to prevent wrapping */}
            <span
              className="hidden sm:inline"
              style={{
                fontFamily: sans,
                fontSize: 10,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: '#6E6A66',
                whiteSpace: 'nowrap',
              }}
            >
              Admin Dashboard
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: sans,
                fontSize: 12,
                color: '#0D0C0B',
                border: '1px solid #E3DDD7',
                padding: '6px 12px',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                whiteSpace: 'nowrap',
              }}
            >
              Visit Site ↗
            </a>

            <button
              type="button"
              onClick={logout}
              style={{
                fontFamily: sans,
                fontSize: 12,
                color: '#6E6A66',
                background: 'none',
                border: '1px solid #E3DDD7',
                padding: '6px 12px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              Log Out
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Content ────────────────────────────────────────────────── */}
      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 16px 80px' }}>
        {/* Page title with inquiries count */}
        <div style={{ marginBottom: 24 }}>
          <h1
            style={{
              fontFamily: serif,
              fontSize: 'clamp(24px, 5vw, 32px)',
              color: '#0D0C0B',
              lineHeight: 1.15,
              margin: '0 0 8px',
            }}
          >
            Inquiries
          </h1>
          <p style={{ fontFamily: sans, fontSize: 13, color: '#6E6A66', margin: 0 }}>
            {total} {total === 1 ? 'inquiry' : 'inquiries'}
            {countNew > 0 && (
              <>
                {' '}
                · <span style={{ color: '#8C7355', fontWeight: 600 }}>{countNew} new</span>
              </>
            )}
            {countContacted > 0 && <> · {countContacted} contacted</>}
          </p>
        </div>

        {/* Error Banner */}
        {error && (
          <div
            style={{
              border: '1px solid #E3DDD7',
              padding: '14px 18px',
              marginBottom: 24,
              background: '#FFF8F0',
            }}
          >
            <p style={{ fontFamily: sans, fontSize: 13, color: '#8C7355', margin: 0, fontWeight: 500 }}>
              {error}
            </p>
            {unauthorizedUserId && (
              <div style={{ marginTop: 10, fontSize: 12, color: '#3D3937' }}>
                <p style={{ margin: '0 0 6px' }}>Run this SQL in your Supabase SQL Editor:</p>
                <code
                  style={{
                    display: 'block',
                    padding: '8px 12px',
                    backgroundColor: '#F3EFEA',
                    borderRadius: 4,
                    fontFamily: 'monospace',
                    fontSize: 11,
                    userSelect: 'all',
                    wordBreak: 'break-all',
                  }}
                >
                  INSERT INTO admin_users (user_id) VALUES ('{unauthorizedUserId}') ON CONFLICT DO NOTHING;
                </code>
              </div>
            )}
          </div>
        )}

        {/* Toolbar: Search, Filter, Sort, Refresh */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 10,
            marginBottom: 20,
            alignItems: 'center',
          }}
        >
          {/* Search — full-width row when wrapping on mobile */}
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, service…"
            style={{
              fontFamily: sans,
              fontSize: 13,
              color: '#0D0C0B',
              background: '#F9F7F4',
              border: '1px solid #E3DDD7',
              padding: '9px 14px',
              flex: '1 1 200px',
              minWidth: 0,
              outline: 'none',
            }}
          />

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as InquiryStatus | 'all')}
            style={{
              fontFamily: sans,
              fontSize: 12,
              color: '#0D0C0B',
              background: '#F9F7F4',
              border: '1px solid #E3DDD7',
              padding: '9px 28px 9px 12px',
              appearance: 'none',
              cursor: 'pointer',
              flex: '0 0 auto',
            }}
          >
            <option value="all">All Statuses</option>
            {(['new', 'contacted', 'in_progress', 'closed'] as InquiryStatus[]).map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s]}
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
              flex: '0 0 auto',
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
              padding: '9px 14px',
              cursor: 'pointer',
              flex: '0 0 auto',
            }}
          >
            Refresh
          </button>
        </div>

        {/* Inquiry Card List */}
        {filtered.length === 0 ? (
          <div
            style={{
              border: '1px solid #E3DDD7',
              padding: '48px 24px',
              textAlign: 'center',
              backgroundColor: '#FDFCFB',
            }}
          >
            <p style={{ fontFamily: sans, fontSize: 14, color: '#6E6A66', margin: 0 }}>
              {inquiries.length === 0
                ? 'No inquiries yet. Your form submissions will appear here.'
                : 'No inquiries match your current search/filter.'}
            </p>
          </div>
        ) : (
          <div>
            {/* Column Headers — hidden on small screens, shown on wider viewports */}
            <div
              className="hidden sm:grid"
              style={{
                gridTemplateColumns:
                  'minmax(0,1.2fr) minmax(0,1.2fr) minmax(0,0.8fr) auto',
                gap: '8px 16px',
                padding: '0 16px 8px',
                alignItems: 'center',
              }}
            >
              {['Name / Service', 'Email / Phone', 'Date', 'Status'].map((h) => (
                <p
                  key={h}
                  style={{
                    fontFamily: sans,
                    fontSize: 9,
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    color: '#B8B1AA',
                    margin: 0,
                  }}
                >
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
                onToggle={() =>
                  setExpandedId(expandedId === inquiry.id ? null : inquiry.id)
                }
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
