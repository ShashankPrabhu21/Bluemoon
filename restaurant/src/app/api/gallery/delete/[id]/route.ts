// /app/api/gallery/delete/[id]/route.ts
import { NextResponse } from "next/server";
import pool from "@/lib/db";

interface RouteParams {
  params: { id: string };
  searchParams: URLSearchParams;
}

export async function DELETE(
  req: Request, // eslint-disable-line @typescript-eslint/no-unused-vars
  { params, searchParams }: RouteParams // eslint-disable-line @typescript-eslint/no-unused-vars
) {
  try {
    await pool.query("DELETE FROM gallery WHERE id = $1", [params.id]);
    return NextResponse.json({ message: "Image deleted successfully" });
  } catch (err) {
    console.error("Error deleting image:", err);
    return NextResponse.json({ error: "Failed to delete image" }, { status: 500 });
  }
}