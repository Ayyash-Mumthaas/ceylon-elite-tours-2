import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.journalPost.findFirst({
    where: { slug, published: true }
  });

  if (!post) return {};
  
  return {
    title: `${post.seoTitle || post.title} | Ceylon Elite Tours`,
    description: post.seoDescription || post.excerpt,
  };
}

export default async function PublicJournalPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const post = await prisma.journalPost.findFirst({
    where: { slug, published: true },
    include: { author: true, category: true }
  });

  if (!post) notFound();

  return (
    <main className="bg-white">
      {/* Hero Section */}
      <div className="relative pt-32 pb-24 lg:pt-40 lg:pb-32 bg-gray-900 text-white">
        {post.heroImageId && (
          <div className="absolute inset-0 z-0">
             {/* eslint-disable-next-line @next/next/no-img-element */}
             <img src={`https://source.unsplash.com/random/1920x1080?srilanka,${post.id}`} alt={post.title} className="w-full h-full object-cover opacity-40" />
          </div>
        )}
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            {post.category && (
              <div className="mb-6 inline-block bg-white/20 backdrop-blur-sm px-4 py-1.5 text-sm font-semibold uppercase tracking-wider rounded-full">
                {post.category.name}
              </div>
            )}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-semibold mb-6 leading-tight">{post.title}</h1>
            <div className="flex items-center justify-center gap-4 text-sm text-gray-200">
              <span>{post.author?.name || 'Ceylon Elite Tours'}</span>
              <span>•</span>
              <span>{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Recently'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-xl text-gray-600 mb-12 font-medium italic border-l-4 border-amber-600 pl-6 py-2">
              {post.excerpt}
            </div>
            
            <div className="prose prose-lg prose-amber max-w-none">
              {/* Note: Use a markdown parser in a real project. Doing simple output for demo. */}
              <div dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br />') }} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
