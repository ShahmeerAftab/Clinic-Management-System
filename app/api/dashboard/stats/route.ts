import { NextResponse } from "next/server";
import connectdb from "@/lib/mongodb";
import Patient from "@/models/patients";
import Appointment from "@/models/appointment";

export async function GET() {
  try {
    await connectdb();

    // Start and end of today
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfDay   = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

    const [totalPatients, totalAppointments, todaysAppointments, completedAppointments] =
      await Promise.all([
        Patient.countDocuments(),
        Appointment.countDocuments(),
        Appointment.countDocuments({ date: { $gte: startOfDay, $lt: endOfDay } }),
        Appointment.countDocuments({ status: "Completed" }),
      ]);

    return NextResponse.json({
      totalPatients,
      totalAppointments,
      todaysAppointments,
      completedAppointments,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
