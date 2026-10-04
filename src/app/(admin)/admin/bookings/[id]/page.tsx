import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/auth";
import Link from "next/link";
import { updateBookingStatus, updatePayment, assignVehicle, assignDriver } from "../actions";

export default async function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requirePermission("manage_bookings");
  const { id } = await params;

  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      customer: true,
      timeline: { orderBy: { createdAt: "desc" } },
      payments: { orderBy: { createdAt: "desc" } },
      assignedVehicle: true,
      assignedDriver: true
    }
  });

  if (!booking) notFound();

  const vehicles = await prisma.vehicle.findMany({ orderBy: { name: "asc" } });
  const drivers = await prisma.driver.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Link href="/admin/bookings" className="text-sm text-gray-500 hover:text-gray-900 mb-2 inline-block">
            &larr; Back to Bookings
          </Link>
          <h1 className="text-2xl font-display font-semibold flex items-center gap-3">
            Booking <span className="font-mono text-gray-500 text-xl">{booking.reference}</span>
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <form action={async (formData: FormData) => {
            "use server";
            await updateBookingStatus(id, formData.get("status") as string);
          }}>
            <select 
              name="status" 
              defaultValue={booking.status}
              onChange={(e) => e.target.form?.submit()}
              className="border border-gray-300 rounded px-3 py-1.5 text-sm font-medium"
            >
              <option value="NEW">NEW</option>
              <option value="CONFIRMED">CONFIRMED</option>
              <option value="VEHICLE_ASSIGNED">VEHICLE ASSIGNED</option>
              <option value="DRIVER_ASSIGNED">DRIVER ASSIGNED</option>
              <option value="UPCOMING">UPCOMING</option>
              <option value="IN_PROGRESS">IN PROGRESS</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
            <noscript><button type="submit" className="ml-2 bg-gray-200 px-2 py-1 text-xs">Update</button></noscript>
          </form>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-medium border-b border-gray-100 pb-3 mb-4">Operations & Assignments</h2>
            
            <div className="grid grid-cols-2 gap-6">
              {/* Vehicle Assignment */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">Vehicle</h3>
                {booking.assignedVehicle ? (
                  <div className="mb-4">
                    <div className="font-medium">{booking.assignedVehicle.name}</div>
                    <div className="text-sm text-gray-500">{booking.assignedVehicle.category}</div>
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 mb-4">No vehicle assigned. Request: {booking.vehicleCategory || 'None'}</div>
                )}
                
                <form action={assignVehicle} className="flex gap-2">
                  <input type="hidden" name="bookingId" value={booking.id} />
                  <select name="assignedVehicleId" className="border border-gray-300 rounded px-2 py-1.5 text-sm flex-1">
                    <option value="">Select a vehicle...</option>
                    {vehicles.map(v => (
                      <option key={v.id} value={v.id}>{v.name} ({v.category})</option>
                    ))}
                  </select>
                  <button type="submit" className="bg-black text-white px-3 py-1.5 rounded text-xs font-medium">Assign</button>
                </form>
              </div>

              {/* Driver Assignment */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">Driver</h3>
                {booking.assignedDriver ? (
                  <div className="mb-4">
                    <div className="font-medium">{booking.assignedDriver.name}</div>
                    <div className="text-sm text-gray-500">{booking.assignedDriver.phone || "No phone"}</div>
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 mb-4">No driver assigned.</div>
                )}
                
                <form action={assignDriver} className="flex gap-2">
                  <input type="hidden" name="bookingId" value={booking.id} />
                  <select name="assignedDriverId" className="border border-gray-300 rounded px-2 py-1.5 text-sm flex-1">
                    <option value="">Select a driver...</option>
                    {drivers.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                  <button type="submit" className="bg-black text-white px-3 py-1.5 rounded text-xs font-medium">Assign</button>
                </form>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-medium border-b border-gray-100 pb-3 mb-4">Payment Tracking</h2>
            
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded border border-gray-200">
                <span className="block text-xs text-gray-500 uppercase mb-1">Total</span>
                <span className="font-semibold text-lg">{booking.currency} {booking.quotedAmount.toLocaleString()}</span>
              </div>
              <div className="bg-green-50 p-4 rounded border border-green-100">
                <span className="block text-xs text-green-700 uppercase mb-1">Received</span>
                <span className="font-semibold text-lg text-green-700">{booking.currency} {booking.depositReceived.toLocaleString()}</span>
              </div>
              <div className="bg-red-50 p-4 rounded border border-red-100">
                <span className="block text-xs text-red-700 uppercase mb-1">Balance Due</span>
                <span className="font-semibold text-lg text-red-700">{booking.currency} {booking.balance.toLocaleString()}</span>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-100 pb-2">Record a Payment</h3>
              <form action={updatePayment} className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <input type="hidden" name="bookingId" value={booking.id} />
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Amount</label>
                  <input type="number" name="amount" step="0.01" required className="w-full border rounded px-2 py-1.5 text-sm" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Method</label>
                  <input type="text" name="method" required className="w-full border rounded px-2 py-1.5 text-sm" placeholder="e.g. Bank Transfer" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Reference No</label>
                  <input type="text" name="referenceNo" className="w-full border rounded px-2 py-1.5 text-sm" placeholder="Optional" />
                </div>
                <div className="flex items-end">
                  <button type="submit" className="w-full bg-black text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-gray-800">Record</button>
                </div>
              </form>
            </div>

            {booking.payments.length > 0 && (
              <div className="mt-8">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">Payment History</h3>
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 font-medium text-gray-500">Date</th>
                      <th className="px-3 py-2 font-medium text-gray-500">Method</th>
                      <th className="px-3 py-2 font-medium text-gray-500">Ref</th>
                      <th className="px-3 py-2 font-medium text-gray-500 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {booking.payments.map(p => (
                      <tr key={p.id}>
                        <td className="px-3 py-2 text-gray-600">{new Date(p.createdAt).toLocaleDateString()}</td>
                        <td className="px-3 py-2">{p.method}</td>
                        <td className="px-3 py-2 text-gray-500 font-mono text-xs">{p.referenceNo || '-'}</td>
                        <td className="px-3 py-2 text-right font-medium">{p.currency} {p.amount.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-medium border-b border-gray-100 pb-3 mb-4">Customer</h2>
            <div className="text-sm space-y-2">
              <div><span className="text-gray-500 block text-xs">Name</span>{booking.customer.name}</div>
              <div><span className="text-gray-500 block text-xs">Email</span>{booking.customer.email}</div>
              <div><span className="text-gray-500 block text-xs">Phone</span>{booking.customer.whatsapp || booking.customer.phone || "-"}</div>
            </div>
            {booking.quotationId && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <Link href={`/admin/quotations/${booking.quotationId}`} className="text-blue-600 text-sm hover:underline">
                  View Source Quotation &rarr;
                </Link>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Activity Timeline</h3>
            <div className="space-y-4">
              {booking.timeline.map((hist) => (
                <div key={hist.id} className="border-l-2 border-gray-200 pl-4 py-1">
                  <div className="text-xs text-gray-400 mb-1">{new Date(hist.createdAt).toLocaleString()}</div>
                  <div className="text-sm font-medium text-gray-900">{hist.event}</div>
                  {hist.note && <div className="text-sm text-gray-600 mt-1">{hist.note}</div>}
                  <div className="text-xs text-gray-500 mt-1">by {hist.actor || 'System'}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
