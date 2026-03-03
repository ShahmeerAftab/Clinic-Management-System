"use client";

import { useState } from "react";

type Prescription = {
  id: number;
  patientId: number;
  patientName: string;
  medicine: string;
  dosage: string;
  notes: string;
  date: string;
};

const patientsList = [
  { id: 1, name: "Ali Khan" },
  { id: 2, name: "Sara Ahmed" },
  { id: 3, name: "Bilal Raza" },
];

export default function DoctorPrescriptionsPage() {
  const [selectedPatient, setSelectedPatient] = useState(patientsList[0].id);
  const [medicine, setMedicine] = useState("");
  const [dosage, setDosage] = useState("");
  const [notes, setNotes] = useState("");
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);

  function handleAddPrescription(e: React.FormEvent) {
    e.preventDefault();

    const newPrescription: Prescription = {
      id: Date.now(),
      patientId: selectedPatient,
      patientName: patientsList.find(p => p.id === selectedPatient)?.name || "",
      medicine,
      dosage,
      notes,
      date: new Date().toLocaleString(),
    };

    setPrescriptions([...prescriptions, newPrescription]);
    setMedicine("");
    setDosage("");
    setNotes("");
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Add Prescription</h1>

      <form onSubmit={handleAddPrescription} className="space-y-4 mb-8">
        <div>
          <label className="block mb-1 text-gray-700">Select Patient</label>
          <select
            value={selectedPatient}
            onChange={(e) => setSelectedPatient(Number(e.target.value))}
            className="w-full border rounded-xl px-4 py-2"
          >
            {patientsList.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 text-gray-700">Medicine</label>
          <input
            type="text"
            value={medicine}
            onChange={(e) => setMedicine(e.target.value)}
            placeholder="Medicine name"
            className="w-full border rounded-xl px-4 py-2"
            required
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-700">Dosage</label>
          <input
            type="text"
            value={dosage}
            onChange={(e) => setDosage(e.target.value)}
            placeholder="e.g. 2 times a day"
            className="w-full border rounded-xl px-4 py-2"
            required
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-700">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any instructions"
            className="w-full border rounded-xl px-4 py-2"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700"
        >
          Add Prescription
        </button>
      </form>

      <h2 className="text-xl font-bold mb-4">Prescriptions</h2>
      {prescriptions.length === 0 && <p>No prescriptions added yet.</p>}

      <div className="space-y-4">
        {prescriptions.map(p => (
          <div key={p.id} className="border rounded-xl p-4 shadow-sm">
            <p className="font-semibold">{p.patientName}</p>
            <p><strong>Medicine:</strong> {p.medicine}</p>
            <p><strong>Dosage:</strong> {p.dosage}</p>
            <p><strong>Notes:</strong> {p.notes || "N/A"}</p>
            <p className="text-xs text-gray-500">{p.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
}