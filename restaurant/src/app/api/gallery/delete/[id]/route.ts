// /app/api/gallery/update/[id]/route.ts
import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const { category, title, alt } = await req.json();
    await pool.query("UPDATE gallery SET category = $1, title = $2, alt = $3 WHERE id = $4", [category, title, alt, params.id]);
    return NextResponse.json({ message: "Image updated successfully" });
  } catch (err) {
    console.error("Error updating image:", err);
    return NextResponse.json({ error: "Failed to update image" }, { status: 500 });
  }
}