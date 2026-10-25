"use client";

import { ChevronDown } from "lucide-react";
import { store } from "@/config/store";
import { formatInr, quote } from "@/lib/pricing";
import { ShopBundleSelector } from "./BundleSelector";
import { primaryButton } from "./BuyButton";
import { Gallery } from "./Gallery";
import { useShop } from "./ShopProvider";

const details = [
  {
    title: "What you get",
    body: `Each pod is a matte black cylinder printed with dark roses, filled with ${store.fragrance.toLowerCase()} scented dry tissues. The tissue rises through the lid, so the next one is always ready to pull.`,
  },
  {
    title: "Delivery",
    body: `${store.delivery.homeState}: ${store.delivery.homeStateDays}. Rest of India: ${store.delivery.restOfIndiaDays}. Packs of 3 or more ship free; a single pod has a ${formatInr(store.deliveryFee)} delivery charge, shown before you pay.`,
  },
  {
    title: "Damage and returns",
    body: `If a pod arrives damaged, send us a photo within ${store.damageClaimHours} hours of delivery and we'll send a replacement free. Unopened pods can be returned within ${store.returnWindowDays} days of delivery.`,
  },
];

export function ProductShowcase() {
  const { tierId, openCheckout } = useShop();
  const q = quote(tierId, "cod");

  return (
    <section id="shop" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <Gallery />

        <div>
          <h2 className="text-title font-semibold">Aero pod Fragrance</h2>
          <p className="mt-2 text-lg text-ink-soft">Rose-scented car tissue pod</p>

          <p className="mt-6 flex flex-wrap items-baseline gap-x-3">
            <span className="text-3xl font-semibold">{formatInr(q.packPrice)}</span>
            {q.savings > 0 && (
              <>
                <span className="text-lg text-ink-soft line-through">MRP {formatInr(q.mrpTotal)}</span>
                <span className="font-semibold text-rose">You save {formatInr(q.savings)}</span>
              </>
            )}
          </p>
          <p className="mt-1 text-sm text-ink-soft">MRP {formatInr(store.mrp)} per pod, inclusive of all taxes.</p>

          <div className="mt-8">
            <ShopBundleSelector />
          </div>

          <button type="button" onClick={() => openCheckout()} className={`${primaryButton} mt-6 w-full`}>
            Buy {q.tier.title} for {formatInr(q.total)}
          </button>
          <p className="mt-3 text-center text-sm text-ink-soft">
            Pay cash on delivery
            {store.upiId ? `, or pay by UPI and save ${formatInr(store.upiDiscount)}.` : "."}
          </p>

          <div className="mt-10 divide-y divide-mist border-y border-mist">
            {details.map((d) => (
              <details key={d.title} className="group py-1">
                <summary className="flex cursor-pointer list-none items-center justify-between py-4 font-semibold [&::-webkit-details-marker]:hidden">
                  {d.title}
                  <ChevronDown aria-hidden className="size-5 text-ink-soft transition-transform group-open:rotate-180" />
                </summary>
                <p className="pb-5 leading-relaxed text-ink-soft">{d.body}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
