import { connectdb } from "@/lib/mongodb";
import Appointment from "@/models/appointment";
import { NextResponse } from "next/server";
import { verifyAuth, unauthorized } from "@/lib/auth";

const STAFF_ROLES = ["admin", "doctor", "receptionist"];

// doctors see own appointments; admin/receptionist see all
export const GET = async (req: Request) => {
  const user = verifyAuth(req);
  if (!user) return unauthorized();

  if (!STAFF_ROLES.includes(user.role)) {
    return NextResponse.json({ message: "Access denied. Staff only." }, { status: 403 });
  }

  await connectdb();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filter: Record<string, any> = {};
  if (user.role === "doctor") filter.doctorId = user.userId;

  const appointments = await Appointment.find(filter).populate("patientID");
  return NextResponse.json(appointments);
};

// staff only
export const POST = async (req: Request) => {
  const user = verifyAuth(req);
  if (!user) return unauthorized();

  if (!STAFF_ROLES.includes(user.role)) {
    return NextResponse.json({ message: "Access denied. Staff only." }, { status: 403 });
  }

  await connectdb();
  const body = await req.json();
  const newAppointment = await Appointment.create(body);
  return NextResponse.json(newAppointment, { status: 201 });
};
