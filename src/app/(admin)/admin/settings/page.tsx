import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requirePermission } from "@/lib/auth";

export default async function SettingsPage() {
  await requirePermission("manage_settings");

  const settingsRaw = await prisma.siteSetting.findMany({
    orderBy: { group: 'asc' }
  });

  const settings = Object.fromEntries(settingsRaw.map((s) => [s.key, s.value]));

  async function updateSettings(formData: FormData) {
    "use server";
    await requirePermission("manage_settings");

    const keys = [
      "brandName", "legalBusinessName", "tagline", "websiteDescription", "websiteUrl", 
      "copyrightText", "defaultCurrency", "timezone", "defaultLanguage",
      "phone", "whatsapp", "email", "bookingEmail", "supportEmail", "address", "googleMapsUrl", 
      "businessHours", "facebookUrl", "instagramUrl", "twitterUrl",
      "defaultSeoTitle", "defaultSeoDescription", "logoUrl", "faviconUrl"
    ];

    const updates = keys.map((key) => {
      const value = formData.get(key) as string || "";
      let group = "general";
      if (["phone", "whatsapp", "email", "bookingEmail", "supportEmail", "address", "googleMapsUrl", "businessHours"].includes(key)) group = "contact";
      if (["facebookUrl", "instagramUrl", "twitterUrl"].includes(key)) group = "social";
      if (["defaultSeoTitle", "defaultSeoDescription"].includes(key)) group = "seo";
      if (["logoUrl", "faviconUrl"].includes(key)) group = "media";

      return prisma.siteSetting.upsert({
        where: { key },
        update: { value, group },
        create: { key, value, group },
      });
    });

    await prisma.$transaction(updates);
    revalidatePath("/", "layout");
  }

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <h1 className="text-2xl font-display font-semibold mb-6">Global Settings</h1>
      
      <form action={updateSettings} className="space-y-8">
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-medium text-gray-900 border-b border-gray-100 pb-3 mb-4">General Configuration</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Brand Name</label>
              <input type="text" name="brandName" defaultValue={settings.brandName || ""} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Legal Business Name</label>
              <input type="text" name="legalBusinessName" defaultValue={settings.legalBusinessName || ""} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Tagline</label>
              <input type="text" name="tagline" defaultValue={settings.tagline || ""} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Website Description</label>
              <textarea name="websiteDescription" defaultValue={settings.websiteDescription || ""} rows={3} className="w-full border border-gray-300 rounded px-3 py-2 text-sm"></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Website URL</label>
              <input type="url" name="websiteUrl" defaultValue={settings.websiteUrl || ""} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" placeholder="https://..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Footer Copyright Text</label>
              <input type="text" name="copyrightText" defaultValue={settings.copyrightText || ""} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Default Currency</label>
              <input type="text" name="defaultCurrency" defaultValue={settings.defaultCurrency || "USD"} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Default Language</label>
              <input type="text" name="defaultLanguage" defaultValue={settings.defaultLanguage || "en"} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-medium text-gray-900 border-b border-gray-100 pb-3 mb-4">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Main Phone</label>
              <input type="text" name="phone" defaultValue={settings.phone || ""} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
              <input type="text" name="whatsapp" defaultValue={settings.whatsapp || ""} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">General Email</label>
              <input type="email" name="email" defaultValue={settings.email || ""} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Booking Email</label>
              <input type="email" name="bookingEmail" defaultValue={settings.bookingEmail || ""} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <textarea name="address" defaultValue={settings.address || ""} rows={2} className="w-full border border-gray-300 rounded px-3 py-2 text-sm"></textarea>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Google Maps URL</label>
              <input type="url" name="googleMapsUrl" defaultValue={settings.googleMapsUrl || ""} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Business Hours</label>
              <input type="text" name="businessHours" defaultValue={settings.businessHours || ""} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-medium text-gray-900 border-b border-gray-100 pb-3 mb-4">Social Media</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Facebook URL</label>
              <input type="url" name="facebookUrl" defaultValue={settings.facebookUrl || ""} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Instagram URL</label>
              <input type="url" name="instagramUrl" defaultValue={settings.instagramUrl || ""} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Twitter/X URL</label>
              <input type="url" name="twitterUrl" defaultValue={settings.twitterUrl || ""} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-medium text-gray-900 border-b border-gray-100 pb-3 mb-4">SEO Defaults</h2>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Default SEO Title</label>
              <input type="text" name="defaultSeoTitle" defaultValue={settings.defaultSeoTitle || ""} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Default SEO Description</label>
              <textarea name="defaultSeoDescription" defaultValue={settings.defaultSeoDescription || ""} rows={3} className="w-full border border-gray-300 rounded px-3 py-2 text-sm"></textarea>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-gray-50 p-4 border-t border-gray-200 flex justify-end z-10 rounded-b-lg">
          <button type="submit" className="bg-black text-white rounded px-8 py-2.5 text-sm font-medium hover:bg-gray-800 transition-colors shadow-sm">
            Save All Settings
          </button>
        </div>
      </form>
    </div>
  );
}
