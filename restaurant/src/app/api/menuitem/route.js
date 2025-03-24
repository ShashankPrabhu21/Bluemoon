import { NextResponse } from "next/server";
import pool from "@/lib/db"; // Ensure your database connection is correct
import db from "@/lib/db";
// ✅ Handle GET requests (Fetch all menu items)
export async function GET() {
  try {
    const result = await db.query("SELECT * FROM menu_items ORDER BY created_at DESC");
    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ error: "Failed to fetch menu items" }, { status: 500 });
  }
}

// ✅ Handle POST requests (Add a new menu item)
export async function POST(req) {
  try {
    const body = await req.json();
    const { category_id, name, description, price, availability, image_url, quantity, spicy_level } = body;

    if (!category_id || !name || !description || !price || !availability || !image_url || !quantity || !spicy_level) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const result = await db.query(
      "INSERT INTO menu_items (category_id, name, description, price, availability, image_url, quantity, spicy_level, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW()) RETURNING *",
      [category_id, name, description, price, availability, image_url, quantity, spicy_level]
    );

    return NextResponse.json(result.rows[0], { status: 201 });

  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ error: "Failed to save menu item" }, { status: 500 });
  }
  
}
export async function DELETE(req) {
  try {
    const body = await req.json();
    console.log("Received delete request body:", body); // Debugging

    const { id } = body;
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const result = await pool.query("DELETE FROM menu_items WHERE item_id = $1", [id]);

    if (result.rowCount === 0) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Item deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting item:", error);
    return NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
  }
}
export async function PUT(req) {
  try {
    const body = await req.json();
    console.log("Received PUT request body:", body); // Debugging

    const { id, category_id, name, description, price, availability, image_url, quantity, spicy_level } = body;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const result = await db.query(
      `UPDATE menu_items 
       SET category_id = $1, name = $2, description = $3, price = $4, availability = $5, 
           image_url = $6, quantity = $7, spicy_level = $8, updated_at = NOW() 
       WHERE item_id = $9 
       RETURNING *`,
      [category_id, name, description, price, availability, image_url, quantity, spicy_level, id]
    );

    console.log("Update result:", result.rows); // Debugging

    if (result.rowCount === 0) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    return NextResponse.json(result.rows[0], { status: 200 });
  } catch (error) {
    console.error("Error updating item:", error);
    return NextResponse.json({ error: "Failed to update menu item" }, { status: 500 });
  }
}