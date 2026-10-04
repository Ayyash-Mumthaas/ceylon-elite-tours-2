export const ROLES = [
  "SUPER_ADMIN",
  "ADMIN",
  "SALES",
  "CONTENT_EDITOR",
  "OPERATIONS",
  "VIEWER",
] as const;

export type Role = (typeof ROLES)[number];

export const PERMISSIONS = {
  manage_users: ["SUPER_ADMIN", "ADMIN"],
  manage_settings: ["SUPER_ADMIN", "ADMIN"],
  manage_security: ["SUPER_ADMIN"],
  manage_tours: ["SUPER_ADMIN", "ADMIN", "CONTENT_EDITOR"],
  manage_destinations: ["SUPER_ADMIN", "ADMIN", "CONTENT_EDITOR"],
  manage_experiences: ["SUPER_ADMIN", "ADMIN", "CONTENT_EDITOR"],
  manage_media: ["SUPER_ADMIN", "ADMIN", "CONTENT_EDITOR"],
  manage_journal: ["SUPER_ADMIN", "ADMIN", "CONTENT_EDITOR"],
  manage_reviews: ["SUPER_ADMIN", "ADMIN", "CONTENT_EDITOR"],
  manage_pages: ["SUPER_ADMIN", "ADMIN", "CONTENT_EDITOR"],
  manage_legal: ["SUPER_ADMIN", "ADMIN"],
  manage_inquiries: ["SUPER_ADMIN", "ADMIN", "SALES", "OPERATIONS"],
  manage_quotations: ["SUPER_ADMIN", "ADMIN", "SALES"],
  manage_bookings: ["SUPER_ADMIN", "ADMIN", "SALES", "OPERATIONS"],
  manage_vehicles: ["SUPER_ADMIN", "ADMIN", "OPERATIONS"],
  manage_drivers: ["SUPER_ADMIN", "ADMIN", "OPERATIONS"],
  manage_payments: ["SUPER_ADMIN", "ADMIN", "SALES"],
  manage_customers: ["SUPER_ADMIN", "ADMIN", "SALES", "OPERATIONS"],
  view_analytics: ["SUPER_ADMIN", "ADMIN", "SALES", "VIEWER"],
  view_audit_logs: ["SUPER_ADMIN", "ADMIN"],
  export_data: ["SUPER_ADMIN", "ADMIN"],
  import_data: ["SUPER_ADMIN", "ADMIN"],
} as const;

export type Permission = keyof typeof PERMISSIONS;

export function hasPermission(role: string | undefined, permission: Permission) {
  if (!role) return false;
  if (role === "SUPER_ADMIN") return true;
  return (PERMISSIONS[permission] as readonly string[]).includes(role);
}

export function canMutate(role: string | undefined) {
  return role !== "VIEWER";
}
