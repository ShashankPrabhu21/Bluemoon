import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, cart_items, service_type, total_amount, scheduled_date, scheduled_time } = body;

    console.log("cart_items received:", cart_items);

    if (!name || !email || !cart_items || !service_type || !total_amount) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Explicitly stringify cart_items
    const stringifiedCartItems = JSON.stringify(cart_items);

    const insertQuery = `
      INSERT INTO "order" (name, email, cart_items, service_type, total_amount, scheduled_date, scheduled_time)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;

    const values = [name, email, stringifiedCartItems, service_type, total_amount, scheduled_date, scheduled_time];

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