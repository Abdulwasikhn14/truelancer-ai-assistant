const express  = require('express')
const { protect } = require('../middleware/authMiddleware')
const { getUserHistory, deleteHistory } = require('../models/historyModel')
const db = require('../config/db')

const router = express.Router()

// GET /api/history/analytics  ── MUST come before /:id ────────────────────────
router.get('/analytics', protect, async (req, res) => {
  const userId = req.user.id
  try {
    // ── Type counts ───────────────────────────────────────────────────────────
    const { rows: typeCounts } = await db.query(
      `SELECT type, COUNT(*)::int AS count FROM history WHERE user_id = $1 GROUP BY type`,
      [userId]
    )
    const cm = {}
    typeCounts.forEach(r => { cm[r.type] = r.count })

    // ── Avg success score on proposals ────────────────────────────────────────
    const { rows: [scoreRow] } = await db.query(
      `SELECT COALESCE(ROUND(AVG(score))::int, 0) AS avg
       FROM history
       WHERE user_id = $1 AND type = 'proposal' AND score IS NOT NULL`,
      [userId]
    )

    // ── Usage by day — last 7 days, all tools combined ────────────────────────
    const { rows: dayRows } = await db.query(
      `SELECT DATE_TRUNC('day', created_at) AS day, COUNT(*)::int AS total
       FROM history
       WHERE user_id = $1 AND created_at >= NOW() - INTERVAL '7 days'
       GROUP BY day
       ORDER BY day ASC`,
      [userId]
    )
    const dayMap = {}
    dayRows.forEach(r => {
      dayMap[new Date(r.day).toISOString().split('T')[0]] = r.total
    })
    const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const usageByDay = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setUTCHours(0, 0, 0, 0)
      d.setUTCDate(d.getUTCDate() - i)
      usageByDay.push({
        date:  DAY_LABELS[d.getUTCDay()],
        total: dayMap[d.toISOString().split('T')[0]] ?? 0,
      })
    }

    // ── Platform distribution ─────────────────────────────────────────────────
    const { rows: platRows } = await db.query(
      `SELECT LOWER(platform) AS p, COUNT(*)::int AS count
       FROM history
       WHERE user_id = $1 AND platform IS NOT NULL
       GROUP BY LOWER(platform)`,
      [userId]
    )
    const pd = { upwork: 0, fiverr: 0, freelancer: 0 }
    platRows.forEach(r => {
      if (r.p === 'upwork')      pd.upwork    = r.count
      else if (r.p === 'fiverr') pd.fiverr    = r.count
      else                        pd.freelancer = r.count
    })

    // ── Recent activity (last 5) ──────────────────────────────────────────────
    const { rows: recent } = await db.query(
      `SELECT * FROM history WHERE user_id = $1 ORDER BY created_at DESC LIMIT 5`,
      [userId]
    )

    // ── Top proposals by score ────────────────────────────────────────────────
    const { rows: topProposals } = await db.query(
      `SELECT * FROM history
       WHERE user_id = $1 AND type = 'proposal' AND score IS NOT NULL
       ORDER BY score DESC LIMIT 5`,
      [userId]
    )

    res.json({
      totalProposals:       cm['proposal'] ?? 0,
      totalGigs:            cm['gig']      ?? 0,
      totalReplies:         cm['message']  ?? 0,
      totalChats:           cm['chat']     ?? 0,
      avgSuccessScore:      scoreRow.avg,
      usageByDay,
      platformDistribution: pd,
      toolsUsage: {
        proposals: cm['proposal'] ?? 0,
        gigs:      cm['gig']      ?? 0,
        messages:  cm['message']  ?? 0,
        chatbot:   cm['chat']     ?? 0,
      },
      recentActivity: recent,
      topProposals,
    })
  } catch (err) {
    console.error('GET /api/history/analytics error:', err.message)
    res.status(500).json({ message: err.message })
  }
})

// GET /api/history ─────────────────────────────────────────────────────────────
router.get('/', protect, async (req, res) => {
  try {
    const rows = await getUserHistory(req.user.id)
    res.json(rows)
  } catch (err) {
    console.error('GET /api/history error:', err.message)
    res.status(500).json({ message: err.message })
  }
})

// DELETE /api/history/:id ──────────────────────────────────────────────────────
router.delete('/:id', protect, async (req, res) => {
  try {
    const deleted = await deleteHistory(Number(req.params.id), req.user.id)
    if (!deleted) return res.status(404).json({ message: 'Item not found' })
    res.json({ message: 'Deleted' })
  } catch (err) {
    console.error('DELETE /api/history/:id error:', err.message)
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
