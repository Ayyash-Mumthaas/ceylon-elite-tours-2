"use server";

import { prisma } from "@/lib/prisma";
import { requirePermission, requireUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function saveJournalPost(formData: FormData) {
  const user = await requireUser();
  await requirePermission("manage_journal");

  const id = formData.get("id") as string;
  const isNew = !id || id === "new";
  
  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const excerpt = formData.get("excerpt") as string;
  const content = formData.get("content") as string;
  const published = formData.get("published") === "on";

  const data = {
    title,
    slug,
    excerpt,
    content,
    published,
    authorId: user.id,
    publishedAt: published ? new Date() : null,
  };

  if (isNew) {
    await prisma.journalPost.create({ data });
  } else {
    await prisma.journalPost.update({ where: { id }, data });
  }

  revalidatePath("/admin/journal");
  revalidatePath("/journal");
  redirect("/admin/journal");
}
