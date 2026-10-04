import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Travel Quotation | Ceylon Elite Tours",
};

export default async function PublicQuotationPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  
  const quotation = await prisma.quotation.findUnique({
    where: { publicToken: token },
    include: {
      customer: true,
      items: { orderBy: { sortOrder: "asc" } },
    }
  });

  if (!quotation) notFound();

  // If accepted or declined, they probably shouldn't see action buttons, just the summary
  const isPending = quotation.status === "SENT";

  return (
    <div className="pt-24 pb-20 bg-gray-50 min-h-screen">
      <div className="container max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
          {/* Header */}
          <div className="bg-black text-white p-8 md:p-12 flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-display font-semibold mb-2">Travel Proposal</h1>
              <p className="text-gray-400">Ceylon Elite Tours</p>
            </div>
            <div className="mt-6 md:mt-0 text-left md:text-right">
              <div className="text-sm text-gray-400 uppercase tracking-widest mb-1">Reference</div>
              <div className="text-xl font-mono">{quotation.reference}</div>
              <div className="mt-2 text-sm">
                Valid until: {quotation.validUntil ? new Date(quotation.validUntil).toLocaleDateString() : 'TBD'}
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 pb-12 border-b border-gray-100">
              <div>
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Prepared For</h3>
                <div className="font-medium text-lg">{quotation.customer.name}</div>
                <div className="text-gray-600 mt-1">{quotation.customer.email}</div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Trip Details</h3>
                <div className="grid grid-cols-2 gap-y-3 text-sm">
                  <div className="text-gray-500">Dates</div>
                  <div className="font-medium">
                    {quotation.travelStart ? new Date(quotation.travelStart).toLocaleDateString() : 'TBD'} - 
                    {quotation.travelEnd ? new Date(quotation.travelEnd).toLocaleDateString() : 'TBD'}
                  </div>
                  <div className="text-gray-500">Travellers</div>
                  <div className="font-medium">{quotation.travellers} Person(s)</div>
                </div>
              </div>
            </div>

            {/* Items */}
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-6">Included Services & Itinerary</h3>
            <table className="w-full text-left mb-12">
              <thead>
                <tr className="border-b-2 border-gray-100 text-sm">
                  <th className="py-3 font-semibold text-gray-700">Description</th>
                  <th className="py-3 font-semibold text-gray-700 text-right hidden md:table-cell">Qty</th>
                  <th className="py-3 font-semibold text-gray-700 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {quotation.items.map(item => (
                  <tr key={item.id}>
                    <td className="py-4 text-gray-800">{item.description}</td>
                    <td className="py-4 text-right text-gray-600 hidden md:table-cell">{item.quantity}</td>
                    <td className="py-4 text-right font-medium text-gray-900">{item.amount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals */}
            <div className="flex justify-end border-t border-gray-100 pt-6">
              <div className="w-full md:w-1/2 lg:w-1/3 space-y-3">
                <div className="flex justify-between text-gray-600 text-sm">
                  <span>Subtotal</span>
                  <span>{quotation.subtotal.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                </div>
                {quotation.discount > 0 && (
                  <div className="flex justify-between text-gray-600 text-sm">
                    <span>Discount</span>
                    <span>- {quotation.discount.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                  </div>
                )}
                {quotation.tax > 0 && (
                  <div className="flex justify-between text-gray-600 text-sm">
                    <span>Tax / Fees</span>
                    <span>+ {quotation.tax.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-xl font-bold pt-4 border-t border-gray-200 text-black">
                  <span>Total ({quotation.currency})</span>
                  <span>{quotation.total.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            {isPending && (
              <div className="mt-16 bg-gray-50 p-6 rounded-lg border border-gray-200 text-center">
                <h3 className="font-display font-semibold text-lg mb-2">Proceed with this proposal?</h3>
                <p className="text-gray-600 text-sm mb-6">By accepting, you agree to proceed with the booking. Our team will prepare the final confirmation and payment details.</p>
                
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <form action={async () => {
                    "use server";
                    await prisma.quotation.update({ where: { id: quotation.id }, data: { status: "DECLINED" } });
                    if (quotation.inquiryId) {
                       await prisma.inquiryHistory.create({
                         data: { inquiryId: quotation.inquiryId, action: "QUOTATION_DECLINED", note: "Customer declined the quotation", actor: quotation.customer.name }
                       });
                    }
                    redirect(`/quotation/${token}`);
                  }}>
                    <button type="submit" className="w-full sm:w-auto px-6 py-3 border border-gray-300 rounded font-medium text-gray-700 hover:bg-gray-100 transition">
                      Decline Proposal
                    </button>
                  </form>
                  <form action={async () => {
                    "use server";
                    await prisma.quotation.update({ where: { id: quotation.id }, data: { status: "ACCEPTED" } });
                    if (quotation.inquiryId) {
                       await prisma.inquiryHistory.create({
                         data: { inquiryId: quotation.inquiryId, action: "QUOTATION_ACCEPTED", note: "Customer accepted the quotation", actor: quotation.customer.name }
                       });
                    }
                    redirect(`/quotation/${token}`);
                  }}>
                    <button type="submit" className="w-full sm:w-auto px-8 py-3 bg-black text-white rounded font-medium hover:bg-gray-800 transition shadow-lg hover:shadow-xl">
                      Accept Proposal
                    </button>
                  </form>
                </div>
              </div>
            )}

            {quotation.status === "ACCEPTED" && (
              <div className="mt-16 bg-green-50 text-green-800 p-6 rounded-lg text-center border border-green-100">
                <div className="text-2xl mb-2">✓</div>
                <h3 className="font-semibold text-lg mb-1">Proposal Accepted</h3>
                <p className="text-sm">Thank you! Our team is preparing your booking confirmation and payment details. We will be in touch shortly.</p>
              </div>
            )}
            
            {quotation.status === "DECLINED" && (
              <div className="mt-16 bg-red-50 text-red-800 p-6 rounded-lg text-center border border-red-100">
                <h3 className="font-semibold text-lg mb-1">Proposal Declined</h3>
                <p className="text-sm">You have declined this proposal. Please contact our team if you would like to request revisions.</p>
              </div>
            )}
            
            {quotation.status === "DRAFT" && (
              <div className="mt-16 bg-yellow-50 text-yellow-800 p-6 rounded-lg text-center border border-yellow-100">
                <h3 className="font-semibold text-lg mb-1">Draft Proposal</h3>
                <p className="text-sm">This is a preview of a draft proposal. It is not yet official.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
