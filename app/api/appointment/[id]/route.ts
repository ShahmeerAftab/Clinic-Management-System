/**
 * /api/appointment/[id] — PUT (update) and DELETE for a single appointment
 *
 * Both endpoints are protected: requires a valid JWT in the Authorization header.
 */

import { connectdb } from "@/lib/mongodb";
import Appointment from "@/models/appointment";
import { NextResponse } from "next/server";
import { verifyAuth, unauthorized } from "@/lib/auth";

// PUT /api/appointment/:id — Update an appointment
export const PUT = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  const user = verifyAuth(req);
  if (!user) return unauthorized();

  const { id } = await params;
  await connectdb();

  const body = await req.json();
  const updated = await Appointment.findByIdAndUpdate(id, body, { new: true });
  if (!updated) return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
  return NextResponse.json(updated);
};

// DELETE /api/appointment/:id — Delete an appointment
export const DELETE = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  const user = verifyAuth(req);
  if (!user) return unauthorized();

  const { id } = await params;
  await connectdb();

  const deleted = await Appointment.findByIdAndDelete(id);
  if (!deleted) return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
  return NextResponse.json({ message: "Appointment deleted" });
};
