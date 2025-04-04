import { NextResponse } from "next/server";
import db from "@/lib/db"; // Update the path if your db file is in a different directory

export async function POST(req) {
  try {
    console.log("✅ API HIT: /api/reservation");

    const body = await req.json();
    console.log("📦 Received Data:", body);

    const { name, phone, email, date, fromTime, toTime, guests, tableNumber } = body;

    if (!name || !phone || !email || !date || !fromTime || !toTime || !guests || !tableNumber) {
      console.error("❌ Missing Fields:", body);
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    // Step 1: Check for conflicting reservation on same table, date & overlapping time
    const conflictQuery = `
      SELECT 1 FROM reservations
      WHERE table_number = $1
        AND reservation_date = $2
        AND ($3::time, $4::time) OVERLAPS (reservation_start_time, reservation_end_time)
    `;
    const conflictValues = [tableNumber, date, fromTime, toTime];
    const conflictResult = await db.query(conflictQuery, conflictValues);

    if (conflictResult.rows.length > 0) {
      console.warn("⚠️ Table already reserved for this slot:", tableNumber);
      return NextResponse.json({ success: false, message: "Table not available for the selected time." }, { status: 409 });
    }

    // Step 2: Insert reservation
    const insertQuery = `
      INSERT INTO reservations
        (name, phone, email, reservation_date, reservation_time, reservation_start_time, reservation_end_time, no_of_guest, status, table_number)
      VALUES 
        ($1, $2, $3, $4, NOW(), $5, $6, $7, 'Confirmed', $8)
    `;
    const insertValues = [name, phone, email, date, fromTime, toTime, guests, tableNumber];

    await db.query(insertQuery, insertValues);
    console.log("✅ Reservation inserted successfully.");

    return NextResponse.json({ success: true, message: "Reservation successful" }, { status: 200 });

  } catch (error) {
    console.error("🔥 Server Error:", error.message);
    return NextResponse.json({ success: false, message: "Server error", error: error.message }, { status: 500 });
  }
}
