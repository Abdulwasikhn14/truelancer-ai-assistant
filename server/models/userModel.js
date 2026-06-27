const db = require('../config/db')

// ── Table setup ───────────────────────────────────────────────────────────────

const createUsersTable = async () => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS users (
      id         SERIAL PRIMARY KEY,
      full_name  VARCHAR(100)  NOT NULL,
      email      VARCHAR(150)  UNIQUE NOT NULL,
      password   VARCHAR(255)  NOT NULL,
      created_at TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
    )
  `)
}

// ── Query functions ───────────────────────────────────────────────────────────

const createUser = async (full_name, email, password) => {
  const result = await db.query(
    'INSERT INTO users (full_name, email, password) VALUES ($1, $2, $3) RETURNING id, full_name, email, created_at',
    [full_name, email, password]
  )
  return result.rows[0]
}

const findUserByEmail = async (email) => {
  const result = await db.query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  )
  return result.rows[0]
}

const findUserById = async (id) => {
  const result = await db.query(
    'SELECT id, full_name, email, created_at FROM users WHERE id = $1',
    [id]
  )
  return result.rows[0] || null
}

const updateUser = async (id, updates) => {
  const fields = []
  const values = []
  let idx = 1

  if (updates.full_name !== undefined) {
    fields.push(`full_name = $${idx++}`)
    values.push(updates.full_name)
  }
  if (updates.password !== undefined) {
    fields.push(`password = $${idx++}`)
    values.push(updates.password)
  }

  if (!fields.length) throw new Error('No fields to update')

  values.push(id)
  const result = await db.query(
    `UPDATE users SET ${fields.join(', ')} WHERE id = $${idx} RETURNING id, full_name, email, created_at`,
    values
  )
  return result.rows[0]
}

module.exports = { createUsersTable, createUser, findUserByEmail, findUserById, updateUser }
