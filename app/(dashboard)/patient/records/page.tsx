type RecordType = "Lab Report" | "Prescription" | "Imaging" | "Discharge Summary";

interface HealthRecord {
  id: number;
  title: string;
  doctor: string;
  date: string;
  type: RecordType;
  hospital: string;
}

const records: HealthRecord[] = [
  { id: 1, title: "Complete Blood Count (CBC)",      doctor: "Dr. Sarah Mitchell", date: "2026-02-20", type: "Lab Report",        hospital: "City Medical Center" },
  { id: 2, title: "Chest X-Ray Report",              doctor: "Dr. James Patel",    date: "2026-02-05", type: "Imaging",           hospital: "MediCare Diagnostics" },
  { id: 3, title: "Antibiotic Prescription",         doctor: "Dr. Emily Chen",     date: "2026-01-18", type: "Prescription",      hospital: "Green Valley Clinic" },
  { id: 4, title: "Post-Surgery Discharge Summary",  doctor: "Dr. Robert Adams",   date: "2025-12-10", type: "Discharge Summary", hospital: "City Medical Center" },
  { id: 5, title: "Lipid Panel Test Results",        doctor: "Dr. Sarah Mitchell", date: "2025-11-22", type: "Lab Report",        hospital: "City Medical Center" },
  { id: 6, title: "MRI Brain Scan",                  doctor: "Dr. James Patel",    date: "2025-10-15", type: "Imaging",           hospital: "MediCare Diagnostics" },
];

const typeStyles: Record<RecordType, { badge: string; bg: string; icon: string }> = {
  "Lab Report":        { badge: "bg-blue-100 text-blue-700",    bg: "bg-blue-50",    icon: "🧪" },
  "Imaging":           { badge: "bg-purple-100 text-purple-700",bg: "bg-purple-50",  icon: "🩻" },
  "Prescription":      { badge: "bg-green-100 text-green-700",  bg: "bg-green-50",   icon: "💊" },
  "Discharge Summary": { badge: "bg-orange-100 text-orange-700",bg: "bg-orange-50",  icon: "📋" },
};

export default function PatientHealthRecords() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Health Records</h1>
        <p className="text-gray-500 mt-1 text-sm">Your complete medical history and health documents.</p>
      </div>

      {/* Record type legend */}
      <div className="flex flex-wrap gap-2 mb-6">
        {(Object.keys(typeStyles) as RecordType[]).map((type) => (
          <span key={type} className={`px-3 py-1 rounded-full text-xs font-medium ${typeStyles[type].badge}`}>
            {typeStyles[type].icon} {type}
          </span>
        ))}
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {records.map((record) => {
          const style = typeStyles[record.type];
          return (
            <div
              key={record.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-3">
                <div className={`w-11 h-11 rounded-xl ${style.bg} flex items-center justify-center text-xl shrink-0`}>
                  {style.icon}
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${style.badge} whitespace-nowrap`}>
                  {record.type}
                </span>
              </div>

              <div>
                <p className="font-semibold text-gray-900 leading-snug">{record.title}</p>
                <p className="text-xs text-gray-400 mt-1">{record.hospital}</p>
              </div>

              <div className="border-t border-gray-50 pt-3 flex items-center justify-between text-xs text-gray-500">
                <div>
                  <p className="font-medium text-gray-700">{record.doctor}</p>
                  <p className="mt-0.5">
                    {new Date(record.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
                <button
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  title="Download report"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" />
                  </svg>
                  Download
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 bg-orange-50 border border-orange-100 rounded-2xl p-4">
        <p className="text-sm text-orange-700 font-medium">
          Secure document upload and download will be available once backend integration is complete.
        </p>
      </div>
    </>
  );
}
