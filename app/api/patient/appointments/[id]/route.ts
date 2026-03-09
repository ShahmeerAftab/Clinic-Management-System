/**
 * /api/patient/appointments/[id] — PUT (update) and DELETE (cancel/remove)
 *
 * Patients can only modify their OWN appointments.
 * The query ensures patientID matches before updating or deleting.
 */

import { connectdb } from "@/lib/mongodb";
import { verifyAuth, unauthorized } from "@/lib/auth";
import Patient from "@/models/patients";
import Appointment from "@/models/appointment";
import { NextResponse } from "next/server";

// PUT /api/patient/appointments/[id] — Update status (e.g. cancel)
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const payload = verifyAuth(req);
  if (!payload) return unauthorized();

  const { id } = await params;

  await connectdb();

  const patient = await Patient.findOne({ userId: payload.userId });
  if (!patient) {
    return NextResponse.json({ message: "Patient not found" }, { status: 404 });
  }

  const body = await req.json();

  // Only update if the appointment belongs to this patient
  const appointment = await Appointment.findOneAndUpdate(
    { _id: id, patientID: patient._id },
    { $set: body },
    { new: true }
  );

  if (!appointment) {
    return NextResponse.json(
      { message: "Appointment not found or access denied" },
      { status: 404 }
    );
  }

  return NextResponse.json(appointment);
}

// DELETE /api/patient/appointments/[id] — Cancel/remove an appointment
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const payload = verifyAuth(req);
  if (!payload) return unauthorized();

  const { id } = await params;

  await connectdb();

  const patient = await Patient.findOne({ userId: payload.userId });
  if (!patient) {
    return NextResponse.json({ message: "Patient not found" }, { status: 404 });
  }

  // Only delete if the appointment belongs to this patient
  const appointment = await Appointment.findOneAndDelete({
    _id: id,
    patientID: patient._id,
  });

  if (!appointment) {
    return NextResponse.json(
      { message: "Appointment not found or access denied" },
      { status: 404 }
    );
  }

  return NextResponse.json({ message: "Appointment cancelled successfully." });
}
