import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function DELETE(
  req: Request,
  context: { params: { id: string } } // <- this is the correct usage
) {
  const { id } = context.params;

  try {
    await pool.query("DELETE FROM gallery WHERE id = $1", [id]);
    return NextResponse.json({ message: "Image deleted successfully" });
  } catch (err) {
    console.error("Error deleting image:", err);
    return NextResponse.json({ error: "Failed to delete image" }, { status: 500 });
  }
}
