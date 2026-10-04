import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const destination = await prisma.destination.findFirst({
    where: { slug, published: true, deletedAt: null },
  });

  if (!destination) return { title: "Not Found" };

  return {
    title: `${destination.seoTitle || destination.name} | Ceylon Elite Tours`,
    description: destination.seoDescription || destination.shortDescription,
  };
}

export default async function DestinationDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const destination = await prisma.destination.findFirst({
    where: { slug, published: true, deletedAt: null },
  });

  if (!destination) notFound();

  let attractions = [];
  try { attractions = JSON.parse(destination.attractionsJson); } catch (e) {}
  
  let travelNotes = [];
  try { travelNotes = JSON.parse(destination.travelNotesJson); } catch (e) {}

  return (
    <article className="pt-24 pb-20">
      <div className="container">
        <Link href="/destinations" className="text-sm text-gray-500 hover:text-black mb-8 inline-block">
          &larr; Back to all destinations
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div>
            <div className="mb-4 text-xs font-semibold tracking-widest uppercase text-gray-500">
              {destination.region} {destination.district ? `• ${destination.district}` : ''}
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-semibold mb-6 leading-tight">
              {destination.name}
            </h1>
            <p className="text-xl text-gray-600 mb-8 font-light">
              {destination.shortDescription}
            </p>
            
            <div className="flex flex-wrap gap-4 mb-8">
              {destination.bestTimeToVisit && (
                <div className="bg-gray-50 px-4 py-2 rounded border border-gray-100">
                  <span className="block text-xs text-gray-500 uppercase tracking-wider">Best Time To Visit</span>
                  <span className="font-medium">{destination.bestTimeToVisit}</span>
                </div>
              )}
              {destination.recommendedDuration && (
                <div className="bg-gray-50 px-4 py-2 rounded border border-gray-100">
                  <span className="block text-xs text-gray-500 uppercase tracking-wider">Suggested Duration</span>
                  <span className="font-medium">{destination.recommendedDuration}</span>
                </div>
              )}
            </div>

            <div className="prose prose-gray max-w-none">
              <p className="whitespace-pre-wrap">{destination.longDescription}</p>
            </div>
          </div>

          <div className="relative">
            {destination.heroImageId ? (
              <div className="aspect-[4/5] rounded-xl overflow-hidden sticky top-32 shadow-xl">
                <img 
                  src={destination.heroImageId} 
                  alt={destination.name} 
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

        {/* Content sections */}
        <div className="mt-24 grid grid-cols-1 lg:grid-cols-2 gap-12 border-t border-gray-200 pt-16">
          <div>
            <h2 className="text-2xl font-display font-semibold mb-6">Key Attractions</h2>
            {attractions.length > 0 ? (
              <ul className="space-y-4">
                {attractions.map((attr: any, i: number) => (
                  <li key={i} className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <h3 className="font-semibold mb-1">{attr.name || attr}</h3>
                    {attr.description && <p className="text-gray-600 text-sm">{attr.description}</p>}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">Discover the natural beauty and local experiences unique to {destination.name}.</p>
            )}
          </div>

          <div>
            <h2 className="text-2xl font-display font-semibold mb-6">Travel Notes</h2>
            {travelNotes.length > 0 ? (
              <ul className="space-y-4">
                {travelNotes.map((note: any, i: number) => (
                  <li key={i} className="flex gap-3 text-gray-700 bg-white p-4 rounded border border-gray-200 shadow-sm">
                    <span className="text-black font-semibold">•</span>
                    <span>{typeof note === 'string' ? note : note.text || note.note}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">Contact us to plan your perfect itinerary including {destination.name}.</p>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
