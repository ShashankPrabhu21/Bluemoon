// app/api/guestOrder/route.js
import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(req) {
    const { firstName, lastName, email, mobileNumber } = await req.json();

    try {
        await pool.query(
            'INSERT INTO users_order (first_name, last_name, email, phone_number) VALUES ($1, $2, $3, $4)',
            [firstName, lastName, email, mobileNumber]
        );

        return NextResponse.json({ message: 'Guest information saved successfully!' });
    } catch (error) {
        console.error('Guest order error:', error); // Log the full error
        return NextResponse.json({ error: 'Failed to save guest information. ' + error.message }, { status: 500 }); // Return the error message
    }
}