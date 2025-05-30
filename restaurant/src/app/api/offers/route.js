// api/offers/route.js
import { NextResponse } from "next/server";
import pool from "@/lib/db";

// GET: Fetch all food items and offers (now with optional pagination for food items)
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const fetchFoodItems = searchParams.get("fetch_food_items") === "true";
  const fetchOffers = searchParams.get("fetch_offers") === "true"; // New parameter to fetch only offers
  const noPagination = searchParams.get("no_pagination") === "true"; // New parameter to bypass pagination

  try {
    await pool.query("SET search_path TO public");

    if (fetchFoodItems) {
      // Logic to fetch paginated food items
      const page = parseInt(searchParams.get("page") || "0");
      const limit = parseInt(searchParams.get("limit") || "12");
      const offset = page * limit;

      const foodItemsQuery = await pool.query(
        "SELECT item_id, name, description, price, availability, image_url, quantity FROM public.menu_items ORDER BY created_at DESC LIMIT $1 OFFSET $2",
        [limit, offset]
      );

      // Return only food items
      return NextResponse.json(foodItemsQuery.rows, { status: 200 });
    } else if (fetchOffers) {
      // Logic to fetch all offers (no pagination)
      const offersQuery = await pool.query("SELECT * FROM public.offers");
      const offers = offersQuery.rows.map((offer) => ({
        ...offer,
        selected_items:
          typeof offer.selected_items === "string"
            ? offer.selected_items
            : JSON.stringify(offer.selected_items), // Ensure it's a string
      }));
      // Return only offers
      return NextResponse.json(offers, { status: 200 });
    } else {
      // Original logic for when no specific type is requested (or for legacy calls)
      // This path is less likely to be hit with the new client logic
      const foodItemsQuery = await pool.query("SELECT * FROM public.menu_items");
      const offersQuery = await pool.query("SELECT * FROM public.offers");

      return NextResponse.json({
        foodItems: foodItemsQuery.rows,
        offers: offersQuery.rows.map((offer) => ({
          ...offer,
          selected_items:
            typeof offer.selected_items === "string"
              ? offer.selected_items
              : JSON.stringify(offer.selected_items),
        })),
      }, { status: 200 });
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST: Insert a new offer
export async function POST(req) {
  try {
    const body = await req.json();
    const { selectedItems, totalPrice, discountedPrice, offerType, startDate, endDate } = body;

    if (!Array.isArray(selectedItems) || selectedItems.length === 0) {
      return NextResponse.json(
        { error: "Invalid selected items format. Must be an array of numbers." },
        { status: 400 }
      );
    }

    // Ensure all selected items exist
    await pool.query("SET search_path TO public");
    const selectedPrices = await pool.query(
      "SELECT item_id FROM public.menu_items WHERE item_id = ANY($1::int[])",
      [selectedItems]
    );

    if (selectedPrices.rows.length !== selectedItems.length) {
      return NextResponse.json({ error: "Some items not found" }, { status: 400 });
    }

    // Insert offer
    const insertOffer = await pool.query(
      `INSERT INTO public.offers (selected_items, total_price, discounted_price, offer_type, start_date, end_date)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [JSON.stringify(selectedItems), totalPrice, discountedPrice, offerType, startDate, endDate]
    );

    return NextResponse.json({ success: true, offer: insertOffer.rows[0] }, { status: 201 });
  } catch (error) {
    console.error("Error creating offer:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Existing PUT and DELETE methods (no changes needed)

// /api/offers/[id]/route.js (for PUT and DELETE on specific offer IDs)
// This file likely exists in a separate dynamic route: `app/api/offers/[id]/route.js`
// Ensure your DELETE and PUT operations correctly target the specific offer ID.
// No changes needed for these methods.

// DELETE: Delete an offer by ID
export async function DELETE(req, { params }) {
  try {
    const { id } = params; // Get id from dynamic route segment
    if (!id) {
      return NextResponse.json({ error: "Offer ID is required" }, { status: 400 });
    }

    const result = await pool.query("DELETE FROM public.offers WHERE id = $1 RETURNING id", [id]);

    if (result.rowCount === 0) {
      return NextResponse.json({ error: "Offer not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Offer deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting offer:", error);
    return NextResponse.json({ error: "Failed to delete offer" }, { status: 500 });
  }
}

// PUT: Update an offer by ID
export async function PUT(req, { params }) {
  try {
    const { id } = params; // Get id from dynamic route segment
    if (!id) {
      return NextResponse.json({ error: "Offer ID is required" }, { status: 400 });
    }

    const body = await req.json();
    const { selectedItems, totalPrice, discountedPrice, offerType, startDate, endDate } = body;

    if (!Array.isArray(selectedItems) || selectedItems.length === 0) {
      return NextResponse.json(
        { error: "Invalid selected items format. Must be an array of numbers." },
        { status: 400 }
      );
    }

    // Ensure all selected items exist
    await pool.query("SET search_path TO public");
    const selectedPrices = await pool.query(
      "SELECT item_id FROM public.menu_items WHERE item_id = ANY($1::int[])",
      [selectedItems]
    );

    if (selectedPrices.rows.length !== selectedItems.length) {
      return NextResponse.json({ error: "Some items not found" }, { status: 400 });
    }

    const result = await pool.query(
      `UPDATE public.offers
       SET selected_items = $1, total_price = $2, discounted_price = $3, offer_type = $4,
           start_date = $5, end_date = $6, updated_at = NOW()
       WHERE id = $7
       RETURNING *`,
      [JSON.stringify(selectedItems), totalPrice, discountedPrice, offerType, startDate, endDate, id]
    );

    if (result.rowCount === 0) {
      return NextResponse.json({ error: "Offer not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, offer: result.rows[0] }, { status: 200 });
  } catch (error) {
    console.error("Error updating offer:", error);
    return NextResponse.json({ error: "Failed to update offer" }, { status: 500 });
  }
}