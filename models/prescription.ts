/**
 * models/prescription.ts
 *
 * A prescription is issued by a doctor to a patient.
 * It can optionally be linked to a specific appointment.
 * It contains one or more medicines, each with a name, dose, and duration.
 */

import mongoose from "mongoose";

// Sub-schema: one medicine entry inside a prescription
const medicineSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true }, // e.g. "Amoxicillin 500mg"
    dose:     { type: String, required: true }, // e.g. "1 tablet twice daily"
    duration: { type: String, required: true }, // e.g. "7 days"
  },
  { _id: false } // no separate _id for each medicine entry
);

const prescriptionSchema = new mongoose.Schema(
  {
    // Patient receiving the prescription
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },

    // Optional: linked appointment
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      default: null,
    },

    // Doctor who issued the prescription
    doctor: { type: String, required: true },

    // Date the prescription was issued
    date: { type: Date, required: true },

    // List of medicines prescribed
    medicines: { type: [medicineSchema], required: true },

    // Additional instructions (e.g. "Take after meals", "Avoid alcohol")
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.models.Prescription ??
  mongoose.model("Prescription", prescriptionSchema);
