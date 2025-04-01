import { NextApiRequest, NextApiResponse } from "next";
import pool from '@/lib/db'; // Ensure your PostgreSQL connection is set up

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log("API request received:", req.method);

    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed. Use POST instead." });
    }

    try {
        const { first_name, last_name, email, phone_number, cart_items, service_type, total_amount } = req.body;

        if (!first_name || !last_name || !email || !phone_number || !cart_items || !service_type || !total_amount) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const query = `
            INSERT INTO "order" (first_name, last_name, email, phone_number, cart_items, service_type, total_amount)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING order_id;
        `;
        const values = [
            first_name,
            last_name,
            email,
            phone_number,
            JSON.stringify(cart_items),
            service_type,
            total_amount
        ];

        const result = await pool.query(query, values);

        console.log("Order saved successfully:", result.rows[0]);

        res.status(200).json({ success: true, order_id: result.rows[0].order_id });
    } catch (error: unknown) {
        console.error("Database Error:", error);
        res.status(500).json({ error: "Database Insertion Failed" });
    }
}
