import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { SectionHeading } from "@/components/site-shell";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Experiences | Ceylon Elite Tours",
  description: "Curated experiences that go beyond the guidebook.",
};

export default async function ExperiencesPublicPage() {
  const experiences = await prisma.experience.findMany({
    where: { published: true, deletedAt: null },
    orderBy: { name: "asc" },
  });

  return (
    <div className="pt-24 pb-16">
      <div className="container">
        <SectionHeading 
          eyebrow="Immerse" 
          title="Curated Experiences" 
          description="Moments that go beyond the guidebook, crafted to bring you closer to the heartbeat of Sri Lanka."
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {experiences.map((exp) => (
            <article key={exp.id} className="experience-card bg-white shadow-sm hover:shadow-md transition-shadow rounded-lg overflow-hidden border border-gray-100 flex flex-col">
              {exp.heroImageId && (
                <div className="aspect-[3/2] w-full overflow-hidden">
                  <img 
                    src={exp.heroImageId} 
                    alt={exp.name} 
                    className="w-full h-full object-cover transition-transform hover:scale-105 duration-700" 
                  />
                </div>
              )}
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-display font-semibold mb-2">{exp.name}</h3>
                <p className="text-gray-600 text-sm mb-6 flex-1 line-clamp-3">{exp.description}</p>
                <div className="flex justify-end pt-4 border-t border-gray-100 mt-auto">
                  <Link href={`/experiences/${exp.slug}`} className="text-sm font-semibold text-black hover:underline">
                    View Experience
                  </Link>
                </div>
              </div>
            </article>
          ))}
          {experiences.length === 0 && (
            <p className="text-gray-500 col-span-full">New experiences are being curated. Please check back soon.</p>
          )}
        </div>
      </div>
    </div>
  );
}
