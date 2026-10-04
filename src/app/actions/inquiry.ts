"use server";

import { prisma } from "@/lib/prisma";

export async function submitInquiry(data: Record<string, any>) {
  try {
    // Basic validation
    if (!data.email || !data.name) {
      return { success: false, error: "Name and email are required." };
    }

    const year = new Date().getFullYear();

    return await prisma.$transaction(async (tx) => {
      // 1. Find or create customer (safe matching by email)
      let customer = await tx.customer.findFirst({
        where: { email: data.email.toLowerCase().trim() },
      });

      if (!customer) {
        customer = await tx.customer.create({
          data: {
            name: data.name,
            email: data.email.toLowerCase().trim(),
            phone: data.phone || null,
            whatsapp: data.whatsapp || null,
            country: data.country || null,
            preferredContact: data.preferredContact || "email",
          },
        });
      }

      // 2. Generate secure unique reference
      const seqKey = `INQ_${year}`;
      const seq = await tx.sequence.upsert({
        where: { key: seqKey },
        update: { value: { increment: 1 } },
        create: { key: seqKey, value: 1 },
      });
      const reference = `CET-INQ-${year}-${seq.value.toString().padStart(6, "0")}`;

      // 3. Create Inquiry
      const inquiry = await tx.inquiry.create({
        data: {
          reference,
          customerId: customer.id,
          status: "NEW",
          travelStart: data.travelStart ? new Date(data.travelStart) : null,
          travelEnd: data.travelEnd ? new Date(data.travelEnd) : null,
          durationNote: data.durationNote || null,
          adults: parseInt(data.adults) || 1,
          children: parseInt(data.children) || 0,
          travellerType: data.travellerType || null,
          vehicleCategory: data.vehicleCategory || null,
          accommodation: data.accommodation || null,
          budgetRange: data.budgetRange || null,
          specialRequirements: data.message || null,
          source: "website_plan_journey",
          
          // Connect Destinations
          destinations: {
            create: (data.destinationIds || []).map((destId: string) => ({
              destination: { connect: { id: destId } }
            }))
          },
          
          // Connect Experiences
          experiences: {
            create: (data.experienceIds || []).map((expId: string) => ({
              experience: { connect: { id: expId } }
            }))
          },

          // Create History / Timeline
          history: {
            create: {
              action: "INQUIRY_CREATED",
              note: "Inquiry submitted via website planner",
              actor: "System"
            }
          }
        },
      });

      return { success: true, reference: inquiry.reference };
    });
  } catch (error) {
    console.error("Inquiry submission error:", error);
    return { success: false, error: "An error occurred while submitting your request. Please try again." };
  }
}
