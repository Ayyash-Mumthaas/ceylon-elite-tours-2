import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const doc = await prisma.legalDocument.findFirst({
    where: { slug, status: "PUBLISHED" }
  });

  if (!doc) return {};
  
  return {
    title: `${doc.title} | Ceylon Elite Tours`,
  };
}

export default async function PublicLegalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const doc = await prisma.legalDocument.findFirst({
    where: { slug, status: "PUBLISHED" }
  });

  if (!doc) notFound();

  return (
    <div className="pt-32 pb-24 max-w-3xl mx-auto px-4">
      <h1 className="text-4xl font-display font-semibold mb-2">{doc.title}</h1>
      <p className="text-gray-500 mb-12 text-sm border-b border-gray-100 pb-8">
        Effective Date: {doc.effectiveDate ? new Date(doc.effectiveDate).toLocaleDateString() : (doc.publishedAt ? new Date(doc.publishedAt).toLocaleDateString() : '')} 
        <span className="mx-2">•</span> 
        Version: {doc.version}
      </p>

      <div className="prose prose-gray max-w-none">
        {/* Simplified rendering. In a real project, use a Markdown/HTML parser like marked or html-react-parser */}
        <div dangerouslySetInnerHTML={{ __html: doc.content }} />
      </div>
    </div>
  );
}
