/**
 * /api/patients/[id] — GET, PUT, DELETE for a single patient
 *
 * All endpoints are protected: requires a valid JWT in the Authorization header.
 */

import { connectdb } from "@/lib/mongodb";
import Patient from "@/models/patients";
import { NextResponse } from "next/server";
import { verifyAuth, unauthorized } from "@/lib/auth";

// GET /api/patients/:id — Fetch one patient
export const GET = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  const user = verifyAuth(req);
  if (!user) return unauthorized();

  await connectdb();
  const { id } = await params;
  const patient = await Patient.findById(id);
  if (!patient) return NextResponse.json({ message: "Patient not found" }, { status: 404 });
  return NextResponse.json(patient);
};

// PUT /api/patients/:id — Update a patient
export const PUT = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  const user = verifyAuth(req);
  if (!user) return unauthorized();

  await connectdb();
  const { id } = await params;
  const body = await req.json();
  const updated = await Patient.findByIdAndUpdate(id, body, { new: true });
  if (!updated) return NextResponse.json({ message: "Patient not found" }, { status: 404 });
  return NextResponse.json(updated);
};

// DELETE /api/patients/:id — Delete a patient
export const DELETE = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  const user = verifyAuth(req);
  if (!user) return unauthorized();

  await connectdb();
  const { id } = await params;
  const deleted = await Patient.findByIdAndDelete(id);
  if (!deleted) return NextResponse.json({ message: "Patient not found" }, { status: 404 });
  return NextResponse.json({ message: "Patient deleted" });
};
