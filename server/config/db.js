const { Pool } = require('pg')

// Managed Postgres providers (Render, Neon, Supabase, …) hand you a single
// DATABASE_URL connection string and require SSL. Locally we fall back to the
// individual DB_* variables with SSL off.
const useConnectionString = !!process.env.DATABASE_URL
const ssl = (process.env.NODE_ENV === 'production' || useConnectionString)
  ? { rejectUnauthorized: false }
  : false

const db = new Pool(
  useConnectionString
    ? { connectionString: process.env.DATABASE_URL, ssl }
    : {
        host:     process.env.DB_HOST,
        port:     Number(process.env.DB_PORT) || 5432,
        database: process.env.DB_NAME,
        user:     process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        ssl: { rejectUnauthorized: false }
      }
)

// Verify the connection is reachable and surface errors early
db.connect((err, client, release) => {
  if (err) {
    console.error('PostgreSQL connection error:', err.message)
  } else {
    console.log('PostgreSQL connected')
    release()
  }
})

module.exports = db
