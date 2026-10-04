import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/auth";
import { savePage } from "../actions";
import Link from "next/link";

export default async function PageEditPage({ params }: { params: Promise<{ id: string }> }) {
  await requirePermission("manage_pages");
  const { id } = await params;
  const isNew = id === "new";
  let p = null;

  if (!isNew) {
    p = await prisma.page.findUnique({ where: { id } });
    if (!p) notFound();
  }

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-display font-semibold">
          {isNew ? "Create Page" : `Edit Page: ${p?.title}`}
        </h1>
        <Link href="/admin/pages" className="text-sm text-gray-500 hover:text-gray-900">
          &larr; Back to Pages
        </Link>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <form action={savePage} className="space-y-6">
          <input type="hidden" name="id" value={id} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
              <input type="text" name="title" defaultValue={p?.title} required className="w-full border border-gray-300 rounded px-3 py-2" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
              <input type="text" name="slug" defaultValue={p?.slug} required className="w-full border border-gray-300 rounded px-3 py-2" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Hero Heading</label>
              <input type="text" name="heroHeading" defaultValue={p?.heroHeading || ""} className="w-full border border-gray-300 rounded px-3 py-2" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Hero Subheading</label>
              <input type="text" name="heroSubheading" defaultValue={p?.heroSubheading || ""} className="w-full border border-gray-300 rounded px-3 py-2" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Page Content (Markdown / Text) *</label>
              <textarea name="content" defaultValue={p?.content} required rows={12} className="w-full border border-gray-300 rounded px-3 py-2 font-mono text-sm"></textarea>
            </div>

            <div className="md:col-span-2 border-t border-gray-200 pt-6 mt-2">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Publishing & SEO</h3>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SEO Title</label>
              <input type="text" name="seoTitle" defaultValue={p?.seoTitle || ""} className="w-full border border-gray-300 rounded px-3 py-2" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SEO Description</label>
              <input type="text" name="seoDescription" defaultValue={p?.seoDescription || ""} className="w-full border border-gray-300 rounded px-3 py-2" />
            </div>

            <div className="flex items-center space-x-6 pt-4 md:col-span-2">
              <label className="flex items-center space-x-2">
                <input type="checkbox" name="published" value="true" defaultChecked={p?.published} className="rounded border-gray-300" />
                <span className="text-sm font-medium text-gray-700">Published</span>
              </label>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-gray-200 flex justify-end">
            <button type="submit" className="bg-black text-white px-6 py-2 rounded font-medium hover:bg-gray-800 transition-colors">
              Save Page
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
