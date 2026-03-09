"use client";

import { useEffect, useState } from "react";
import type { Appointment, Patient, PopulatedPatient } from "@/types";
import { useToast } from "@/components/ui/Toast";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { ConfirmModal } from "@/components/ui/Modal";
import AppointmentList from "./AppointmentList";
import AppointmentForm from "./AppointmentForm";

type Mode = "list" | "book";

export default function AppointmentManager({ role }: { role: string }) {
  const toast = useToast();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients,     setPatients]     = useState<Patient[]>([]);
  const [mode,         setMode]         = useState<Mode>("list");
  const [editingId,    setEditingId]    = useState<string | null>(null);
  const [submitting,   setSubmitting]   = useState(false);

  /* Delete confirmation */
  const [deleteTarget,  setDeleteTarget]  = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [formPatient,  setFormPatient]  = useState("");
  const [formDob,      setFormDob]      = useState("");
  const [formDoctor,   setFormDoctor]   = useState("");
  const [formDate,     setFormDate]     = useState("");
  const [formTime,     setFormTime]     = useState("");
  const [formReason,   setFormReason]   = useState("");
  const [formStatus,   setFormStatus]   = useState<"Scheduled" | "Cancelled">("Scheduled");
  const [patientError, setPatientError] = useState("");

  useEffect(() => {
    fetchWithAuth("/api/appointment")
      .then((r) => r.json())
      .then((data) => setAppointments(Array.isArray(data) ? data.filter(Boolean) : []))
      .catch(console.error);

    fetchWithAuth("/api/patients")
      .then((r) => r.json())
      .then(setPatients)
      .catch(console.error);
  }, []);

  function clearForm() {
    setFormPatient(""); setFormDob(""); setFormDoctor(""); setFormDate("");
    setFormTime(""); setFormReason(""); setFormStatus("Scheduled");
    setPatientError(""); setEditingId(null);
  }

  function openBook()   { clearForm(); setMode("book"); }
  function backToList() { clearForm(); setMode("list"); }

  function handleEditOpen(id: string) {
    const appt = appointments.find((a) => a._id === id);
    if (!appt) return;
    setFormPatient(
      typeof appt.patientID === "object" && appt.patientID !== null
        ? appt.patientID._id
        : appt.patientID ?? "",
    );
    setFormDoctor(appt.doctor);
    setFormDate(appt.date);
    setFormTime(appt.time);
    setFormReason(appt.reason);
    setFormStatus(appt.status === "Cancelled" ? "Cancelled" : "Scheduled");
    setEditingId(id);
    setMode("book");
  }

  async function handleBook(e: React.FormEvent) {
    e.preventDefault();
    if (!formPatient) { setPatientError("Please select a patient from the list."); return; }
    setPatientError("");
    setSubmitting(true);

    const payload = { patientID: formPatient, doctor: formDoctor, date: formDate, time: formTime, reason: formReason, status: formStatus };

    try {
      if (editingId !== null) {
        const res = await fetchWithAuth(`/api/appointment/${editingId}`, {
          method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
        });
        const updated = await res.json();
        setAppointments((prev) => prev.map((a) => (a._id === editingId ? updated : a)));
        toast.success("Appointment updated.");
      } else {
        const res = await fetchWithAuth("/api/appointment", {
          method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
        });
        const newAppt = await res.json();
        setAppointments((prev) => [newAppt, ...prev]);
        toast.success("Appointment booked successfully.");
      }
      clearForm(); setMode("list");
    } catch (err) {
      toast.error("Could not save appointment. Please try again.");
    } finally { setSubmitting(false); }
  }

  /* Delete (opens confirm modal) */
  function requestDelete(id: string) { setDeleteTarget(id); }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      const res = await fetchWithAuth(`/api/appointment/${deleteTarget}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setAppointments((prev) => prev.filter((a) => a._id !== deleteTarget));
      toast.success("Appointment deleted.");
    } catch {
      toast.error("Could not delete appointment.");
    } finally {
      setDeleteLoading(false);
      setDeleteTarget(null);
    }
  }

  async function updateStatus(id: string) {
    const appt = appointments.find((a) => a._id === id);
    if (!appt || appt.status !== "Scheduled") return;
    try {
      const res = await fetchWithAuth(`/api/appointment/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...appt, status: "Completed",
          patientID:
            typeof appt.patientID === "object" && appt.patientID !== null
              ? (appt.patientID as PopulatedPatient)._id
              : appt.patientID,
        }),
      });
      const updated = await res.json();
      setAppointments((prev) => prev.map((a) => (a._id === id ? updated : a)));
      toast.success("Appointment marked as completed.");
    } catch {
      toast.error("Could not update appointment status.");
    }
  }

  const sortedAppointments = [...appointments].sort((a, b) => {
    const aScheduled = a.status === "Scheduled";
    const bScheduled = b.status === "Scheduled";
    if (aScheduled && !bScheduled) return -1;
    if (!aScheduled && bScheduled) return 1;
    if (aScheduled && bScheduled) {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    }
    return 0;
  });

  return (
    <>
      {/* Delete confirm modal */}
      <ConfirmModal
        open={deleteTarget !== null}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        loading={deleteLoading}
        title="Delete Appointment"
        description="This will permanently remove the appointment. This cannot be undone."
        confirmLabel="Delete Appointment"
        danger
      />

      {mode === "list" && (
        <AppointmentList
          appointments={sortedAppointments}
          patients={patients}
          onBook={openBook}
          onEdit={handleEditOpen}
          onDelete={requestDelete}
          onUpdateStatus={updateStatus}
        />
      )}

      {mode === "book" && (
        <AppointmentForm
          editingId={editingId}
          patients={patients}
          formPatient={formPatient}
          formDob={formDob}
          formDoctor={formDoctor}
          formDate={formDate}
          formTime={formTime}
          formReason={formReason}
          formStatus={formStatus}
          patientError={patientError}
          submitting={submitting}
          onPatientChange={(id, dob) => { setFormPatient(id); setFormDob(dob); if (id) setPatientError(""); }}
          onDoctorChange={setFormDoctor}
          onDateChange={setFormDate}
          onTimeChange={setFormTime}
          onReasonChange={setFormReason}
          onStatusChange={setFormStatus}
          onSubmit={handleBook}
          onCancel={backToList}
        />
      )}
    </>
  );
}
