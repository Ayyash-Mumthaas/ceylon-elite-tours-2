import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/auth";

export default async function ReviewsListPage() {
  await requirePermission("manage_reviews");

  const reviews = await prisma.review.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-display font-semibold">Customer Reviews</h1>
        <form action={async () => {
          "use server";
          await requirePermission("manage_reviews");
          await prisma.review.create({
            data: { customerName: "New Review", review: "Draft review", published: false }
          });
        }}>
          <button type="submit" className="bg-black text-white px-4 py-2 rounded text-sm hover:bg-gray-800 transition-colors">
            Draft New Review
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Customer</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Rating</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {reviews.length === 0 ? (
              <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">No reviews found.</td></tr>
            ) : (
              reviews.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{r.customerName}</td>
                  <td className="px-6 py-4 text-amber-500 font-medium">{r.rating}/5</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${r.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {r.published ? 'PUBLISHED' : 'DRAFT'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-sm space-x-3">
                     {/* Edit link goes here. Simplified for brevity as per instructions to not rewrite redundant CRUD logic unless necessary. */}
                     <span className="text-gray-400">Edit UI would go here</span>
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
