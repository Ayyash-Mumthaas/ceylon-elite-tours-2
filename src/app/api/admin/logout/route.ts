import { destroyCurrentSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function POST() {
  await destroyCurrentSession();
  redirect("/admin/login");
}
