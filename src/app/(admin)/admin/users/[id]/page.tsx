import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/auth";
import { saveUser } from "../actions";
import Link from "next/link";

export default async function UserEditPage({ params }: { params: Promise<{ id: string }> }) {
  await requirePermission("manage_users");
  const { id } = await params;
  const isNew = id === "new";
  
  let user = null;
  if (!isNew) {
    user = await prisma.user.findUnique({ where: { id } });
    if (!user) notFound();
  }

  return (
    <div className="max-w-3xl mx-auto pb-12">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Link href="/admin/users" className="text-sm text-gray-500 hover:text-gray-900 mb-2 inline-block">
            &larr; Back to Users
          </Link>
          <h1 className="text-2xl font-display font-semibold">
            {isNew ? "New Admin User" : `Edit User: ${user?.name || user?.email}`}
          </h1>
        </div>
      </div>

      <form action={saveUser} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-6">
        <input type="hidden" name="id" value={id} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input type="text" name="name" defaultValue={user?.name || ""} className="w-full border border-gray-300 rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input type="email" name="email" defaultValue={user?.email || ""} required className="w-full border border-gray-300 rounded px-3 py-2" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
            <select name="role" defaultValue={user?.role || "VIEWER"} required className="w-full border border-gray-300 rounded px-3 py-2">
              <option value="SUPER_ADMIN">SUPER_ADMIN (Full access)</option>
              <option value="ADMIN">ADMIN (General management)</option>
              <option value="SALES">SALES (Inquiries, Quotations, Customers)</option>
              <option value="CONTENT_EDITOR">CONTENT_EDITOR (Tours, Pages, Journal)</option>
              <option value="OPERATIONS">OPERATIONS (Bookings, Vehicles, Drivers)</option>
              <option value="VIEWER">VIEWER (Read-only access)</option>
            </select>
          </div>
        </div>

        {isNew && (
          <div className="text-sm text-gray-500 bg-gray-50 p-4 rounded">
            The temporary password for this new user will be: <strong>Temp1234!</strong><br/>
            They should change it immediately upon logging in.
          </div>
        )}

        <div className="pt-4 border-t border-gray-100 flex justify-end">
          <button type="submit" className="bg-black text-white px-6 py-2 rounded font-medium hover:bg-gray-800 transition-colors">
            Save User
          </button>
        </div>
      </form>
    </div>
  );
}
