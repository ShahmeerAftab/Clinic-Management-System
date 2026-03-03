import PatientManager from "../../../components/PatientManager";

export default function AdminPatientsPage() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Patient Management</h2>
        <p className="text-gray-500 text-sm mt-1">Add, edit, view, and delete patient records.</p>
      </div>

      <PatientManager role="admin" />
    </div>
  );
}
