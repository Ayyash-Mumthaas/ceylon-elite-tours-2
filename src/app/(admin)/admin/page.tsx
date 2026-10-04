import { prisma } from "@/lib/prisma";

export default async function AdminDashboard() {
  const [
    inquiriesCount,
    bookingsCount,
    usersCount,
    toursCount,
    recentInquiries
  ] = await Promise.all([
    prisma.inquiry.count(),
    prisma.booking.count(),
    prisma.user.count(),
    prisma.tour.count(),
    prisma.inquiry.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { customer: true }
    })
  ]);

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-display font-semibold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Total Inquiries</p>
          <p className="text-3xl font-semibold">{inquiriesCount}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Total Bookings</p>
          <p className="text-3xl font-semibold">{bookingsCount}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Active Tours</p>
          <p className="text-3xl font-semibold">{toursCount}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Staff Members</p>
          <p className="text-3xl font-semibold">{usersCount}</p>
        </div>
      </div>

      <h2 className="text-lg font-display font-semibold mb-4">Recent Inquiries</h2>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Reference</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Customer</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {recentInquiries.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                  No inquiries yet.
                </td>
              </tr>
            ) : (
              recentInquiries.map((inq) => (
                <tr key={inq.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{inq.reference}</td>
                  <td className="px-6 py-4">{inq.customer.name}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {inq.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {new Date(inq.createdAt).toLocaleDateString()}
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
