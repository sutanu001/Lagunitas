import pg from 'pg';
const { Pool } = pg;

let pool = null;

const getPool = () => {
  if (!pool) {
    pool = new Pool({
      host:     process.env.DB_HOST     || 'localhost',
      port:     parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DB_NAME     || 'lagunitas',
      user:     process.env.DB_USER     || 'postgres',
      password: process.env.DB_PASSWORD || 'lagunitas123',
      max:                  20,
      idleTimeoutMillis:    30_000,
      connectionTimeoutMillis: 3_000,
    });

    pool.on('error', (err) => {
      console.error('Unexpected PostgreSQL client error:', err.message);
    });
  }
  return pool;
};

/**
 * Connect and verify the database is reachable.
 * Fails gracefully so the app can still serve from in-memory fallback.
 */
export const connectDB = async () => {
  try {
    const client = await getPool().connect();
    const res = await client.query('SELECT NOW() AS now');
    client.release();
    console.log(`✅  PostgreSQL connected  — server time: ${res.rows[0].now}`);
    return true;
  } catch (err) {
    console.warn(`⚠️  PostgreSQL unavailable (${err.message}). Running with in-memory fallback.`);
    return false;
  }
};

/**
 * Execute a parameterised SQL query.
 * Returns null on connection error instead of throwing.
 */
export const query = async (text, params) => {
  try {
    return await getPool().query(text, params);
  } catch (err) {
    console.error(`DB query error: ${err.message}\nSQL: ${text}`);
    return null;
  }
};
