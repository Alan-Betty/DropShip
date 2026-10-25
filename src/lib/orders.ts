import { randomInt } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { store, type TierId } from "../config/store.ts";
import { quote, type PaymentMethod } from "./pricing.ts";
import type { CheckoutFields } from "./validation.ts";

export const ORDER_STATUSES = ["placed", "confirmed", "shipped", "delivered", "cancelled"] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];
export type PaymentStatus = "cod_pending" | "awaiting_payment" | "paid";

export type Order = {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: OrderStatus;
  payment: PaymentMethod;
  paymentStatus: PaymentStatus;
  tierId: TierId;
  qty: number;
  packPrice: number;
  delivery: number;
  upiDiscount: number;
  total: number;
  customer: CheckoutFields;
  tracking: string;
};

const DATA_DIR = process.env.ORDERS_DIR ?? path.join(process.cwd(), "data");
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");
// No 0/O/1/I so customers can read an order ID out over the phone.
const ID_ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";

// Every write goes through this chain so two simultaneous checkouts can't
// read the same file and overwrite each other's order.
let writeChain: Promise<unknown> = Promise.resolve();
function serialized<T>(fn: () => Promise<T>): Promise<T> {
  const run = writeChain.then(fn, fn);
  writeChain = run.catch(() => undefined);
  return run;
}

async function readAll(): Promise<Order[]> {
  try {
    return JSON.parse(await readFile(ORDERS_FILE, "utf8")) as Order[];
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw err;
  }
}

async function writeAll(orders: Order[]): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  const tmp = `${ORDERS_FILE}.${process.pid}.tmp`;
  await writeFile(tmp, JSON.stringify(orders, null, 2));
  await rename(tmp, ORDERS_FILE);
}

function newId(existing: Set<string>): string {
  for (;;) {
    let id = "AP";
    for (let i = 0; i < 8; i++) id += ID_ALPHABET[randomInt(ID_ALPHABET.length)];
    if (!existing.has(id)) return id;
  }
}

function countSold(orders: Order[]): number {
  return orders.filter((o) => o.status !== "cancelled").reduce((sum, o) => sum + o.qty, 0);
}

export class OutOfStockError extends Error {
  constructor(public remaining: number) {
    super(remaining > 0 ? `Only ${remaining} pods are left.` : "The launch batch is sold out.");
  }
}

export function createOrder(input: {
  tierId: TierId;
  payment: PaymentMethod;
  customer: CheckoutFields;
}): Promise<Order> {
  return serialized(async () => {
    const orders = await readAll();
    const q = quote(input.tierId, input.payment);
    const remaining = store.launchStock - countSold(orders);
    if (q.qty > remaining) throw new OutOfStockError(Math.max(remaining, 0));

    const now = new Date().toISOString();
    const order: Order = {
      id: newId(new Set(orders.map((o) => o.id))),
      createdAt: now,
      updatedAt: now,
      status: "placed",
      payment: input.payment,
      paymentStatus: input.payment === "upi" ? "awaiting_payment" : "cod_pending",
      tierId: input.tierId,
      qty: q.qty,
      packPrice: q.packPrice,
      delivery: q.delivery,
      upiDiscount: q.upiDiscount,
      total: q.total,
      customer: input.customer,
      tracking: "",
    };
    orders.push(order);
    await writeAll(orders);
    return order;
  });
}

export async function getOrder(id: string): Promise<Order | undefined> {
  return (await readAll()).find((o) => o.id === id.toUpperCase());
}

export async function listOrders(): Promise<Order[]> {
  return (await readAll()).toReversed();
}

export async function stockLeft(): Promise<number> {
  return Math.max(store.launchStock - countSold(await readAll()), 0);
}

export function updateOrder(
  id: string,
  patch: Partial<Pick<Order, "status" | "paymentStatus" | "tracking">>,
): Promise<Order | undefined> {
  return serialized(async () => {
    const orders = await readAll();
    const order = orders.find((o) => o.id === id);
    if (!order) return undefined;
    Object.assign(order, patch, { updatedAt: new Date().toISOString() });
    await writeAll(orders);
    return order;
  });
}

/** Optional copy of each new order to a Google Sheet, Zapier or similar, set via ORDER_WEBHOOK_URL. */
export async function notifyWebhook(order: Order): Promise<void> {
  const url = process.env.ORDER_WEBHOOK_URL;
  if (!url) return;
  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order),
      signal: AbortSignal.timeout(5000),
    });
  } catch (err) {
    console.error(`Order ${order.id} saved, but the webhook failed:`, err);
  }
}
