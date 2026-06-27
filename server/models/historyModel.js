const db = require('../config/db')

// ── Table setup ───────────────────────────────────────────────────────────────

const createHistoryTable = async () => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS history (
      id         SERIAL PRIMARY KEY,
      user_id    INTEGER REFERENCES users(id) ON DELETE CASCADE,
      type       VARCHAR(50)  NOT NULL,
      title      VARCHAR(255),
      content    TEXT         NOT NULL,
      platform   VARCHAR(100),
      score      INTEGER,
      created_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
    )
  `)
}

// ── Query functions ───────────────────────────────────────────────────────────

const saveHistory = async (userId, type, title, content, platform = null, score = null) => {
  const result = await db.query(
    `INSERT INTO history (user_id, type, title, content, platform, score)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [userId, type, title, content, platform, score]
  )
  return result.rows[0]
}

const getUserHistory = async (userId) => {
  const result = await db.query(
    'SELECT * FROM history WHERE user_id = $1 ORDER BY created_at DESC',
    [userId]
  )
  return result.rows
}

const deleteHistory = async (id, userId) => {
  const result = await db.query(
    'DELETE FROM history WHERE id = $1 AND user_id = $2 RETURNING id',
    [id, userId]
  )
  return result.rows[0]
}

module.exports = { createHistoryTable, saveHistory, getUserHistory, deleteHistory }
