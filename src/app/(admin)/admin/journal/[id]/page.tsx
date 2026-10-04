import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/auth";
import { saveJournalPost } from "../actions";
import Link from "next/link";

export default async function JournalEditPage({ params }: { params: Promise<{ id: string }> }) {
  await requirePermission("manage_journal");
  const { id } = await params;
  const isNew = id === "new";
  
  let post = null;
  if (!isNew) {
    post = await prisma.journalPost.findUnique({ where: { id } });
    if (!post) notFound();
  }

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Link href="/admin/journal" className="text-sm text-gray-500 hover:text-gray-900 mb-2 inline-block">
            &larr; Back to Journal
          </Link>
          <h1 className="text-2xl font-display font-semibold">
            {isNew ? "New Post" : `Edit: ${post?.title}`}
          </h1>
        </div>
      </div>

      <form action={saveJournalPost} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-6">
        <input type="hidden" name="id" value={id} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input type="text" name="title" defaultValue={post?.title} required className="w-full border border-gray-300 rounded px-3 py-2" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
            <input type="text" name="slug" defaultValue={post?.slug} required className="w-full border border-gray-300 rounded px-3 py-2" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt *</label>
            <textarea name="excerpt" defaultValue={post?.excerpt} rows={3} required className="w-full border border-gray-300 rounded px-3 py-2"></textarea>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Content (Markdown) *</label>
            <textarea name="content" defaultValue={post?.content} rows={15} required className="w-full border border-gray-300 rounded px-3 py-2 font-mono text-sm"></textarea>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="published" defaultChecked={post?.published} className="w-4 h-4 text-black rounded border-gray-300" />
            <span className="text-sm font-medium text-gray-700">Published</span>
          </label>
          <button type="submit" className="bg-black text-white px-6 py-2 rounded font-medium hover:bg-gray-800 transition-colors">
            Save Post
          </button>
        </div>
      </form>
    </div>
  );
}
