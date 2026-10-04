import Link from "next/link";

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-sm border border-gray-100 text-center">
        <h1 className="text-2xl font-display font-semibold mb-2 text-red-600">Access Denied</h1>
        <p className="text-gray-500 mb-8">You do not have permission to view this page.</p>
        <Link
          href="/admin"
          className="inline-block bg-black text-white rounded px-4 py-2 hover:bg-gray-800 transition-colors"
        >
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}
