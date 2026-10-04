import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/auth";
import { saveDriver } from "../actions";
import Link from "next/link";

export default async function DriverEditPage({ params }: { params: Promise<{ id: string }> }) {
  await requirePermission("manage_vehicles");
  const { id } = await params;
  const isNew = id === "new";
  let d = null;

  if (!isNew) {
    d = await prisma.driver.findUnique({ where: { id } });
    if (!d) notFound();
  }

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-display font-semibold">
          {isNew ? "Add Driver" : `Edit Driver: ${d?.name}`}
        </h1>
        <Link href="/admin/drivers" className="text-sm text-gray-500 hover:text-gray-900">
          &larr; Back to Drivers
        </Link>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <form action={saveDriver} className="space-y-6">
          <input type="hidden" name="id" value={id} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <input type="text" name="name" defaultValue={d?.name} required className="w-full border border-gray-300 rounded px-3 py-2" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input type="text" name="phone" defaultValue={d?.phone || ""} className="w-full border border-gray-300 rounded px-3 py-2" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">License Information</label>
              <input type="text" name="licenseInfo" defaultValue={d?.licenseInfo || ""} className="w-full border border-gray-300 rounded px-3 py-2" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type (Usually Drives)</label>
              <input type="text" name="vehicleNote" defaultValue={d?.vehicleNote || ""} className="w-full border border-gray-300 rounded px-3 py-2" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select name="status" defaultValue={d?.status || "ACTIVE"} className="w-full border border-gray-300 rounded px-3 py-2">
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
                <option value="ON_LEAVE">ON LEAVE</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Internal Notes (Hidden from public)</label>
              <textarea name="notes" defaultValue={d?.notes || ""} rows={4} className="w-full border border-gray-300 rounded px-3 py-2"></textarea>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-gray-200 flex justify-end">
            <button type="submit" className="bg-black text-white px-6 py-2 rounded font-medium hover:bg-gray-800 transition-colors">
              Save Driver
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
