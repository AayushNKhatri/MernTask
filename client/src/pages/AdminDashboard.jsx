export default function AdminDashboard() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg">
        <h2 className="text-3xl font-bold text-center text-red-700 mb-6">Admin Dashboard</h2>
        <p className="text-center text-gray-600">Welcome! You are logged in as an <span className="font-semibold">Admin</span>.</p>
      </div>
    </div>
  );
}