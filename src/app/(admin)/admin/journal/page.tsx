import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { requirePermission } from "@/lib/auth";

export default async function JournalListPage() {
  await requirePermission("manage_journal");

  const posts = await prisma.journalPost.findMany({
    orderBy: { createdAt: "desc" },
    include: { author: true, category: true }
  });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-display font-semibold">Journal</h1>
        <Link href="/admin/journal/new" className="bg-black text-white px-4 py-2 rounded text-sm hover:bg-gray-800 transition-colors">
          New Post
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Title</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Category</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Author</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {posts.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">No posts found.</td></tr>
            ) : (
              posts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{post.title}</td>
                  <td className="px-6 py-4 text-gray-600">{post.category?.name || '-'}</td>
                  <td className="px-6 py-4 text-gray-600">{post.author?.name || '-'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${post.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {post.published ? 'PUBLISHED' : 'DRAFT'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-sm">
                    <Link href={`/admin/journal/${post.id}`} className="text-blue-600 hover:text-blue-900">Edit</Link>
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
