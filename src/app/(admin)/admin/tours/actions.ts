"use server";

import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function saveTour(formData: FormData) {
  await requirePermission("manage_tours");

  const id = formData.get("id") as string;
  const isNew = !id || id === "new";

  const slugRaw = formData.get("slug") as string;
  const slug = slugRaw ? slugRaw.toLowerCase().replace(/[^a-z0-9]+/g, '-') : '';

  const data = {
    title: formData.get("title") as string,
    slug,
    shortDescription: formData.get("shortDescription") as string,
    fullDescription: formData.get("fullDescription") as string,
    heroImageId: (formData.get("heroImageId") as string) || null,
    duration: (formData.get("duration") as string) || null,
    startingLocation: (formData.get("startingLocation") as string) || null,
    endingLocation: (formData.get("endingLocation") as string) || null,
    vehicleCategory: (formData.get("vehicleCategory") as string) || null,
    importantInfo: (formData.get("importantInfo") as string) || null,
    difficulty: (formData.get("difficulty") as string) || null,
    availabilityNotes: (formData.get("availabilityNotes") as string) || null,
    priceDisplayMode: (formData.get("priceDisplayMode") as string) || "REQUEST_QUOTE",
    startingPrice: formData.get("startingPrice") ? parseFloat(formData.get("startingPrice") as string) : null,
    currency: (formData.get("currency") as string) || "USD",
    itineraryJson: (formData.get("itineraryJson") as string) || "[]",
    inclusionsJson: (formData.get("inclusionsJson") as string) || "[]",
    exclusionsJson: (formData.get("exclusionsJson") as string) || "[]",
    featured: formData.get("featured") === "true",
    published: formData.get("published") === "true",
    seoTitle: (formData.get("seoTitle") as string) || null,
    seoDescription: (formData.get("seoDescription") as string) || null,
  };

  let tourId = id;

  if (isNew) {
    const created = await prisma.tour.create({ data });
    tourId = created.id;
  } else {
    await prisma.tour.update({ where: { id }, data });
  }

  revalidatePath("/admin/tours");
  revalidatePath("/tours");
  redirect("/admin/tours");
}

export async function deleteTour(id: string) {
  await requirePermission("manage_tours");
  await prisma.tour.delete({ where: { id } });
  revalidatePath("/admin/tours");
  revalidatePath("/tours");
}

export async function duplicateTour(id: string) {
  await requirePermission("manage_tours");
  const existing = await prisma.tour.findUnique({ where: { id } });
  if (!existing) throw new Error("Tour not found");

  const { id: _, slug, createdAt, updatedAt, ...rest } = existing;
  const newTour = await prisma.tour.create({
    data: {
      ...rest,
      title: `${existing.title} (Copy)`,
      slug: `${existing.slug}-copy-${Date.now()}`,
      published: false,
    },
  });

  revalidatePath("/admin/tours");
  redirect(`/admin/tours/${newTour.id}`);
}
