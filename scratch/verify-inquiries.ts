import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const baseUrl = "http://localhost:3000";

async function main() {
  console.log("Starting Critical Verification for Inquiry Pipeline...");

  const initialCount = await prisma.inquiry.count();
  console.log(`Initial inquiry count: ${initialCount}`);

  // Test 1: Invalid submission
  const invalidRes = await fetch(`${baseUrl}/api/test-inquiry`, {
    method: "POST",
    body: JSON.stringify({ name: "Incomplete" }),
  }).then(r => r.json());

  if (!invalidRes.success) {
    console.log("✅ Invalid submission correctly rejected.");
  } else {
    throw new Error("Invalid submission was accepted.");
  }

  // Test 2: Valid submission
  const mockData = {
    name: "John Verification",
    email: "john.verify@example.com",
    phone: "+94777123456",
    country: "United Kingdom",
    travelStart: "2026-12-01",
    travelEnd: "2026-12-14",
    adults: 2,
    children: 1,
    travellerType: "Family",
    vehicleCategory: "Luxury SUV",
    accommodation: "Luxury (5 Star)",
    budgetRange: "$4000 - $6000",
    message: "We love nature.",
    // Send empty arrays for relations to test basic persistence without needing specific IDs
    destinationIds: [],
    experienceIds: []
  };

  const validRes = await fetch(`${baseUrl}/api/test-inquiry`, {
    method: "POST",
    body: JSON.stringify(mockData),
  }).then(r => r.json());

  if (validRes.success && validRes.reference.startsWith("CET-INQ-")) {
    console.log(`✅ Valid submission accepted. Reference generated: ${validRes.reference}`);
  } else {
    console.error(validRes);
    throw new Error("Valid submission failed.");
  }

  // Test 3: Database persistence & Reference uniqueness
  const inquiry = await prisma.inquiry.findUnique({
    where: { reference: validRes.reference },
    include: { customer: true, history: true }
  });

  if (!inquiry) throw new Error("Inquiry not found in database.");
  if (inquiry.customer.email !== "john.verify@example.com") throw new Error("Customer mismatch.");
  if (inquiry.history.length === 0) throw new Error("Timeline event not created.");
  
  console.log("✅ Inquiry correctly persisted to database with Customer and Timeline relations.");

  // Test 4: Admin dashboard count increment
  const newCount = await prisma.inquiry.count();
  if (newCount === initialCount + 1) {
    console.log("✅ Database count incremented correctly (Dashboard will update).");
  } else {
    throw new Error(`Count mismatch. Expected ${initialCount + 1}, got ${newCount}`);
  }

  // Cleanup
  await prisma.inquiry.delete({ where: { id: inquiry.id } });
  
  console.log("\nAll inquiry verifications passed successfully!");
}

main().finally(() => prisma.$disconnect());
