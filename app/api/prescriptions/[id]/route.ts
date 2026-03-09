/**
 * /api/prescriptions/[id] — GET and DELETE for a single prescription
 */

import { connectdb } from "@/lib/mongodb";
import { verifyAuth, unauthorized } from "@/lib/auth";
import Prescription from "@/models/prescription";
import { NextResponse } from "next/server";

// GET /api/prescriptions/[id]
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const payload = verifyAuth(req);
  if (!payload) return unauthorized();

  const { id } = await params;

  await connectdb();

  const prescription = await Prescription.findById(id)
    .populate("patientId", "name")
    .lean();

  if (!prescription) {
    return NextResponse.json({ message: "Prescription not found" }, { status: 404 });
  }

  return NextResponse.json(prescription);
}

// DELETE /api/prescriptions/[id] — Doctor/admin only
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const payload = verifyAuth(req);
  if (!payload) return unauthorized();

  if (payload.role === "patient") {
    return NextResponse.json({ message: "Access denied." }, { status: 403 });
  }

  const { id } = await params;

  await connectdb();

  const prescription = await Prescription.findByIdAndDelete(id);

  if (!prescription) {
    return NextResponse.json({ message: "Prescription not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Prescription deleted successfully." });
}
