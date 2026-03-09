import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "@/models/user";
import connectDB from "@/lib/mongodb";
import { ensurePatientProfile } from "@/lib/ensurePatient";

export async function POST(req: Request) {

  try {

    await connectDB();

    const { email, password } = await req.json();

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json({ message: "Invalid password" }, { status: 401 });
    }

    // If the user is a patient, make sure they have a Patient profile.
    // This is a safety net for patients who signed up before this fix was applied
    // (their User exists but their Patient doc may not).
    if (user.role === "patient") {
      await ensurePatientProfile(user._id.toString());
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    return NextResponse.json({
      message: "Login successful",
      token,
      role: user.role,
      name: user.name,
    });

  } catch (error) {
    console.error("[login]", error);
    return NextResponse.json({ message: "Login failed" }, { status: 500 });

  }

}