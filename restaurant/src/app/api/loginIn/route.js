// app/api/loginIn/route.js
import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcrypt';

export async function POST(req) {
    try {
        const { email, password } = await req.json();

        console.log("🔍 Checking user:", email);

        // Fetch user from DB
        const result = await pool.query('SELECT * FROM users_order WHERE email = $1', [email]);
        const user = result.rows[0];

        if (!user) {
            console.log("❌ User not found");
            return NextResponse.json({ error: 'Account not found.' }, { status: 401 });
        }

        console.log("✅ User found:", user.email);

        // Debug password comparison
        console.log("🔒 Stored Password:", user.password);
        console.log("🔑 Entered Password:", password);

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            console.log("❌ Invalid password");
            return NextResponse.json({ error: 'Invalid password.' }, { status: 401 });
        }

        console.log("✅ Login successful for:", user.email);

        return NextResponse.json({ message: 'Login successful!', user });
    } catch (error) {
        console.error("❌ Login error:", error);
        return NextResponse.json({ error: 'Failed to login.' }, { status: 500 });
    }
}
