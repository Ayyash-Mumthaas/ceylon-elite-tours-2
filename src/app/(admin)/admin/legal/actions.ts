"use server";

import { prisma } from "@/lib/prisma";
import { requirePermission, requireUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function saveLegalDocument(formData: FormData) {
  const user = await requireUser();
  await requirePermission("manage_settings");

  const id = formData.get("id") as string;
  const isNew = !id || id === "new";
  
  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const content = formData.get("content") as string;
  const version = formData.get("version") as string;
  const status = formData.get("status") as string;

  const data = {
    title,
    slug,
    content,
    version,
    status,
    publishedAt: status === "PUBLISHED" ? new Date() : null,
  };

  await prisma.$transaction(async (tx) => {
    let docId = id;
    if (isNew) {
      const doc = await tx.legalDocument.create({ data });
      docId = doc.id;
    } else {
      await tx.legalDocument.update({ where: { id }, data });
    }

    await tx.legalRevision.create({
      data: {
        documentId: docId,
        content,
        version,
        actor: user.name || user.email,
      }
    });
  });

  revalidatePath("/admin/legal");
  revalidatePath(`/${slug}`);
  redirect("/admin/legal");
}
