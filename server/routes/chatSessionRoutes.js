'use strict'

const express  = require('express')
const { protect } = require('../middleware/authMiddleware')
const {
  getAllSessions, createSession, getSession,
  updateSession, deleteSession,
} = require('../models/chatSessionModel')

const router = express.Router()

// GET /api/chat-sessions ──────────────────────────────────────────────────────
router.get('/', protect, async (req, res) => {
  try {
    const sessions = await getAllSessions(req.user.id)
    res.json(sessions)
  } catch (err) {
    console.error('GET /api/chat-sessions error:', err.message)
    res.status(500).json({ message: err.message })
  }
})

// POST /api/chat-sessions ─────────────────────────────────────────────────────
router.post('/', protect, async (req, res) => {
  const { title, tone, platform, messages } = req.body
  try {
    const session = await createSession(
      req.user.id,
      title    || 'New Chat',
      tone     || 'Professional',
      platform || 'Upwork',
      messages || []
    )
    res.status(201).json(session)
  } catch (err) {
    console.error('POST /api/chat-sessions error:', err.message)
    res.status(500).json({ message: err.message })
  }
})

// GET /api/chat-sessions/:id ──────────────────────────────────────────────────
router.get('/:id', protect, async (req, res) => {
  try {
    const session = await getSession(Number(req.params.id), req.user.id)
    if (!session) return res.status(404).json({ message: 'Session not found' })
    res.json(session)
  } catch (err) {
    console.error('GET /api/chat-sessions/:id error:', err.message)
    res.status(500).json({ message: err.message })
  }
})

// PUT /api/chat-sessions/:id ──────────────────────────────────────────────────
router.put('/:id', protect, async (req, res) => {
  const { title, tone, platform, messages } = req.body
  try {
    const session = await updateSession(
      Number(req.params.id), req.user.id,
      { title, tone, platform, messages }
    )
    if (!session) return res.status(404).json({ message: 'Session not found' })
    res.json(session)
  } catch (err) {
    console.error('PUT /api/chat-sessions/:id error:', err.message)
    res.status(500).json({ message: err.message })
  }
})

// DELETE /api/chat-sessions/:id ───────────────────────────────────────────────
router.delete('/:id', protect, async (req, res) => {
  try {
    const deleted = await deleteSession(Number(req.params.id), req.user.id)
    if (!deleted) return res.status(404).json({ message: 'Session not found' })
    res.json({ message: 'Session deleted' })
  } catch (err) {
    console.error('DELETE /api/chat-sessions/:id error:', err.message)
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
