"use server";

import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function saveVehicle(formData: FormData) {
  await requirePermission("manage_vehicles");

  const id = formData.get("id") as string;
  const isNew = !id || id === "new";
  const slugRaw = formData.get("slug") as string;
  const slug = slugRaw ? slugRaw.toLowerCase().replace(/[^a-z0-9]+/g, '-') : '';

  const data = {
    name: formData.get("name") as string,
    slug,
    category: formData.get("category") as string,
    passengerCapacity: formData.get("passengerCapacity") ? parseInt(formData.get("passengerCapacity") as string) : null,
    luggageCapacity: (formData.get("luggageCapacity") as string) || null,
    heroImageId: (formData.get("heroImageId") as string) || null,
    comfortLevel: (formData.get("comfortLevel") as string) || null,
    airConditioning: formData.get("airConditioning") === "true",
    description: formData.get("description") as string,
    displayPublic: formData.get("displayPublic") === "true",
  };

  if (isNew) {
    await prisma.vehicle.create({ data });
  } else {
    await prisma.vehicle.update({ where: { id }, data });
  }

  revalidatePath("/admin/vehicles");
  revalidatePath("/vehicles");
  redirect("/admin/vehicles");
}

export async function deleteVehicle(id: string) {
  await requirePermission("manage_vehicles");
  await prisma.vehicle.delete({ where: { id } });
  revalidatePath("/admin/vehicles");
  revalidatePath("/vehicles");
}
