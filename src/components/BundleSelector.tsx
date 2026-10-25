"use client";

import { Check } from "lucide-react";
import { store, tiers, type TierId } from "@/config/store";
import { formatInr, quote } from "@/lib/pricing";
import { useShop } from "./ShopProvider";

export function BundleSelector({
  value,
  onChange,
  compact = false,
  name = "pack",
}: {
  value: TierId;
  onChange: (id: TierId) => void;
  compact?: boolean;
  name?: string;
}) {
  return (
    <fieldset>
      <legend className="sr-only">Choose a pack</legend>
      <div className={compact ? "grid grid-cols-3 gap-2" : "space-y-3"}>
        {tiers.map((tier) => {
          const q = quote(tier.id, "cod");
          const checked = value === tier.id;
          return (
            <label
              key={tier.id}
              className={`relative block cursor-pointer rounded-2xl border-2 bg-white transition-colors has-focus-visible:outline-3 has-focus-visible:outline-rose ${
                checked ? "border-ink" : "border-mist hover:border-ink-soft/40"
              } ${compact ? "px-3 py-3 text-center" : "px-5 py-4"}`}
            >
              <input
                type="radio"
                name={name}
                value={tier.id}
                checked={checked}
                onChange={() => onChange(tier.id)}
                className="sr-only"
              />
              {compact ? (
                <>
                  <span className="block font-semibold">{tier.title}</span>
                  <span className="block text-sm text-ink-soft">{formatInr(tier.price)}</span>
                </>
              ) : (
                <span className="flex items-start gap-4">
                  <span
                    aria-hidden
                    className={`mt-1 grid size-5 shrink-0 place-items-center rounded-full border-2 ${
                      checked ? "border-ink bg-ink text-white" : "border-mist"
                    }`}
                  >
                    {checked && <Check className="size-3" strokeWidth={3} />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span className="text-lg font-semibold">{tier.title}</span>
                      {tier.badge && (
                        <span className="rounded-full bg-rose px-2.5 py-0.5 text-xs font-semibold text-white">
                          {tier.badge}
                        </span>
                      )}
                    </span>
                    <span className="mt-0.5 block text-sm text-ink-soft">{tier.note}</span>
                    <span className="mt-1.5 block text-sm">
                      {tier.freeDelivery ? (
                        <span className="font-medium text-ok">Free delivery</span>
                      ) : (
                        <span className="text-ink-soft">+ {formatInr(store.deliveryFee)} delivery</span>
                      )}
                    </span>
                  </span>
                  <span className="text-right">
                    <span className="block text-xl font-semibold">{formatInr(tier.price)}</span>
                    {q.savings > 0 ? (
                      <>
                        <span className="block text-sm text-ink-soft line-through">{formatInr(q.mrpTotal)}</span>
                        <span className="block text-sm font-medium text-rose">
                          {formatInr(q.perPod)}/pod, save {formatInr(q.savings)}
                        </span>
                      </>
                    ) : (
                      <span className="block text-sm text-ink-soft">MRP</span>
                    )}
                  </span>
                </span>
              )}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

/** The selector wired to the page-wide selection, used in the shop section. */
export function ShopBundleSelector() {
  const { tierId, selectTier } = useShop();
  return <BundleSelector value={tierId} onChange={selectTier} />;
}
