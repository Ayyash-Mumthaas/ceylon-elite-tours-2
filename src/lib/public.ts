import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { parseJson } from "@/lib/sanitize";
import { getSettings } from "@/lib/settings";

export const getPublicSite = cache(async () => {
  const now = new Date();
  const [
    settings,
    nav,
    social,
    contacts,
    features,
    announcement,
    homepage,
    tours,
    destinations,
    experiences,
    vehicles,
    faqs,
    reviews,
    trust,
    journal,
    legal,
    media,
  ] = await Promise.all([
    getSettings(),
    prisma.navigationItem.findMany({ where: { visible: true }, orderBy: { sortOrder: "asc" } }),
    prisma.socialLink.findMany({ where: { visible: true }, orderBy: { sortOrder: "asc" } }),
    prisma.contactMethod.findMany({ where: { visible: true }, orderBy: { sortOrder: "asc" } }),
    prisma.featureFlag.findMany(),
    prisma.announcement.findFirst({
      where: {
        visible: true,
        OR: [{ startsAt: null }, { startsAt: { lte: now } }],
        AND: [{ OR: [{ endsAt: null }, { endsAt: { gte: now } }] }],
      },
    }),
    prisma.homepageSection.findMany({ where: { visible: true }, orderBy: { sortOrder: "asc" } }),
    prisma.tour.findMany({
      where: { published: true, deletedAt: null },
      include: { destinations: { include: { destination: true } }, experiences: { include: { experience: true } } },
      orderBy: [{ featured: "desc" }, { title: "asc" }],
    }),
    prisma.destination.findMany({
      where: { published: true, deletedAt: null },
      orderBy: [{ featured: "desc" }, { name: "asc" }],
    }),
    prisma.experience.findMany({
      where: { published: true, deletedAt: null },
      include: { destinations: { include: { destination: true } } },
      orderBy: [{ featured: "desc" }, { name: "asc" }],
    }),
    prisma.vehicle.findMany({
      where: { displayPublic: true, deletedAt: null, publicStatus: { not: "HIDDEN" } },
      orderBy: { name: "asc" },
    }),
    prisma.faq.findMany({ where: { published: true }, orderBy: [{ featured: "desc" }, { sortOrder: "asc" }] }),
    prisma.review.findMany({ where: { published: true }, orderBy: [{ featured: "desc" }, { createdAt: "desc" }] }),
    prisma.trustItem.findMany({ where: { published: true }, orderBy: { sortOrder: "asc" } }),
    prisma.journalPost.findMany({
      where: { published: true, deletedAt: null },
      include: { category: true, author: true },
      orderBy: { publishedAt: "desc" },
    }),
    prisma.legalDocument.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.mediaAsset.findMany(),
  ]);

  const mediaById = Object.fromEntries(media.map((item) => [item.id, item]));
  const flags = Object.fromEntries(features.map((item) => [item.key, item.enabled]));

  return {
    settings,
    nav,
    social,
    contacts,
    flags,
    announcement,
    homepage,
    tours,
    destinations,
    experiences,
    vehicles,
    faqs,
    reviews,
    trust,
    journal,
    legal,
    mediaById,
  };
});

export function mediaUrl(
  mediaById: Record<string, { url: string; altText: string | null }>,
  id?: string | null,
  fallback = "",
) {
  if (!id) return fallback;
  return mediaById[id]?.url ?? fallback;
}

export function jsonList(value?: string | null) {
  return parseJson<string[]>(value, []);
}

export function whatsappHref(settings: Record<string, string>, message?: string) {
  const raw = settings.whatsappNumber || "";
  const digits = raw.replace(/[^\d]/g, "");
  if (!digits) return null;
  const text = encodeURIComponent(message || settings.whatsappDefaultMessage || "Hello Ceylon Elite Tours, I would like to plan a trip to Sri Lanka.");
  return `https://wa.me/${digits}?text=${text}`;
}
