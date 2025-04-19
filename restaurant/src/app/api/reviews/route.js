import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// Fetch all reviews
export async function GET() {
  try {
    await pool.query('SET search_path TO public');
    const result = await pool.query(
      'SELECT id, name, gender, rating, experience, created_at FROM public.reviews ORDER BY created_at DESC'
    );
    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}


// Add a new review
export async function POST(req) {
  try {
    const { name, gender, rating, experience } = await req.json();

    if (!name || !gender || !experience) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const result = await pool.query(
      'INSERT INTO reviews (name, gender, rating, experience, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING *',
      [name, gender, rating, experience]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error("POST Error:", error); // ✅ Log the error
    return NextResponse.json({ error: 'Failed to insert review' }, { status: 500 });
  }
}
