// /app/api/gallery/get/route.ts
import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const result = await pool.query("SELECT * FROM gallery ORDER BY id DESC");
    return NextResponse.json({ success: true, items: result.rows }); // Changed 'images' to 'items' to reflect all media types
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json({ success: false, error });
  }
}