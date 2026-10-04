import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/auth";
import { saveVehicle } from "../actions";
import Link from "next/link";

export default async function VehicleEditPage({ params }: { params: Promise<{ id: string }> }) {
  await requirePermission("manage_vehicles");
  const { id } = await params;
  const isNew = id === "new";
  let v = null;

  if (!isNew) {
    v = await prisma.vehicle.findUnique({ where: { id } });
    if (!v) notFound();
  }

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-display font-semibold">
          {isNew ? "Add Vehicle" : `Edit Vehicle: ${v?.name}`}
        </h1>
        <Link href="/admin/vehicles" className="text-sm text-gray-500 hover:text-gray-900">
          &larr; Back to Fleet
        </Link>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <form action={saveVehicle} className="space-y-6">
          <input type="hidden" name="id" value={id} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input type="text" name="name" defaultValue={v?.name} required className="w-full border border-gray-300 rounded px-3 py-2" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
              <input type="text" name="slug" defaultValue={v?.slug} required className="w-full border border-gray-300 rounded px-3 py-2" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <input type="text" name="category" defaultValue={v?.category} required className="w-full border border-gray-300 rounded px-3 py-2" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Passenger Capacity</label>
              <input type="number" name="passengerCapacity" defaultValue={v?.passengerCapacity || ""} className="w-full border border-gray-300 rounded px-3 py-2" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Luggage Capacity</label>
              <input type="text" name="luggageCapacity" defaultValue={v?.luggageCapacity || ""} className="w-full border border-gray-300 rounded px-3 py-2" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
              <textarea name="description" defaultValue={v?.description} required rows={4} className="w-full border border-gray-300 rounded px-3 py-2"></textarea>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hero Image URL</label>
              <input type="text" name="heroImageId" defaultValue={v?.heroImageId || ""} className="w-full border border-gray-300 rounded px-3 py-2" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Comfort Level</label>
              <input type="text" name="comfortLevel" defaultValue={v?.comfortLevel || ""} className="w-full border border-gray-300 rounded px-3 py-2" />
            </div>

            <div className="flex items-center space-x-6 pt-4 md:col-span-2 border-t border-gray-200 mt-2">
              <label className="flex items-center space-x-2">
                <input type="checkbox" name="airConditioning" value="true" defaultChecked={v?.airConditioning ?? true} className="rounded border-gray-300" />
                <span className="text-sm font-medium text-gray-700">Air Conditioning</span>
              </label>

              <label className="flex items-center space-x-2">
                <input type="checkbox" name="displayPublic" value="true" defaultChecked={v?.displayPublic ?? true} className="rounded border-gray-300" />
                <span className="text-sm font-medium text-gray-700">Display Publicly</span>
              </label>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-gray-200 flex justify-end">
            <button type="submit" className="bg-black text-white px-6 py-2 rounded font-medium hover:bg-gray-800 transition-colors">
              Save Vehicle
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
