import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { SectionHeading } from "@/components/site-shell";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Destinations | Ceylon Elite Tours",
  description: "Explore the landscapes, cultural centres and coastal escapes that give Sri Lanka its depth and rhythm.",
};

export default async function DestinationsPublicPage() {
  const destinations = await prisma.destination.findMany({
    where: { published: true, deletedAt: null },
    orderBy: { name: "asc" },
  });

  return (
    <div className="pt-24 pb-16">
      <div className="container">
        <SectionHeading 
          eyebrow="Discover" 
          title="Destinations" 
          description="Explore the landscapes, cultural centres and coastal escapes that give the island its depth and rhythm."
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {destinations.map((destination) => (
            <article key={destination.id} className="destination-card bg-white shadow-sm hover:shadow-md transition-shadow rounded-lg overflow-hidden border border-gray-100 flex flex-col">
              {destination.heroImageId && (
                <div className="aspect-[4/3] w-full overflow-hidden">
                  <img 
                    src={destination.heroImageId} 
                    alt={destination.name} 
                    className="w-full h-full object-cover transition-transform hover:scale-105 duration-700" 
                  />
                </div>
              )}
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-center text-xs text-gray-500 uppercase tracking-wider mb-3">
                  <span>{destination.region}</span>
                </div>
                <h3 className="text-xl font-display font-semibold mb-2">{destination.name}</h3>
                <p className="text-gray-600 text-sm mb-6 flex-1 line-clamp-3">{destination.shortDescription}</p>
                <div className="flex justify-end pt-4 border-t border-gray-100 mt-auto">
                  <Link href={`/destinations/${destination.slug}`} className="text-sm font-semibold text-black hover:underline">
                    Discover destination
                  </Link>
                </div>
              </div>
            </article>
          ))}
          {destinations.length === 0 && (
            <p className="text-gray-500 col-span-full">New destinations are being added. Please check back soon.</p>
          )}
        </div>
      </div>
    </div>
  );
}
