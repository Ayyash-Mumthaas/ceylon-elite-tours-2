import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { requirePermission } from "@/lib/auth";

export default async function QuotationsListPage() {
  await requirePermission("manage_quotations");

  const quotations = await prisma.quotation.findMany({
    orderBy: { createdAt: "desc" },
    include: { customer: true },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DRAFT": return "bg-gray-100 text-gray-800";
      case "SENT": return "bg-blue-100 text-blue-800";
      case "ACCEPTED": return "bg-green-100 text-green-800";
      case "DECLINED": return "bg-red-100 text-red-800";
      case "EXPIRED": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-display font-semibold">Quotations</h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Reference</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Customer</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Total</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {quotations.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">No quotations found.</td></tr>
            ) : (
              quotations.map((q) => (
                <tr key={q.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-mono text-sm text-gray-900">{q.reference}</td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{q.customer.name}</div>
                  </td>
                  <td className="px-6 py-4 font-medium">
                    {q.currency} {q.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(q.status)}`}>
                      {q.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-sm">
                    <Link href={`/admin/quotations/${q.id}`} className="text-blue-600 hover:text-blue-900 font-medium">
                      View / Edit
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
