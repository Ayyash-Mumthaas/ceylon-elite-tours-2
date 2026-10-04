"use server";

import { prisma } from "@/lib/prisma";
import { requirePermission, requireUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function updateInquiryStatus(id: string, newStatus: string) {
  const user = await requireUser();
  await requirePermission("manage_inquiries");

  await prisma.$transaction(async (tx) => {
    await tx.inquiry.update({
      where: { id },
      data: { status: newStatus },
    });

    await tx.inquiryHistory.create({
      data: {
        inquiryId: id,
        action: "STATUS_CHANGED",
        note: `Status updated to ${newStatus}`,
        actor: user.name || user.email,
      },
    });
  });

  revalidatePath(`/admin/inquiries/${id}`);
  revalidatePath("/admin/inquiries");
}

export async function addInquiryNote(id: string, note: string) {
  const user = await requireUser();
  await requirePermission("manage_inquiries");

  if (!note.trim()) return;

  await prisma.inquiryHistory.create({
    data: {
      inquiryId: id,
      action: "NOTE_ADDED",
      note,
      actor: user.name || user.email,
    },
  });

  revalidatePath(`/admin/inquiries/${id}`);
}
