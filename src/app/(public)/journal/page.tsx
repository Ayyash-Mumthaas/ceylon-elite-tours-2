import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Journal | Ceylon Elite Tours",
  description: "Travel stories, guides, and inspiration for your Sri Lankan adventure.",
};

export default async function JournalPage() {
  const posts = await prisma.journalPost.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
    include: { author: true, category: true }
  });

  return (
    <main className="pt-32 pb-24 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-display font-semibold mb-4">The Journal</h1>
          <p className="text-gray-600 text-lg">Inspiration, guides, and stories from Sri Lanka.</p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center text-gray-500 py-12">No posts available yet. Check back soon!</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {posts.map(post => (
              <Link key={post.id} href={`/journal/${post.slug}`} className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition border border-gray-100 flex flex-col">
                <div className="aspect-[4/3] bg-gray-200 overflow-hidden relative">
                  {post.heroImageId ? (
                    // In a real app, resolve image ID to URL. Using a placeholder for now.
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={`https://source.unsplash.com/random/800x600?srilanka,${post.id}`} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 group-hover:scale-105 transition duration-500">No Image</div>
                  )}
                  {post.category && (
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded">
                      {post.category.name}
                    </div>
                  )}
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="text-xs text-gray-500 mb-2 uppercase tracking-wide">
                    {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Recently'}
                  </div>
                  <h2 className="text-xl font-semibold mb-3 group-hover:text-amber-700 transition-colors line-clamp-2">{post.title}</h2>
                  <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-1">{post.excerpt}</p>
                  <div className="flex items-center text-sm text-gray-500 mt-auto pt-4 border-t border-gray-100">
                    <span>By {post.author?.name || 'Ceylon Elite Tours'}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
