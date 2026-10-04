import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { SectionHeading } from "@/components/site-shell";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Fleet | Ceylon Elite Tours",
  description: "Travel in unparalleled comfort with our curated fleet of luxury vehicles.",
};

export default async function VehiclesPublicPage() {
  const vehicles = await prisma.vehicle.findMany({
    where: { displayPublic: true, deletedAt: null },
    orderBy: { name: "asc" },
  });

  return (
    <div className="pt-24 pb-16">
      <div className="container">
        <SectionHeading 
          eyebrow="Transport" 
          title="Our Fleet" 
          description="Travel in unparalleled comfort. Our curated fleet ensures every journey is as relaxing as the destination itself."
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {vehicles.map((v) => (
            <article key={v.id} className="vehicle-card bg-white shadow-sm hover:shadow-md transition-shadow rounded-lg overflow-hidden border border-gray-100 flex flex-col">
              {v.heroImageId && (
                <div className="aspect-[16/9] w-full overflow-hidden bg-gray-50">
                  <img 
                    src={v.heroImageId} 
                    alt={v.name} 
                    className="w-full h-full object-cover transition-transform hover:scale-105 duration-700" 
                  />
                </div>
              )}
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-center text-xs text-gray-500 uppercase tracking-wider mb-3">
                  <span>{v.category}</span>
                </div>
                <h3 className="text-xl font-display font-semibold mb-2">{v.name}</h3>
                <p className="text-gray-600 text-sm mb-6 flex-1 line-clamp-3">{v.description}</p>
                
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-6">
                  {v.passengerCapacity && <span>{v.passengerCapacity} Passengers</span>}
                  {v.luggageCapacity && <span>• {v.luggageCapacity} Luggage</span>}
                </div>

                <div className="flex justify-end pt-4 border-t border-gray-100 mt-auto">
                  <Link href={`/vehicles/${v.slug}`} className="text-sm font-semibold text-black hover:underline">
                    View Details
                  </Link>
                </div>
              </div>
            </article>
          ))}
          {vehicles.length === 0 && (
            <p className="text-gray-500 col-span-full">Our fleet information is currently being updated.</p>
          )}
        </div>
      </div>
    </div>
  );
}
