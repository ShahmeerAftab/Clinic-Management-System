"use client";

/**
 * Patient Profile Page — /patient/profile
 *
 * Allows the logged-in patient to view and update their own profile:
 * name, age, gender, and contact information.
 *
 * The API endpoint PUT /api/patient/me handles the update.
 */

import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

interface PatientProfile {
  _id: string;
  name: string;
  age: string;
  gender: string;
  contact: string;
}

const GENDER_OPTIONS = ["Male", "Female", "Other", "Prefer not to say"];

const inputCls =
  "w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl text-ink " +
  "placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-aq focus:border-aq/50 focus:bg-white transition-all";
const labelCls = "block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5";

export default function PatientProfilePage() {
  const [profile, setProfile]   = useState<PatientProfile | null>(null);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [error, setError]       = useState("");
  const [success, setSuccess]   = useState("");

  // Form fields
  const [name, setName]       = useState("");
  const [age, setAge]         = useState("");
  const [gender, setGender]   = useState("");
  const [contact, setContact] = useState("");

  // Load profile on mount
  useEffect(() => {
    fetchWithAuth("/api/patient/me")
      .then((r) => r.json())
      .then((data: PatientProfile) => {
        setProfile(data);
        setName(data.name || "");
        setAge(data.age === "N/A" ? "" : data.age || "");
        setGender(data.gender === "N/A" ? "" : data.gender || "");
        setContact(data.contact || "");
      })
      .catch(() => setError("Failed to load profile."))
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name.trim()) { setError("Name is required."); return; }
    if (!age.trim())  { setError("Age is required."); return; }

    setSaving(true);
    try {
      const res = await fetchWithAuth("/api/patient/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), age: age.trim(), gender, contact: contact.trim() }),
      });

      if (!res.ok) {
        const err = await res.json();
        setError(err.message || "Failed to update profile.");
        return;
      }

      const updated: PatientProfile = await res.json();
      setProfile(updated);
      setSuccess("Profile updated successfully!");
      setTimeout(() => setSuccess(""), 4000);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 rounded-full border-2 border-aq border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-ink">My Profile</h1>
        <p className="text-sm text-gray-500 mt-0.5">Keep your personal details up to date.</p>
      </div>

      {/* Avatar + name card */}
      {profile && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-aq-faint flex items-center justify-center text-xl font-bold text-aq-darker shrink-0">
            {profile.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <p className="text-base font-semibold text-ink">{profile.name}</p>
            <p className="text-sm text-gray-400">{profile.contact}</p>
            {(profile.age === "N/A" || profile.gender === "N/A") && (
              <p className="text-xs text-amber-600 font-medium mt-1">
                Profile incomplete — please fill in your details below.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Feedback */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl px-5 py-4 text-sm text-rose-700 font-medium">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-5 py-4 text-sm text-emerald-700 font-medium">
          {success}
        </div>
      )}

      {/* Edit form */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-aq to-aq-dark" />
        <div className="p-7">
          <h2 className="text-sm font-bold text-ink mb-5">Personal Information</h2>
          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className={labelCls}>Full Name <span className="text-rose-500">*</span></label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                className={inputCls}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Age <span className="text-rose-500">*</span></label>
                <input
                  type="number"
                  min="0"
                  max="150"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="e.g. 28"
                  className={inputCls}
                  required
                />
              </div>
              <div>
                <label className={labelCls}>Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className={inputCls}
                >
                  <option value="">Select gender</option>
                  {GENDER_OPTIONS.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className={labelCls}>Contact / Email</label>
              <input
                type="text"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="Phone number or email"
                className={inputCls}
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 rounded-xl text-sm font-bold text-ink bg-aq hover:bg-aq-dark disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98] transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-aq focus:ring-offset-2"
              >
                {saving ? (
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Saving…
                  </span>
                ) : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>

    </div>
  );
}
