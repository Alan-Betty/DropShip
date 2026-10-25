// Every business number on the site lives here. Change a price or policy once
// and the page, checkout, server-side order total and admin all follow.

export type TierId = "single" | "trio" | "five";

export type Tier = {
  id: TierId;
  qty: number;
  /** Selling price for the whole pack, in rupees. Must not exceed qty × MRP. */
  price: number;
  title: string;
  note: string;
  badge?: string;
  freeDelivery: boolean;
};

export const store = {
  brand: "Aero pod",
  productName: "Aero pod Fragrance car tissue pod",
  tagline: "freshness that rides with you.",
  fragrance: "Rose floral",
  mrp: 130,
  /** Size of the launch batch. The stock meter counts down from this using real orders. */
  launchStock: 2000,
  deliveryFee: 40,
  /** Flat rupee discount for paying by UPI. Prepaid orders almost never come back as RTO. */
  upiDiscount: 20,
  shipsFrom: "Kerala",
  delivery: {
    homeState: "Kerala",
    homeStateDays: "2–4 working days",
    restOfIndiaDays: "4–7 working days",
  },
  damageClaimHours: 48,
  returnWindowDays: 7,
  contact: {
    /** Digits only with country code, e.g. 919876543210. Leave empty to hide WhatsApp links. */
    whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "",
    email: process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? "",
  },
  /** UPI ID that receives payments. Leave empty to offer cash on delivery only. */
  upiId: process.env.NEXT_PUBLIC_UPI_ID ?? "",
  upiPayeeName: process.env.NEXT_PUBLIC_UPI_PAYEE_NAME ?? "Aero pod",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
} as const;

export const tiers: Tier[] = [
  {
    id: "single",
    qty: 1,
    price: 130,
    title: "1 pod",
    note: "Try it in one car",
    freeDelivery: false,
  },
  {
    id: "trio",
    qty: 3,
    price: 299,
    title: "3 pods",
    note: "Car, home and office desk",
    badge: "Recommended",
    freeDelivery: true,
  },
  {
    id: "five",
    qty: 5,
    price: 449,
    title: "5 pods",
    note: "Family cars, or gifts for new car owners",
    badge: "Lowest price per pod",
    freeDelivery: true,
  },
];

export const defaultTierId: TierId = "trio";

export function getTier(id: string): Tier | undefined {
  return tiers.find((t) => t.id === id);
}

export function whatsappLink(message: string): string | null {
  if (!store.contact.whatsapp) return null;
  return `https://wa.me/${store.contact.whatsapp}?text=${encodeURIComponent(message)}`;
}
