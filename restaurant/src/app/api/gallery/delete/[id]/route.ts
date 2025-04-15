// src/app/api/gallery/delete/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function DELETE(req: NextRequest, context: { params: { id: string } }) {
  const id = context.params.id;

  try {
    await pool.query("DELETE FROM gallery WHERE id = $1", [id]);
    return NextResponse.json({ message: "Image deleted successfully" });
  } catch (err) {
    console.error("Error deleting image:", err);
    return NextResponse.json({ error: "Failed to delete image" }, { status: 500 });
  }
}
