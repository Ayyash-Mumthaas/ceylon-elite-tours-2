import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { requirePermission } from "@/lib/auth";

export default async function InquiriesInboxPage() {
  await requirePermission("manage_inquiries");

  const inquiries = await prisma.inquiry.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      customer: true,
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "NEW": return "bg-blue-100 text-blue-800";
      case "CONTACTED": return "bg-yellow-100 text-yellow-800";
      case "CONFIRMED": return "bg-green-100 text-green-800";
      case "ARCHIVED": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-display font-semibold">Inquiry Inbox</h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Reference</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Customer</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Dates</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {inquiries.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">No inquiries found.</td></tr>
            ) : (
              inquiries.map((inq) => (
                <tr key={inq.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-mono text-sm text-gray-900">{inq.reference}</td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{inq.customer.name}</div>
                    <div className="text-xs text-gray-500">{inq.customer.email}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {inq.travelStart ? new Date(inq.travelStart).toLocaleDateString() : 'TBD'} - {inq.travelEnd ? new Date(inq.travelEnd).toLocaleDateString() : 'TBD'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(inq.status)}`}>
                      {inq.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-sm">
                    <Link href={`/admin/inquiries/${inq.id}`} className="text-blue-600 hover:text-blue-900 font-medium">
                      View Details
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
