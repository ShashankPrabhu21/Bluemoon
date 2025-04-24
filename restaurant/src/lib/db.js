import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Required for NeonDB
  },
});

// Optional test connection (use only once if you want to verify)
(async () => {
  try {
    const client = await pool.connect();
    console.log("✅ PostgreSQL connected!");
    client.release();
  } catch (err) {
    console.error("❌ PostgreSQL connection error:", err);
  }
})();

export default pool;
