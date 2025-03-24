 import { NextResponse } from "next/server";
import db from "@/lib/db"; // Adjust the path as per your project

export async function POST(req) {
  try {
    console.log("API HIT: /api/reservation");
    
    const body = await req.json();
    console.log("Received Data:", body);

    const { name, phone, email, date, fromTime, toTime, guests } = body;

    if (!name || !phone || !email || !date || !fromTime || !toTime || !guests) {
      console.error("Missing Fields:", body);
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    const query = `
    INSERT INTO reservations (name, phone, email, reservation_date, reservation_time, reservation_start_time, reservation_end_time, no_of_guest, status)
    VALUES ($1, $2, $3, $4, NOW(), $5, $6, $7, 'Pending')
  `;
  const values = [name, phone, email, date, fromTime, toTime, guests];
  

    console.log("Executing Query:", query);
    await db.query(query, values);
    
    return NextResponse.json({ success: true, message: "Reservation successful" }, { status: 200 });

  } catch (error) {
    console.error("Server Error:", error.message); // Log full error
    return NextResponse.json({ success: false, message: "Server error", error: error.message }, { status: 500 });
  }
}