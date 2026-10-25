import { test } from "node:test";
import assert from "node:assert/strict";

process.env.NEXT_PUBLIC_UPI_ID = "aeropod@upi";
const { quote, upgradeCost, formatInr } = await import("./pricing.ts");
const { tiers, store } = await import("../config/store.ts");

test("no pack is priced above its MRP", () => {
  for (const tier of tiers) assert.ok(tier.price <= tier.qty * store.mrp, tier.id);
});

test("single pod pays delivery, cash on delivery", () => {
  const q = quote("single", "cod");
  assert.equal(q.packPrice, 130);
  assert.equal(q.delivery, store.deliveryFee);
  assert.equal(q.upiDiscount, 0);
  assert.equal(q.total, 130 + store.deliveryFee);
});

test("3-pod pack ships free and UPI takes the discount off", () => {
  const q = quote("trio", "upi");
  assert.equal(q.delivery, 0);
  assert.equal(q.upiDiscount, store.upiDiscount);
  assert.equal(q.total, 299 - store.upiDiscount);
  assert.equal(q.savings, 390 - 299);
});

test("upgrading from 1 to 3 pods costs the difference including delivery", () => {
  assert.equal(upgradeCost("single", "trio"), 299 - (130 + store.deliveryFee));
});

test("unknown packs are rejected", () => {
  assert.throws(() => quote("ten" as never, "cod"));
});

test("formats rupees with Indian grouping", () => {
  assert.equal(formatInr(129999), "₹1,29,999");
});
