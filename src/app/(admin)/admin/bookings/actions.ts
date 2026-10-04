"use server";

import { prisma } from "@/lib/prisma";
import { requirePermission, requireUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createBookingFromQuotation(quotationId: string) {
  const user = await requireUser();
  await requirePermission("manage_bookings");

  const quotation = await prisma.quotation.findUnique({
    where: { id: quotationId },
    include: { customer: true, inquiry: true }
  });

  if (!quotation) throw new Error("Quotation not found");
  if (quotation.status !== "ACCEPTED") throw new Error("Quotation must be ACCEPTED to create a booking.");

  const year = new Date().getFullYear();

  const booking = await prisma.$transaction(async (tx) => {
    // Generate secure unique reference
    const seqKey = `BKG_${year}`;
    const seq = await tx.sequence.upsert({
      where: { key: seqKey },
      update: { value: { increment: 1 } },
      create: { key: seqKey, value: 1 },
    });
    const reference = `CET-${year}-${seq.value.toString().padStart(6, "0")}`;

    const b = await tx.booking.create({
      data: {
        reference,
        customerId: quotation.customerId,
        inquiryId: quotation.inquiryId,
        quotationId: quotation.id,
        status: "CONFIRMED",
        paymentStatus: "UNPAID",
        travelStart: quotation.travelStart,
        travelEnd: quotation.travelEnd,
        adults: quotation.inquiry ? quotation.inquiry.adults : quotation.travellers,
        children: quotation.inquiry ? quotation.inquiry.children : 0,
        vehicleCategory: quotation.inquiry ? quotation.inquiry.vehicleCategory : null,
        accommodation: quotation.inquiry ? quotation.inquiry.accommodation : null,
        quotedAmount: quotation.total,
        currency: quotation.currency,
        depositRequired: quotation.total * 0.3, // Example: 30% deposit
        balance: quotation.total,
        source: "quotation"
      }
    });

    await tx.bookingTimeline.create({
      data: {
        bookingId: b.id,
        event: "BOOKING_CREATED",
        note: `Booking created from Quotation ${quotation.reference}`,
        actor: user.name || user.email,
      }
    });

    if (quotation.inquiryId) {
      await tx.inquiry.update({
        where: { id: quotation.inquiryId },
        data: { status: "CONFIRMED" }
      });
    }

    return b;
  });

  redirect(`/admin/bookings/${booking.id}`);
}

export async function updateBookingStatus(id: string, newStatus: string) {
  const user = await requireUser();
  await requirePermission("manage_bookings");

  await prisma.$transaction(async (tx) => {
    await tx.booking.update({
      where: { id },
      data: { status: newStatus }
    });

    await tx.bookingTimeline.create({
      data: {
        bookingId: id,
        event: "STATUS_CHANGED",
        note: `Status updated to ${newStatus}`,
        actor: user.name || user.email,
      }
    });
  });

  revalidatePath(`/admin/bookings/${id}`);
}

export async function updatePayment(formData: FormData) {
  const user = await requireUser();
  await requirePermission("manage_bookings");

  const bookingId = formData.get("bookingId") as string;
  const amount = parseFloat(formData.get("amount") as string) || 0;
  const method = formData.get("method") as string;
  const referenceNo = formData.get("referenceNo") as string;
  const notes = formData.get("notes") as string;

  await prisma.$transaction(async (tx) => {
    const b = await tx.booking.findUnique({ where: { id: bookingId } });
    if (!b) throw new Error("Booking not found");

    const newDepositReceived = b.depositReceived + amount;
    const newBalance = b.quotedAmount - newDepositReceived;
    
    let paymentStatus = "PARTIALLY_PAID";
    if (newBalance <= 0) paymentStatus = "PAID";
    else if (newDepositReceived === 0) paymentStatus = "UNPAID";

    await tx.payment.create({
      data: {
        bookingId,
        amount,
        currency: b.currency,
        method,
        referenceNo,
        notes,
        paidAt: new Date()
      }
    });

    await tx.booking.update({
      where: { id: bookingId },
      data: { 
        depositReceived: newDepositReceived, 
        balance: newBalance,
        paymentStatus
      }
    });

    await tx.bookingTimeline.create({
      data: {
        bookingId,
        event: "PAYMENT_RECEIVED",
        note: `Received ${b.currency} ${amount} via ${method}. Reference: ${referenceNo}`,
        actor: user.name || user.email,
      }
    });
  });

  revalidatePath(`/admin/bookings/${bookingId}`);
}

export async function assignVehicle(formData: FormData) {
  const user = await requireUser();
  await requirePermission("manage_bookings");

  const bookingId = formData.get("bookingId") as string;
  const assignedVehicleId = formData.get("assignedVehicleId") as string;

  await prisma.$transaction(async (tx) => {
    await tx.booking.update({
      where: { id: bookingId },
      data: { 
        assignedVehicleId,
        status: "VEHICLE_ASSIGNED"
      }
    });

    await tx.bookingTimeline.create({
      data: {
        bookingId,
        event: "VEHICLE_ASSIGNED",
        note: `Vehicle ID ${assignedVehicleId} assigned.`,
        actor: user.name || user.email,
      }
    });
  });

  revalidatePath(`/admin/bookings/${bookingId}`);
}

export async function assignDriver(formData: FormData) {
  const user = await requireUser();
  await requirePermission("manage_bookings");

  const bookingId = formData.get("bookingId") as string;
  const assignedDriverId = formData.get("assignedDriverId") as string;

  await prisma.$transaction(async (tx) => {
    await tx.booking.update({
      where: { id: bookingId },
      data: { 
        assignedDriverId,
        status: "DRIVER_ASSIGNED"
      }
    });

    await tx.bookingTimeline.create({
      data: {
        bookingId,
        event: "DRIVER_ASSIGNED",
        note: `Driver ID ${assignedDriverId} assigned.`,
        actor: user.name || user.email,
      }
    });
  });

  revalidatePath(`/admin/bookings/${bookingId}`);
}
