import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

// ✅ Define your route context interface
interface RouteContext {
  params: {
    id: string;
  };
}

export async function DELETE(req: NextRequest, context: RouteContext) {
  const id = context.params.id;

  try {
    await pool.query("DELETE FROM gallery WHERE id = $1", [id]);
    return NextResponse.json({ message: "Image deleted successfully" });
  } catch (err) {
    console.error("Error deleting image:", err);
    return NextResponse.json({ error: "Failed to delete image" }, { status: 500 });
  }
}
