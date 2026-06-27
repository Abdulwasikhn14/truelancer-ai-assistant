const bcrypt = require('bcryptjs')
const jwt    = require('jsonwebtoken')
const { createUser, findUserByEmail, findUserById, updateUser } = require('../models/userModel')

// ── Helpers ───────────────────────────────────────────────────────────────────

const signToken = (id, email) =>
  jwt.sign({ id, email }, process.env.JWT_SECRET, { expiresIn: '7d' })

const stripPassword = ({ password, ...safe }) => safe

// ── registerUser ──────────────────────────────────────────────────────────────

const registerUser = async (req, res) => {
  try {
    const { full_name, email, password } = req.body

    if (!full_name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    const existingUser = await findUserByEmail(email)
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = await createUser(full_name, email, hashedPassword)

    return res.status(201).json({
      message: 'Account created successfully',
      user: {
        id: newUser.id,
        full_name: newUser.full_name,
        email: newUser.email,
      },
    })
  } catch (error) {
    console.error('Register error:', error.message)
    if (error.code === '23505') {
      return res.status(400).json({ message: 'Email already registered' })
    }
    return res.status(500).json({ message: 'Server error: ' + error.message })
  }
}

// ── loginUser ─────────────────────────────────────────────────────────────────

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body

    console.log('Login attempt:', email)

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }

    const user = await findUserByEmail(email)
    console.log('User found:', user ? 'yes' : 'no')

    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' })
    }

    // Detect Google OAuth accounts — their password is not a bcrypt hash
    if (!user.password || !user.password.startsWith('$2')) {
      return res.status(400).json({
        message: 'This account was created with Google. Please use "Continue with Google" to sign in.',
      })
    }

    console.log('Stored hash (first 7 chars):', user.password.slice(0, 7))

    const isMatch = await bcrypt.compare(password, user.password)
    console.log('Password match:', isMatch)

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' })
    }

    const token = signToken(user.id, user.email)

    return res.status(200).json({ token, user: stripPassword(user) })
  } catch (error) {
    console.error('Login error:', error.message)
    return res.status(500).json({ message: 'Server error: ' + error.message })
  }
}

// ── updateProfile ─────────────────────────────────────────────────────────────

const updateProfile = async (req, res) => {
  try {
    const { full_name, currentPassword, newPassword } = req.body
    const updates = {}

    if (full_name && full_name.trim()) {
      updates.full_name = full_name.trim()
    }

    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ message: 'Current password is required to set a new password' })
      }
      const fullUser = await findUserByEmail(req.user.email)

      // Google OAuth users cannot set a password via this flow
      if (!fullUser.password || !fullUser.password.startsWith('$2')) {
        return res.status(400).json({ message: 'Google accounts cannot set a password here.' })
      }

      const match = await bcrypt.compare(currentPassword, fullUser.password)
      if (!match) {
        return res.status(400).json({ message: 'Current password is incorrect' })
      }
      if (newPassword.length < 8) {
        return res.status(400).json({ message: 'New password must be at least 8 characters' })
      }
      updates.password = await bcrypt.hash(newPassword, 10)
    }

    if (!Object.keys(updates).length) {
      return res.status(400).json({ message: 'No changes to save' })
    }

    const user = await updateUser(req.user.id, updates)
    res.status(200).json({ user })
  } catch (err) {
    console.error('updateProfile error:', err.message)
    res.status(500).json({ message: 'Server error' })
  }
}

module.exports = { registerUser, loginUser, updateProfile }
