//api/orders/route.ts
import { NextResponse } from "next/server";
import pool from "@/lib/db"; // Assuming your database pool is in "@/lib/db"

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, cart_items, service_type, total_amount } = body;

    // Validation (Optional but recommended)
    if (!name || !email || !cart_items || !service_type || !total_amount) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const insertQuery = `
      INSERT INTO "order" (name, email, cart_items, service_type, total_amount)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;

    const values = [name, email, cart_items, service_type, total_amount];

    const result = await pool.query(insertQuery, values);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: "Failed to insert order" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, order: result.rows[0] });
  } catch (error) {
    console.error("Error inserting order:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create order" },
      { status: 500 }
    );
  }
}