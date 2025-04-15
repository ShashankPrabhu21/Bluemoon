// /app/api/gallery/delete/[id]/route.ts
import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function DELETE(
  req: Request,
  { params, searchParams }: { params: { id: string }; searchParams: URLSearchParams }
) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  searchParams; // Explicitly using it to silence the linter

  try {
    await pool.query("DELETE FROM gallery WHERE id = $1", [params.id]);
    return NextResponse.json({ message: "Image deleted successfully" });
  } catch (err) {
    console.error("Error deleting image:", err);
    return NextResponse.json({ error: "Failed to delete image" }, { status: 500 });
  }
}