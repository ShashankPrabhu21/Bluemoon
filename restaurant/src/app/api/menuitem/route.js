// api/menuitem/route.js
import { NextResponse } from "next/server";
import db from "@/lib/db";

// Mapping Category IDs to Names
const categoryMapping = {
  1: "Breakfast",
  2: "Main Course",
  4: "Entree",
  5: "Drinks",
};

// Handle GET requests with optimized queries
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const categoryName = searchParams.get("category");
  // const noPagination = searchParams.get("no_pagination") === "true"; // This parameter will now be unused for general fetch

  let query = "SELECT item_id, category_id, name, description, price, availability, image_url, spicy_level, quantity, created_at FROM menu_items";
  let values = [];
  let paramIndex = 1;

  // Add WHERE clause if a category is specified (this part remains the same)
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
      return NextResponse.json([], { status: 200 });
    }
  }

  // --- IMPORTANT: Modified Pagination logic ---
  // Always apply pagination now. The 'no_pagination' parameter is effectively removed for this GET endpoint's main purpose.
  const page = parseInt(searchParams.get("page") || "0");
  const limit = parseInt(searchParams.get("limit") || "4"); // Use a default limit if not provided
  const offset = page * limit;

  query += ` ORDER BY created_at DESC LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
  values.push(limit, offset);


  console.log("Executing query:", query);
  console.log("With values:", values);

  try {
    const result = await db.query(query, values);

    // Add category_name to each item
    const menuItemsWithCategoryName = result.rows.map((item) => ({
      ...item,
      category_name: categoryMapping[item.category_id] || "Unknown",
    }));

    // Set cache headers for better performance (adjust max-age as needed)
    const response = NextResponse.json(menuItemsWithCategoryName, { status: 200 });
    response.headers.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
    
    return response;
  } catch (error) {
    console.error("Database Error in GET:", error);
    return NextResponse.json(
      { error: "Failed to fetch menu items", details: error.message },
      { status: 500 }
    );
  }
}

// POST: Insert a new item
export async function POST(req) {
    const client = await db.connect(); // Get a client for transaction
    
    try {
        await client.query('BEGIN'); // Start transaction
        
        const body = await req.json();
        const { category_id, name, description, price, availability, image_url, quantity, spicy_level } = body;

        // Validation
        if (!category_id || !name || !description || !price || !availability || !image_url || !quantity || !spicy_level) {
            await client.query('ROLLBACK');
            return NextResponse.json({ error: "All fields are required" }, { status: 400 });
        }

        // Check for duplicate quantity (faster with prepared statement)
        const quantityCheck = await client.query("SELECT item_id FROM menu_items WHERE quantity = $1", [quantity]);
        if (quantityCheck.rows.length > 0) {
            await client.query('ROLLBACK');
            return NextResponse.json({ error: "Item with this number already exists." }, { status: 400 });
        }

        // Insert new item with optimized query (fewer columns in RETURNING)
        const result = await client.query(
            `INSERT INTO menu_items (category_id, name, description, price, availability, image_url, quantity, spicy_level, created_at, updated_at) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW()) 
             RETURNING item_id, category_id, name, description, price, availability, image_url, quantity, spicy_level`,
            [category_id, name, description, price, availability, image_url, quantity, spicy_level]
        );

        await client.query('COMMIT'); // Commit transaction

        // Add category name to response
        const newItem = {
            ...result.rows[0],
            category_name: categoryMapping[category_id] || "Unknown"
        };

        return NextResponse.json(newItem, { status: 201 });

    } catch (error) {
        await client.query('ROLLBACK'); // Rollback on error
        console.error("Database Error in POST:", error);
        return NextResponse.json({ error: "Failed to save menu item" }, { status: 500 });
    } finally {
        client.release(); // Always release the client
    }
}

// DELETE: Delete an item by ID
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

// PUT: Update an item by ID
export async function PUT(req) {
    const client = await db.connect();
    
    try {
        await client.query('BEGIN');
        
        const body = await req.json();
        console.log("Received PUT request body:", body);

        const { item_id, category_id, name, description, price, availability, image_url, quantity, spicy_level } = body;

        if (!item_id) {
            await client.query('ROLLBACK');
            return NextResponse.json({ error: "item_id is required" }, { status: 400 });
        }

        // Check if quantity conflicts with other items (excluding current item)
        const quantityCheck = await client.query(
            "SELECT item_id FROM menu_items WHERE quantity = $1 AND item_id != $2", 
            [quantity, item_id]
        );
        
        if (quantityCheck.rows.length > 0) {
            await client.query('ROLLBACK');
            return NextResponse.json({ error: "Item with this number already exists." }, { status: 400 });
        }

        const result = await client.query(
            `UPDATE menu_items
             SET category_id = $1, name = $2, description = $3, price = $4, availability = $5,
                 image_url = $6, quantity = $7, spicy_level = $8, updated_at = NOW()
             WHERE item_id = $9
             RETURNING item_id, category_id, name, description, price, availability, image_url, quantity, spicy_level`,
            [category_id, name, description, price, availability, image_url, quantity, spicy_level, item_id]
        );

        console.log("Update result:", result.rows);

        if (result.rowCount === 0) {
            await client.query('ROLLBACK');
            return NextResponse.json({ error: "Item not found" }, { status: 404 });
        }

        await client.query('COMMIT');

        // Add category name to response
        const updatedItem = {
            ...result.rows[0],
            category_name: categoryMapping[category_id] || "Unknown"
        };

        return NextResponse.json(updatedItem, { status: 200 });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error("Error updating item:", error);
        return NextResponse.json({ error: "Failed to update menu item" }, { status: 500 });
    } finally {
        client.release();
    }
}