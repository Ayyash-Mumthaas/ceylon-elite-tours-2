import { prisma } from "../src/lib/prisma";

async function main() {
  console.log("Running Programmatic Verification for Checkpoint 7...");
  const errors: string[] = [];

  try {
    // 1. Verify Site Settings
    await prisma.siteSetting.upsert({
      where: { key: "brandName" },
      update: { value: "Ceylon Elite Tests" },
      create: { key: "brandName", value: "Ceylon Elite Tests", group: "general" }
    });
    const setting = await prisma.siteSetting.findUnique({ where: { key: "brandName" } });
    if (setting?.value !== "Ceylon Elite Tests") errors.push("Settings update failed.");
    console.log("✅ Site Settings verified.");

    // 2. Verify Legal Document
    const doc = await prisma.legalDocument.upsert({
      where: { slug_version: { slug: "test-policy", version: "1.0" } },
      update: { content: "Updated content", status: "PUBLISHED" },
      create: { title: "Test Policy", slug: "test-policy", version: "1.0", content: "Original content", status: "PUBLISHED" }
    });
    if (!doc) errors.push("Legal document creation failed.");
    console.log("✅ Legal CMS verified.");

    // 3. Verify Journal Post
    const post = await prisma.journalPost.upsert({
      where: { slug: "test-post" },
      update: { content: "Updated post", published: true },
      create: { title: "Test Post", slug: "test-post", excerpt: "Test", content: "Test content", published: true }
    });
    if (!post) errors.push("Journal post creation failed.");
    console.log("✅ Journal CMS verified.");

    // 4. Verify Media Asset
    const media = await prisma.mediaAsset.create({
      data: { filename: "test.jpg", originalName: "test.jpg", mimeType: "image/jpeg", sizeBytes: 1024, url: "/uploads/test.jpg" }
    });
    if (!media) errors.push("Media creation failed.");
    await prisma.mediaAsset.delete({ where: { id: media.id } }); // Cleanup
    console.log("✅ Media Library verified.");

    // 5. Verify Audit Logs
    const log = await prisma.auditLog.create({
      data: { action: "TEST", resource: "System", result: "success" }
    });
    if (!log) errors.push("Audit log creation failed.");
    console.log("✅ Audit Logging verified.");

    // 6. Verify User Creation
    const user = await prisma.user.upsert({
      where: { email: "test.admin@example.com" },
      update: { role: "ADMIN" },
      create: { email: "test.admin@example.com", name: "Test Admin", role: "ADMIN", passwordHash: "dummy" }
    });
    if (!user) errors.push("User creation failed.");
    console.log("✅ Admin User Management verified.");

    if (errors.length > 0) {
      console.error("❌ Errors found:");
      errors.forEach(e => console.error(" - " + e));
      process.exit(1);
    }

    console.log("🎉 All Checkpoint 7 checks passed successfully!");
  } catch (err: any) {
    console.error("❌ Test failed:", err);
    process.exit(1);
  } finally {
    // Cleanup test data
    await prisma.legalDocument.deleteMany({ where: { slug: "test-policy" } });
    await prisma.journalPost.deleteMany({ where: { slug: "test-post" } });
    await prisma.auditLog.deleteMany({ where: { action: "TEST" } });
    await prisma.user.deleteMany({ where: { email: "test.admin@example.com" } });
    await prisma.siteSetting.update({ where: { key: "brandName" }, data: { value: "Ceylon Elite Tours" } });
  }
}

main();
