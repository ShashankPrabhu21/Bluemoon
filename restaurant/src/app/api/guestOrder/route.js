import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(req) {
  try {
    const { firstName, lastName, mobileNumber, email, address, city, postCode, state, serviceType } = await req.json();

    if (!firstName || !lastName || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    let insertQuery;
    let values;

    if (serviceType === "delivery") {
      if (!address || !city || !postCode || !state) {
        return NextResponse.json({ error: "Delivery address is incomplete." }, { status: 400 });
      }

      insertQuery = `
        INSERT INTO users_order (first_name, last_name, phone_number, email, address, city, postCode, state)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *;
      `;
      values = [firstName, lastName, mobileNumber, email, address, city, postCode, state];
    } else {
      insertQuery = `
        INSERT INTO users_order (first_name, last_name, phone_number, email)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
      `;
      values = [firstName, lastName, mobileNumber, email];
    }

    const result = await pool.query(insertQuery, values);
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("Error saving guest order:", error);
    console.error("Error details:", error); //log the full error.
    if (error.code === '23505') {
      return NextResponse.json({ error: "Email address already exists" }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to save guest order. "+ error.message, status: 500 });
  }
}