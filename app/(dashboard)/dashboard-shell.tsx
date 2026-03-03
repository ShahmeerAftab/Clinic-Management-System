"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

const roleBadges: Record<string, { label: string; emoji: string; color: string }> = {
  admin:        { label: "Admin",        emoji: "🛡️", color: "bg-blue-100 text-blue-700" },
  doctor:       { label: "Doctor",       emoji: "🩺", color: "bg-emerald-100 text-emerald-700" },
  receptionist: { label: "Receptionist", emoji: "🗂️", color: "bg-violet-100 text-violet-700" },
  patient:      { label: "Patient",      emoji: "🏥", color: "bg-orange-100 text-orange-700" },
};

const staffNavItems = [
  { label: "Patients",     icon: "👥", path: "/patients" },
  { label: "Appointments", icon: "📅", path: "/appointments" },
  { label: "Analytics",    icon: "📊", path: "/analytics" },
];

const patientNavItems = [
  { label: "Appointments",   icon: "📅", path: "/patient/appointments" },
  { label: "Health Records", icon: "📋", path: "/patient/records" },
  { label: "Health Tips",    icon: "🤖", path: "/patient/tips" },
];

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const router   = useRouter();
  const pathname = usePathname();

  const [mounted, setMounted]     = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userRole, setUserRole]   = useState("");

  useEffect(() => {
    const savedRole  = localStorage.getItem("userRole");
    const savedEmail = localStorage.getItem("userEmail");

    if (!savedRole || !roleBadges[savedRole]) {
      router.push("/login");
      return;
    }

    setUserRole(savedRole);
    setUserEmail(savedEmail || "");
    setMounted(true);
  }, []);

  function handleLogout() {
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    router.push("/login");
  }

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-400 text-sm">Loading…</p>
      </div>
    );
  }

  const badge    = roleBadges[userRole];
  const dashPath = `/${userRole}`;
  const navItems = [
    { label: "Dashboard", icon: "🏠", path: dashPath },
    ...(userRole === "patient" ? patientNavItems : staffNavItems),
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">

      <aside className="w-60 bg-white border-r border-gray-200 flex flex-col shrink-0">

        <div className="px-5 py-5 border-b border-gray-100 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zm-7 3a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H8a1 1 0 110-2h3V7a1 1 0 011-1z" />
            </svg>
          </div>
          <span className="font-bold text-gray-900 text-base">MediCare Pro</span>
        </div>

        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.path ||
              (item.path !== dashPath && pathname.startsWith(item.path));

            return (
              <Link
                key={item.label}
                href={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 py-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
          >
            <span className="text-base">🚪</span>
            Logout
          </button>
        </div>

      </aside>

      <div className="flex-1 flex flex-col min-w-0">

        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${badge.color}`}>
            {badge.emoji} {badge.label}
          </span>
          <span className="text-sm text-gray-500">{userEmail}</span>
        </header>

        <main className="flex-1 px-8 py-8">
          {children}
        </main>

      </div>

    </div>
  );
}
