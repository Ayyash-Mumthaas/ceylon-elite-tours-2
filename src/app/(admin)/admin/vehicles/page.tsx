import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { requirePermission } from "@/lib/auth";
import { deleteVehicle } from "./actions";

export default async function VehiclesListPage() {
  await requirePermission("manage_vehicles");

  const vehicles = await prisma.vehicle.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-display font-semibold">Fleet / Vehicles</h1>
        <Link href="/admin/vehicles/new" className="bg-black text-white px-4 py-2 rounded text-sm hover:bg-gray-800 transition-colors">
          Add Vehicle
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Category</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Visibility</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {vehicles.length === 0 ? (
              <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">No vehicles found.</td></tr>
            ) : (
              vehicles.map((v) => (
                <tr key={v.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{v.name}</div>
                    <div className="text-xs text-gray-500">/{v.slug}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{v.category}</td>
                  <td className="px-6 py-4">
                    {v.displayPublic ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Public</span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">Hidden</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right text-sm space-x-3">
                    <Link href={`/admin/vehicles/${v.id}`} className="text-blue-600 hover:text-blue-900">Edit</Link>
                    <form action={deleteVehicle.bind(null, v.id)} className="inline">
                      <button className="text-red-600 hover:text-red-900" onClick={(e) => { if (!confirm("Are you sure?")) e.preventDefault(); }}>Delete</button>
                    </form>
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
