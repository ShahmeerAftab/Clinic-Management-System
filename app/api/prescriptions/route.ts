/**
 * /api/prescriptions — GET (list) and POST (create)
 *
 * GET:
 *   - Patient role: returns only their own prescriptions
 *   - Doctor/Admin: returns all prescriptions (or filter by ?patientId=)
 *
 * POST:
 *   - Doctor/Admin only: creates a new prescription with one or more medicines
 */

import { connectdb } from "@/lib/mongodb";
import { verifyAuth, unauthorized } from "@/lib/auth";
import Patient from "@/models/patients";
import Prescription from "@/models/prescription";
import { NextResponse } from "next/server";

// GET /api/prescriptions
export async function GET(req: Request) {
  const payload = verifyAuth(req);
  if (!payload) return unauthorized();

  await connectdb();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let filter: Record<string, any> = {};

  if (payload.role === "patient") {
    // Patients only see their own prescriptions
    const patient = await Patient.findOne({ userId: payload.userId });
    if (!patient) return NextResponse.json([]);
    filter.patientId = patient._id;
  } else {
    // Staff can optionally filter by patient
    const url = new URL(req.url);
    const patientId = url.searchParams.get("patientId");
    if (patientId) filter.patientId = patientId;
  }

  const prescriptions = await Prescription.find(filter)
    .populate("patientId", "name") // include patient name
    .sort({ date: -1 })            // newest first
    .lean();

  return NextResponse.json(prescriptions);
}

// POST /api/prescriptions — Issue a new prescription
export async function POST(req: Request) {
  const payload = verifyAuth(req);
  if (!payload) return unauthorized();

  // Only doctors and admins can issue prescriptions
  if (payload.role === "patient") {
    return NextResponse.json(
      { message: "Patients cannot issue prescriptions." },
      { status: 403 }
    );
  }

  await connectdb();

  const body = await req.json();

  // Validate required fields
  if (
    !body.patientId ||
    !body.doctor ||
    !body.date ||
    !body.medicines ||
    body.medicines.length === 0
  ) {
    return NextResponse.json(
      { message: "patientId, doctor, date, and at least one medicine are required." },
      { status: 400 }
    );
  }

  const prescription = await Prescription.create(body);

  // Populate patient name before returning
  await prescription.populate("patientId", "name");

  return NextResponse.json(prescription, { status: 201 });
}
