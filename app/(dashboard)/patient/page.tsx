export default function PatientDashboard() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Patient Dashboard</h1>
        <p className="text-gray-500 mt-1 text-sm">
          Welcome! Here is a summary of your health at a glance.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-2xl mb-4">📅</div>
          <p className="text-3xl font-bold text-gray-900">2</p>
          <p className="text-sm text-gray-500 mt-1">Upcoming Appointments</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-2xl mb-4">📋</div>
          <p className="text-3xl font-bold text-gray-900">View</p>
          <p className="text-sm text-gray-500 mt-1">My Medical Records</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="w-12 h-12 rounded-xl bg-violet-50 flex items-center justify-center text-2xl mb-4">🤖</div>
          <p className="text-3xl font-bold text-gray-900">3 New</p>
          <p className="text-sm text-gray-500 mt-1">AI Health Tips</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-2xl mb-4">📊</div>
          <p className="text-3xl font-bold text-gray-900">92/100</p>
          <p className="text-sm text-gray-500 mt-1">Health Score</p>
        </div>
      </div>

      <div className="mt-8 bg-orange-50 border border-orange-100 rounded-2xl p-5">
        <p className="text-sm text-orange-700 font-medium">
          🏥 You are logged in as <strong>Patient</strong>. You can view your appointments and health records.
        </p>
        <p className="text-xs text-orange-500 mt-1">
          Backend integration coming soon — data above is placeholder for now.
        </p>
      </div>
    </>
  );
}
