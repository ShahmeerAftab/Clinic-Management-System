/**
 * /api/health-records — GET (list) and POST (create)
 *
 * GET:
 *   - Patient role: returns only their own records
 *   - Doctor/Admin/Receptionist: returns all records (or filter by ?patientId=)
 *
 * POST:
 *   - Doctor/Admin only: creates a new health record for a patient
 */

import { connectdb } from "@/lib/mongodb";
import { verifyAuth, unauthorized } from "@/lib/auth";
import Patient from "@/models/patients";
import HealthRecord from "@/models/healthRecord";
import { NextResponse } from "next/server";

// GET /api/health-records
export async function GET(req: Request) {
  const payload = verifyAuth(req);
  if (!payload) return unauthorized();

  await connectdb();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let filter: Record<string, any> = {};

  if (payload.role === "patient") {
    // Patients only see their own records
    const patient = await Patient.findOne({ userId: payload.userId });
    if (!patient) return NextResponse.json([]);
    filter.patientId = patient._id;
  } else {
    // Staff can optionally filter by a specific patient
    const url = new URL(req.url);
    const patientId = url.searchParams.get("patientId");
    if (patientId) filter.patientId = patientId;
  }

  const records = await HealthRecord.find(filter)
    .populate("patientId", "name") // include patient name in the response
    .sort({ visitDate: -1 })       // newest visit first
    .lean();

  return NextResponse.json(records);
}

// POST /api/health-records — Create a new health record
export async function POST(req: Request) {
  const payload = verifyAuth(req);
  if (!payload) return unauthorized();

  // Only doctors and admins can create health records
  if (payload.role === "patient") {
    return NextResponse.json(
      { message: "Patients cannot create health records." },
      { status: 403 }
    );
  }

  await connectdb();

  const body = await req.json();

  // Validate required fields
  if (!body.patientId || !body.title || !body.type || !body.doctor || !body.visitDate) {
    return NextResponse.json(
      { message: "patientId, title, type, doctor, and visitDate are required." },
      { status: 400 }
    );
  }

  const record = await HealthRecord.create(body);
  return NextResponse.json(record, { status: 201 });
}
