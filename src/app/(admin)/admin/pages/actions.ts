"use server";

import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function savePage(formData: FormData) {
  await requirePermission("manage_pages");

  const id = formData.get("id") as string;
  const isNew = !id || id === "new";
  const slugRaw = formData.get("slug") as string;
  const slug = slugRaw ? slugRaw.toLowerCase().replace(/[^a-z0-9]+/g, '-') : '';

  const data = {
    title: formData.get("title") as string,
    slug,
    heroHeading: (formData.get("heroHeading") as string) || null,
    heroSubheading: (formData.get("heroSubheading") as string) || null,
    content: formData.get("content") as string,
    published: formData.get("published") === "true",
    seoTitle: (formData.get("seoTitle") as string) || null,
    seoDescription: (formData.get("seoDescription") as string) || null,
  };

  if (isNew) {
    await prisma.page.create({ data });
  } else {
    await prisma.page.update({ where: { id }, data });
  }

  revalidatePath("/admin/pages");
  revalidatePath(`/${slug}`);
  redirect("/admin/pages");
}

export async function deletePage(id: string) {
  await requirePermission("manage_pages");
  const page = await prisma.page.findUnique({ where: { id } });
  if (page) {
    await prisma.page.delete({ where: { id } });
    revalidatePath(`/${page.slug}`);
  }
  revalidatePath("/admin/pages");
}
