// /app/api/gallery/upload/route.ts
import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const type = formData.get("type") as string;
        const category = formData.get("category") as string;
        const title = formData.get("title") as string;
        const alt = formData.get("alt") as string | null;
        const youtubeUrl = formData.get("url") as string | null; // Get YouTube URL from formData
        const imageFile = formData.get("image") as File | null;
        const videoFile = formData.get("video") as File | null;
        const srcFromFrontend = formData.get("src") as string | null; // Get the Cloudinary URL if frontend uploaded

        if (!type || !category || !title) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        let src: string | null = null;

        if (srcFromFrontend) {
            src = srcFromFrontend; // Use the URL sent from the frontend
        } else if (type === "image" && imageFile) {
            try {
                const buffer = await imageFile.arrayBuffer();
                const bytes = new Uint8Array(buffer);
                const result = await cloudinary.uploader.upload(`data:${imageFile.type};base64,${Buffer.from(bytes).toString('base64')}`, {
                    folder: 'gallery', // Optional: Store images in a 'gallery' folder
                });
                src = result.secure_url;
            } catch (error) {
                console.error("Cloudinary image upload error:", error);
                return NextResponse.json({ error: 'Failed to upload image to Cloudinary' }, { status: 500 });
            }
        } else if (type === "video" && videoFile) {
            try {
                const buffer = await videoFile.arrayBuffer();
                const bytes = new Uint8Array(buffer);
                const result = await cloudinary.uploader.upload(`data:${videoFile.type};base64,${Buffer.from(bytes).toString('base64')}`, {
                    resource_type: 'video',
                    folder: 'gallery', // Optional: Store videos in a 'gallery' folder
                });
                src = result.secure_url;
            } catch (error) {
                console.error("Cloudinary video upload error:", error);
                return NextResponse.json({ error: 'Failed to upload video to Cloudinary' }, { status: 500 });
            }
            // Storing video as base64 in the database is not recommended for scalability.
            // Consider uploading to Cloudinary and saving the URL.
        } else if (type === "youtube" && youtubeUrl) {
            src = youtubeUrl;
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