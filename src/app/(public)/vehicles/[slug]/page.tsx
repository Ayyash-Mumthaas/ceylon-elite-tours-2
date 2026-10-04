import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const v = await prisma.vehicle.findFirst({
    where: { slug, displayPublic: true, deletedAt: null },
  });

  if (!v) return { title: "Not Found" };

  return {
    title: `${v.name} | Ceylon Elite Tours`,
    description: v.description,
  };
}

export default async function VehicleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const v = await prisma.vehicle.findFirst({
    where: { slug, displayPublic: true, deletedAt: null },
  });

  if (!v) notFound();

  return (
    <article className="pt-24 pb-20">
      <div className="container">
        <Link href="/vehicles" className="text-sm text-gray-500 hover:text-black mb-8 inline-block">
          &larr; Back to fleet
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div>
            <div className="mb-4 text-xs font-semibold tracking-widest uppercase text-gray-500">
              {v.category}
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-semibold mb-6 leading-tight">
              {v.name}
            </h1>
            
            <div className="flex flex-wrap gap-4 mb-8">
              {v.passengerCapacity && (
                <div className="bg-gray-50 px-4 py-2 rounded border border-gray-100">
                  <span className="block text-xs text-gray-500 uppercase tracking-wider">Capacity</span>
                  <span className="font-medium">{v.passengerCapacity} Passengers</span>
                </div>
              )}
              {v.luggageCapacity && (
                <div className="bg-gray-50 px-4 py-2 rounded border border-gray-100">
                  <span className="block text-xs text-gray-500 uppercase tracking-wider">Luggage</span>
                  <span className="font-medium">{v.luggageCapacity}</span>
                </div>
              )}
              {v.comfortLevel && (
                <div className="bg-gray-50 px-4 py-2 rounded border border-gray-100">
                  <span className="block text-xs text-gray-500 uppercase tracking-wider">Comfort</span>
                  <span className="font-medium">{v.comfortLevel}</span>
                </div>
              )}
            </div>

            <div className="prose prose-gray max-w-none text-lg text-gray-600 font-light">
              <p className="whitespace-pre-wrap">{v.description}</p>
            </div>
            
            <div className="mt-8">
              <div className="flex items-center gap-2 text-gray-700">
                <span className="text-green-600">✓</span> {v.airConditioning ? "Fully Air-Conditioned" : "Standard Ventilation"}
              </div>
            </div>

            <div className="mt-12">
              <Link 
                href="/plan-your-journey" 
                className="bg-black text-white px-8 py-3 rounded hover:bg-gray-800 transition-colors inline-block"
              >
                Request this vehicle
              </Link>
            </div>
          </div>

          <div className="relative">
            {v.heroImageId ? (
              <div className="aspect-[4/3] rounded-xl overflow-hidden sticky top-32 shadow-xl">
                <img 
                  src={v.heroImageId} 
                  alt={v.name} 
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="aspect-[4/3] bg-gray-100 rounded-xl border border-gray-200 sticky top-32 flex items-center justify-center">
                <span className="text-gray-400">No Image Provided</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
