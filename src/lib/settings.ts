import { prisma } from "@/lib/prisma";

export async function getSettings() {
  const rows = await prisma.siteSetting.findMany();
  return Object.fromEntries(rows.map((row) => [row.key, row.value])) as Record<string, string>;
}

export async function getSetting(key: string, fallback = "") {
  const row = await prisma.siteSetting.findUnique({ where: { key } });
  return row?.value ?? fallback;
}

export async function setSettings(values: Record<string, string>, group = "general") {
  await prisma.$transaction(
    Object.entries(values).map(([key, value]) =>
      prisma.siteSetting.upsert({
        where: { key },
        update: { value, group },
        create: { key, value, group },
      }),
    ),
  );
}

export function setting(map: Record<string, string>, key: string, fallback = "") {
  return map[key] ?? fallback;
}
