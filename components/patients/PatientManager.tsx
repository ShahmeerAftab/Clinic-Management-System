"use client";

import { useEffect, useState } from "react";
import type { Patient } from "@/types";
import { useToast } from "@/components/ui/Toast";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { ConfirmModal } from "@/components/ui/Modal";
import { SectionLoader } from "@/components/ui/Spinner";
import PatientList from "./PatientList";
import PatientForm from "./PatientForm";
import PatientView from "./PatientView";

type Mode = "list" | "add" | "edit" | "view";

export default function PatientManager({ role }: { role: string }) {
  const toast = useToast();

  const [patients,        setPatients]        = useState<Patient[]>([]);
  const [mode,            setMode]            = useState<Mode>("list");
  const [searchQuery,     setSearchQuery]     = useState("");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [loading,         setLoading]         = useState(true);
  const [error,           setError]           = useState<string | null>(null);
  const [formError,       setFormError]       = useState<string | null>(null);
  const [submitting,      setSubmitting]      = useState(false);

  /* Delete confirmation modal */
  const [deleteTarget,  setDeleteTarget]  = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [formName,    setFormName]    = useState("");
  const [formAge,     setFormAge]     = useState("");
  const [formGender,  setFormGender]  = useState("Male");
  const [formContact, setFormContact] = useState("");

  /* ── Fetch patients ── */
  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(new Error("timeout")), 15000);

    async function fetchPatients() {
      try {
        const res = await fetchWithAuth("/api/patients", { signal: controller.signal });
        clearTimeout(timeout);
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error ?? `HTTP ${res.status}`);
        }
        const data: Patient[] = await res.json();
        if (!cancelled) setPatients(data);
      } catch (err: any) {
        clearTimeout(timeout);
        if (cancelled) return;
        setError(
          err.name === "AbortError"
            ? "Request timed out. Check your MongoDB Atlas connection."
            : (err.message ?? "Could not load patients."),
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchPatients();
    return () => { cancelled = true; clearTimeout(timeout); controller.abort(); };
  }, []);

  const filteredPatients = patients.filter((p) =>
    p.name?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  function clearForm() {
    setFormName(""); setFormAge(""); setFormGender("Male"); setFormContact("");
    setSelectedPatient(null); setFormError(null);
  }

  function openAdd()            { clearForm(); setMode("add"); }
  function openEdit(p: Patient) {
    setSelectedPatient(p);
    setFormName(p.name); setFormAge(p.age); setFormGender(p.gender); setFormContact(p.contact);
    setMode("edit");
  }
  function openView(p: Patient) { setSelectedPatient(p); setMode("view"); }
  function backToList()         { clearForm(); setMode("list"); }

  /* ── Add ── */
  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);
    try {
      const res  = await fetchWithAuth("/api/patients", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formName, age: formAge, gender: formGender, contact: formContact, createdBy: role }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? `HTTP ${res.status}`);
      if (body.name) setPatients((prev) => [body, ...prev]);
      clearForm(); setMode("list");
      toast.success("Patient added successfully.");
    } catch (err: any) {
      const msg = err.message ?? "Could not save patient.";
      setFormError(msg); toast.error(msg);
    } finally { setSubmitting(false); }
  }

  /* ── Edit ── */
  async function handleEdit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);
    try {
      const res  = await fetchWithAuth(`/api/patients/${selectedPatient!._id}`, {
        method:  "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formName, age: formAge, gender: formGender, contact: formContact }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? `HTTP ${res.status}`);
      setPatients((prev) => prev.map((p) => (p._id === body._id ? body : p)));
      clearForm(); setMode("list");
      toast.success("Patient updated successfully.");
    } catch (err: any) {
      const msg = err.message ?? "Could not update patient.";
      setFormError(msg); toast.error(msg);
    } finally { setSubmitting(false); }
  }

  /* ── Delete (opens confirm modal) ── */
  function requestDelete(id: string) { setDeleteTarget(id); }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      const res  = await fetchWithAuth(`/api/patients/${deleteTarget}`, { method: "DELETE" });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? `HTTP ${res.status}`);
      setPatients((prev) => prev.filter((p) => p._id !== deleteTarget));
      toast.success("Patient deleted.");
    } catch (err: any) {
      toast.error(err.message ?? "Could not delete patient.");
    } finally {
      setDeleteLoading(false);
      setDeleteTarget(null);
    }
  }

  /* ── States ── */
  if (loading) return <SectionLoader message="Loading patients…" />;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 max-w-sm mx-auto text-center">
        <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center">
          <svg className="w-6 h-6 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div>
          <p className="font-semibold text-gray-900">Failed to load patients</p>
          <p className="text-sm text-gray-500 mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Delete confirmation modal */}
      <ConfirmModal
        open={deleteTarget !== null}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        loading={deleteLoading}
        title="Delete Patient"
        description="This will permanently remove the patient record and all associated data. This cannot be undone."
        confirmLabel="Delete Patient"
        danger
      />

      {mode === "list" && (
        <PatientList
          patients={patients}
          filteredPatients={filteredPatients}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onAdd={openAdd}
          onView={openView}
          onEdit={openEdit}
          onDelete={requestDelete}
        />
      )}

      {(mode === "add" || mode === "edit") && (
        <PatientForm
          mode={mode}
          selectedPatient={selectedPatient}
          formName={formName}
          formAge={formAge}
          formGender={formGender}
          formContact={formContact}
          formError={formError}
          submitting={submitting}
          onNameChange={setFormName}
          onAgeChange={setFormAge}
          onGenderChange={setFormGender}
          onContactChange={setFormContact}
          onSubmit={mode === "add" ? handleAdd : handleEdit}
          onCancel={backToList}
        />
      )}

      {mode === "view" && selectedPatient && (
        <PatientView
          patient={selectedPatient}
          onBack={backToList}
          onEdit={openEdit}
        />
      )}
    </>
  );
}
