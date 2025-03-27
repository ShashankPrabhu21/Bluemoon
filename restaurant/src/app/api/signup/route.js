// app/api/signup/route.js
import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcrypt';

export async function POST(req) {
    const { firstName, lastName, email, phoneNumber, password } = await req.json();

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(
            'INSERT INTO users_order (first_name, last_name, email, phone_number, password) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [firstName, lastName, email, phoneNumber, hashedPassword]
        );

        return NextResponse.json({ message: 'Successfully created!', user: result.rows[0] }, { status: 201 });
    } catch (error) {
        console.error('Signup error:', error);
        return NextResponse.json({ error: 'Failed to create account.' }, { status: 500 });
    }
}