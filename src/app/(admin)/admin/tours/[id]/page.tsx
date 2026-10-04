import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/auth";
import { saveTour } from "../actions";
import Link from "next/link";

export default async function TourEditPage({ params }: { params: Promise<{ id: string }> }) {
  await requirePermission("manage_tours");
  
  const { id } = await params;

  const isNew = id === "new";
  let tour = null;

  if (!isNew) {
    tour = await prisma.tour.findUnique({ where: { id } });
    if (!tour) notFound();
  }

  // Helper to safely format JSON strings for textareas
  const formatJson = (str: string) => {
    try {
      return JSON.stringify(JSON.parse(str), null, 2);
    } catch {
      return str;
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-display font-semibold">
          {isNew ? "Create Tour" : `Edit Tour: ${tour?.title}`}
        </h1>
        <Link href="/admin/tours" className="text-sm text-gray-500 hover:text-gray-900">
          &larr; Back to Tours
        </Link>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <form action={saveTour} className="space-y-6">
          <input type="hidden" name="id" value={id} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
              <input
                type="text"
                name="title"
                defaultValue={tour?.title}
                required
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
              <input
                type="text"
                name="slug"
                defaultValue={tour?.slug}
                required
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
              <input
                type="text"
                name="duration"
                defaultValue={tour?.duration || ""}
                placeholder="e.g. 7 Days / 6 Nights"
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Short Description *</label>
              <textarea
                name="shortDescription"
                defaultValue={tour?.shortDescription}
                required
                rows={2}
                className="w-full border border-gray-300 rounded px-3 py-2"
              ></textarea>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Description *</label>
              <textarea
                name="fullDescription"
                defaultValue={tour?.fullDescription}
                required
                rows={6}
                className="w-full border border-gray-300 rounded px-3 py-2"
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Starting Price</label>
              <input
                type="number"
                step="0.01"
                name="startingPrice"
                defaultValue={tour?.startingPrice || ""}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
              <select name="currency" defaultValue={tour?.currency || "USD"} className="w-full border border-gray-300 rounded px-3 py-2">
                <option value="USD">USD</option>
                <option value="LKR">LKR</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hero Image URL</label>
              <input
                type="text"
                name="heroImageId"
                defaultValue={tour?.heroImageId || ""}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Category</label>
              <input
                type="text"
                name="vehicleCategory"
                defaultValue={tour?.vehicleCategory || ""}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>

            <div className="md:col-span-2 border-t border-gray-200 pt-6 mt-2">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Content & Itinerary</h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Inclusions (JSON Array)</label>
              <textarea
                name="inclusionsJson"
                defaultValue={formatJson(tour?.inclusionsJson || "[]")}
                rows={4}
                className="w-full border border-gray-300 rounded px-3 py-2 font-mono text-xs"
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Exclusions (JSON Array)</label>
              <textarea
                name="exclusionsJson"
                defaultValue={formatJson(tour?.exclusionsJson || "[]")}
                rows={4}
                className="w-full border border-gray-300 rounded px-3 py-2 font-mono text-xs"
              ></textarea>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Itinerary (JSON Array of Objects)</label>
              <textarea
                name="itineraryJson"
                defaultValue={formatJson(tour?.itineraryJson || "[]")}
                rows={6}
                className="w-full border border-gray-300 rounded px-3 py-2 font-mono text-xs"
              ></textarea>
            </div>
            
            <div className="md:col-span-2 border-t border-gray-200 pt-6 mt-2">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Publishing & SEO</h3>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SEO Title</label>
              <input
                type="text"
                name="seoTitle"
                defaultValue={tour?.seoTitle || ""}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SEO Description</label>
              <input
                type="text"
                name="seoDescription"
                defaultValue={tour?.seoDescription || ""}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>

            <div className="flex items-center space-x-6 pt-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="published"
                  value="true"
                  defaultChecked={tour?.published}
                  className="rounded border-gray-300"
                />
                <span className="text-sm font-medium text-gray-700">Published (Visible Publicly)</span>
              </label>
              
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="featured"
                  value="true"
                  defaultChecked={tour?.featured}
                  className="rounded border-gray-300"
                />
                <span className="text-sm font-medium text-gray-700">Featured (Homepage)</span>
              </label>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-gray-200 flex justify-end">
            <button
              type="submit"
              className="bg-black text-white px-6 py-2 rounded font-medium hover:bg-gray-800 transition-colors"
            >
              Save Tour
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
