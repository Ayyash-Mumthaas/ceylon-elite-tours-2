import { requireUser } from "@/lib/auth";
import Link from "next/link";
import { ReactNode } from "react";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await requireUser();

  return (
    <div className="min-h-screen flex bg-gray-50 text-sm">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h2 className="font-display font-semibold text-lg">CET Control Center</h2>
          <p className="text-gray-500 text-xs mt-1">{user.role}</p>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <Link href="/admin" className="block px-3 py-2 rounded text-gray-700 hover:bg-gray-50">Dashboard</Link>
          <Link href="/admin/inquiries" className="block px-3 py-2 rounded text-gray-700 hover:bg-gray-50">Inquiries</Link>
          <Link href="/admin/quotations" className="block px-3 py-2 rounded text-gray-700 hover:bg-gray-50">Quotations</Link>
          <Link href="/admin/bookings" className="block px-3 py-2 rounded text-gray-700 hover:bg-gray-50">Bookings</Link>
          <Link href="/admin/calendar" className="block px-3 py-2 rounded text-gray-700 hover:bg-gray-50">Calendar</Link>
          <div className="pt-4 mt-4 border-t border-gray-100">
            <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Operations & CMS</p>
            <Link href="/admin/tours" className="block px-3 py-2 rounded text-gray-700 hover:bg-gray-50">Tours</Link>
            <Link href="/admin/destinations" className="block px-3 py-2 rounded text-gray-700 hover:bg-gray-50">Destinations</Link>
            <Link href="/admin/experiences" className="block px-3 py-2 rounded text-gray-700 hover:bg-gray-50">Experiences</Link>
            <Link href="/admin/journal" className="block px-3 py-2 rounded text-gray-700 hover:bg-gray-50">Journal</Link>
            <Link href="/admin/reviews" className="block px-3 py-2 rounded text-gray-700 hover:bg-gray-50">Reviews</Link>
            <Link href="/admin/vehicles" className="block px-3 py-2 rounded text-gray-700 hover:bg-gray-50">Vehicles</Link>
            <Link href="/admin/drivers" className="block px-3 py-2 rounded text-gray-700 hover:bg-gray-50">Drivers</Link>
            <Link href="/admin/pages" className="block px-3 py-2 rounded text-gray-700 hover:bg-gray-50">Pages</Link>
            <Link href="/admin/media" className="block px-3 py-2 rounded text-gray-700 hover:bg-gray-50">Media Library</Link>
            <Link href="/admin/legal" className="block px-3 py-2 rounded text-gray-700 hover:bg-gray-50">Legal & Policies</Link>
            <Link href="/admin/users" className="block px-3 py-2 rounded text-gray-700 hover:bg-gray-50">Admin Users</Link>
            <Link href="/admin/settings" className="block px-3 py-2 rounded text-gray-700 hover:bg-gray-50">Global Settings</Link>
            <Link href="/admin/audit-logs" className="block px-3 py-2 rounded text-gray-700 hover:bg-gray-50">Security Audit Logs</Link>
          </div>
        </nav>
        <div className="p-4 border-t border-gray-200">
          <p className="text-gray-700 mb-2 truncate px-2">{user.email}</p>
          <form action="/api/admin/logout" method="POST">
            <button className="w-full text-left px-2 py-1 text-red-600 hover:bg-red-50 rounded">
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
