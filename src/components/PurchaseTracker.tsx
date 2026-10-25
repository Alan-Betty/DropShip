"use client";

import { useEffect } from "react";
import { track } from "@/lib/track";

// Fires the ad-platform Purchase event once per order, even if the customer
// refreshes or revisits the confirmation page.
export function PurchaseTracker({ orderId, value, qty }: { orderId: string; value: number; qty: number }) {
  useEffect(() => {
    const key = `aeropod-tracked-${orderId}`;
    try {
      if (localStorage.getItem(key)) return;
      localStorage.setItem(key, "1");
    } catch {}
    track("Purchase", { orderId, value, qty });
  }, [orderId, value, qty]);
  return null;
}
