"use client";

import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

// ---------- types ----------
interface Stats {
  totalPatients: number;
  totalAppointments: number;
  todaysAppointments: number;
  completedAppointments: number;
}

interface Appointment {
  _id: string;
  patientID: { _id: string; name: string } | null;
  doctor: string;
  date: string;
  time: string;
  reason?: string;
  status: string;
}

// ---------- helpers ----------
const statusStyles: Record<string, string> = {
  Scheduled: "bg-aq-faint text-aq-darker border-aq/30",
  Completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Cancelled: "bg-rose-50 text-rose-700 border-rose-200",
};

function AvatarCircle({ name }: { name: string }) {
  return (
    <div className="w-8 h-8 rounded-full bg-aq-faint flex items-center justify-center text-[11px] font-bold text-aq-darker shrink-0">
      {name.slice(0, 2).toUpperCase()}
    </div>
  );
}

// ---------- main page ----------
export default function DoctorDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState("");

  const [schedule, setSchedule] = useState<Appointment[]>([]);
  const [scheduleLoading, setScheduleLoading] = useState(true);
  const [scheduleError, setScheduleError] = useState("");

  // Fetch dashboard stats
  useEffect(() => {
    fetch("/api/dashboard/stats")
      .then((res) => res.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setStats(data);
      })
      .catch(() => setStatsError("Could not load stats."))
      .finally(() => setStatsLoading(false));
  }, []);

  // Fetch today's scheduled appointments
  useEffect(() => {
    fetchWithAuth("/api/appointment")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch appointments");
        return res.json();
      })
      .then((data: Appointment[]) => {
        // Compare just the date part (ignores time-zone offset for same-day match)
        const todayStr = new Date().toDateString();

        const todayScheduled = data.filter((appt) => {
          const apptDateStr = new Date(appt.date).toDateString();
          return apptDateStr === todayStr && appt.status === "Scheduled";
        });

        // Sort by time string alphabetically (HH:MM AM/PM sorts correctly)
        todayScheduled.sort((a, b) => a.time.localeCompare(b.time));

        setSchedule(todayScheduled);
      })
      .catch(() => setScheduleError("Could not load today's appointments."))
      .finally(() => setScheduleLoading(false));
  }, []);

  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  const cards = [
    {
      label: "Total Patients",
      value: stats?.totalPatients,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      label: "Total Appointments",
      value: stats?.totalAppointments,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
    },
    {
      label: "Today's Appointments",
      value: stats?.todaysAppointments,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      label: "Completed Appointments",
      value: stats?.completedAppointments,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink">Good morning, Doctor!</h1>
          <p className="text-sm text-gray-500 mt-0.5">{today}</p>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-aq-faint text-aq-darker text-xs font-semibold rounded-full border border-aq/30 self-start sm:self-auto">
          <span className="w-1.5 h-1.5 rounded-full bg-aq animate-pulse inline-block" />
          On Duty
        </span>
      </div>

      {/* Stats error banner */}
      {statsError && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm px-4 py-3 rounded-xl">
          {statsError}
        </div>
      )}

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md hover:border-aq/30 transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-aq-faint text-aq-darker flex items-center justify-center">
                {card.icon}
              </div>
            </div>

            {/* Skeleton while loading */}
            {statsLoading ? (
              <div className="h-8 w-16 bg-gray-100 rounded-lg animate-pulse mb-1" />
            ) : (
              <p className="text-2xl font-bold text-ink tracking-tight">
                {card.value ?? "—"}
              </p>
            )}

            <p className="text-sm text-gray-500 mt-0.5">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Today's Schedule — dynamic */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 pt-5 pb-4 border-b border-gray-50 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-ink">Today&apos;s Schedule</h2>
            <p className="text-xs text-gray-400 mt-0.5">Scheduled appointments for today</p>
          </div>
          {!scheduleLoading && !scheduleError && (
            <span className="text-xs font-semibold text-aq-darker bg-aq-faint px-2.5 py-1 rounded-full border border-aq/20">
              {schedule.length} scheduled
            </span>
          )}
        </div>

        {/* Loading state */}
        {scheduleLoading && (
          <div className="divide-y divide-gray-50">
            {[1, 2, 3].map((n) => (
              <div key={n} className="flex items-center gap-4 px-6 py-3.5">
                <div className="w-8 h-8 rounded-full bg-gray-100 animate-pulse shrink-0" />
                <div className="w-20 h-3 bg-gray-100 rounded animate-pulse shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 bg-gray-100 rounded animate-pulse w-32" />
                  <div className="h-2.5 bg-gray-100 rounded animate-pulse w-48" />
                </div>
                <div className="w-20 h-5 bg-gray-100 rounded-full animate-pulse" />
              </div>
            ))}
          </div>
        )}

        {/* Error state */}
        {!scheduleLoading && scheduleError && (
          <div className="px-6 py-8 text-center">
            <p className="text-sm text-rose-600">{scheduleError}</p>
          </div>
        )}

        {/* Empty state */}
        {!scheduleLoading && !scheduleError && schedule.length === 0 && (
          <div className="px-6 py-10 text-center">
            <div className="w-12 h-12 rounded-full bg-aq-faint flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-aq-darker" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-ink">No appointments today</p>
            <p className="text-xs text-gray-400 mt-1">You have no scheduled appointments for today.</p>
          </div>
        )}

        {/* Appointment rows */}
        {!scheduleLoading && !scheduleError && schedule.length > 0 && (
          <div className="divide-y divide-gray-50">
            {schedule.map((appt) => {
              const patientName = appt.patientID?.name ?? "Unknown Patient";
              const style = statusStyles[appt.status] ?? "bg-gray-100 text-gray-600 border-gray-200";

              return (
                <div
                  key={appt._id}
                  className="flex items-center gap-4 px-6 py-3.5 hover:bg-aq-faint/40 transition-colors"
                >
                  <AvatarCircle name={patientName} />
                  <span className="text-xs font-mono font-semibold text-gray-500 w-20 shrink-0">
                    {appt.time}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ink">{patientName}</p>
                    <p className="text-xs text-gray-500 truncate">
                      {appt.reason ?? "No reason provided"}
                    </p>
                  </div>
                  <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${style}`}>
                    {appt.status}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="bg-aq-faint border border-aq/20 rounded-2xl px-5 py-4 flex items-center gap-3">
        <svg className="w-5 h-5 text-aq-darker shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-sm text-aq-darker font-medium">
          Dashboard stats and appointments are live from the database.
        </p>
      </div>

    </div>
  );
}
