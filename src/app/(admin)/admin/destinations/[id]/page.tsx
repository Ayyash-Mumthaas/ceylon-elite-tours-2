import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/auth";
import { saveDestination } from "../actions";
import Link from "next/link";

export default async function DestinationEditPage({ params }: { params: Promise<{ id: string }> }) {
  await requirePermission("manage_destinations");

  const { id } = await params;
  const isNew = id === "new";
  let destination = null;

  if (!isNew) {
    destination = await prisma.destination.findUnique({ where: { id } });
    if (!destination) notFound();
  }

  const formatJson = (str: string) => {
    try { return JSON.stringify(JSON.parse(str), null, 2); } catch { return str; }
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-display font-semibold">
          {isNew ? "Create Destination" : `Edit Destination: ${destination?.name}`}
        </h1>
        <Link href="/admin/destinations" className="text-sm text-gray-500 hover:text-gray-900">
          &larr; Back to Destinations
        </Link>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <form action={saveDestination} className="space-y-6">
          <input type="hidden" name="id" value={id} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input type="text" name="name" defaultValue={destination?.name} required className="w-full border border-gray-300 rounded px-3 py-2" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
              <input type="text" name="slug" defaultValue={destination?.slug} required className="w-full border border-gray-300 rounded px-3 py-2" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Region</label>
              <input type="text" name="region" defaultValue={destination?.region || ""} className="w-full border border-gray-300 rounded px-3 py-2" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Short Description *</label>
              <textarea name="shortDescription" defaultValue={destination?.shortDescription} required rows={2} className="w-full border border-gray-300 rounded px-3 py-2"></textarea>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Long Description *</label>
              <textarea name="longDescription" defaultValue={destination?.longDescription} required rows={6} className="w-full border border-gray-300 rounded px-3 py-2"></textarea>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hero Image URL</label>
              <input type="text" name="heroImageId" defaultValue={destination?.heroImageId || ""} className="w-full border border-gray-300 rounded px-3 py-2" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Best Time to Visit</label>
              <input type="text" name="bestTimeToVisit" defaultValue={destination?.bestTimeToVisit || ""} className="w-full border border-gray-300 rounded px-3 py-2" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Recommended Duration</label>
              <input type="text" name="recommendedDuration" defaultValue={destination?.recommendedDuration || ""} className="w-full border border-gray-300 rounded px-3 py-2" />
            </div>
            
            <div className="md:col-span-2 border-t border-gray-200 pt-6 mt-2">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Content</h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Attractions (JSON Array)</label>
              <textarea name="attractionsJson" defaultValue={formatJson(destination?.attractionsJson || "[]")} rows={4} className="w-full border border-gray-300 rounded px-3 py-2 font-mono text-xs"></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Travel Notes (JSON Array)</label>
              <textarea name="travelNotesJson" defaultValue={formatJson(destination?.travelNotesJson || "[]")} rows={4} className="w-full border border-gray-300 rounded px-3 py-2 font-mono text-xs"></textarea>
            </div>
            
            <div className="md:col-span-2 border-t border-gray-200 pt-6 mt-2">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Publishing & SEO</h3>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SEO Title</label>
              <input type="text" name="seoTitle" defaultValue={destination?.seoTitle || ""} className="w-full border border-gray-300 rounded px-3 py-2" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SEO Description</label>
              <input type="text" name="seoDescription" defaultValue={destination?.seoDescription || ""} className="w-full border border-gray-300 rounded px-3 py-2" />
            </div>

            <div className="flex items-center space-x-6 pt-4">
              <label className="flex items-center space-x-2">
                <input type="checkbox" name="published" value="true" defaultChecked={destination?.published} className="rounded border-gray-300" />
                <span className="text-sm font-medium text-gray-700">Published</span>
              </label>
              
              <label className="flex items-center space-x-2">
                <input type="checkbox" name="featured" value="true" defaultChecked={destination?.featured} className="rounded border-gray-300" />
                <span className="text-sm font-medium text-gray-700">Featured</span>
              </label>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-gray-200 flex justify-end">
            <button type="submit" className="bg-black text-white px-6 py-2 rounded font-medium hover:bg-gray-800 transition-colors">
              Save Destination
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
