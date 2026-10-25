"use client";

import { useEffect, useState } from "react";
import { formatInr, quote } from "@/lib/pricing";
import { primaryButton } from "./BuyButton";
import { useShop } from "./ShopProvider";

// Mobile-only bar that keeps a buy button under the thumb once the hero's
// button has scrolled away. It hides over the shop section, which has its own.
export function StickyBuyBar() {
  const { tierId, openCheckout } = useShop();
  const [visible, setVisible] = useState(false);
  const q = quote(tierId, "cod");

  useEffect(() => {
    const hero = document.getElementById("top");
    const shop = document.getElementById("shop");
    if (!hero || !shop) return;
    const state = { pastHero: false, onShop: false };
    const observer = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.target === hero) state.pastHero = !e.isIntersecting;
        if (e.target === shop) state.onShop = e.isIntersecting;
      }
      setVisible(state.pastHero && !state.onShop);
    });
    observer.observe(hero);
    observer.observe(shop);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-mist bg-white/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-md transition-transform duration-300 lg:hidden ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
      aria-hidden={!visible}
      inert={!visible}
    >
      <div className="flex items-center gap-4">
        <div className="min-w-0 flex-1 leading-tight">
          <p className="font-semibold">
            {q.tier.title}, {formatInr(q.total)}
          </p>
          <p className="truncate text-sm text-ink-soft">
            {q.delivery === 0 ? "Free delivery" : `Includes ${formatInr(q.delivery)} delivery`}, pay on delivery
          </p>
        </div>
        <button type="button" onClick={() => openCheckout()} className={`${primaryButton} min-h-12! px-6!`}>
          Buy now
        </button>
      </div>
    </div>
  );
}
