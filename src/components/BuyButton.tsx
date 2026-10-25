"use client";

import type { TierId } from "@/config/store";
import { useShop } from "./ShopProvider";

export const primaryButton =
  "inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-aero px-7 text-base font-semibold text-white transition-colors hover:bg-aero-deep active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60";

/** Opens checkout. Pass a tier to switch to it first; otherwise the selected pack is used. */
export function BuyButton({
  tierId,
  className = "",
  children,
}: {
  tierId?: TierId;
  className?: string;
  children: React.ReactNode;
}) {
  const { openCheckout } = useShop();
  return (
    <button type="button" onClick={() => openCheckout(tierId)} className={`${primaryButton} ${className}`}>
      {children}
    </button>
  );
}
