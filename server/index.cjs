/**
 * Sujal Vende Portfolio — API Server (CommonJS)
 *
 * Run with: node server/index.cjs  (or npm run server)
 */

const express = require('express')
const cors = require('cors')
const fs = require('fs')
const path = require('path')
const { v4: uuidv4 } = require('uuid')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// ── ENV (manual .env parse since we're CJS) ────────────────────────────────
const envPath = path.join(__dirname, '../.env')
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8')
    .split('\n')
    .forEach((line) => {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) return
      const eqIdx = trimmed.indexOf('=')
      if (eqIdx === -1) return
      const key = trimmed.slice(0, eqIdx).trim()
      const val = trimmed.slice(eqIdx + 1).trim()
      if (key && !process.env[key]) process.env[key] = val
    })
}

const PORT = parseInt(process.env.SERVER_PORT || '3001')
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-please-change-in-production'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'sujal7977'
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

// Trust proxy for correct IP (behind Vite proxy)
app.set('trust proxy', true)

// ── RATE LIMITER ───────────────────────────────────────────────────────────
const rateLimitStore = new Map()

function rateLimit(max, windowMs) {
  return (req, res, next) => {
    const ip = req.ip || 'unknown'
    const now = Date.now()
    let entry = rateLimitStore.get(ip)
    if (!entry || now > entry.reset) entry = { count: 0, reset: now + windowMs }
    entry.count++
    rateLimitStore.set(ip, entry)
    if (entry.count > max) {
      return res.status(429).json({ error: 'Too many requests. Please try again shortly.' })
    }
    next()
  }
}

// ── AUTH MIDDLEWARE ────────────────────────────────────────────────────────
function authenticate(req, res, next) {
  const auth = req.headers.authorization || ''
  if (!auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' })
  try {
    req.user = jwt.verify(auth.slice(7), JWT_SECRET)
    next()
  } catch {
    res.status(401).json({ error: 'Session expired. Please log in again.' })
  }
}

// ── INPUT SANITIZER ────────────────────────────────────────────────────────
const sanitize = (str = '') => String(str).trim().slice(0, 2000)

// ── ROUTES ─────────────────────────────────────────────────────────────────

app.get('/api/health', (_req, res) => res.json({ ok: true, time: new Date().toISOString() }))

// POST /api/inquiry — public form submission
app.post('/api/inquiry', rateLimit(5, 60_000), (req, res) => {
  const name = sanitize(req.body.name)
  const email = sanitize(req.body.email)
  const phone = sanitize(req.body.phone)
  const service = sanitize(req.body.service)
  const budget = sanitize(req.body.budget)
  const message = sanitize(req.body.message)

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
    name, email, phone, service, budget, message,
    status: 'New',
    createdAt: new Date().toISOString(),
  }

  const inquiries = readInquiries()
  inquiries.unshift(inquiry)
  writeInquiries(inquiries)
  console.log(`[inquiry] ${name} <${email}> — ${service}`)
  res.status(201).json({ success: true })
})

// POST /api/admin/login
app.post('/api/admin/login', rateLimit(10, 60_000), async (req, res) => {
  const { password } = req.body
  if (!password) return res.status(400).json({ error: 'Password is required.' })
  if (password !== ADMIN_PASSWORD) {
    await new Promise((r) => setTimeout(r, 400))
    return res.status(401).json({ error: 'Incorrect password.' })
  }
  const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '24h' })
  res.json({ token })
})

// GET /api/inquiries
app.get('/api/inquiries', authenticate, (_req, res) => res.json(readInquiries()))

// PATCH /api/inquiries/:id/status
app.patch('/api/inquiries/:id/status', authenticate, (req, res) => {
  const valid = ['New', 'Contacted', 'In Progress', 'Closed']
  const { status } = req.body
  if (!valid.includes(status)) return res.status(400).json({ error: 'Invalid status.' })
  const inquiries = readInquiries()
  const idx = inquiries.findIndex((i) => i.id === req.params.id)
  if (idx === -1) return res.status(404).json({ error: 'Not found.' })
  inquiries[idx].status = status
  writeInquiries(inquiries)
  res.json(inquiries[idx])
})

// DELETE /api/inquiries/:id
app.delete('/api/inquiries/:id', authenticate, (req, res) => {
  let list = readInquiries()
  const before = list.length
  list = list.filter((i) => i.id !== req.params.id)
  if (list.length === before) return res.status(404).json({ error: 'Not found.' })
  writeInquiries(list)
  res.json({ success: true })
})

// ── START ──────────────────────────────────────────────────────────────────
ensureDataFile()
app.listen(PORT, () => {
  console.log(`\n  ✓  API server  →  http://localhost:${PORT}`)
  console.log(`  ✓  Admin pass  →  ${ADMIN_PASSWORD}`)
  console.log(`  ✓  Data file   →  ${DATA_FILE}\n`)
})
