import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { SectionHeading } from "@/components/site-shell";

export const metadata = {
  title: "Tours & Journeys | Ceylon Elite Tours",
  description: "Explore our collection of private, thoughtfully planned journeys across Sri Lanka.",
};

export default async function ToursPublicPage() {
  const tours = await prisma.tour.findMany({
    where: { published: true, deletedAt: null },
    orderBy: { title: "asc" },
  });

  return (
    <div className="pt-24 pb-16">
      <div className="container">
        <SectionHeading 
          eyebrow="Our Collection" 
          title="Private Journeys" 
          description="Carefully crafted itineraries that capture the essence of Sri Lanka, tailored to your pace."
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {tours.map((tour) => (
            <article key={tour.id} className="journey-card bg-white shadow-sm hover:shadow-md transition-shadow rounded-lg overflow-hidden border border-gray-100 flex flex-col">
              {tour.heroImageId && (
                <div className="aspect-[4/3] w-full overflow-hidden">
                  <img 
                    src={tour.heroImageId} 
                    alt={tour.title} 
                    className="w-full h-full object-cover transition-transform hover:scale-105 duration-700" 
                  />
                </div>
              )}
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-center text-xs text-gray-500 uppercase tracking-wider mb-3">
                  <span>{tour.duration}</span>
                  <span>{tour.vehicleCategory}</span>
                </div>
                <h3 className="text-xl font-display font-semibold mb-2">{tour.title}</h3>
                <p className="text-gray-600 text-sm mb-6 flex-1 line-clamp-3">{tour.shortDescription}</p>
                <div className="flex justify-between items-center pt-4 border-t border-gray-100 mt-auto">
                  <span className="text-sm font-medium">
                    {tour.startingPrice ? `${tour.currency} ${tour.startingPrice}` : 'On Request'}
                  </span>
                  <Link href={`/tours/${tour.slug}`} className="text-sm font-semibold text-black hover:underline">
                    Explore journey
                  </Link>
                </div>
              </div>
            </article>
          ))}
          {tours.length === 0 && (
            <p className="text-gray-500 col-span-full">New journeys are being crafted. Please check back soon.</p>
          )}
        </div>
      </div>
    </div>
  );
}
