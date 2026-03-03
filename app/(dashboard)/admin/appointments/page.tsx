import AppointmentManager from "../../../components/AppointmentManager";

export default function AdminAppointmentsPage() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Appointment Management</h2>
        <p className="text-gray-500 text-sm mt-1">Book appointments and update their status.</p>
      </div>

      <AppointmentManager role="admin" />
    </div>
  );
}
