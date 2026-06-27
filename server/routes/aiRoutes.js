const express = require('express')
const { handleProposal, handleClientReply, handleGigDescription, handleChatbot, handlePricing } = require('../controllers/aiController')
const { protect } = require('../middleware/authMiddleware')

const router = express.Router()

// ── Diagnostic test endpoint (no auth required) ───────────────────────────────
router.get('/test', async (req, res) => {
  try {
    const Groq = require('groq-sdk')
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })
    const response = await groq.chat.completions.create({
      model:      'llama-3.3-70b-versatile',
      messages:   [{ role: 'user', content: 'Say hello in one word' }],
      max_tokens: 10,
    })
    res.json({ success: true, message: response.choices[0].message.content })
  } catch (error) {
    res.json({ success: false, error: error.message })
  }
})

router.post('/proposal', protect, handleProposal)
router.post('/reply',    protect, handleClientReply)
router.post('/gig',      protect, handleGigDescription)
router.post('/chat',     protect, handleChatbot)
router.post('/pricing',  protect, handlePricing)

module.exports = router
