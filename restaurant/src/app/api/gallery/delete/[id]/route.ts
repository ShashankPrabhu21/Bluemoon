// /app/api/gallery/delete/[id]/route.ts
import { NextResponse } from "next/server";
import pool from "@/lib/db";

interface Params {
  id: string;
}

export async function DELETE(req: Request, { params }: { params: Params }) {
  const { id } = params;

  try {
    const result = await pool.query("DELETE FROM gallery WHERE id = $1", [id]);

    if (result.rowCount > 0) {
      return NextResponse.json({ message: "Image deleted successfully!", alert: true }, { status: 200 });
    } else {
      return NextResponse.json({ error: "Image not found", alert: false }, { status: 404 });
    }
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json({ error: "Internal server error", alert: false }, { status: 500 });
  }
}