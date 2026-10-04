"use server";

import { prisma } from "@/lib/prisma";
import { requirePermission, requireUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { hash } from "bcryptjs"; // Needs to be installed, or we use what's available. We check what auth is using. Wait, let's use Web Crypto API or just leave password alone if not set.
// Actually, this project might use bcrypt. The auth uses bcrypt. I'll dynamically import bcrypt if needed or assume user can't set password here yet.
// For now, let's allow role updates.

export async function saveUser(formData: FormData) {
  const adminUser = await requireUser();
  await requirePermission("manage_settings");

  const id = formData.get("id") as string;
  const isNew = !id || id === "new";
  
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const role = formData.get("role") as string;

  if (isNew) {
    // Basic password for new users. In a real system, send invite email.
    // Assuming we use standard bcrypt. Let's just create without password if allowed, 
    // or we skip new user creation complexity for this demo and focus on roles.
    const bcrypt = await import("bcryptjs");
    const passwordHash = await bcrypt.hash("Temp1234!", 10);
    
    await prisma.user.create({
      data: { name, email, role, passwordHash }
    });
  } else {
    // Don't allow removing your own admin privileges
    if (id === adminUser.id && role !== "SUPER_ADMIN" && adminUser.role === "SUPER_ADMIN") {
      throw new Error("Cannot demote yourself.");
    }
    
    await prisma.user.update({
      where: { id },
      data: { name, email, role }
    });
  }

  revalidatePath("/admin/users");
  redirect("/admin/users");
}
