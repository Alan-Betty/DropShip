import { getTier, store, type Tier, type TierId } from "../config/store.ts";

export type PaymentMethod = "cod" | "upi";

export type Quote = {
  tier: Tier;
  qty: number;
  mrpTotal: number;
  packPrice: number;
  savings: number;
  delivery: number;
  upiDiscount: number;
  total: number;
  perPod: number;
};

// The server calls this with the tier id from the request and ignores any
// price the browser sends, so totals can't be tampered with.
export function quote(tierId: TierId, payment: PaymentMethod): Quote {
  const tier = getTier(tierId);
  if (!tier) throw new Error(`Unknown pack: ${tierId}`);

  const mrpTotal = tier.qty * store.mrp;
  const delivery = tier.freeDelivery ? 0 : store.deliveryFee;
  const upiDiscount = payment === "upi" && store.upiId ? store.upiDiscount : 0;

  return {
    tier,
    qty: tier.qty,
    mrpTotal,
    packPrice: tier.price,
    savings: mrpTotal - tier.price,
    delivery,
    upiDiscount,
    total: tier.price + delivery - upiDiscount,
    perPod: Math.round(tier.price / tier.qty),
  };
}

/** What it costs to go from the single pod to the recommended pack, delivery included. */
export function upgradeCost(from: TierId, to: TierId): number {
  return quote(to, "cod").total - quote(from, "cod").total;
}

export function formatInr(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}
