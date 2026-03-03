const stats = [
  { label: "Appointments Today",  value: "34",     icon: "📅", bg: "bg-violet-50" },
  { label: "Check-ins Completed", value: "12",     icon: "🏥", bg: "bg-blue-50" },
  { label: "AI Chatbot",          value: "Active", icon: "🤖", bg: "bg-emerald-50" },
  { label: "Reports Pending",     value: "5",      icon: "📋", bg: "bg-orange-50" },
];

export default function ReceptionistDashboard() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Receptionist Dashboard</h1>
        <p className="text-gray-500 mt-1 text-sm">Welcome back! Here is the front desk overview for today.</p>
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

      <div className="mt-8 bg-violet-50 border border-violet-100 rounded-2xl p-5">
        <p className="text-sm text-violet-700 font-medium">
          🗂️ You are logged in as <strong>Receptionist</strong>. You can manage appointments and patient check-ins.
        </p>
        <p className="text-xs text-violet-500 mt-1">
          Backend integration coming soon — data above is placeholder for now.
        </p>
      </div>
    </div>
  );
}
