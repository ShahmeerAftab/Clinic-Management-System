"use client";

import { useState } from "react";

// Dummy data
const dummyAppointments = [
  { id: 1, doctor: "Dr. Ahmed", date: "2026-03-01 10:00 AM", status: "Completed" },
  { id: 2, doctor: "Dr. Sara", date: "2026-03-05 2:00 PM", status: "Pending" },
];

const dummyPrescriptions = [
  { id: 1, doctor: "Dr. Ahmed", medicine: "Paracetamol", dosage: "2/day", notes: "Take after meals", date: "2026-03-01 10:30 AM" },
];

export default function PatientProfilePage() {
  const [appointments] = useState(dummyAppointments);
  const [prescriptions] = useState(dummyPrescriptions);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Patient Profile</h1>

      {/* ── Medical History Timeline ── */}
      <h2 className="text-xl font-semibold mb-4">Medical History Timeline</h2>

      <div className="space-y-4">
        {appointments.map(a => (
          <div key={a.id} className="border-l-4 border-blue-500 pl-4 py-2">
            <p><strong>Appointment with:</strong> {a.doctor}</p>
            <p><strong>Date:</strong> {a.date}</p>
            <p><strong>Status:</strong> {a.status}</p>
          </div>
        ))}

        {prescriptions.map(p => (
          <div key={p.id} className="border-l-4 border-green-500 pl-4 py-2">
            <p><strong>Doctor:</strong> {p.doctor}</p>
            <p><strong>Medicine:</strong> {p.medicine}</p>
            <p><strong>Dosage:</strong> {p.dosage}</p>
            <p><strong>Notes:</strong> {p.notes}</p>
            <p className="text-xs text-gray-500">{p.date}</p>
          </div>
        ))}

        {appointments.length === 0 && prescriptions.length === 0 && <p>No history available.</p>}
      </div>
    </div>
  );
}