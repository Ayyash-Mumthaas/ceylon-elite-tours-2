import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const baseUrl = "http://localhost:3000";

async function checkStatus(slug: string): Promise<{ status: number; html: string }> {
  try {
    const res = await fetch(`${baseUrl}/destinations/${slug}`);
    const html = await res.text();
    return { status: res.status, html };
  } catch (error) {
    return { status: 500, html: "" };
  }
}

async function main() {
  console.log("Starting Critical Verification for Destinations CMS public routes...");
  const slug = "critical-test-destination-456";

  await prisma.destination.deleteMany({ where: { slug } });

  console.log("Creating destination as DRAFT...");
  const dest = await prisma.destination.create({
    data: {
      name: "Secret Draft Destination",
      slug,
      shortDescription: "A secret place",
      longDescription: "Long secret description",
      published: false,
    }
  });

  let res = await checkStatus(slug);
  if (res.status === 404) {
    console.log("✅ Draft destination correctly returns 404.");
  } else {
    throw new Error(`Draft destination returned status ${res.status}`);
  }

  console.log("Publishing destination...");
  await prisma.destination.update({ where: { id: dest.id }, data: { published: true } });

  res = await checkStatus(slug);
  if (res.status === 200 && res.html.includes("Secret Draft Destination")) {
    console.log("✅ Published destination appears publicly.");
  } else {
    throw new Error(`Published check failed. Status: ${res.status}`);
  }

  console.log("Editing name...");
  await prisma.destination.update({ where: { id: dest.id }, data: { name: "Amazing Updated Name" } });
  res = await checkStatus(slug);
  if (res.status === 200 && res.html.includes("Amazing Updated Name")) {
    console.log("✅ Name update reflected publicly.");
  } else {
    throw new Error("Name update not found in HTML.");
  }

  console.log("Editing description...");
  await prisma.destination.update({ where: { id: dest.id }, data: { shortDescription: "Fresh desc here" } });
  res = await checkStatus(slug);
  if (res.status === 200 && res.html.includes("Fresh desc here")) {
    console.log("✅ Description update reflected publicly.");
  } else {
    throw new Error("Description update not found in HTML.");
  }

  console.log("Unpublishing destination...");
  await prisma.destination.update({ where: { id: dest.id }, data: { published: false } });
  res = await checkStatus(slug);
  if (res.status === 404) {
    console.log("✅ Unpublished destination correctly returns 404.");
  } else {
    throw new Error(`Unpublished returned status ${res.status}`);
  }

  console.log("Deleting destination...");
  await prisma.destination.delete({ where: { id: dest.id } });
  console.log("✅ Destination deleted safely.");

  console.log("\nAll critical verifications passed successfully!");
}

main().finally(() => prisma.$disconnect());
