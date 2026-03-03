"use client";

import { useState } from "react";

// A single patient record
type Patient = {
  id: number;
  name: string;
  age: string;      
  gender: string;
  contact: string;
  createdBy: string; 
};


type Mode = "list" | "add" | "edit" | "view";
type Props = {
  role: string; 
};


// SAMPLE DATA

const SAMPLE_PATIENTS: Patient[] = [
  { id: 1, name: "Ali Hassan",     age: "34", gender: "Male",   contact: "0312-1234567", createdBy: "Receptionist" },
  { id: 2, name: "Sara Malik",     age: "27", gender: "Female", contact: "0321-9876543", createdBy: "Doctor"       },
  { id: 3, name: "Ahmed Khan",     age: "45", gender: "Male",   contact: "0333-5555555", createdBy: "Admin"        },
  { id: 4, name: "Zara Siddiqui", age: "31", gender: "Female", contact: "0311-7777777", createdBy: "Receptionist" },
];

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function PatientManager({ role }: Props) {

  // ── STATE ──────────────────────────────────────────────────────────────────

  const [patients, setPatients]               = useState<Patient[]>(SAMPLE_PATIENTS);
  const [mode, setMode]                       = useState<Mode>("list"); // current screen
  const [searchQuery, setSearchQuery]         = useState("");            // search box text
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null); // for edit/view

  // Form fields 
  const [formName,    setFormName]    = useState("");
  const [formAge,     setFormAge]     = useState("");
  const [formGender,  setFormGender]  = useState("Male");
  const [formContact, setFormContact] = useState("");

  // Filtered list — 
  const filteredPatients = patients.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Reset form fields back to empty after submitting or cancelling
  function clearForm() {
    setFormName("");
    setFormAge("");
    setFormGender("Male");
    setFormContact("");
    setSelectedPatient(null);
  }

  function capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // ── ADD ────────────────────────────────────────────────────────────────────

  function openAdd() {
    clearForm();
    setMode("add");
  }

  function handleAdd(e: React.FormEvent) {
    e.preventDefault(); 

    // Generate a new unique ID 
    const newId = patients.length > 0
      ? Math.max(...patients.map((p) => p.id)) + 1
      : 1;

    const newPatient: Patient = {
      id:        newId,
      name:      formName,
      age:       formAge,
      gender:    formGender,
      contact:   formContact,
      createdBy: capitalize(role), 
    };

    setPatients([newPatient, ...patients]); // add to the top of the list
    clearForm();
    setMode("list");
  }

  // ── EDIT ───────────────────────────────────────────────────────────────────

  // Open the edit form
  function openEdit(patient: Patient) {
    setSelectedPatient(patient);
    setFormName(patient.name);
    setFormAge(patient.age);
    setFormGender(patient.gender);
    setFormContact(patient.contact);
    setMode("edit");
  }

  function handleEdit(e: React.FormEvent) {
    e.preventDefault();

    // If the id matches, replace it with updated data; otherwise keep it unchanged.
    setPatients(patients.map((p) =>
      p.id === selectedPatient!.id
        ? { ...p, name: formName, age: formAge, gender: formGender, contact: formContact }
        : p
    ));

    clearForm();
    setMode("list");
  }

  // ── DELETE ─────────────────────────────────────────────────────────────────

  function handleDelete(id: number) {
    const confirmed = window.confirm("Delete this patient? This cannot be undone.");
    if (!confirmed) return;

    // .filter() keeps every patient EXCEPT the one with this id
    setPatients(patients.filter((p) => p.id !== id));
  }

  // ── VIEW ───────────────────────────────────────────────────────────────────

  function openView(patient: Patient) {
    setSelectedPatient(patient);
    setMode("view");
  }

  // RENDER
  // We check the `mode` state and show only the matching section.
  // Only one section is visible at a time.
  return (
    <div>

      
         {/* shows all patients in a table */}
         
      {mode === "list" && (
        <div>

          {/* Search bar + Add Patient button */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <input
              type="text"
              placeholder="🔍  Search patients by name…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={openAdd}
              className="shrink-0 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors"
            >
              + Add Patient
            </button>
          </div>

          {/* Result count line */}
          <p className="text-xs text-gray-400 mb-3">
            Showing {filteredPatients.length} of {patients.length} patient(s)
          </p>

           {/* ── TABLE  */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
            <table className="w-full text-sm min-w-[640px]">

              {/* Table header row */}
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Name</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Age</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Gender</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Contact</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Created By</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>

              {/* Table body — one row per patient */}
              <tbody>
                {filteredPatients.map((patient) => (
                  <tr key={patient.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">

                    <td className="px-5 py-4 font-medium text-gray-900">{patient.name}</td>
                    <td className="px-5 py-4 text-gray-600">{patient.age} yrs</td>
                    <td className="px-5 py-4 text-gray-600">{patient.gender}</td>
                    <td className="px-5 py-4 text-gray-500 font-mono text-xs">{patient.contact}</td>

                    {/* CreatedBy badge */}
                    <td className="px-5 py-4">
                      <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                        {patient.createdBy}
                      </span>
                    </td>

                    {/* Action buttons */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openView(patient)}
                          className="px-3 py-1.5 text-xs font-medium rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                        >
                          View
                        </button>
                        <button
                          onClick={() => openEdit(patient)}
                          className="px-3 py-1.5 text-xs font-medium rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(patient.id)}
                          className="px-3 py-1.5 text-xs font-medium rounded-lg bg-red-50 text-red-700 hover:bg-red-100 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {/* Show this row when the list is empty (no results or no data) */}
                {filteredPatients.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center text-gray-400 text-sm">
                      {searchQuery
                        ? `No patients matched "${searchQuery}". Try a different name.`
                        : "No patients yet. Click + Add Patient to get started."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          ADD / EDIT FORM MODE
          Both "add" and "edit" use the same form layout.
          We check `mode` to decide which submit handler to call and
          what label to show on the submit button.
          ═══════════════════════════════════════════════════════════════════ */}
      {(mode === "add" || mode === "edit") && (
        <div className="max-w-lg">

          {/* Back link */}
          <button
            onClick={() => { clearForm(); setMode("list"); }}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors"
          >
            ← Back to Patient List
          </button>

          {/* Form card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7">
            <h3 className="text-lg font-bold text-gray-900 mb-6">
              {mode === "add" ? "Add New Patient" : `Edit — ${selectedPatient?.name}`}
            </h3>

            {/* The same form handles both add and edit.
                onSubmit uses a ternary to call the correct handler. */}
            <form
              onSubmit={mode === "add" ? handleAdd : handleEdit}
              className="space-y-4"
            >

              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ali Hassan"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Age */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Age
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  max="150"
                  placeholder="e.g. 34"
                  value={formAge}
                  onChange={(e) => setFormAge(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Gender
                </label>
                <select
                  value={formGender}
                  onChange={(e) => setFormGender(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Contact */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Contact Number
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 0312-1234567"
                  value={formContact}
                  onChange={(e) => setFormContact(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Submit + Cancel buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors"
                >
                  {mode === "add" ? "Add Patient" : "Save Changes"}
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

      {/* ═══════════════════════════════════════════════════════════════════
          VIEW MODE — read-only patient profile + empty medical history
          ═══════════════════════════════════════════════════════════════════ */}
      {mode === "view" && selectedPatient && (
        <div className="max-w-lg">

          {/* Back link */}
          <button
            onClick={() => { setSelectedPatient(null); setMode("list"); }}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors"
          >
            ← Back to Patient List
          </button>

          {/* ── Patient info card ── */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7 mb-4">

            {/* Avatar (first letter of name) + name + Edit button */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                {/* Avatar circle with the first letter of the patient's name */}
                <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center text-xl font-bold text-blue-600">
                  {selectedPatient.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{selectedPatient.name}</h3>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {selectedPatient.gender} · {selectedPatient.age} years old
                  </p>
                </div>
              </div>
              {/* Quick edit button from the view screen */}
              <button
                onClick={() => openEdit(selectedPatient)}
                className="px-3.5 py-2 bg-blue-50 text-blue-700 text-sm font-medium rounded-xl hover:bg-blue-100 transition-colors"
              >
                Edit
              </button>
            </div>

            {/* Info rows — label on the left, value on the right */}
            <div className="divide-y divide-gray-50">
              <div className="flex gap-4 py-3">
                <span className="text-sm text-gray-400 w-28 shrink-0">Contact</span>
                <span className="text-sm font-medium text-gray-800">{selectedPatient.contact}</span>
              </div>
              <div className="flex gap-4 py-3">
                <span className="text-sm text-gray-400 w-28 shrink-0">Gender</span>
                <span className="text-sm font-medium text-gray-800">{selectedPatient.gender}</span>
              </div>
              <div className="flex gap-4 py-3">
                <span className="text-sm text-gray-400 w-28 shrink-0">Age</span>
                <span className="text-sm font-medium text-gray-800">{selectedPatient.age} years old</span>
              </div>
              <div className="flex gap-4 py-3">
                <span className="text-sm text-gray-400 w-28 shrink-0">Added by</span>
                <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                  {selectedPatient.createdBy}
                </span>
              </div>
            </div>
          </div>

          {/* ── Medical history placeholder ──
              This section is empty for now.
              Later it will show a real timeline of prescriptions + appointments. */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7">
            <h4 className="font-semibold text-gray-900 mb-1">Medical History</h4>
            <p className="text-xs text-gray-400 mb-6">
              Prescriptions and appointments will appear here once connected to the backend.
            </p>

            {/* Empty state illustration */}
            <div className="flex flex-col items-center py-8 text-center">
              <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center text-3xl mb-3">
                📋
              </div>
              <p className="text-sm font-medium text-gray-600">No history yet</p>
              <p className="text-xs text-gray-400 mt-1.5 max-w-xs leading-relaxed">
                This timeline will show visit notes, prescriptions, and appointment records
                once the backend is integrated.
              </p>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
