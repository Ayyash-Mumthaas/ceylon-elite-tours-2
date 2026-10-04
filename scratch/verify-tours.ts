import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const baseUrl = "http://localhost:3000";

async function checkStatus(slug: string): Promise<{ status: number; html: string }> {
  try {
    const res = await fetch(`${baseUrl}/tours/${slug}`);
    const html = await res.text();
    return { status: res.status, html };
  } catch (error) {
    return { status: 500, html: "" };
  }
}

async function main() {
  console.log("Starting Critical Verification for Tours CMS public routes...");
  const slug = "critical-test-tour-123";

  // Cleanup just in case
  await prisma.tour.deleteMany({ where: { slug } });

  // 1 & 2 & 3: Create as draft
  console.log("Creating tour as DRAFT...");
  const tour = await prisma.tour.create({
    data: {
      title: "Secret Draft Tour",
      slug,
      shortDescription: "A secret tour",
      fullDescription: "Long secret tour description",
      published: false,
    }
  });

  // 4. Confirm it does NOT appear publicly
  let res = await checkStatus(slug);
  if (res.status === 404) {
    console.log("✅ Draft tour correctly returns 404.");
  } else {
    console.log("HTML returned:", res.html);
    throw new Error(`Draft tour returned status ${res.status}`);
  }

  // 5. Publish it
  console.log("Publishing tour...");
  await prisma.tour.update({ where: { id: tour.id }, data: { published: true } });

  // 6 & 7. Confirm it appears publicly
  res = await checkStatus(slug);
  if (res.status === 200 && res.html.includes("Secret Draft Tour")) {
    console.log("✅ Published tour appears publicly.");
  } else {
    throw new Error(`Published tour check failed. Status: ${res.status}`);
  }

  // 8 & 9. Edit title
  console.log("Editing title...");
  await prisma.tour.update({ where: { id: tour.id }, data: { title: "Amazing Updated Title" } });
  res = await checkStatus(slug);
  if (res.status === 200 && res.html.includes("Amazing Updated Title")) {
    console.log("✅ Title update reflected publicly.");
  } else {
    throw new Error("Title update not found in HTML.");
  }

  // 10 & 11. Edit description
  console.log("Editing description...");
  await prisma.tour.update({ where: { id: tour.id }, data: { shortDescription: "Fresh description here" } });
  res = await checkStatus(slug);
  if (res.status === 200 && res.html.includes("Fresh description here")) {
    console.log("✅ Description update reflected publicly.");
  } else {
    throw new Error("Description update not found in HTML.");
  }

  // 16 & 17. Unpublish
  console.log("Unpublishing tour...");
  await prisma.tour.update({ where: { id: tour.id }, data: { published: false } });
  res = await checkStatus(slug);
  if (res.status === 404) {
    console.log("✅ Unpublished tour correctly returns 404.");
  } else {
    throw new Error(`Unpublished tour returned status ${res.status}`);
  }

  // 18 & 19. Delete
  console.log("Deleting tour...");
  await prisma.tour.delete({ where: { id: tour.id } });
  console.log("✅ Tour deleted safely.");

  console.log("\nAll critical verifications passed successfully!");
}

main().finally(() => prisma.$disconnect());
