"use server";

import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { randomBytes } from "crypto";
import { supabase } from "@/lib/supabase";

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

  const ext = file.name.split('.').pop() || "bin";
  const filename = `${randomBytes(16).toString("hex")}.${ext}`;

  const { data, error } = await supabase.storage
    .from("media")
    .upload(filename, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    console.error("Supabase Storage error:", error);
    throw new Error("Failed to upload to Supabase Storage");
  }

  // Get the public URL for the file
  const { data: urlData } = supabase.storage
    .from("media")
    .getPublicUrl(filename);
    
  const url = urlData.publicUrl;

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
  
  const asset = await prisma.mediaAsset.findUnique({ where: { id } });
  if (asset) {
    // Delete from Supabase Storage
    const { error } = await supabase.storage
      .from("media")
      .remove([asset.filename]);
      
    if (error) {
      console.error("Error deleting from Supabase:", error);
      // We log but continue to delete from DB to avoid ghost records
    }
    
    await prisma.mediaAsset.delete({ where: { id } });
  }
  
  revalidatePath("/admin/media");
}
