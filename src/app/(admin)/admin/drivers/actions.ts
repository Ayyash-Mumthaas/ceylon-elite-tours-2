"use server";

import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function saveDriver(formData: FormData) {
  await requirePermission("manage_vehicles"); // Or manage_drivers if you prefer, tying it to vehicles for now

  const id = formData.get("id") as string;
  const isNew = !id || id === "new";

  const data = {
    name: formData.get("name") as string,
    phone: (formData.get("phone") as string) || null,
    licenseInfo: (formData.get("licenseInfo") as string) || null,
    vehicleNote: (formData.get("vehicleNote") as string) || null,
    status: formData.get("status") as string,
    availability: (formData.get("availability") as string) || null,
    notes: (formData.get("notes") as string) || null,
  };

  if (isNew) {
    await prisma.driver.create({ data });
  } else {
    await prisma.driver.update({ where: { id }, data });
  }

  revalidatePath("/admin/drivers");
  redirect("/admin/drivers");
}

export async function deleteDriver(id: string) {
  await requirePermission("manage_vehicles");
  await prisma.driver.delete({ where: { id } });
  revalidatePath("/admin/drivers");
}
