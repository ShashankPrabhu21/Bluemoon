import { NextResponse } from "next/server";
import pool from "@/lib/db"; // Ensure this path matches your setup

export async function GET() {
  try {
    const result = await pool.query("SELECT name, email, phone, join_date FROM customer"); // Fetch all customers
    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}