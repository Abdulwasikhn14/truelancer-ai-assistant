const jwt          = require('jsonwebtoken')
const { findUserById } = require('../models/userModel')

const protect = async (req, res, next) => {
  const header = req.headers.authorization

  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorised — no token' })
  }

  const token = header.split(' ')[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Fetch fresh user data and attach to request (excludes password)
    const user = await findUserById(decoded.id)
    if (!user) {
      return res.status(401).json({ message: 'Not authorised — user not found' })
    }

    req.user = user
    next()
  } catch {
    res.status(401).json({ message: 'Not authorised — invalid token' })
  }
}

module.exports = { protect }
