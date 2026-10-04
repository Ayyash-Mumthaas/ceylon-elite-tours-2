"use server";

import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function saveDestination(formData: FormData) {
  await requirePermission("manage_destinations");

  const id = formData.get("id") as string;
  const isNew = !id || id === "new";

  const slugRaw = formData.get("slug") as string;
  const slug = slugRaw ? slugRaw.toLowerCase().replace(/[^a-z0-9]+/g, '-') : '';

  const data = {
    name: formData.get("name") as string,
    slug,
    region: (formData.get("region") as string) || null,
    district: (formData.get("district") as string) || null,
    shortDescription: formData.get("shortDescription") as string,
    longDescription: formData.get("longDescription") as string,
    heroImageId: (formData.get("heroImageId") as string) || null,
    bestTimeToVisit: (formData.get("bestTimeToVisit") as string) || null,
    recommendedDuration: (formData.get("recommendedDuration") as string) || null,
    attractionsJson: (formData.get("attractionsJson") as string) || "[]",
    travelNotesJson: (formData.get("travelNotesJson") as string) || "[]",
    latitude: formData.get("latitude") ? parseFloat(formData.get("latitude") as string) : null,
    longitude: formData.get("longitude") ? parseFloat(formData.get("longitude") as string) : null,
    featured: formData.get("featured") === "true",
    published: formData.get("published") === "true",
    seoTitle: (formData.get("seoTitle") as string) || null,
    seoDescription: (formData.get("seoDescription") as string) || null,
  };

  let destinationId = id;

  if (isNew) {
    const created = await prisma.destination.create({ data });
    destinationId = created.id;
  } else {
    await prisma.destination.update({ where: { id }, data });
  }

  revalidatePath("/admin/destinations");
  revalidatePath("/destinations");
  redirect("/admin/destinations");
}

export async function deleteDestination(id: string) {
  await requirePermission("manage_destinations");
  await prisma.destination.delete({ where: { id } });
  revalidatePath("/admin/destinations");
  revalidatePath("/destinations");
}
