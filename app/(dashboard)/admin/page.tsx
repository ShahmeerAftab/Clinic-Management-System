const stats = [
  { label: "Appointments Today",   value: "34",    icon: "📅", bg: "bg-blue-50" },
  { label: "Total Patients",       value: "1,248", icon: "👥", bg: "bg-emerald-50" },
  { label: "AI Insights",          value: "Active", icon: "🤖", bg: "bg-violet-50" },
  { label: "Analytics This Month", value: "↑ 12%", icon: "📊", bg: "bg-orange-50" },
];

export default function AdminDashboard() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1 text-sm">Welcome back! Here is your full clinic overview.</p>
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

      <div className="mt-8 bg-blue-50 border border-blue-100 rounded-2xl p-5">
        <p className="text-sm text-blue-700 font-medium">
          🛡️ You are logged in as <strong>Admin</strong>. You have full access to all clinic data and settings.
        </p>
        <p className="text-xs text-blue-500 mt-1">
          Backend integration coming soon — data above is placeholder for now.
        </p>
      </div>
    </div>
  );
}
