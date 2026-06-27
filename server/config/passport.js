'use strict'

const passport  = require('passport')
const bcrypt    = require('bcryptjs')
const { Strategy: GoogleStrategy } = require('passport-google-oauth20')
const { findUserByEmail, createUser, findUserById } = require('../models/userModel')

passport.use(
  new GoogleStrategy(
    {
      clientID:     process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:  process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/google/callback',
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email    = profile.emails?.[0]?.value
        const fullName = profile.displayName || 'Google User'

        if (!email) return done(new Error('No email returned from Google'), null)

        let user = await findUserByEmail(email)

        if (!user) {
          // Generate a random password and hash it — the user will never type this
          const randomPassword =
            Math.random().toString(36).slice(-16) +
            Math.random().toString(36).slice(-16)
          const hashedPassword = await bcrypt.hash(randomPassword, 10)
          user = await createUser(fullName, email, hashedPassword)
        }

        console.log('Google OAuth success for:', email)
        return done(null, user)
      } catch (err) {
        console.error('Google strategy error:', err.message)
        return done(err, null)
      }
    }
  )
)

// Minimal session support — only the user id is stored in the session
passport.serializeUser((user, done) => done(null, user.id))

passport.deserializeUser(async (id, done) => {
  try {
    const user = await findUserById(id)
    done(null, user || false)
  } catch (err) {
    done(err, null)
  }
})

module.exports = passport
