import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "aeropod_admin";

export function adminConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD);
}

// The cookie holds an HMAC of the password, never the password itself.
// Changing ADMIN_PASSWORD signs everyone out.
export function sessionToken(): string {
  return createHmac("sha256", process.env.ADMIN_PASSWORD ?? "").update("aeropod-admin-session").digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

export function passwordMatches(attempt: string): boolean {
  return adminConfigured() && safeEqual(attempt, process.env.ADMIN_PASSWORD!);
}

export async function isAdmin(): Promise<boolean> {
  if (!adminConfigured()) return false;
  const value = (await cookies()).get(ADMIN_COOKIE)?.value;
  return Boolean(value && safeEqual(value, sessionToken()));
}
