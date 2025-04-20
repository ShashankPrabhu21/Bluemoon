//gallery/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

// PUT: Edit gallery image by ID
export async function PUT(req: NextRequest) {
  try {
    const id = req.nextUrl.pathname.split("/").pop(); // Extract ID from the URL

    const formData = await req.formData();
    const image = formData.get("image"); // Assuming base64 or URL string
    const category = formData.get("category") as string;
    const description = formData.get("description") as string;

    if (!id || !category || !description) {
      return NextResponse.json({ message: "Missing fields", alert: false }, { status: 400 });
    }

    await pool.query(
      `UPDATE gallery SET image = $1, category = $2, description = $3 WHERE id = $4`,
      [image ? image.toString() : null, category, description, id]
    );

    return NextResponse.json({ message: "Gallery item updated successfully", alert: true });
  } catch (error) {
    console.error("PUT error:", error);
    return NextResponse.json({ message: "Failed to update item", alert: false }, { status: 500 });
  }
}

// DELETE: Delete gallery image by ID
export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.pathname.split("/").pop(); // Extract ID

    if (!id) {
      return NextResponse.json({ message: "Invalid ID", alert: false }, { status: 400 });
    }

    await pool.query("DELETE FROM gallery WHERE id = $1", [id]);

    return NextResponse.json({ message: "Image deleted successfully", alert: true });
  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json({ message: "Failed to delete image", alert: false }, { status: 500 });
  }
}
