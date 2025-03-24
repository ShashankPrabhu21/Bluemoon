import { NextResponse } from "next/server";
import pool from "@/lib/db"; // Ensure this is correctly set up

// ✅ Fetch all customers
export async function GET() {
  try {
    const result = await pool.query(
      "SELECT customer_id AS id, name, email, phone, is_active FROM customer"
    );
    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// ✅ Update customer (status or details)
export async function PATCH(req) {
  try {
    const { id, is_active, name, email, phone } = await req.json();

    if (typeof is_active !== "undefined") {
      // Toggle active status
      await pool.query("UPDATE customer SET is_active = $1 WHERE customer_id = $2", [is_active, id]);
      return NextResponse.json({ message: "Customer status updated successfully." }, { status: 200 });
    }

    if (name || email || phone) {
      // Update customer details
      await pool.query(
        "UPDATE customer SET name = $1, email = $2, phone = $3 WHERE customer_id = $4",
        [name, email, phone, id]
      );
      return NextResponse.json({ message: "Customer details updated successfully." }, { status: 200 });
    }

    return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
  } catch (error) {
    console.error("Error updating customer:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}