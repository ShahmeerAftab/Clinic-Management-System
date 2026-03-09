/**
 * models/healthRecord.ts
 *
 * A health record represents a single medical visit or document
 * (e.g. Lab Report, X-Ray, Discharge Summary) for a patient.
 *
 * Doctors and admins create records; patients can only view their own.
 */

import mongoose from "mongoose";

const healthRecordSchema = new mongoose.Schema(
  {
    // Which patient this record belongs to
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },

    // Title of the record (e.g. "Complete Blood Count")
    title: { type: String, required: true },

    // Type of document
    type: {
      type: String,
      enum: ["Lab Report", "Imaging", "Prescription", "Discharge Summary", "Other"],
      required: true,
    },

    // Doctor who created / signed this record
    doctor: { type: String, required: true },

    // Hospital or clinic where the visit took place
    hospital: { type: String, default: "" },

    // Date the patient visited or the test was done
    visitDate: { type: Date, required: true },

    // Diagnosis or findings
    diagnosis: { type: String, default: "" },

    // Additional clinical notes
    notes: { type: String, default: "" },
  },
  { timestamps: true } // adds createdAt and updatedAt automatically
);

export default mongoose.models.HealthRecord ??
  mongoose.model("HealthRecord", healthRecordSchema);
