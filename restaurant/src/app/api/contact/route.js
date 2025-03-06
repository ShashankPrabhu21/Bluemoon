import connectDB from "@/lib/mongodb"; 
import ContactMessage from "@/models/ContactMessage";
import { NextResponse } from "next/server";

// Handle POST request (Save Contact Message)
export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    const { name, email, phone, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newMessage = new ContactMessage({ name, email, phone, subject, message });
    await newMessage.save();

    return NextResponse.json({ message: "Message saved successfully" }, { status: 200 });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

// Handle GET request (Fetch all messages)
export async function GET() {
  try {
    await connectDB();
    const messages = await ContactMessage.find();
    return NextResponse.json(messages, { status: 200 });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
