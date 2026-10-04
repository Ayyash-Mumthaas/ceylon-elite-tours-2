import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/auth";
import { saveLegalDocument } from "../actions";
import Link from "next/link";

export default async function LegalEditPage({ params }: { params: Promise<{ id: string }> }) {
  await requirePermission("manage_settings");
  const { id } = await params;
  const isNew = id === "new";
  
  let doc = null;
  if (!isNew) {
    doc = await prisma.legalDocument.findUnique({
      where: { id },
      include: { revisions: { orderBy: { createdAt: "desc" } } }
    });
    if (!doc) notFound();
  }

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Link href="/admin/legal" className="text-sm text-gray-500 hover:text-gray-900 mb-2 inline-block">
            &larr; Back to Legal
          </Link>
          <h1 className="text-2xl font-display font-semibold">
            {isNew ? "New Legal Document" : `Edit: ${doc?.title}`}
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form action={saveLegalDocument} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-6">
            <input type="hidden" name="id" value={id} />
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input type="text" name="title" defaultValue={doc?.title} required className="w-full border border-gray-300 rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
                <input type="text" name="slug" defaultValue={doc?.slug} required className="w-full border border-gray-300 rounded px-3 py-2" placeholder="privacy-policy" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Version</label>
                <input type="text" name="version" defaultValue={doc?.version || "1.0"} required className="w-full border border-gray-300 rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select name="status" defaultValue={doc?.status || "DRAFT"} className="w-full border border-gray-300 rounded px-3 py-2">
                  <option value="DRAFT">DRAFT</option>
                  <option value="PUBLISHED">PUBLISHED</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Content (Markdown/HTML)</label>
              <textarea name="content" defaultValue={doc?.content || ""} rows={20} required className="w-full border border-gray-300 rounded px-3 py-2 font-mono text-sm"></textarea>
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <button type="submit" className="bg-black text-white px-6 py-2 rounded font-medium hover:bg-gray-800 transition-colors">
                Save Document
              </button>
            </div>
          </form>
        </div>

        {!isNew && doc && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-medium border-b border-gray-100 pb-3 mb-4">Revision History</h2>
              <div className="space-y-4">
                {doc.revisions.map((rev) => (
                  <div key={rev.id} className="border-l-2 border-gray-200 pl-4 py-1">
                    <div className="text-sm font-medium text-gray-900">v{rev.version}</div>
                    <div className="text-xs text-gray-500">by {rev.actor}</div>
                    <div className="text-xs text-gray-400 mt-1">{new Date(rev.createdAt).toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
