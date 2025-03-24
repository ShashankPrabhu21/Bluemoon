import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function testConnection() {
  try {
    const client = await pool.connect();
    console.log("✅ Database connection established successfully");
    client.release();
  } catch (error) {
    console.error("❌ Database connection failed:", error);
  }
}

testConnection();

export default pool;
