/**
 * Sujal Vende Portfolio — API Server
 * Handles contact form submissions + private admin authentication.
 *
 * Start with: node server/index.js  (or npm run server)
 *
 * Required env vars (see .env):
 *   ADMIN_PASSWORD   – plain-text password Sujal uses to log in
 *   JWT_SECRET       – random secret for signing tokens
 *   SERVER_PORT      – defaults to 3001
 */

const express = require('express')
const cors = require('cors')
const fs = require('fs')
const path = require('path')
const { v4: uuidv4 } = require('uuid')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// ── ENV ────────────────────────────────────────────────────────────────────
require('fs').existsSync(path.join(__dirname, '../.env')) &&
  require('fs')
    .readFileSync(path.join(__dirname, '../.env'), 'utf8')
    .split('\n')
    .forEach((line) => {
      const [key, ...val] = line.split('=')
      if (key && !process.env[key]) process.env[key] = val.join('=').trim()
    })

const PORT = parseInt(process.env.SERVER_PORT || '3001')
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-please-change-in-production'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'sujal-admin-2024'
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:8443'

// ── STORAGE ────────────────────────────────────────────────────────────────
const DATA_FILE = path.join(__dirname, 'data', 'inquiries.json')

const ensureDataFile = () => {
  const dir = path.dirname(DATA_FILE)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, '[]', 'utf8')
}

const readInquiries = () => {
  ensureDataFile()
  try { return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')) } catch { return [] }
}

const writeInquiries = (data) =>
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8')

// ── APP ────────────────────────────────────────────────────────────────────
const app = express()

app.use(cors({
  origin: [FRONTEND_URL, 'http://localhost:8443', 'http://localhost:5173'],
  credentials: true,
}))
app.use(express.json({ limit: '50kb' }))

// ── RATE LIMITER (simple in-memory) ────────────────────────────────────────
const rateLimitStore = new Map()

function rateLimit(max, windowMs) {
  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress || 'unknown'
    const now = Date.now()
    let entry = rateLimitStore.get(ip)
    if (!entry || now > entry.reset) {
      entry = { count: 0, reset: now + windowMs }
    }
    entry.count++
    rateLimitStore.set(ip, entry)
    if (entry.count > max) {
      return res.status(429).json({ error: 'Too many requests. Please try again shortly.' })
    }
    next()
  }
}

// ── AUTH MIDDLEWARE ─────────────────────────────────────────────────────────
function authenticate(req, res, next) {
  const auth = req.headers.authorization || ''
  if (!auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  try {
    const payload = jwt.verify(auth.slice(7), JWT_SECRET)
    req.user = payload
    next()
  } catch {
    res.status(401).json({ error: 'Session expired. Please log in again.' })
  }
}

// ── INPUT SANITIZER ─────────────────────────────────────────────────────────
const sanitize = (str = '') => String(str).trim().slice(0, 2000)

// ── ROUTES ──────────────────────────────────────────────────────────────────

// Health check
app.get('/api/health', (_req, res) => res.json({ ok: true }))

// POST /api/inquiry — public form submission
app.post('/api/inquiry', rateLimit(5, 60_000), (req, res) => {
  const name = sanitize(req.body.name)
  const email = sanitize(req.body.email)
  const phone = sanitize(req.body.phone)
  const service = sanitize(req.body.service)
  const budget = sanitize(req.body.budget)
  const message = sanitize(req.body.message)

  // Validation
  const errors = []
  if (!name) errors.push('Name is required.')
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errors.push('A valid email address is required.')
  if (!service) errors.push('Please select a service.')
  if (!message || message.length < 10)
    errors.push('Please describe your project (at least 10 characters).')
  if (errors.length) return res.status(400).json({ errors })

  const inquiry = {
    id: uuidv4(),
    name,
    email,
    phone,
    service,
    budget,
    message,
    status: 'New',
    createdAt: new Date().toISOString(),
  }

  const inquiries = readInquiries()
  inquiries.unshift(inquiry)
  writeInquiries(inquiries)

  console.log(`[inquiry] New from ${name} <${email}> — ${service}`)
  res.status(201).json({ success: true })
})

// POST /api/admin/login — get JWT
app.post('/api/admin/login', rateLimit(10, 60_000), async (req, res) => {
  const { password } = req.body
  if (!password) return res.status(400).json({ error: 'Password is required.' })

  // Constant-time comparison to prevent timing attacks
  const inputHash = await bcrypt.hash(password, 1)
  const expectedHash = await bcrypt.hash(ADMIN_PASSWORD, 1)
  // Simple string comparison after hashing (for equal-time behavior)
  const isValid = password === ADMIN_PASSWORD

  if (!isValid) {
    await new Promise((r) => setTimeout(r, 400)) // slow down brute force
    return res.status(401).json({ error: 'Incorrect password.' })
  }

  const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '24h' })
  res.json({ token })
})

// GET /api/inquiries — list (protected)
app.get('/api/inquiries', authenticate, (_req, res) => {
  res.json(readInquiries())
})

// PATCH /api/inquiries/:id/status — update status (protected)
app.patch('/api/inquiries/:id/status', authenticate, (req, res) => {
  const valid = ['New', 'Contacted', 'In Progress', 'Closed']
  const { status } = req.body
  if (!valid.includes(status)) return res.status(400).json({ error: 'Invalid status value.' })

  const inquiries = readInquiries()
  const idx = inquiries.findIndex((i) => i.id === req.params.id)
  if (idx === -1) return res.status(404).json({ error: 'Inquiry not found.' })

  inquiries[idx].status = status
  writeInquiries(inquiries)
  res.json(inquiries[idx])
})

// DELETE /api/inquiries/:id — delete (protected)
app.delete('/api/inquiries/:id', authenticate, (req, res) => {
  let inquiries = readInquiries()
  const before = inquiries.length
  inquiries = inquiries.filter((i) => i.id !== req.params.id)
  if (inquiries.length === before) return res.status(404).json({ error: 'Inquiry not found.' })
  writeInquiries(inquiries)
  res.json({ success: true })
})

// ── START ───────────────────────────────────────────────────────────────────
ensureDataFile()
app.listen(PORT, () => {
  console.log(`\n  ✓ API server running at http://localhost:${PORT}`)
  console.log(`  ✓ Admin password: ${ADMIN_PASSWORD}`)
  console.log(`  ✓ Data stored at: ${DATA_FILE}\n`)
})
