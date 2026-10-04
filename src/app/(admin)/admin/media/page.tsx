import { DeleteButton } from "@/components/delete-button";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/auth";
import { uploadMedia, deleteMedia } from "./actions";

export default async function MediaLibraryPage() {
  await requirePermission("manage_media");

  const media = await prisma.mediaAsset.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-display font-semibold">Media Library</h1>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
        <h2 className="text-sm font-semibold uppercase text-gray-500 tracking-wider mb-4">Upload New Media</h2>
        <form action={uploadMedia} className="flex gap-4 items-center">
          <input 
            type="file" 
            name="file" 
            accept="image/*,application/pdf" 
            required 
            className="flex-1 border border-gray-300 rounded p-2 text-sm" 
          />
          <input 
            type="text" 
            name="altText" 
            placeholder="Alt text (Optional)" 
            className="flex-1 border border-gray-300 rounded p-2 text-sm" 
          />
          <button type="submit" className="bg-black text-white px-6 py-2 rounded text-sm font-medium hover:bg-gray-800 transition">
            Upload
          </button>
        </form>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {media.length === 0 ? (
          <div className="col-span-full py-12 text-center text-gray-500 bg-gray-50 rounded-lg border border-gray-200">
            No media found.
          </div>
        ) : (
          media.map((item) => (
            <div key={item.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden group relative flex flex-col">
              <div className="aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
                {item.mimeType.startsWith('image/') ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.url} alt={item.altText || item.filename} className="object-cover w-full h-full" />
                ) : (
                  <span className="text-gray-400 font-medium text-xs uppercase">{item.mimeType.split('/')[1]}</span>
                )}
              </div>
              <div className="p-3 bg-white text-xs border-t border-gray-100 flex-1 flex flex-col justify-between">
                <div>
                  <div className="font-medium text-gray-900 truncate" title={item.originalName}>{item.originalName}</div>
                  <div className="text-gray-500 mt-1">{(item.sizeBytes / 1024).toFixed(1)} KB</div>
                </div>
                
                <form action={deleteMedia.bind(null, item.id)} className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <DeleteButton message="Are you sure? This may break pages where this image is used." className="text-red-600 hover:text-red-800" />
                </form>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
