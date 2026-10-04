import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import { PlannerForm } from "./planner-form";

export const metadata: Metadata = {
  title: "Plan Your Journey | Ceylon Elite Tours",
  description: "Begin crafting your personalized Sri Lankan itinerary with our travel specialists.",
};

export default async function PlanYourJourneyPage() {
  const destinations = await prisma.destination.findMany({
    where: { published: true, deletedAt: null },
    select: { id: true, name: true, region: true, shortDescription: true, heroImageId: true },
    orderBy: { name: "asc" },
  });

  const experiences = await prisma.experience.findMany({
    where: { published: true, deletedAt: null },
    select: { id: true, name: true, description: true, icon: true },
    orderBy: { name: "asc" },
  });
  
  const vehicles = await prisma.vehicle.findMany({
    where: { displayPublic: true, deletedAt: null },
    select: { id: true, name: true, category: true, passengerCapacity: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="pt-24 pb-20 bg-gray-50 min-h-screen">
      <div className="container max-w-3xl">
        <header className="mb-12 text-center">
          <div className="text-xs font-semibold tracking-widest uppercase text-gray-500 mb-4">
            Bespoke Travel Design
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-semibold mb-6">
            Plan Your Journey
          </h1>
          <p className="text-gray-600 text-lg font-light">
            Share your preferences with us, and our travel specialists will craft a personalized itinerary that matches your pace and interests.
          </p>
        </header>

        <PlannerForm 
          destinations={destinations} 
          experiences={experiences} 
          vehicles={vehicles}
        />
      </div>
    </div>
  );
}
