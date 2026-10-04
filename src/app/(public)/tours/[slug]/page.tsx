import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const tour = await prisma.tour.findFirst({
    where: { slug, published: true, deletedAt: null },
  });

  if (!tour) return { title: "Not Found" };

  return {
    title: `${tour.seoTitle || tour.title} | Ceylon Elite Tours`,
    description: tour.seoDescription || tour.shortDescription,
  };
}

export default async function TourDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tour = await prisma.tour.findFirst({
    where: { slug, published: true, deletedAt: null },
  });

  if (!tour) notFound();

  let itinerary = [];
  try {
    itinerary = JSON.parse(tour.itineraryJson);
  } catch (e) {}

  let inclusions = [];
  try {
    inclusions = JSON.parse(tour.inclusionsJson);
  } catch (e) {}

  let exclusions = [];
  try {
    exclusions = JSON.parse(tour.exclusionsJson);
  } catch (e) {}

  return (
    <article className="pt-24 pb-20">
      <div className="container">
        <Link href="/tours" className="text-sm text-gray-500 hover:text-black mb-8 inline-block">
          &larr; Back to all journeys
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div>
            <h1 className="text-4xl md:text-5xl font-display font-semibold mb-6 leading-tight">
              {tour.title}
            </h1>
            <p className="text-xl text-gray-600 mb-8 font-light">
              {tour.shortDescription}
            </p>
            
            <div className="flex flex-wrap gap-4 mb-8">
              {tour.duration && (
                <div className="bg-gray-50 px-4 py-2 rounded border border-gray-100">
                  <span className="block text-xs text-gray-500 uppercase tracking-wider">Duration</span>
                  <span className="font-medium">{tour.duration}</span>
                </div>
              )}
              {tour.vehicleCategory && (
                <div className="bg-gray-50 px-4 py-2 rounded border border-gray-100">
                  <span className="block text-xs text-gray-500 uppercase tracking-wider">Transport</span>
                  <span className="font-medium">{tour.vehicleCategory}</span>
                </div>
              )}
              {(tour.startingPrice || tour.priceDisplayMode === 'REQUEST_QUOTE') && (
                <div className="bg-gray-50 px-4 py-2 rounded border border-gray-100">
                  <span className="block text-xs text-gray-500 uppercase tracking-wider">Price</span>
                  <span className="font-medium">
                    {tour.startingPrice ? `${tour.currency} ${tour.startingPrice}` : 'On Request'}
                  </span>
                </div>
              )}
            </div>

            <div className="prose prose-gray max-w-none">
              <p className="whitespace-pre-wrap">{tour.fullDescription}</p>
            </div>

            <div className="mt-12 flex gap-4">
              <Link 
                href="/plan-your-journey" 
                className="bg-black text-white px-8 py-3 rounded hover:bg-gray-800 transition-colors inline-block"
              >
                Inquire Now
              </Link>
            </div>
          </div>

          <div className="relative">
            {tour.heroImageId ? (
              <div className="aspect-[4/5] rounded-xl overflow-hidden sticky top-32 shadow-xl">
                <img 
                  src={tour.heroImageId} 
                  alt={tour.title} 
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="aspect-[4/5] bg-gray-100 rounded-xl border border-gray-200 sticky top-32 flex items-center justify-center">
                <span className="text-gray-400">No Image Provided</span>
              </div>
            )}
          </div>
        </div>

        {/* Itinerary & Details section */}
        <div className="mt-24 grid grid-cols-1 lg:grid-cols-3 gap-12 border-t border-gray-200 pt-16">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-display font-semibold mb-8">Itinerary</h2>
            {itinerary.length > 0 ? (
              <div className="space-y-8">
                {itinerary.map((day: { day?: string | number, title?: string, description?: string }, i: number) => (
                  <div key={i} className="flex gap-6">
                    <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center font-display font-semibold text-xl">
                      {day.day || i + 1}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{day.title || `Day ${day.day || i + 1}`}</h3>
                      <p className="text-gray-600">{day.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Itinerary details are customized upon request.</p>
            )}
          </div>

          <div>
            <div className="bg-gray-50 p-8 rounded-lg border border-gray-100">
              <h3 className="font-semibold mb-4 text-lg">Inclusions</h3>
              {inclusions.length > 0 ? (
                <ul className="space-y-2 mb-8">
                  {inclusions.map((inc: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-green-500">✓</span> {inc}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-sm mb-8">Not specified.</p>
              )}

              <h3 className="font-semibold mb-4 text-lg">Exclusions</h3>
              {exclusions.length > 0 ? (
                <ul className="space-y-2">
                  {exclusions.map((exc: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-red-400">✕</span> {exc}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-sm">Not specified.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
