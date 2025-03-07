import connectDB from "@/lib/mongodb";
import User from "@/models/user";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDB();

    const { user_id, name, email, password, role, status, is_signed_up, is_signed_in, login_time, logout_time } = await req.json();

    const newUser = new User({
      user_id,
      name,
      email,
      password,
      role,
      status,
      is_signed_up,
      is_signed_in,
      login_time,
      logout_time,
    });

    await newUser.save();

    return NextResponse.json({ message: "User added successfully!" }, { status: 201 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
