// /app/api/gallery/update/[id]/route.ts
import { NextResponse } from "next/server";
import pool from "@/lib/db";

interface Params {
  id: string;
}

export async function PUT(req: Request, { params }: { params: Params }) {
  const { id } = params;
  const { category, title, alt } = await req.json();

  if (!category || !title || !alt) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    const result = await pool.query(
      "UPDATE gallery SET category = $1, title = $2, alt = $3 WHERE id = $4",
      [category, title, alt, id]
    );

    if (result.rowCount > 0) {
      return NextResponse.json({ message: "Image updated successfully!", alert: true }, { status: 200 });
    } else {
      return NextResponse.json({ error: "Image not found", alert: false }, { status: 404 });
    }
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json({ error: "Internal server error", alert: false }, { status: 500 });
  }
}