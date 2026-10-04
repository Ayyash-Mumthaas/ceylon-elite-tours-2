import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { requirePermission } from "@/lib/auth";

export default async function BookingsListPage() {
  await requirePermission("manage_bookings");

  const bookings = await prisma.booking.findMany({
    orderBy: { createdAt: "desc" },
    include: { customer: true },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "NEW": return "bg-gray-100 text-gray-800";
      case "CONFIRMED": return "bg-blue-100 text-blue-800";
      case "VEHICLE_ASSIGNED": return "bg-purple-100 text-purple-800";
      case "DRIVER_ASSIGNED": return "bg-indigo-100 text-indigo-800";
      case "UPCOMING": return "bg-green-100 text-green-800";
      case "IN_PROGRESS": return "bg-yellow-100 text-yellow-800";
      case "COMPLETED": return "bg-gray-200 text-gray-900";
      case "CANCELLED": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentColor = (status: string) => {
    switch (status) {
      case "UNPAID": return "text-red-600 bg-red-50";
      case "PARTIALLY_PAID": return "text-yellow-700 bg-yellow-50";
      case "PAID": return "text-green-700 bg-green-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-display font-semibold">Bookings</h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Reference</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Customer</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Dates</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Payment</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {bookings.length === 0 ? (
              <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500">No bookings found.</td></tr>
            ) : (
              bookings.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-mono text-sm text-gray-900">{b.reference}</td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{b.customer.name}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {b.travelStart ? new Date(b.travelStart).toLocaleDateString() : 'TBD'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(b.status)}`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded ${getPaymentColor(b.paymentStatus)}`}>
                      {b.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-sm">
                    <Link href={`/admin/bookings/${b.id}`} className="text-blue-600 hover:text-blue-900 font-medium">
                      Manage
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
