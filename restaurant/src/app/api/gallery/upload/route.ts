// /app/api/gallery/upload/route.ts
import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const type = formData.get("type") as string;
    const category = formData.get("category") as string;
    const title = formData.get("title") as string;
    const alt = formData.get("alt") as string | null;
    const url = formData.get("url") as string | null;
    const imageFile = formData.get("image") as File | null;
    const videoFile = formData.get("video") as File | null;

    if (!type || !category || !title) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    let src: string | null = null;

    if (type === "image" && imageFile) {
      const imageBuffer = await imageFile.arrayBuffer();
      src = Buffer.from(imageBuffer).toString('base64');
    } else if (type === "video" && videoFile) {
      const videoBuffer = await videoFile.arrayBuffer();
      src = Buffer.from(videoBuffer).toString('base64');
      // Consider storing video files in a dedicated storage and saving the URL instead for scalability
    } else if (type === "youtube" && url) {
      src = url;
    } else {
      return NextResponse.json({ error: 'Invalid media type or missing file/URL' }, { status: 400 });
    }

    await pool.query(
      "INSERT INTO gallery (type, src, alt, title, category) VALUES ($1, $2, $3, $4, $5)",
      [type, src, alt, title, category]
    );

    return NextResponse.json({ message: 'Item uploaded successfully', alert: true }, { status: 201 });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: 'Internal server error', alert: false }, { status: 500 });
  }
}