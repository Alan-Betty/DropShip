import QRCode from "qrcode";
import { store } from "../config/store.ts";

/** A upi://pay link that opens GPay, PhonePe, Paytm etc. with the amount and order ID filled in. */
export function upiLink(orderId: string, amount: number): string {
  const params = new URLSearchParams({
    pa: store.upiId,
    pn: store.upiPayeeName,
    am: amount.toFixed(2),
    cu: "INR",
    tn: `Aero pod order ${orderId}`,
    tr: orderId,
  });
  return `upi://pay?${params.toString()}`;
}

export function upiQrDataUrl(orderId: string, amount: number): Promise<string> {
  return QRCode.toDataURL(upiLink(orderId, amount), { margin: 1, width: 440, color: { dark: "#1d1a1c", light: "#ffffff" } });
}
