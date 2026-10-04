"use server";

import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { randomBytes } from "crypto";
import { existsSync } from "fs";

export async function uploadMedia(formData: FormData) {
  await requirePermission("manage_media");

  const file = formData.get("file") as File;
  const altText = formData.get("altText") as string || "";

  if (!file || file.size === 0) {
    throw new Error("No file uploaded");
  }

  // Basic validation
  if (!file.type.startsWith("image/") && file.type !== "application/pdf") {
    throw new Error("Invalid file type. Only images and PDFs allowed.");
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Use public/uploads for local development
  const uploadDir = join(process.cwd(), "public", "uploads");
  if (!existsSync(uploadDir)) {
    await mkdir(uploadDir, { recursive: true });
  }

  const ext = file.name.split('.').pop() || "bin";
  const filename = `${randomBytes(16).toString("hex")}.${ext}`;
  const path = join(uploadDir, filename);

  await writeFile(path, buffer);

  const url = `/uploads/${filename}`;

  await prisma.mediaAsset.create({
    data: {
      filename,
      originalName: file.name,
      mimeType: file.type,
      sizeBytes: file.size,
      url,
      altText,
    }
  });

  revalidatePath("/admin/media");
}

export async function deleteMedia(id: string) {
  await requirePermission("manage_media");
  
  // Note: in a real production system, you'd delete the file from the filesystem/S3 too.
  await prisma.mediaAsset.delete({ where: { id } });
  
  revalidatePath("/admin/media");
}
