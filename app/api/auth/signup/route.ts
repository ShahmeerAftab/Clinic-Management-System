/**
 * POST /api/auth/signup
 *
 * Creates a new user account.
 *
 * Request body: { name, email, password, role }
 * Response:     { message } on success  |  { message } on error
 */

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/models/user";
import connectDB from "@/lib/mongodb";
import { ensurePatientProfile } from "@/lib/ensurePatient";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { name, email, password, role } = await req.json();

    // Step 1: Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Name, email, and password are required." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters." },
        { status: 400 }
      );
    }

    // Step 2: Check if a user with this email already exists
    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return NextResponse.json(
        { message: "An account with this email already exists." },
        { status: 409 } // 409 Conflict
      );
    }

    // Step 3: Hash the password before saving (never store plain text)
    // bcrypt salt rounds = 10 is the standard secure default
    const hashedPassword = await bcrypt.hash(password, 10);

    // Step 4: Create the user in MongoDB
    const newUser = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: role || "patient",
    });

    // Step 5: If the new user is a patient, auto-create their Patient profile.
    // This prevents the "Patient profile not found" error when they try to
    // book appointments right after signing up.
    if (newUser.role === "patient") {
      await ensurePatientProfile(newUser._id.toString());
    }

    // Step 6: Return success — do NOT return the user object (contains hashed password)
    return NextResponse.json(
      { message: "Account created successfully. Please log in." },
      { status: 201 }
    );
  } catch (error) {
    console.error("[signup]", error);
    return NextResponse.json(
      { message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
