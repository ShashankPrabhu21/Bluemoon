import { NextResponse } from "next/server";
import db from "@/lib/db"; // Assuming db is the correct import for your PostgreSQL connection

// Mapping Category IDs to Names
const categoryMapping = {
  1: "Breakfast",
  2: "Main Course",
  4: "Entree",
  5: "Drinks",
};

// Handle GET requests (Fetch menu items with pagination and optional category filter)
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const categoryName = searchParams.get("category"); // Get the 'category' parameter
  const noPagination = searchParams.get("no_pagination") === "true"; // Check for no_pagination flag

  let query = "SELECT * FROM menu_items"; // Base query for all items
  let values = [];
  let paramIndex = 1; // Used to track parameter positions for parameterized queries

  // Add WHERE clause if a category is specified (and it's not "All Menu")
  if (categoryName && categoryName !== "All Menu") {
    let categoryId = null;
    for (const id in categoryMapping) {
      if (categoryMapping[id] === categoryName) {
        categoryId = parseInt(id);
        break;
      }
    }

    if (categoryId !== null) {
      query += ` WHERE category_id = $${paramIndex++}`;
      values.push(categoryId);
    } else {
      // If the category name from the frontend doesn't match any in our mapping,
      // we return an empty array without hitting the database.
      return NextResponse.json([], { status: 200 });
    }
  }

  // --- CRITICAL CHANGE START ---
  // Only apply LIMIT and OFFSET if noPagination is NOT true
  if (!noPagination) {
    // If no_pagination is false, parse page and limit for pagination
    const page = parseInt(searchParams.get("page") || "0");
    const limit = parseInt(searchParams.get("limit") || "12"); // Ensure this matches ITEMS_PER_PAGE in frontend
    const offset = page * limit; // Calculate the offset for SQL LIMIT/OFFSET

    query += ` ORDER BY created_at DESC LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
    values.push(limit, offset); // Add limit and offset to values array
  } else {
    // If no_pagination is true, just order the results, no LIMIT/OFFSET
    query += ` ORDER BY created_at DESC`; // Order to ensure consistent display
  }
  // --- CRITICAL CHANGE END ---

  console.log("Executing query:", query);
  console.log("With values:", values);

  try {
    const result = await db.query(query, values);

    // Add category_name to each item in the result
    const menuItemsWithCategoryName = result.rows.map((item) => ({
      ...item,
      category_name: categoryMapping[item.category_id] || "Unknown",
    }));

    return NextResponse.json(menuItemsWithCategoryName, { status: 200 });
  } catch (error) {
    console.error("Database Error in GET:", error);
    return NextResponse.json(
      { error: "Failed to fetch menu items", details: error.message }, // Include error details for debugging
      { status: 500 }
    );
  }
}

// Your POST, DELETE, PUT methods remain unchanged
// ✅ Handle POST requests (Add a new menu item)
export async function POST(req) {
  try {
    const body = await req.json();
    const { category_id, name, description, price, availability, image_url, quantity, spicy_level } = body;

    if (!category_id || !name || !description || !price || !availability || !image_url || !quantity || !spicy_level) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const quantityCheck = await db.query("SELECT * FROM menu_items WHERE quantity = $1", [quantity]);
    if (quantityCheck.rows.length > 0) {
        return NextResponse.json({ error: "Item with this number already exists." }, { status: 400 });
    }

    const result = await db.query(
      "INSERT INTO menu_items (category_id, name, description, price, availability, image_url, quantity, spicy_level, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW()) RETURNING *",
      [category_id, name, description, price, availability, image_url, quantity, spicy_level]
    );

    return NextResponse.json(result.rows[0], { status: 201 });

  } catch (error) {
    console.error("Database Error in POST:", error);
    return NextResponse.json({ error: "Failed to save menu item" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const body = await req.json();
    console.log("Received delete request body:", body);

    const { item_id } = body;
    if (!item_id) {
      return NextResponse.json({ error: "item_id is required" }, { status: 400 });
    }

    const result = await db.query("DELETE FROM menu_items WHERE item_id = $1", [item_id]);

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
    console.log("Received PUT request body:", body);

    const { item_id, category_id, name, description, price, availability, image_url, quantity, spicy_level } = body;

    if (!item_id) {
      return NextResponse.json({ error: "item_id is required" }, { status: 400 });
    }

    const result = await db.query(
      `UPDATE menu_items
          SET category_id = $1, name = $2, description = $3, price = $4, availability = $5,
              image_url = $6, quantity = $7, spicy_level = $8, updated_at = NOW()
          WHERE item_id = $9
          RETURNING *`,
      [category_id, name, description, price, availability, image_url, quantity, spicy_level, item_id]
    );

    console.log("Update result:", result.rows);

    if (result.rowCount === 0) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    return NextResponse.json(result.rows[0], { status: 200 });
  } catch (error) {
    console.error("Error updating item:", error);
    return NextResponse.json({ error: "Failed to update menu item" }, { status: 500 });
  }
}