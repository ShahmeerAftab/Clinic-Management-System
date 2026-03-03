// ─────────────────────────────────────────────────────────────────────────────
// AppointmentManager.tsx
//
// This component handles all appointment management in one file:
//   List → shows all appointments as cards with a status badge
//   Book → form to create a new appointment
//
// Status flow:  pending → confirmed → completed
// Each appointment card shows an action button to advance the status.
//
// Used by admin, doctor, and receptionist pages.
// ─────────────────────────────────────────────────────────────────────────────
"use client";

import { useState } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// TYPE DEFINITIONS
// ─────────────────────────────────────────────────────────────────────────────

// A single appointment record
type Appointment = {
  id: number;
  patientName: string;
  doctorName: string;
  date: string;
  status: "pending" | "confirmed" | "completed";
};

// The two "screens" this component can show
type Mode = "list" | "book";

// Props received from the page that renders this component
type Props = {
  role: string; // "admin" | "doctor" | "receptionist"
};

// ─────────────────────────────────────────────────────────────────────────────
// SAMPLE DATA — pre-seeded so the list isn't empty on first load
// ─────────────────────────────────────────────────────────────────────────────
const SAMPLE_APPOINTMENTS: Appointment[] = [
  { id: 1, patientName: "Ali Hassan",    doctorName: "Dr. Sarah Ahmed",  date: "2026-03-05", status: "confirmed"  },
  { id: 2, patientName: "Sara Malik",    doctorName: "Dr. Omar Sheikh",  date: "2026-03-06", status: "pending"    },
  { id: 3, patientName: "Ahmed Khan",    doctorName: "Dr. Sarah Ahmed",  date: "2026-03-07", status: "pending"    },
  { id: 4, patientName: "Zara Siddiqui", doctorName: "Dr. Bilal Hassan", date: "2026-03-04", status: "completed"  },
];

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function AppointmentManager({ role }: Props) {

  // ── STATE ──────────────────────────────────────────────────────────────────

  const [appointments, setAppointments] = useState<Appointment[]>(SAMPLE_APPOINTMENTS);
  const [mode, setMode]                 = useState<Mode>("list"); // current screen

  // Form fields for booking a new appointment
  const [formPatient, setFormPatient] = useState("");
  const [formDoctor,  setFormDoctor]  = useState("");
  const [formDate,    setFormDate]    = useState("");
  const [formStatus,  setFormStatus]  = useState<"pending" | "confirmed">("pending");

  // ── HELPERS ────────────────────────────────────────────────────────────────

  // Reset the booking form fields to empty
  function clearForm() {
    setFormPatient("");
    setFormDoctor("");
    setFormDate("");
    setFormStatus("pending");
  }

  // Returns Tailwind CSS classes for the status badge colour.
  // pending   = yellow   confirmed = blue   completed = green
  function statusBadgeClass(status: string) {
    if (status === "pending")   return "bg-yellow-50 text-yellow-700 border border-yellow-200";
    if (status === "confirmed") return "bg-blue-50 text-blue-700 border border-blue-200";
    if (status === "completed") return "bg-emerald-50 text-emerald-700 border border-emerald-200";
    return "bg-gray-100 text-gray-600";
  }

  // ── BOOK ───────────────────────────────────────────────────────────────────

  function handleBook(e: React.FormEvent) {
    e.preventDefault(); // stop page reload

    // Generate a new unique ID
    const newId = appointments.length > 0
      ? Math.max(...appointments.map((a) => a.id)) + 1
      : 1;

    const newAppt: Appointment = {
      id:          newId,
      patientName: formPatient,
      doctorName:  formDoctor,
      date:        formDate,
      status:      formStatus,
    };

    setAppointments([newAppt, ...appointments]); // add to the top of the list
    clearForm();
    setMode("list");
  }

  // ── STATUS UPDATE ──────────────────────────────────────────────────────────
  // Each click advances the status one step forward:
  //   pending → confirmed → completed
  // Once completed, the button disappears (no more advances).

  function updateStatus(id: number) {
    setAppointments(appointments.map((appt) => {
      if (appt.id !== id) return appt; // leave other appointments unchanged

      if (appt.status === "pending")   return { ...appt, status: "confirmed"  as const };
      if (appt.status === "confirmed") return { ...appt, status: "completed"  as const };
      return appt; // already completed — no further change
    }));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div>

      {/* ═══════════════════════════════════════════════════════════════════
          LIST MODE — shows all appointments as cards
          ═══════════════════════════════════════════════════════════════════ */}
      {mode === "list" && (
        <div>

          {/* Appointment count + Book button */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-gray-500">
              {appointments.length} appointment(s) total
            </p>
            <button
              onClick={() => { clearForm(); setMode("book"); }}
              className="px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors"
            >
              + Book Appointment
            </button>
          </div>

          {/* ── Appointment cards ─────────────────────────────────────────
              Each card shows: patient name + status badge | doctor | date | action
              ─────────────────────────────────────────────────────────────── */}
          <div className="space-y-3">
            {appointments.map((appt) => (
              <div
                key={appt.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
              >

                {/* Left side: patient name, status badge, doctor, date */}
                <div className="flex flex-col gap-1.5">
                  {/* Name + status badge on the same line */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-gray-900">{appt.patientName}</span>
                    <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full capitalize ${statusBadgeClass(appt.status)}`}>
                      {appt.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">👨‍⚕️ {appt.doctorName}</p>
                  <p className="text-sm text-gray-500">📅 {appt.date}</p>
                </div>

                {/* Right side: action button — changes based on current status */}
                <div className="shrink-0">

                  {/* Pending → show "Confirm" button */}
                  {appt.status === "pending" && (
                    <button
                      onClick={() => updateStatus(appt.id)}
                      className="px-4 py-2 text-sm font-medium rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                    >
                      Confirm →
                    </button>
                  )}

                  {/* Confirmed → show "Mark Complete" button */}
                  {appt.status === "confirmed" && (
                    <button
                      onClick={() => updateStatus(appt.id)}
                      className="px-4 py-2 text-sm font-medium rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                    >
                      Mark Complete ✓
                    </button>
                  )}

                  {/* Completed → no button, just a text label */}
                  {appt.status === "completed" && (
                    <span className="text-sm text-gray-400 font-medium">
                      ✅ Done
                    </span>
                  )}
                </div>
              </div>
            ))}

            {/* Empty state — shown when there are no appointments */}
            {appointments.length === 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
                <div className="text-3xl mb-3">📅</div>
                <p className="text-sm font-medium text-gray-600">No appointments yet</p>
                <p className="text-xs text-gray-400 mt-1">Click + Book Appointment to schedule one.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          BOOK MODE — form to create a new appointment
          ═══════════════════════════════════════════════════════════════════ */}
      {mode === "book" && (
        <div className="max-w-lg">

          {/* Back link */}
          <button
            onClick={() => { clearForm(); setMode("list"); }}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors"
          >
            ← Back to Appointments
          </button>

          {/* Form card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Book New Appointment</h3>

            <form onSubmit={handleBook} className="space-y-4">

              {/* Patient Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Patient Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ali Hassan"
                  value={formPatient}
                  onChange={(e) => setFormPatient(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Doctor Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Doctor Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Sarah Ahmed"
                  value={formDoctor}
                  onChange={(e) => setFormDoctor(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Appointment Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Appointment Date
                </label>
                <input
                  type="date"
                  required
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>

              {/* Initial Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Initial Status
                </label>
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value as "pending" | "confirmed")}
                  className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                </select>
              </div>

              {/* Submit + Cancel */}
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors"
                >
                  Book Appointment
                </button>
                <button
                  type="button"
                  onClick={() => { clearForm(); setMode("list"); }}
                  className="px-5 py-2.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
