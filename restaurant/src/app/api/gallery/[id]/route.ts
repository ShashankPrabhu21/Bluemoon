// gallery/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

// PUT: Edit gallery item by ID
export async function PUT(req: NextRequest) {
  try {
    const id = req.nextUrl.pathname.split("/").pop(); // Extract ID from the URL

    const formData = await req.formData();
    const type = formData.get("type") as string;
    const category = formData.get("category") as string;
    const title = formData.get("title") as string;
    const alt = formData.get("alt") as string | null;
    const url = formData.get("url") as string | null;
    const imageFile = formData.get("image") as File | null;
    const videoFile = formData.get("video") as File | null;

    if (!id || !type || !category || !title) {
      return NextResponse.json({ message: "Missing required fields", alert: false }, { status: 400 });
    }

    let src: string | null = null;

    if (type === "image" && imageFile) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      src = buffer.toString("base64");
    } else if (type === "video" && videoFile) {
      const bytes = await videoFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      src = buffer.toString("base64");
      // Consider storing video files in a dedicated storage and saving the URL instead for scalability
    } else if (type === "youtube" && url) {
      src = url;
    } else if (type === "image" && formData.has("src")) {
      src = formData.get("src") as string; // For updating existing images without re-uploading
    }

    if (!src && (type === "image" || type === "video" || type === "youtube") && !formData.has("src")) {
      return NextResponse.json({ message: "Missing media source", alert: false }, { status: 400 });
    }

    await pool.query(
      `UPDATE gallery SET type = $1, category = $2, title = $3, alt = $4, src = $5 WHERE id = $6`,
      [type, category, title, alt, src, id]
    );

    return NextResponse.json({ message: "Gallery item updated successfully", alert: true });
  } catch (error) {
    console.error("PUT error:", error);
    return NextResponse.json({ message: "Failed to update item", alert: false }, { status: 500 });
  }
}

// DELETE: Delete gallery item by ID
export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.pathname.split("/").pop(); // Extract ID

    if (!id) {
      return NextResponse.json({ message: "Invalid ID", alert: false }, { status: 400 });
    }

    await pool.query("DELETE FROM gallery WHERE id = $1", [id]);

    return NextResponse.json({ message: "Item deleted successfully", alert: true });
  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json({ message: "Failed to delete item", alert: false }, { status: 500 });
  }
}