import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { requirePermission } from "@/lib/auth";

export default async function LegalListPage() {
  await requirePermission("manage_settings");

  const documents = await prisma.legalDocument.findMany({
    orderBy: { title: "asc" }
  });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-display font-semibold">Legal & Policies</h1>
        <Link href="/admin/legal/new" className="bg-black text-white px-4 py-2 rounded text-sm hover:bg-gray-800 transition-colors">
          Add Document
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Title</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Slug</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Version</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {documents.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">No legal documents found.</td></tr>
            ) : (
              documents.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{doc.title}</td>
                  <td className="px-6 py-4 text-gray-500 font-mono text-sm">/{doc.slug}</td>
                  <td className="px-6 py-4 text-gray-600">{doc.version}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${doc.status === 'PUBLISHED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {doc.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-sm">
                    <Link href={`/admin/legal/${doc.id}`} className="text-blue-600 hover:text-blue-900">Edit</Link>
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
