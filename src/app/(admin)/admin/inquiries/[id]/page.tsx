import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/auth";
import Link from "next/link";
import { updateInquiryStatus, addInquiryNote } from "../actions";
import { createQuotationFromInquiry } from "../../quotations/actions";

export default async function InquiryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requirePermission("manage_inquiries");
  const { id } = await params;

  const inquiry = await prisma.inquiry.findUnique({
    where: { id },
    include: {
      customer: true,
      destinations: { include: { destination: true } },
      experiences: { include: { experience: true } },
      history: { orderBy: { createdAt: "desc" } },
      assignedStaff: true,
    }
  });

  if (!inquiry) notFound();

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Link href="/admin/inquiries" className="text-sm text-gray-500 hover:text-gray-900 mb-2 inline-block">
            &larr; Back to Inbox
          </Link>
          <h1 className="text-2xl font-display font-semibold flex items-center gap-3">
            Inquiry <span className="font-mono text-gray-500 text-xl">{inquiry.reference}</span>
          </h1>
        </div>
        <div className="flex items-center gap-4">
          {["NEW", "CONTACTED", "QUOTATION_PREPARING"].includes(inquiry.status) && (
            <form action={createQuotationFromInquiry.bind(null, id)}>
              <button type="submit" className="bg-black text-white px-4 py-1.5 rounded text-sm font-medium hover:bg-gray-800 transition">
                Create Quotation
              </button>
            </form>
          )}
          <form action={async (formData: FormData) => {
            "use server";
            await updateInquiryStatus(id, formData.get("status") as string);
          }}>
            <select 
              name="status" 
              defaultValue={inquiry.status}
              onChange={(e) => e.target.form?.submit()}
              className="border border-gray-300 rounded px-3 py-1.5 text-sm font-medium"
            >
              <option value="NEW">NEW</option>
              <option value="CONTACTED">CONTACTED</option>
              <option value="QUOTATION_PREPARING">QUOTATION PREPARING</option>
              <option value="QUOTATION_SENT">QUOTATION SENT</option>
              <option value="AWAITING_CONFIRMATION">AWAITING CONFIRMATION</option>
              <option value="CONFIRMED">CONFIRMED</option>
              <option value="CANCELLED">CANCELLED</option>
              <option value="ARCHIVED">ARCHIVED</option>
            </select>
            <noscript><button type="submit" className="ml-2 bg-gray-200 px-2 py-1 text-xs">Update</button></noscript>
          </form>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-medium border-b border-gray-100 pb-3 mb-4">Customer Details</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-gray-500 block">Name</span><span className="font-medium">{inquiry.customer.name}</span></div>
              <div><span className="text-gray-500 block">Email</span><span className="font-medium">{inquiry.customer.email}</span></div>
              <div><span className="text-gray-500 block">Phone/WhatsApp</span><span className="font-medium">{inquiry.customer.whatsapp || inquiry.customer.phone || "-"}</span></div>
              <div><span className="text-gray-500 block">Country</span><span className="font-medium">{inquiry.customer.country || "-"}</span></div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-medium border-b border-gray-100 pb-3 mb-4">Trip Requirements</h2>
            <div className="grid grid-cols-2 gap-4 text-sm mb-6">
              <div>
                <span className="text-gray-500 block">Travel Dates</span>
                <span className="font-medium">
                  {inquiry.travelStart ? new Date(inquiry.travelStart).toLocaleDateString() : 'TBD'} to {inquiry.travelEnd ? new Date(inquiry.travelEnd).toLocaleDateString() : 'TBD'}
                </span>
                {inquiry.durationNote && <span className="block text-gray-500 mt-1">({inquiry.durationNote})</span>}
              </div>
              <div>
                <span className="text-gray-500 block">Travel Party</span>
                <span className="font-medium">{inquiry.adults} Adults, {inquiry.children} Children ({inquiry.travellerType || '-'})</span>
              </div>
              <div>
                <span className="text-gray-500 block">Accommodation</span>
                <span className="font-medium">{inquiry.accommodation || "Flexible"}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Vehicle Preference</span>
                <span className="font-medium">{inquiry.vehicleCategory || "Flexible"}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Budget Range</span>
                <span className="font-medium">{inquiry.budgetRange || "Not specified"}</span>
              </div>
            </div>

            {inquiry.destinations.length > 0 && (
              <div className="mb-4">
                <span className="text-gray-500 block text-sm mb-1">Requested Destinations</span>
                <div className="flex flex-wrap gap-2">
                  {inquiry.destinations.map(d => (
                    <span key={d.id} className="bg-gray-100 px-2 py-1 rounded text-xs">{d.destination.name}</span>
                  ))}
                </div>
              </div>
            )}

            {inquiry.experiences.length > 0 && (
              <div className="mb-4">
                <span className="text-gray-500 block text-sm mb-1">Interested Experiences</span>
                <div className="flex flex-wrap gap-2">
                  {inquiry.experiences.map(e => (
                    <span key={e.id} className="bg-blue-50 text-blue-700 border border-blue-100 px-2 py-1 rounded text-xs">{e.experience.name}</span>
                  ))}
                </div>
              </div>
            )}
            
            {inquiry.specialRequirements && (
              <div className="mt-6 pt-4 border-t border-gray-100">
                <span className="text-gray-500 block text-sm mb-2">Customer Message / Requirements</span>
                <p className="text-gray-800 text-sm whitespace-pre-wrap bg-gray-50 p-4 rounded">{inquiry.specialRequirements}</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar: Workflow & Timeline */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-medium border-b border-gray-100 pb-3 mb-4">Internal Notes (Hidden from Customer)</h2>
            <form action={async (formData: FormData) => {
              "use server";
              await addInquiryNote(id, formData.get("note") as string);
            }} className="mb-6">
              <textarea name="note" rows={3} required className="w-full border border-gray-300 rounded px-3 py-2 text-sm mb-2" placeholder="Add an internal note..."></textarea>
              <button type="submit" className="bg-black text-white px-4 py-2 rounded text-sm w-full hover:bg-gray-800">Save Note</button>
            </form>

            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Activity Timeline</h3>
            <div className="space-y-4">
              {inquiry.history.map((hist) => (
                <div key={hist.id} className="border-l-2 border-gray-200 pl-4 py-1">
                  <div className="text-xs text-gray-400 mb-1">{new Date(hist.createdAt).toLocaleString()}</div>
                  <div className="text-sm font-medium text-gray-900">{hist.action}</div>
                  {hist.note && <div className="text-sm text-gray-600 mt-1">{hist.note}</div>}
                  <div className="text-xs text-gray-500 mt-1">by {hist.actor || 'System'}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
