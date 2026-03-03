const metrics = [
  { label: "Total Consultations",    value: "318",    change: "+12% this month",      bg: "bg-blue-50",    text: "text-blue-600"    },
  { label: "Avg. Consultation Time", value: "22 min", change: "-3 min vs last month", bg: "bg-emerald-50", text: "text-emerald-600" },
  { label: "Patient Satisfaction",   value: "94%",    change: "+2% this month",       bg: "bg-violet-50",  text: "text-violet-600"  },
  { label: "Prescriptions Issued",   value: "205",    change: "+8% this month",       bg: "bg-orange-50",  text: "text-orange-600"  },
];

const topConditions = [
  { condition: "Hypertension",               count: 42 },
  { condition: "Diabetes Type 2",            count: 35 },
  { condition: "Upper Respiratory Infection",count: 28 },
  { condition: "Anxiety / Depression",       count: 21 },
  { condition: "Musculoskeletal Pain",        count: 18 },
];

export default function DoctorAnalyticsPage() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Analytics</h2>
        <p className="text-gray-500 text-sm mt-1">Your performance and patient insights for this month.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {metrics.map((m) => (
          <div key={m.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className={`inline-block px-2.5 py-1 rounded-lg text-xs font-semibold mb-3 ${m.bg} ${m.text}`}>
              {m.change}
            </div>
            <p className="text-3xl font-bold text-gray-900">{m.value}</p>
            <p className="text-sm text-gray-500 mt-1">{m.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-base font-semibold text-gray-900 mb-4">Top Conditions Treated</h3>
        <div className="space-y-3">
          {topConditions.map((item) => (
            <div key={item.condition} className="flex items-center gap-4">
              <span className="text-sm text-gray-700 w-56 shrink-0">{item.condition}</span>
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-2 bg-emerald-500 rounded-full"
                  style={{ width: `${(item.count / 50) * 100}%` }}
                />
              </div>
              <span className="text-sm font-medium text-gray-900 w-8 text-right">{item.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
