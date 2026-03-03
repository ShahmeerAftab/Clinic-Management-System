const stats = [
  { label: "Total Patients",      value: "142",     icon: "👥", bg: "bg-blue-50" },
  { label: "Appointments Today",  value: "8",       icon: "📅", bg: "bg-emerald-50" },
  { label: "Reports Pending",     value: "24",      icon: "📄", bg: "bg-orange-50" },
  { label: "Revenue This Month",  value: "$12,400", icon: "💰", bg: "bg-violet-50" },
];

export default function DoctorDashboard() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Doctor Dashboard</h1>
        <p className="text-gray-500 mt-1 text-sm">Good morning, Doctor! Here is your overview for today.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((card) => (
          <div key={card.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className={`w-12 h-12 rounded-xl ${card.bg} flex items-center justify-center text-2xl mb-4`}>
              {card.icon}
            </div>
            <p className="text-3xl font-bold text-gray-900">{card.value}</p>
            <p className="text-sm text-gray-500 mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-emerald-50 border border-emerald-100 rounded-2xl p-5">
        <p className="text-sm text-emerald-700 font-medium">
          🩺 You are logged in as <strong>Doctor</strong>. You can view your patients and manage appointments.
        </p>
        <p className="text-xs text-emerald-500 mt-1">
          Backend integration coming soon — data above is placeholder for now.
        </p>
      </div>
    </div>
  );
}
