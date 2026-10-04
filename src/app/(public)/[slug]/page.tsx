import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = await prisma.page.findFirst({
    where: { slug, published: true, deletedAt: null },
  });

  if (!p) return { title: "Not Found" };

  return {
    title: `${p.seoTitle || p.title} | Ceylon Elite Tours`,
    description: p.seoDescription,
  };
}

export default async function GenericPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = await prisma.page.findFirst({
    where: { slug, published: true, deletedAt: null },
  });

  if (!p) notFound();

  return (
    <article className="pt-24 pb-20">
      <div className="container max-w-4xl">
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-display font-semibold mb-4 leading-tight">
            {p.heroHeading || p.title}
          </h1>
          {p.heroSubheading && (
            <p className="text-xl text-gray-600 font-light">
              {p.heroSubheading}
            </p>
          )}
        </header>

        <div className="prose prose-gray prose-lg mx-auto">
          <p className="whitespace-pre-wrap">{p.content}</p>
        </div>
      </div>
    </article>
  );
}
