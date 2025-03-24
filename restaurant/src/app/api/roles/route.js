import { NextResponse } from "next/server";
import pool from "@/lib/db";


export async function GET() {
  try {
    const result = await pool.query("SELECT DISTINCT roles FROM users");
    const roles = result.rows.map(row => row.roles);
    return NextResponse.json({ roles });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
