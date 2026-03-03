type AppointmentStatus = "Confirmed" | "Pending" | "Completed";

interface Appointment {
  id: number;
  doctor: string;
  specialty: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  location: string;
}

const appointments: Appointment[] = [
  { id: 1, doctor: "Dr. Sarah Mitchell", specialty: "Cardiologist", date: "2026-03-10", time: "10:00 AM", status: "Confirmed", location: "Room 204" },
  { id: 2, doctor: "Dr. James Patel", specialty: "General Physician", date: "2026-03-15", time: "02:30 PM", status: "Pending", location: "Room 101" },
  { id: 3, doctor: "Dr. Emily Chen", specialty: "Dermatologist", date: "2026-02-20", time: "11:00 AM", status: "Completed", location: "Room 312" },
  { id: 4, doctor: "Dr. Robert Adams", specialty: "Orthopedic", date: "2026-02-05", time: "09:00 AM", status: "Completed", location: "Room 118" },
  { id: 5, doctor: "Dr. Sarah Mitchell", specialty: "Cardiologist", date: "2026-03-28", time: "03:00 PM", status: "Pending", location: "Room 204" },
];

const statusStyles: Record<AppointmentStatus, string> = {
  Confirmed: "bg-green-100 text-green-700 border border-green-200",
  Pending:   "bg-yellow-100 text-yellow-700 border border-yellow-200",
  Completed: "bg-blue-100 text-blue-700 border border-blue-200",
};

const statusDot: Record<AppointmentStatus, string> = {
  Confirmed: "bg-green-500",
  Pending:   "bg-yellow-500",
  Completed: "bg-blue-500",
};

const summary = [
  { label: "Total",     value: appointments.length,                                          color: "text-gray-900",  bg: "bg-gray-50" },
  { label: "Upcoming",  value: appointments.filter(a => a.status === "Confirmed").length,    color: "text-green-700", bg: "bg-green-50" },
  { label: "Pending",   value: appointments.filter(a => a.status === "Pending").length,      color: "text-yellow-700",bg: "bg-yellow-50" },
  { label: "Completed", value: appointments.filter(a => a.status === "Completed").length,    color: "text-blue-700",  bg: "bg-blue-50" },
];

export default function PatientAppointments() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Appointments</h1>
        <p className="text-gray-500 mt-1 text-sm">Track all your scheduled and past appointments.</p>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {summary.map((s) => (
          <div key={s.label} className={`${s.bg} rounded-2xl p-4 border border-gray-100`}>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Table card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <p className="font-semibold text-gray-800">Appointment History</p>
          <span className="text-xs text-gray-400">{appointments.length} records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Doctor</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Time</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Location</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {appointments.map((appt) => (
                <tr key={appt.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{appt.doctor}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{appt.specialty}</p>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {new Date(appt.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{appt.time}</td>
                  <td className="px-6 py-4 text-gray-600">{appt.location}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusStyles[appt.status]}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${statusDot[appt.status]}`} />
                      {appt.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 bg-orange-50 border border-orange-100 rounded-2xl p-4">
        <p className="text-sm text-orange-700 font-medium">
          Appointment booking will be enabled once backend integration is complete.
        </p>
      </div>
    </>
  );
}
