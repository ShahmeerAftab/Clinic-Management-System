/**
 * /api/patient/dashboard — GET stats for the patient's dashboard
 *
 * Returns:
 *  - upcomingCount:       number of Scheduled appointments
 *  - todayAppointments:  list of today's appointments
 *  - recordsCount:       total health records
 *  - prescriptionsCount: total prescriptions
 */

import { connectdb } from "@/lib/mongodb";
import { verifyAuth, unauthorized } from "@/lib/auth";
import Patient from "@/models/patients";
import Appointment from "@/models/appointment";
import HealthRecord from "@/models/healthRecord";
import Prescription from "@/models/prescription";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  // 1. Verify JWT
  const payload = verifyAuth(req);
  if (!payload) return unauthorized();

  await connectdb();

  // 2. Find this user's Patient document
  const patient = await Patient.findOne({ userId: payload.userId });

  // If patient profile doesn't exist yet, return zeroed stats
  if (!patient) {
    return NextResponse.json({
      upcomingCount: 0,
      todayAppointments: [],
      recordsCount: 0,
      prescriptionsCount: 0,
    });
  }

  const patientId = patient._id;

  // 3. Build today's date range (midnight to midnight)
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  // 4. Run all queries in parallel for speed
  const [upcomingCount, todayAppointments, recordsCount, prescriptionsCount] =
    await Promise.all([
      // Count all Scheduled (upcoming) appointments
      Appointment.countDocuments({
        patientID: patientId,
        status: "Scheduled",
      }),

      // Fetch today's appointments (any status)
      Appointment.find({
        patientID: patientId,
        date: { $gte: todayStart, $lte: todayEnd },
      }).sort({ date: 1 }),

      // Count health records
      HealthRecord.countDocuments({ patientId }),

      // Count prescriptions
      Prescription.countDocuments({ patientId }),
    ]);

  return NextResponse.json({
    upcomingCount,
    todayAppointments,
    recordsCount,
    prescriptionsCount,
  });
}
