/**
 * /api/patient/me — GET and PUT for a patient's own profile
 *
 * GET: Returns the Patient document linked to the logged-in user.
 *      If no Patient record exists yet, creates one automatically
 *      using the user's name from the User collection (lazy creation).
 *
 * PUT: Updates the patient's own profile (age, gender, contact, etc.)
 */

import { connectdb } from "@/lib/mongodb";
import { verifyAuth, unauthorized } from "@/lib/auth";
import Patient from "@/models/patients";
import User from "@/models/user";
import { NextResponse } from "next/server";

// GET /api/patient/me
export async function GET(req: Request) {
  // 1. Verify the JWT token
  const payload = verifyAuth(req);
  if (!payload) return unauthorized();

  await connectdb();

  // 2. Find the Patient document linked to this user
  let patient = await Patient.findOne({ userId: payload.userId });

  // 3. If no patient record exists, create a minimal one (lazy creation)
  if (!patient) {
    // Look up the user to get their name
    const user = await User.findById(payload.userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Create a basic patient profile — admin can fill in the rest later
    patient = await Patient.create({
      name:      user.name,
      age:       "N/A",
      gender:    "N/A",
      contact:   user.email,
      userId:    payload.userId,
      createdBy: "self",
    });
  }

  return NextResponse.json(patient);
}

// PUT /api/patient/me — Update own profile
export async function PUT(req: Request) {
  const payload = verifyAuth(req);
  if (!payload) return unauthorized();

  await connectdb();

  const body = await req.json();

  const patient = await Patient.findOneAndUpdate(
    { userId: payload.userId },
    { $set: body },
    { new: true } // return the updated document
  );

  if (!patient) {
    return NextResponse.json({ message: "Profile not found" }, { status: 404 });
  }

  return NextResponse.json(patient);
}
