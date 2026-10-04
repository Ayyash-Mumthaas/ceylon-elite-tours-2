import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/auth";
import Link from "next/link";

export default async function UsersListPage() {
  await requirePermission("manage_users");

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-display font-semibold">Admin Users</h1>
        <Link href="/admin/users/new" className="bg-black text-white px-4 py-2 rounded text-sm hover:bg-gray-800 transition-colors">
          Add User
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Role</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{u.name || '-'}</td>
                <td className="px-6 py-4 text-gray-600">{u.email}</td>
                <td className="px-6 py-4">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {u.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-right text-sm">
                  <Link href={`/admin/users/${u.id}`} className="text-blue-600 hover:text-blue-900">Edit</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
