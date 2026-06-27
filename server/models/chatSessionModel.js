'use strict'

const db = require('../config/db')

async function createChatSessionsTable() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS chat_sessions (
      id         SERIAL PRIMARY KEY,
      user_id    INTEGER REFERENCES users(id) ON DELETE CASCADE,
      title      VARCHAR(255)       DEFAULT 'New Chat',
      tone       VARCHAR(50)        DEFAULT 'Professional',
      platform   VARCHAR(100)       DEFAULT 'Upwork',
      messages   JSONB              DEFAULT '[]',
      created_at TIMESTAMP          DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP          DEFAULT CURRENT_TIMESTAMP
    )
  `)
}

async function getAllSessions(userId) {
  const { rows } = await db.query(
    `SELECT * FROM chat_sessions WHERE user_id = $1 ORDER BY updated_at DESC`,
    [userId]
  )
  return rows
}

async function createSession(userId, title, tone, platform, messages = []) {
  const { rows } = await db.query(
    `INSERT INTO chat_sessions (user_id, title, tone, platform, messages)
     VALUES ($1, $2, $3, $4, $5::jsonb)
     RETURNING *`,
    [userId, title, tone, platform, JSON.stringify(messages)]
  )
  return rows[0]
}

async function getSession(id, userId) {
  const { rows } = await db.query(
    `SELECT * FROM chat_sessions WHERE id = $1 AND user_id = $2`,
    [id, userId]
  )
  return rows[0] || null
}

async function updateSession(id, userId, updates) {
  const setClauses = ['updated_at = CURRENT_TIMESTAMP']
  const values     = []
  let   idx        = 1

  if (updates.title    !== undefined) { setClauses.push(`title    = $${idx++}`);         values.push(updates.title)                     }
  if (updates.tone     !== undefined) { setClauses.push(`tone     = $${idx++}`);         values.push(updates.tone)                      }
  if (updates.platform !== undefined) { setClauses.push(`platform = $${idx++}`);         values.push(updates.platform)                  }
  if (updates.messages !== undefined) { setClauses.push(`messages = $${idx++}::jsonb`);  values.push(JSON.stringify(updates.messages))  }

  values.push(id, userId)

  const { rows } = await db.query(
    `UPDATE chat_sessions SET ${setClauses.join(', ')}
     WHERE id = $${idx} AND user_id = $${idx + 1}
     RETURNING *`,
    values
  )
  return rows[0] || null
}

async function deleteSession(id, userId) {
  const { rows } = await db.query(
    `DELETE FROM chat_sessions WHERE id = $1 AND user_id = $2 RETURNING id`,
    [id, userId]
  )
  return rows[0] || null
}

module.exports = {
  createChatSessionsTable,
  getAllSessions,
  createSession,
  getSession,
  updateSession,
  deleteSession,
}
