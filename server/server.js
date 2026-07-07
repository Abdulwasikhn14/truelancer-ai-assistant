require('dotenv').config()

const express   = require('express')
const cors      = require('cors')
const rateLimit = require('express-rate-limit')
const session   = require('express-session')
const passport  = require('./config/passport')

const authRoutes        = require('./routes/authRoutes')
const aiRoutes          = require('./routes/aiRoutes')
const historyRoutes     = require('./routes/historyRoutes')
const chatSessionRoutes = require('./routes/chatSessionRoutes')
const { createUsersTable }       = require('./models/userModel')
const { createHistoryTable }     = require('./models/historyModel')
const { createChatSessionsTable } = require('./models/chatSessionModel')

const app    = express()
const PORT   = process.env.PORT || 5000
const isProd = process.env.NODE_ENV === 'production'

// Behind Render/Vercel/other proxies we must trust the proxy so secure cookies
// and req.protocol are handled correctly over HTTPS.
app.set('trust proxy', 1)

// ── Middleware ────────────────────────────────────────────────────────────────

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5200',
  credentials: true,
}))

app.use(express.json())

app.use(session({
  secret:            process.env.SESSION_SECRET || 'truelancer_session_secret',
  resave:            false,
  saveUninitialized: false,
  cookie: {
    secure:   isProd,                 // HTTPS-only in production
    httpOnly: true,
    sameSite: isProd ? 'none' : 'lax', // allow the cross-site OAuth redirect flow
    maxAge:   24 * 60 * 60 * 1000,     // 24 h
  },
}))

app.use(passport.initialize())
app.use(passport.session())

// ── Rate limiting ─────────────────────────────────────────────────────────────

const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max:      20,
  message:  { message: 'Too many requests. Please wait a moment and try again.' },
})

// ── Routes ───────────────────────────────────────────────────────────────────

app.use('/api/auth',          authRoutes)
app.use('/api/ai',           aiLimiter, aiRoutes)
app.use('/api/history',      historyRoutes)
app.use('/api/chat-sessions', chatSessionRoutes)

app.get('/', (req, res) => {
  res.json({ message: 'Truelancer API is running' })
})

// ── Start ─────────────────────────────────────────────────────────────────────

const start = async () => {
  await createUsersTable()
  await createHistoryTable()
  await createChatSessionsTable()
  console.log('Database connected and tables ready')

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start().catch((err) => {
  console.error('Failed to start server:', err.message)
  process.exit(1)
})
