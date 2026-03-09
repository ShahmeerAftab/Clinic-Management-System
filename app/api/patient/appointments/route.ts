/**
 * /api/patient/appointments — GET (own appointments) and POST (book new)
 *
 * GET: Returns all appointments for the logged-in patient,
 *      sorted so "Scheduled" ones appear first, then by date.
 *
 * POST: Books a new appointment for the logged-in patient.
 */

import { connectdb } from "@/lib/mongodb";
import { verifyAuth, unauthorized } from "@/lib/auth";
import Patient from "@/models/patients";
import Appointment from "@/models/appointment";
import { NextResponse } from "next/server";
import { ensurePatientProfile } from "@/lib/ensurePatient";

// GET /api/patient/appointments
export async function GET(req: Request) {
  const payload = verifyAuth(req);
  if (!payload) return unauthorized();

  await connectdb();

  // Find the patient profile linked to this user
  const patient = await Patient.findOne({ userId: payload.userId });
  if (!patient) return NextResponse.json([]);

  // Fetch all appointments for this patient, newest first
  const appointments = await Appointment.find({ patientID: patient._id })
    .sort({ date: -1 })
    .lean();

  return NextResponse.json(appointments);
}

// POST /api/patient/appointments — Book a new appointment
export async function POST(req: Request) {
  const payload = verifyAuth(req);
  if (!payload) return unauthorized();

  await connectdb();

  // Get (or auto-create) the patient's profile.
  // ensurePatientProfile will create a basic Patient doc if one doesn't exist yet,
  // so patients can book appointments immediately after signing up.
  const patient = await ensurePatientProfile(payload.userId);

  const body = await req.json();

  // Validate required fields
  if (!body.doctor || !body.date || !body.time) {
    return NextResponse.json(
      { message: "Doctor, date, and time are required." },
      { status: 400 }
    );
  }

  // Create the appointment — status defaults to "Scheduled"
  const appointment = await Appointment.create({
    patientID: patient._id,
    doctor:    body.doctor,
    date:      body.date,
    time:      body.time,
    reason:    body.reason || "",
    status:    "Scheduled",
  });

  return NextResponse.json(appointment, { status: 201 });
}
