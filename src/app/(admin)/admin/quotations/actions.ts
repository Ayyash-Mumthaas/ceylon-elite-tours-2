"use server";

import { prisma } from "@/lib/prisma";
import { requirePermission, requireUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import crypto from "crypto";

export async function createQuotationFromInquiry(inquiryId: string) {
  const user = await requireUser();
  await requirePermission("manage_quotations");

  const inquiry = await prisma.inquiry.findUnique({
    where: { id: inquiryId },
    include: { customer: true }
  });

  if (!inquiry) throw new Error("Inquiry not found");

  const year = new Date().getFullYear();

  const quotation = await prisma.$transaction(async (tx) => {
    // Generate secure unique reference
    const seqKey = `QUO_${year}`;
    const seq = await tx.sequence.upsert({
      where: { key: seqKey },
      update: { value: { increment: 1 } },
      create: { key: seqKey, value: 1 },
    });
    const reference = `CET-QUO-${year}-${seq.value.toString().padStart(6, "0")}`;
    const publicToken = crypto.randomBytes(32).toString('hex');

    const q = await tx.quotation.create({
      data: {
        reference,
        publicToken,
        customerId: inquiry.customerId,
        inquiryId: inquiry.id,
        status: "DRAFT",
        travelStart: inquiry.travelStart,
        travelEnd: inquiry.travelEnd,
        travellers: inquiry.adults + inquiry.children,
        currency: "USD",
        subtotal: 0,
        total: 0,
        validUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
      }
    });

    await tx.inquiryHistory.create({
      data: {
        inquiryId: inquiry.id,
        action: "QUOTATION_CREATED",
        note: `Quotation ${reference} created.`,
        actor: user.name || user.email,
      }
    });

    await tx.inquiry.update({
      where: { id: inquiry.id },
      data: { status: "QUOTATION_PREPARING" }
    });

    return q;
  });

  redirect(`/admin/quotations/${quotation.id}`);
}

export async function recalculateQuotation(tx: any, quotationId: string) {
  const quotation = await tx.quotation.findUnique({
    where: { id: quotationId },
    include: { items: true }
  });

  if (!quotation) return;

  const subtotal = quotation.items.reduce((sum: number, item: any) => sum + item.amount, 0);
  const total = subtotal - quotation.discount + quotation.tax;

  await tx.quotation.update({
    where: { id: quotationId },
    data: { subtotal, total }
  });
}

export async function addQuotationItem(formData: FormData) {
  await requirePermission("manage_quotations");

  const quotationId = formData.get("quotationId") as string;
  const description = formData.get("description") as string;
  const quantity = parseInt(formData.get("quantity") as string) || 1;
  const unitAmount = parseFloat(formData.get("unitAmount") as string) || 0;
  const amount = quantity * unitAmount;

  await prisma.$transaction(async (tx) => {
    await tx.quotationItem.create({
      data: {
        quotationId,
        description,
        quantity,
        unitAmount,
        amount,
      }
    });
    await recalculateQuotation(tx, quotationId);
  });

  revalidatePath(`/admin/quotations/${quotationId}`);
}

export async function removeQuotationItem(itemId: string, quotationId: string) {
  await requirePermission("manage_quotations");

  await prisma.$transaction(async (tx) => {
    await tx.quotationItem.delete({ where: { id: itemId } });
    await recalculateQuotation(tx, quotationId);
  });

  revalidatePath(`/admin/quotations/${quotationId}`);
}

export async function updateQuotationFinancials(formData: FormData) {
  await requirePermission("manage_quotations");

  const id = formData.get("id") as string;
  const discount = parseFloat(formData.get("discount") as string) || 0;
  const tax = parseFloat(formData.get("tax") as string) || 0;
  
  await prisma.$transaction(async (tx) => {
    await tx.quotation.update({
      where: { id },
      data: { discount, tax }
    });
    await recalculateQuotation(tx, id);
  });

  revalidatePath(`/admin/quotations/${id}`);
}

export async function updateQuotationStatus(id: string, newStatus: string) {
  const user = await requireUser();
  await requirePermission("manage_quotations");

  await prisma.$transaction(async (tx) => {
    const q = await tx.quotation.update({
      where: { id },
      data: { status: newStatus }
    });

    if (q.inquiryId && newStatus === "SENT") {
      await tx.inquiry.update({
        where: { id: q.inquiryId },
        data: { status: "QUOTATION_SENT" }
      });
      await tx.inquiryHistory.create({
        data: {
          inquiryId: q.inquiryId,
          action: "QUOTATION_SENT",
          note: `Quotation ${q.reference} sent to customer.`,
          actor: user.name || user.email,
        }
      });
    }
  });

  revalidatePath(`/admin/quotations/${id}`);
}
