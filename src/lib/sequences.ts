import { prisma } from "@/lib/prisma";

export async function nextSequence(key: string) {
  const row = await prisma.sequence.upsert({
    where: { key },
    update: { value: { increment: 1 } },
    create: { key, value: 1 },
  });
  return row.value;
}

export async function nextInquiryReference() {
  const year = new Date().getFullYear();
  const n = await nextSequence(`inquiry-${year}`);
  return `CET-INQ-${year}-${String(n).padStart(6, "0")}`;
}

export async function nextQuotationReference() {
  const year = new Date().getFullYear();
  const n = await nextSequence(`quotation-${year}`);
  return `CET-Q-${year}-${String(n).padStart(6, "0")}`;
}

export async function nextBookingReference() {
  const year = new Date().getFullYear();
  const n = await nextSequence(`booking-${year}`);
  return `CET-${year}-${String(n).padStart(6, "0")}`;
}
