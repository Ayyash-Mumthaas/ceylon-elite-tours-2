import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function audit(input: {
  actorId?: string | null;
  actorEmail?: string | null;
  action: string;
  resource: string;
  resourceId?: string | null;
  result?: string;
  metadata?: Record<string, unknown>;
}) {
  const headerStore = await headers();
  await prisma.auditLog.create({
    data: {
      actorId: input.actorId ?? undefined,
      actorEmail: input.actorEmail ?? undefined,
      action: input.action,
      resource: input.resource,
      resourceId: input.resourceId ?? undefined,
      ip: headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() || headerStore.get("x-real-ip"),
      result: input.result ?? "success",
      metadata: JSON.stringify(input.metadata ?? {}),
    },
  });
}
