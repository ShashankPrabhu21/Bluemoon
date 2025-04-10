import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT 
        CONCAT(first_name, ' ', last_name) AS name,
        email,
        phone_number AS phone,
        TO_CHAR(created_at, 'YYYY-MM-DD') AS join_date
      FROM users_order
    `);

    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
