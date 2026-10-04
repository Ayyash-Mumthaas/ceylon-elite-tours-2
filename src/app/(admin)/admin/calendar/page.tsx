import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/auth";
import Link from "next/link";

export default async function CalendarPage() {
  await requirePermission("manage_bookings");

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Fetch upcoming bookings that haven't been cancelled or completed
  const upcomingBookings = await prisma.booking.findMany({
    where: {
      travelStart: { gte: today },
      status: { notIn: ["CANCELLED", "COMPLETED", "CLOSED", "NEW"] }
    },
    orderBy: { travelStart: "asc" },
    include: { customer: true, assignedVehicle: true, assignedDriver: true }
  });

  // Group by Month-Year
  const grouped: Record<string, typeof upcomingBookings> = {};
  
  upcomingBookings.forEach(b => {
    if (!b.travelStart) return;
    const monthYear = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date(b.travelStart));
    if (!grouped[monthYear]) grouped[monthYear] = [];
    grouped[monthYear].push(b);
  });

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-display font-semibold">Booking Calendar (Agenda)</h1>
      </div>

      <div className="space-y-8">
        {Object.keys(grouped).length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center text-gray-500">
            No upcoming trips scheduled.
          </div>
        ) : (
          Object.keys(grouped).map(month => (
            <div key={month} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                <h2 className="font-semibold text-lg text-gray-800">{month}</h2>
              </div>
              <div className="divide-y divide-gray-100">
                {grouped[month].map(b => (
                  <Link key={b.id} href={`/admin/bookings/${b.id}`} className="block hover:bg-blue-50 transition p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="bg-black text-white w-14 h-14 rounded-lg flex flex-col items-center justify-center flex-shrink-0">
                          <span className="text-xs uppercase font-medium">{new Intl.DateTimeFormat('en-US', { month: 'short' }).format(new Date(b.travelStart!))}</span>
                          <span className="text-xl font-bold leading-none">{new Date(b.travelStart!).getDate()}</span>
                        </div>
                        <div>
                          <div className="font-semibold text-lg text-gray-900">{b.customer.name}</div>
                          <div className="text-sm text-gray-500 flex items-center gap-2">
                            <span>{b.reference}</span>
                            <span>•</span>
                            <span>{b.adults} Adults {b.children > 0 && `, ${b.children} Children`}</span>
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            End Date: {b.travelEnd ? new Date(b.travelEnd).toLocaleDateString() : 'TBD'}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-start md:items-end gap-2">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {b.status}
                        </span>
                        <div className="text-xs text-gray-500 text-right">
                          {b.assignedVehicle ? `Veh: ${b.assignedVehicle.name}` : 'Veh: Pending'} | 
                          {b.assignedDriver ? ` Drv: ${b.assignedDriver.name}` : ' Drv: Pending'}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
