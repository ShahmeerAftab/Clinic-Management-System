/**
 * /api/patients — GET (list all) and POST (create new)
 *
 * Both endpoints are protected: the client must send a valid JWT
 * in the "Authorization: Bearer <token>" header.
 */

import { connectdb } from "@/lib/mongodb";
import Patient from "@/models/patients";
import { NextResponse } from "next/server";
import { verifyAuth, unauthorized } from "@/lib/auth";

// GET /api/patients — Fetch all patients
export const GET = async (req: Request) => {
  // Step 1: Verify the JWT. If missing or invalid, return 401.
  const user = verifyAuth(req);
  if (!user) return unauthorized();

  // Step 2: Fetch and return all patients
  await connectdb();
  const patients = await Patient.find();
  return NextResponse.json(patients);
};

// POST /api/patients — Create a new patient
export const POST = async (req: Request) => {
  // Step 1: Verify the JWT
  const user = verifyAuth(req);
  if (!user) return unauthorized();

  // Step 2: Create the patient
  await connectdb();
  const body = await req.json();
  const newPatient = await Patient.create(body);
  return NextResponse.json(newPatient, { status: 201 });
};
