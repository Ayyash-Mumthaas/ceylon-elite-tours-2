import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/auth";
import Link from "next/link";
import { addQuotationItem, removeQuotationItem, updateQuotationFinancials, updateQuotationStatus } from "../actions";

export default async function QuotationEditorPage({ params }: { params: Promise<{ id: string }> }) {
  await requirePermission("manage_quotations");
  const { id } = await params;

  const quotation = await prisma.quotation.findUnique({
    where: { id },
    include: {
      customer: true,
      items: { orderBy: { sortOrder: "asc" } },
    }
  });

  if (!quotation) notFound();

  const isEditable = quotation.status === "DRAFT";

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Link href="/admin/quotations" className="text-sm text-gray-500 hover:text-gray-900 mb-2 inline-block">
            &larr; Back to Quotations
          </Link>
          <h1 className="text-2xl font-display font-semibold flex items-center gap-3">
            Quotation <span className="font-mono text-gray-500 text-xl">{quotation.reference}</span>
          </h1>
        </div>
        <div className="flex items-center gap-4">
          {quotation.status === "ACCEPTED" && (
            <form action={async () => {
              "use server";
              const { createBookingFromQuotation } = await import("../../bookings/actions");
              await createBookingFromQuotation(id);
            }}>
              <button type="submit" className="bg-green-600 text-white px-4 py-1.5 rounded text-sm font-medium hover:bg-green-700 transition">
                Create Booking
              </button>
            </form>
          )}
          <a href={`/quotation/${quotation.publicToken}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-sm hover:underline">
            Preview Customer View &nearr;
          </a>
          <form action={async (formData: FormData) => {
            "use server";
            await updateQuotationStatus(id, formData.get("status") as string);
          }}>
            <select 
              name="status" 
              defaultValue={quotation.status}
              onChange={(e) => e.target.form?.submit()}
              className="border border-gray-300 rounded px-3 py-1.5 text-sm font-medium ml-4"
            >
              <option value="DRAFT">DRAFT</option>
              <option value="SENT">SENT</option>
              <option value="ACCEPTED">ACCEPTED (Manual override)</option>
              <option value="DECLINED">DECLINED (Manual override)</option>
              <option value="EXPIRED">EXPIRED</option>
            </select>
            <noscript><button type="submit" className="ml-2 bg-gray-200 px-2 py-1 text-xs">Update</button></noscript>
          </form>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Items Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
              <h2 className="font-medium">Quotation Items</h2>
            </div>
            
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-200 text-xs text-gray-500 uppercase">
                  <th className="px-4 py-3">Description</th>
                  <th className="px-4 py-3 text-right">Qty</th>
                  <th className="px-4 py-3 text-right">Unit Price</th>
                  <th className="px-4 py-3 text-right">Total</th>
                  {isEditable && <th className="px-4 py-3"></th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {quotation.items.map(item => (
                  <tr key={item.id}>
                    <td className="px-4 py-3 text-sm">{item.description}</td>
                    <td className="px-4 py-3 text-sm text-right">{item.quantity}</td>
                    <td className="px-4 py-3 text-sm text-right">{item.unitAmount.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-right font-medium">{item.amount.toLocaleString()}</td>
                    {isEditable && (
                      <td className="px-4 py-3 text-right">
                        <form action={async () => {
                          "use server";
                          await removeQuotationItem(item.id, quotation.id);
                        }}>
                          <button type="submit" className="text-red-500 hover:text-red-700 text-xs">Remove</button>
                        </form>
                      </td>
                    )}
                  </tr>
                ))}
                {quotation.items.length === 0 && (
                  <tr><td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-500">No items added yet.</td></tr>
                )}
              </tbody>
            </table>

            {isEditable && (
              <div className="p-4 bg-gray-50 border-t border-gray-200">
                <form action={addQuotationItem} className="flex gap-2 items-end">
                  <input type="hidden" name="quotationId" value={quotation.id} />
                  <div className="flex-1">
                    <label className="block text-xs text-gray-500 mb-1">Description</label>
                    <input type="text" name="description" required className="w-full border rounded px-2 py-1.5 text-sm" placeholder="e.g. 5 Nights Luxury Accommodation" />
                  </div>
                  <div className="w-20">
                    <label className="block text-xs text-gray-500 mb-1">Qty</label>
                    <input type="number" name="quantity" defaultValue={1} min={1} required className="w-full border rounded px-2 py-1.5 text-sm" />
                  </div>
                  <div className="w-32">
                    <label className="block text-xs text-gray-500 mb-1">Unit Price</label>
                    <input type="number" name="unitAmount" step="0.01" required className="w-full border rounded px-2 py-1.5 text-sm" placeholder="0.00" />
                  </div>
                  <button type="submit" className="bg-black text-white px-4 py-1.5 rounded text-sm hover:bg-gray-800 h-[34px]">Add Item</button>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar: Financials & Details */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-medium border-b border-gray-100 pb-3 mb-4">Financials ({quotation.currency})</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal</span>
                <span>{quotation.subtotal.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
              </div>
              <div className="flex justify-between text-red-600">
                <span>Discount</span>
                <span>- {quotation.discount.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Tax/Fees</span>
                <span>+ {quotation.tax.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
              </div>
              <div className="pt-3 border-t border-gray-200 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>{quotation.total.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
              </div>
            </div>

            {isEditable && (
              <form action={updateQuotationFinancials} className="mt-6 pt-6 border-t border-gray-200 space-y-4">
                <input type="hidden" name="id" value={quotation.id} />
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Discount Amount</label>
                  <input type="number" name="discount" step="0.01" defaultValue={quotation.discount} className="w-full border rounded px-2 py-1.5 text-sm" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Tax / Fees</label>
                  <input type="number" name="tax" step="0.01" defaultValue={quotation.tax} className="w-full border rounded px-2 py-1.5 text-sm" />
                </div>
                <button type="submit" className="w-full bg-gray-100 text-black px-4 py-2 rounded text-sm hover:bg-gray-200 border border-gray-300">
                  Update Financials
                </button>
              </form>
            )}
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-medium border-b border-gray-100 pb-3 mb-4">Customer Details</h2>
            <div className="text-sm space-y-2">
              <div><span className="text-gray-500 block text-xs">Name</span>{quotation.customer.name}</div>
              <div><span className="text-gray-500 block text-xs">Email</span>{quotation.customer.email}</div>
            </div>
            {quotation.inquiryId && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <Link href={`/admin/inquiries/${quotation.inquiryId}`} className="text-blue-600 text-sm hover:underline">
                  View Source Inquiry &rarr;
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
