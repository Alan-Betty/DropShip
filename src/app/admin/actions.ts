"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { ADMIN_COOKIE, isAdmin, passwordMatches, sessionToken } from "@/lib/admin-auth";
import { ORDER_STATUSES, updateOrder, type OrderStatus, type PaymentStatus } from "@/lib/orders";

export async function login(_prev: string | null, formData: FormData): Promise<string | null> {
  // A short pause on every attempt makes guessing the password slow.
  await new Promise((r) => setTimeout(r, 600));
  if (!passwordMatches(String(formData.get("password") ?? ""))) return "That password isn't right.";
  (await cookies()).set(ADMIN_COOKIE, sessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  revalidatePath("/admin");
  return null;
}

export async function logout() {
  (await cookies()).delete(ADMIN_COOKIE);
  revalidatePath("/admin");
}

const PAYMENT_STATUSES: PaymentStatus[] = ["cod_pending", "awaiting_payment", "paid"];

export async function saveOrder(formData: FormData) {
  if (!(await isAdmin())) throw new Error("Sign in again to update orders.");
  const id = String(formData.get("id"));
  const status = String(formData.get("status")) as OrderStatus;
  const paymentStatus = String(formData.get("paymentStatus")) as PaymentStatus;
  if (!ORDER_STATUSES.includes(status) || !PAYMENT_STATUSES.includes(paymentStatus)) {
    throw new Error("Unknown order or payment status.");
  }
  await updateOrder(id, {
    status,
    paymentStatus,
    tracking: String(formData.get("tracking") ?? "").trim().slice(0, 200),
  });
  revalidatePath("/admin");
  revalidatePath(`/order/${id}`);
}
