"use server";

import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function saveExperience(formData: FormData) {
  await requirePermission("manage_experiences");

  const id = formData.get("id") as string;
  const isNew = !id || id === "new";
  const slugRaw = formData.get("slug") as string;
  const slug = slugRaw ? slugRaw.toLowerCase().replace(/[^a-z0-9]+/g, '-') : '';

  const data = {
    name: formData.get("name") as string,
    slug,
    description: formData.get("description") as string,
    icon: (formData.get("icon") as string) || null,
    heroImageId: (formData.get("heroImageId") as string) || null,
    featured: formData.get("featured") === "true",
    published: formData.get("published") === "true",
    seoTitle: (formData.get("seoTitle") as string) || null,
    seoDescription: (formData.get("seoDescription") as string) || null,
  };

  if (isNew) {
    await prisma.experience.create({ data });
  } else {
    await prisma.experience.update({ where: { id }, data });
  }

  revalidatePath("/admin/experiences");
  revalidatePath("/experiences");
  redirect("/admin/experiences");
}

export async function deleteExperience(id: string) {
  await requirePermission("manage_experiences");
  await prisma.experience.delete({ where: { id } });
  revalidatePath("/admin/experiences");
  revalidatePath("/experiences");
}
