/**
 * /api/appointment — GET (list all) and POST (create new)
 *
 * Both endpoints are protected: requires a valid JWT in the Authorization header.
 */

import { connectdb } from "@/lib/mongodb";
import Appointment from "@/models/appointment";
import { NextResponse } from "next/server";
import { verifyAuth, unauthorized } from "@/lib/auth";

// GET /api/appointment — Fetch all appointments (with patient data populated)
export const GET = async (req: Request) => {
  const user = verifyAuth(req);
  if (!user) return unauthorized();

  await connectdb();
  const appointments = await Appointment.find().populate("patientID");
  return NextResponse.json(appointments);
};

// POST /api/appointment — Create a new appointment
export const POST = async (req: Request) => {
  const user = verifyAuth(req);
  if (!user) return unauthorized();

  await connectdb();
  const body = await req.json();
  const newAppointment = await Appointment.create(body);
  return NextResponse.json(newAppointment, { status: 201 });
};
