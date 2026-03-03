// This layout is a simple pass-through.
// Navigation is handled by app/(dashboard)/layout.tsx for all doctor pages.
// This file only exists to support sub-sub-pages like /doctor/patients/profile.
export default function DoctorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
