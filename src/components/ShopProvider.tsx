"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { defaultTierId, type TierId } from "@/config/store";
import { quote } from "@/lib/pricing";
import { track } from "@/lib/track";

type Shop = {
  tierId: TierId;
  selectTier: (id: TierId) => void;
  checkoutOpen: boolean;
  openCheckout: (id?: TierId) => void;
  closeCheckout: () => void;
};

const ShopContext = createContext<Shop | null>(null);

export function ShopProvider({ children }: { children: React.ReactNode }) {
  const [tierId, setTierId] = useState<TierId>(defaultTierId);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const selectTier = useCallback((id: TierId) => {
    setTierId(id);
    const q = quote(id, "cod");
    track("AddToCart", { value: q.total, qty: q.qty });
  }, []);

  const openCheckout = useCallback(
    (id?: TierId) => {
      const chosen = id ?? tierId;
      if (id) setTierId(id);
      setCheckoutOpen(true);
      const q = quote(chosen, "cod");
      track("InitiateCheckout", { value: q.total, qty: q.qty });
    },
    [tierId],
  );

  const closeCheckout = useCallback(() => setCheckoutOpen(false), []);

  useEffect(() => {
    track("ViewContent", { value: quote(defaultTierId, "cod").total, qty: 3 });
  }, []);

  const value = useMemo(
    () => ({ tierId, selectTier, checkoutOpen, openCheckout, closeCheckout }),
    [tierId, selectTier, checkoutOpen, openCheckout, closeCheckout],
  );
  return <ShopContext value={value}>{children}</ShopContext>;
}

export function useShop(): Shop {
  const shop = useContext(ShopContext);
  if (!shop) throw new Error("useShop must be used inside <ShopProvider>");
  return shop;
}
