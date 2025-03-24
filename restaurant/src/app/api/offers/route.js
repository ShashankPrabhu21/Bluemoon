import { NextResponse } from "next/server";
import pool from "@/lib/db"; // Ensure database connection



export async function GET() { 
  try {
    const foodItemsQuery = await pool.query("SELECT * FROM menu_items");
    const offersQuery = await pool.query("SELECT * FROM offers");

    return NextResponse.json({
      foodItems: foodItemsQuery.rows,
      offers: offersQuery.rows.map((offer) => ({
        ...offer,
        selected_items: typeof offer.selected_items === "string" ? offer.selected_items : JSON.stringify(offer.selected_items),
      })),
    });
  } catch (error) {
    
    console.error("Error fetching data:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}





// POST API to insert a new offer
export async function POST(req) {
  try {
    const body = await req.json(); // Await the JSON body properly
    const { selectedItems, totalPrice, discountedPrice, offerType, startDate, endDate } = body;

    if (!Array.isArray(selectedItems) || selectedItems.length === 0) {
      return NextResponse.json(
        { error: "Invalid selected items format. Must be an array of numbers." },
        { status: 400 }
      );
    }

    console.log("Received selectedItems:", selectedItems);

    // Ensure all selected items exist in the database
    const selectedPrices = await pool.query(
      "SELECT item_id FROM menu_items WHERE item_id = ANY($1::int[])",
      [selectedItems]
    );

    if (selectedPrices.rows.length !== selectedItems.length) {
      return NextResponse.json({ error: "Some items not found" }, { status: 400 });
    }

    // Insert the new offer into the database
    const insertOffer = await pool.query(
      `INSERT INTO offers (selected_items, total_price, discounted_price, offer_type, start_date, end_date) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [JSON.stringify(selectedItems), totalPrice, discountedPrice, offerType, startDate, endDate]
    );

    return NextResponse.json({ success: true, offer: insertOffer.rows[0] });
  } catch (error) {
    console.error("Error creating offer:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}



