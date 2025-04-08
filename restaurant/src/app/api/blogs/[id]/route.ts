import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

// UPDATE blog by ID
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const blogId = params.id;

    // Parse FormData
    const formData = await req.formData();
    const category = formData.get("category") as string;
    const title = formData.get("title") as string;
    const subtitle = formData.get("subtitle") as string;
    const image = formData.get("image");
    const content: { heading: string; text: string }[] = [];

    // Extract content sections from FormData
    for (const key of formData.keys()) {
      if (key.startsWith("content")) {
        const match = key.match(/content\[(\d+)\]\[(heading|text)\]/);
        if (match) {
          const index = parseInt(match[1]);
          const field = match[2];
          const value = formData.get(key) as string;

          if (!content[index]) {
            content[index] = { heading: "", text: "" };
          }
          if (field === "heading") {
            content[index].heading = value;
          } else if (field === "text") {
            content[index].text = value;
          }
        }
      }
    }

    // Update main blog info
    await pool.query(
      `
        UPDATE blogs
        SET category = $1, title = $2, subtitle = $3, image = $4
        WHERE id = $5
      `,
      [category, title, subtitle, image? image.toString(): null, blogId]
    );

    // Delete old sections (to simplify logic)
    await pool.query(`DELETE FROM blog_sections WHERE blog_id = $1`, [blogId]);

    // Reinsert updated sections
    for (const section of content) {
      await pool.query(
        `
          INSERT INTO blog_sections (blog_id, heading, text)
          VALUES ($1, $2, $3)
        `,
        [blogId, section.heading, section.text]
      );
    }

    return NextResponse.json({ message: "Blog updated successfully", alert:true }); //added alert.
  } catch (error) {
    console.error("PUT error:", error);
    return NextResponse.json({ error: "Failed to update blog", alert:false }, { status: 500 });//added alert.
  }
}

// DELETE – Delete blog
export async function DELETE(req: NextRequest, context: { params: { id: string } }) {
  try {
    const blogId = context.params.id;

    await pool.query(`DELETE FROM blog_sections WHERE blog_id = $1`, [blogId]);
    await pool.query(`DELETE FROM blogs WHERE id = $1`, [blogId]);

    return NextResponse.json({ message: "Blog deleted successfully", alert:true });//added alert.
  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json({ message: "Failed to delete blog", alert:false }, { status: 500 });//added alert.
  }
}