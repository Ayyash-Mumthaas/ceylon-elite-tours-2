import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const exp = await prisma.experience.findFirst({
    where: { slug, published: true, deletedAt: null },
  });

  if (!exp) return { title: "Not Found" };

  return {
    title: `${exp.seoTitle || exp.name} | Ceylon Elite Tours`,
    description: exp.seoDescription || exp.description,
  };
}

export default async function ExperienceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const exp = await prisma.experience.findFirst({
    where: { slug, published: true, deletedAt: null },
  });

  if (!exp) notFound();

  return (
    <article className="pt-24 pb-20">
      <div className="container">
        <Link href="/experiences" className="text-sm text-gray-500 hover:text-black mb-8 inline-block">
          &larr; Back to all experiences
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div>
            <div className="mb-4 text-xs font-semibold tracking-widest uppercase text-gray-500">
              Experience
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-semibold mb-6 leading-tight">
              {exp.name}
            </h1>
            
            <div className="prose prose-gray max-w-none text-lg text-gray-600 font-light">
              <p className="whitespace-pre-wrap">{exp.description}</p>
            </div>

            <div className="mt-12">
              <Link 
                href="/plan-your-journey" 
                className="bg-black text-white px-8 py-3 rounded hover:bg-gray-800 transition-colors inline-block"
              >
                Inquire about this experience
              </Link>
            </div>
          </div>

          <div className="relative">
            {exp.heroImageId ? (
              <div className="aspect-[4/3] rounded-xl overflow-hidden sticky top-32 shadow-xl">
                <img 
                  src={exp.heroImageId} 
                  alt={exp.name} 
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
