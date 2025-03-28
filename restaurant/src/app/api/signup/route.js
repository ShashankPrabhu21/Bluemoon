// app/api/signup/route.js
import { NextResponse } from "next/server";
import pool from "@/lib/db";
import bcrypt from "bcrypt";

export async function POST(req) {
    try {
        const { firstName, lastName, email, password, phoneNumber, address, city, postCode, state, serviceType } = await req.json();

        if (!firstName || !lastName || !email || !password || !phoneNumber) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        let insertQuery;
        let values;

        if (serviceType === "delivery") {
            if (!address || !city || !postCode || !state) {
                return NextResponse.json({ error: "Delivery address is incomplete." }, { status: 400 });
            }

            insertQuery = `
                INSERT INTO users_order (first_name, last_name, email, password, phone_number, address, city, postCode, state)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                RETURNING *;
            `;
            values = [firstName, lastName, email, hashedPassword, phoneNumber, address, city, postCode, state];
        } else {
            insertQuery = `
                INSERT INTO users_order (first_name, last_name, email, password, phone_number)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING *;
            `;
            values = [firstName, lastName, email, hashedPassword, phoneNumber];
        }

        console.log("SQL Query:", insertQuery);
        console.log("SQL Values:", values);

        const result = await pool.query(insertQuery, values);

        console.log("Database Result:", result);

        return NextResponse.json(result.rows[0]);
    } catch (error) {
        console.error("Error creating account:", error);
        console.error("Error details:", error);
        return NextResponse.json({ error: "Failed to create account. " + error.message, status: 500 });
    }
}