// Sends funnel events to whichever ad trackers are loaded. Meta's standard
// event names are used so ad campaigns can optimise for purchases directly.

type FunnelEvent = "ViewContent" | "AddToCart" | "InitiateCheckout" | "AddPaymentInfo" | "Purchase";

type Win = Window & {
  fbq?: (...args: unknown[]) => void;
  gtag?: (...args: unknown[]) => void;
};

const GA_NAMES: Record<FunnelEvent, string> = {
  ViewContent: "view_item",
  AddToCart: "add_to_cart",
  InitiateCheckout: "begin_checkout",
  AddPaymentInfo: "add_payment_info",
  Purchase: "purchase",
};

export function track(event: FunnelEvent, params: { value?: number; qty?: number; orderId?: string } = {}) {
  if (typeof window === "undefined") return;
  const w = window as Win;
  w.fbq?.("track", event, {
    currency: "INR",
    value: params.value,
    num_items: params.qty,
    content_ids: ["aeropod-fragrance"],
    content_type: "product",
  });
  w.gtag?.("event", GA_NAMES[event], {
    currency: "INR",
    value: params.value,
    transaction_id: params.orderId,
    items: [{ item_id: "aeropod-fragrance", item_name: "Aero pod Fragrance", quantity: params.qty }],
  });
}
