const express   = require('express')
const passport  = require('passport')
const jwt       = require('jsonwebtoken')
const { registerUser, loginUser, updateProfile } = require('../controllers/authController')
const { protect } = require('../middleware/authMiddleware')

const router = express.Router()

router.post('/register', registerUser)
router.post('/login',    loginUser)

router.get('/me', protect, (req, res) => {
  res.status(200).json({ user: req.user })
})

router.put('/profile', protect, updateProfile)

// ── Google OAuth ──────────────────────────────────────────────────────────────

router.get('/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    prompt: 'select_account',
  })
)

router.get('/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=google_failed`,
  }),
  (req, res) => {
    try {
      const user  = req.user
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      )

      const name  = encodeURIComponent(user.full_name || '')
      const email = encodeURIComponent(user.email || '')

      res.redirect(
        `${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth/google/success?token=${token}&name=${name}&email=${email}`
      )
    } catch (error) {
      console.error('Google callback error:', error.message)
      res.redirect(
        `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=token_failed`
      )
    }
  }
)

module.exports = router
