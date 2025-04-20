import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();
    const { title, alt, category } = body;

    await pool.query(
      "UPDATE gallery SET title = $1, alt = $2, category = $3 WHERE id = $4",
      [title, alt, category, id]
    );

    return NextResponse.json({ message: "Image updated successfully" });
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json({ error: "Failed to update image" }, { status: 500 });
  }
}
