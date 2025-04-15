// /app/api/gallery/upload/route.ts
import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const imageFile = formData.get("image") as File;
    const category = formData.get("category") as string;
    const title = formData.get("title") as string;
    const alt = formData.get("alt") as string;

    if (!imageFile) {
      return NextResponse.json({ error: 'Image is required' }, { status: 400 });
    }

    const imageBuffer = await imageFile.arrayBuffer();
    const imageBase64 = Buffer.from(imageBuffer).toString('base64');

    await pool.query(
      "INSERT INTO gallery (src, alt, title, category) VALUES ($1, $2, $3, $4)",
      [imageBase64, alt, title, category]
    );

    return NextResponse.json({ message: 'Image uploaded successfully', alert: true }, { status: 201 });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: 'Internal server error', alert: false }, { status: 500 });
  }
}