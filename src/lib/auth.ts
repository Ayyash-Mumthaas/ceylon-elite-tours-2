import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { SESSION_COOKIE } from "@/lib/constants";
import { hashPassword, randomToken, sha256, verifyPassword } from "@/lib/crypto";
import type { Role } from "@/lib/permissions";
import { hasPermission, type Permission } from "@/lib/permissions";

export { SESSION_COOKIE };
const SESSION_DAYS = 7;

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: Role;
};

export async function createUserSession(userId: string) {
  const token = randomToken();
  const tokenHash = sha256(token);
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  const headerStore = await headers();
  await prisma.session.create({
    data: {
      userId,
      tokenHash,
      expiresAt,
      ip: headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() || headerStore.get("x-real-ip"),
      userAgent: headerStore.get("user-agent"),
    },
  });
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
}

export async function getSessionUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const session = await prisma.session.findUnique({
    where: { tokenHash: sha256(token) },
    include: { user: true },
  });
  if (!session || session.expiresAt < new Date() || !session.user.isActive) {
    return null;
  }
  return {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name,
    role: session.user.role as Role,
  };
}

export async function requireUser() {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");
  return user;
}

export async function requirePermission(permission: Permission) {
  const user = await requireUser();
  if (!hasPermission(user.role, permission)) {
    redirect("/admin/forbidden");
  }
  return user;
}

export async function destroyCurrentSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (token) {
    await prisma.session.deleteMany({ where: { tokenHash: sha256(token) } });
  }
  cookieStore.set(SESSION_COOKIE, "", { httpOnly: true, path: "/", expires: new Date(0) });
}

export async function destroyAllSessions(userId: string) {
  await prisma.session.deleteMany({ where: { userId } });
}

export async function authenticate(email: string, password: string) {
  const normalized = email.trim().toLowerCase();
  const headerStore = await headers();
  const ip = headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const user = await prisma.user.findUnique({ where: { email: normalized } });
  const ok = user ? await verifyPassword(password, user.passwordHash) : await verifyPassword(password, await hashPassword("dummy-timing"));
  await prisma.loginAttempt.create({
    data: { email: normalized, ip, success: Boolean(user && user.isActive && ok) },
  });
  if (!user || !user.isActive || !ok) {
    return { ok: false as const, error: "Invalid email or password." };
  }
  await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
  await createUserSession(user.id);
  return { ok: true as const, user };
}
