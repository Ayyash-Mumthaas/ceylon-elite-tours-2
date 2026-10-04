import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/auth";

export default async function AuditLogsPage() {
  await requirePermission("manage_settings"); // Usually SUPER_ADMIN

  const logs = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 100, // Show last 100
  });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-display font-semibold">Security Audit Logs</h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-4 py-3 font-medium text-gray-500 uppercase text-xs">Timestamp</th>
              <th className="px-4 py-3 font-medium text-gray-500 uppercase text-xs">Actor</th>
              <th className="px-4 py-3 font-medium text-gray-500 uppercase text-xs">Action</th>
              <th className="px-4 py-3 font-medium text-gray-500 uppercase text-xs">Resource</th>
              <th className="px-4 py-3 font-medium text-gray-500 uppercase text-xs">Result</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {logs.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-500">No audit logs found.</td></tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{new Date(log.createdAt).toLocaleString()}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{log.actorEmail || 'System'}</td>
                  <td className="px-4 py-3 text-gray-800 font-mono text-xs bg-gray-100 rounded px-1">{log.action}</td>
                  <td className="px-4 py-3 text-gray-600">{log.resource} <span className="text-xs text-gray-400">{log.resourceId}</span></td>
                  <td className="px-4 py-3">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${log.result === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {log.result}
                    </span>
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
