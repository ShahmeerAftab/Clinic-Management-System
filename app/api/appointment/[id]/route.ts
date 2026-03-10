import { connectdb } from "@/lib/mongodb";
import Appointment from "@/models/appointment";
import { NextResponse } from "next/server";
import { verifyAuth, unauthorized } from "@/lib/auth";

const STAFF_ROLES = ["admin", "doctor", "receptionist"];

// staff only
export const PUT = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  const user = verifyAuth(req);
  if (!user) return unauthorized();
  if (!STAFF_ROLES.includes(user.role)) {
    return NextResponse.json({ message: "Access denied. Staff only." }, { status: 403 });
  }

  const { id } = await params;
  await connectdb();

  const body = await req.json();
  const updated = await Appointment.findByIdAndUpdate(id, body, { new: true });
  if (!updated) return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
  return NextResponse.json(updated);
};

// staff only
export const DELETE = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  const user = verifyAuth(req);
  if (!user) return unauthorized();
  if (!STAFF_ROLES.includes(user.role)) {
    return NextResponse.json({ message: "Access denied. Staff only." }, { status: 403 });
  }

  const { id } = await params;
  await connectdb();

  const deleted = await Appointment.findByIdAndDelete(id);
  if (!deleted) return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
  return NextResponse.json({ message: "Appointment deleted" });
};
