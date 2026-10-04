import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/auth";
import { saveExperience } from "../actions";
import Link from "next/link";

export default async function ExperienceEditPage({ params }: { params: Promise<{ id: string }> }) {
  await requirePermission("manage_experiences");
  const { id } = await params;
  const isNew = id === "new";
  let exp = null;

  if (!isNew) {
    exp = await prisma.experience.findUnique({ where: { id } });
    if (!exp) notFound();
  }

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-display font-semibold">
          {isNew ? "Create Experience" : `Edit Experience: ${exp?.name}`}
        </h1>
        <Link href="/admin/experiences" className="text-sm text-gray-500 hover:text-gray-900">
          &larr; Back to Experiences
        </Link>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <form action={saveExperience} className="space-y-6">
          <input type="hidden" name="id" value={id} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input type="text" name="name" defaultValue={exp?.name} required className="w-full border border-gray-300 rounded px-3 py-2" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
              <input type="text" name="slug" defaultValue={exp?.slug} required className="w-full border border-gray-300 rounded px-3 py-2" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Icon / Hero Image URL</label>
              <input type="text" name="heroImageId" defaultValue={exp?.heroImageId || ""} className="w-full border border-gray-300 rounded px-3 py-2" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
              <textarea name="description" defaultValue={exp?.description} required rows={6} className="w-full border border-gray-300 rounded px-3 py-2"></textarea>
            </div>

            <div className="md:col-span-2 border-t border-gray-200 pt-6 mt-2">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Publishing & SEO</h3>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SEO Title</label>
              <input type="text" name="seoTitle" defaultValue={exp?.seoTitle || ""} className="w-full border border-gray-300 rounded px-3 py-2" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SEO Description</label>
              <input type="text" name="seoDescription" defaultValue={exp?.seoDescription || ""} className="w-full border border-gray-300 rounded px-3 py-2" />
            </div>

            <div className="flex items-center space-x-6 pt-4">
              <label className="flex items-center space-x-2">
                <input type="checkbox" name="published" value="true" defaultChecked={exp?.published} className="rounded border-gray-300" />
                <span className="text-sm font-medium text-gray-700">Published</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" name="featured" value="true" defaultChecked={exp?.featured} className="rounded border-gray-300" />
                <span className="text-sm font-medium text-gray-700">Featured</span>
              </label>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-gray-200 flex justify-end">
            <button type="submit" className="bg-black text-white px-6 py-2 rounded font-medium hover:bg-gray-800 transition-colors">
              Save Experience
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
