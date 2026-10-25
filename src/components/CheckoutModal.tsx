"use client";

import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { Banknote, Loader2, Lock, Smartphone, Truck, X } from "lucide-react";
import { store, type TierId } from "@/config/store";
import { formatInr, quote, upgradeCost, type PaymentMethod } from "@/lib/pricing";
import { track } from "@/lib/track";
import { isValidPincode, validateCheckout, type CheckoutFields, type FieldErrors } from "@/lib/validation";
import { BundleSelector } from "./BundleSelector";
import { primaryButton } from "./BuyButton";
import { useShop } from "./ShopProvider";

const SAVED_KEY = "aeropod-checkout";
const EMPTY: CheckoutFields = { name: "", phone: "", pincode: "", address: "", landmark: "", city: "", state: "" };

const STATES = [
  "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chandigarh",
  "Chhattisgarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Goa", "Gujarat", "Haryana",
  "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka", "Kerala", "Ladakh", "Lakshadweep",
  "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Puducherry",
  "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand",
  "West Bengal",
];

type PinResult = { pincode: string; status: "found" | "error"; message?: string };

export function CheckoutModal() {
  const { tierId, selectTier, checkoutOpen, closeCheckout } = useShop();
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [fields, setFields] = useState<CheckoutFields>(EMPTY);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [payment, setPayment] = useState<PaymentMethod>(store.upiId ? "upi" : "cod");
  const [pinResult, setPinResult] = useState<PinResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const autoFilled = useRef({ city: "", state: "" });

  const q = quote(tierId, payment);
  const codTotal = quote(tierId, "cod").total;

  // Open and close the native dialog in step with shop state. Native <dialog>
  // gives us the focus trap, Escape to close and inert background for free.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (checkoutOpen && !dialog.open) {
      dialog.showModal();
      document.documentElement.style.overflow = "hidden";
    } else if (!checkoutOpen && dialog.open) {
      dialog.close();
    }
    if (!checkoutOpen) document.documentElement.style.overflow = "";
  }, [checkoutOpen]);

  // Returning customers shouldn't have to type their address twice.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(SAVED_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time restore from browser storage after hydration
      if (saved) setFields({ ...EMPTY, ...JSON.parse(saved) });
    } catch {}
  }, []);

  useEffect(() => {
    const pincode = fields.pincode;
    if (!isValidPincode(pincode)) return;
    const controller = new AbortController();
    fetch(`/api/pincode/${pincode}`, { signal: controller.signal })
      .then(async (res) => {
        const body = await res.json();
        if (!res.ok) {
          setPinResult({ pincode, status: "error", message: body.error });
          return;
        }
        setPinResult({ pincode, status: "found" });
        setFields((f) => ({
          ...f,
          city: !f.city || f.city === autoFilled.current.city ? body.city : f.city,
          state: !f.state || f.state === autoFilled.current.state ? body.state : f.state,
        }));
        autoFilled.current = { city: body.city, state: body.state };
      })
      .catch((err) => {
        if (err.name !== "AbortError")
          setPinResult({ pincode, status: "error", message: "Enter your city and state below." });
      });
    return () => controller.abort();
  }, [fields.pincode]);

  // A lookup result only counts for the PIN currently typed; anything else is idle or in flight.
  const pin = !isValidPincode(fields.pincode)
    ? { status: "idle" as const }
    : pinResult?.pincode === fields.pincode
      ? pinResult
      : { status: "loading" as const };

  function update<K extends keyof CheckoutFields>(key: K, value: string) {
    setFields((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  }

  async function placeOrder(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    const checked = validateCheckout(fields);
    if (!checked.ok) {
      setErrors(checked.errors);
      const first = Object.keys(checked.errors)[0];
      dialogRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    setSubmitting(true);
    track("AddPaymentInfo", { value: q.total, qty: q.qty });
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tierId, payment, customer: checked.data }),
      });
      const body = await res.json();
      if (!res.ok) {
        if (body.fields) setErrors(body.fields);
        setFormError(body.error ?? "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }
      try {
        const { name, phone, pincode, address, landmark, city, state } = checked.data;
        localStorage.setItem(SAVED_KEY, JSON.stringify({ name, phone, pincode, address, landmark, city, state }));
      } catch {}
      router.push(`/order/${body.id}`);
      closeCheckout();
      setSubmitting(false);
    } catch {
      setFormError("You seem to be offline. Check your connection and place the order again.");
      setSubmitting(false);
    }
  }

  const isHomeState = fields.state.trim().toLowerCase() === store.delivery.homeState.toLowerCase();
  const eta = isHomeState ? store.delivery.homeStateDays : store.delivery.restOfIndiaDays;

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="checkout-title"
      onClose={closeCheckout}
      onClick={(e) => e.target === dialogRef.current && closeCheckout()}
      className="m-0 h-dvh max-h-dvh w-full max-w-none bg-petal p-0 text-ink sm:m-auto sm:h-auto sm:max-h-[92dvh] sm:max-w-lg sm:rounded-[1.75rem] sm:shadow-2xl"
    >
      <form onSubmit={placeOrder} noValidate className="flex h-full max-h-[inherit] flex-col">
        <div className="flex items-center justify-between border-b border-mist px-5 py-4">
          <h2 id="checkout-title" className="text-xl font-semibold">Checkout</h2>
          <button
            type="button"
            onClick={closeCheckout}
            className="grid size-10 place-items-center rounded-full hover:bg-blush"
            aria-label="Close checkout"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="flex-1 space-y-7 overflow-y-auto px-5 py-6">
          <section aria-labelledby="pack-heading">
            <h3 id="pack-heading" className="mb-3 font-semibold">Your pack</h3>
            <BundleSelector value={tierId} onChange={(id: TierId) => selectTier(id)} compact name="checkout-pack" />
            {tierId === "single" && (
              <div className="mt-3 flex items-center gap-3 rounded-2xl bg-blush px-4 py-3 text-sm">
                <Truck aria-hidden className="size-5 shrink-0 text-rose" />
                <p className="flex-1">
                  Add 2 more pods for <strong>{formatInr(upgradeCost("single", "trio"))}</strong> and delivery
                  becomes free.
                </p>
                <button
                  type="button"
                  onClick={() => selectTier("trio")}
                  className="shrink-0 rounded-full bg-ink px-3.5 py-2 text-sm font-semibold text-white"
                >
                  Make it 3
                </button>
              </div>
            )}
          </section>

          <section aria-labelledby="address-heading" className="space-y-4">
            <h3 id="address-heading" className="font-semibold">Delivery details</h3>
            <Field label="Full name" name="name" value={fields.name} error={errors.name} onChange={update}
              autoComplete="name" autoFocus />
            <Field label="Mobile number" name="phone" value={fields.phone} error={errors.phone} onChange={update}
              autoComplete="tel-national" inputMode="tel" prefix="+91" hint="We'll WhatsApp your order updates here." />
            <Field label="PIN code" name="pincode" value={fields.pincode} error={errors.pincode}
              onChange={(k, v) => update(k, v.replace(/\D/g, "").slice(0, 6))}
              autoComplete="postal-code" inputMode="numeric"
              hint={
                pin.status === "loading" ? "Finding your area…"
                : pin.status === "found" ? `Delivers to ${fields.city}, ${fields.state} in ${eta}.`
                : pin.status === "error" ? pin.message
                : "City and state fill in automatically."
              } />
            <Field label="House, building and street" name="address" value={fields.address} error={errors.address}
              onChange={update} autoComplete="address-line1" />
            <Field label="Landmark (optional)" name="landmark" value={fields.landmark} error={errors.landmark}
              onChange={update} autoComplete="address-line2" placeholder="Near St. Mary's Church" />
            <div className="grid grid-cols-2 gap-3">
              <Field label="City" name="city" value={fields.city} error={errors.city} onChange={update}
                autoComplete="address-level2" />
              <Field label="State" name="state" value={fields.state} error={errors.state} onChange={update}
                autoComplete="address-level1" list="indian-states" />
              <datalist id="indian-states">
                {STATES.map((s) => <option key={s} value={s} />)}
              </datalist>
            </div>
          </section>

          <section aria-labelledby="payment-heading">
            <h3 id="payment-heading" className="mb-3 font-semibold">Payment</h3>
            <div className="space-y-2.5">
              {store.upiId && (
                <PaymentOption checked={payment === "upi"} onSelect={() => setPayment("upi")}
                  icon={<Smartphone className="size-5" />} title="UPI"
                  detail="GPay, PhonePe, Paytm or any UPI app"
                  tag={`Save ${formatInr(store.upiDiscount)}`} />
              )}
              <PaymentOption checked={payment === "cod"} onSelect={() => setPayment("cod")}
                icon={<Banknote className="size-5" />} title="Cash on delivery"
                detail={`Pay ${formatInr(codTotal)} when it arrives`} />
            </div>
          </section>

          <section aria-label="Order summary" className="rounded-2xl bg-white px-4 py-4 text-sm">
            <dl className="space-y-2">
              <Row label={`${q.tier.title} at MRP`} value={formatInr(q.mrpTotal)} />
              {q.savings > 0 && <Row label="Pack discount" value={`−${formatInr(q.savings)}`} accent />}
              <Row label="Delivery" value={q.delivery ? formatInr(q.delivery) : "Free"} />
              {q.upiDiscount > 0 && <Row label="UPI discount" value={`−${formatInr(q.upiDiscount)}`} accent />}
            </dl>
            <div className="mt-3 flex justify-between border-t border-mist pt-3 text-base font-semibold">
              <span>Total</span>
              <span>{formatInr(q.total)}</span>
            </div>
          </section>
        </div>

        <div className="border-t border-mist bg-petal px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4">
          {formError && (
            <p role="alert" className="mb-3 rounded-xl bg-aero/10 px-3 py-2 text-sm font-medium text-aero-deep">
              {formError}
            </p>
          )}
          <button type="submit" disabled={submitting} className={`${primaryButton} w-full`}>
            {submitting ? (
              <><Loader2 aria-hidden className="size-5 animate-spin" /> Placing order…</>
            ) : payment === "upi" ? (
              `Place order and pay ${formatInr(q.total)}`
            ) : (
              `Place order, pay ${formatInr(q.total)} on delivery`
            )}
          </button>
          <p className="mt-2.5 flex items-center justify-center gap-1.5 text-xs text-ink-soft">
            <Lock aria-hidden className="size-3.5" />
            Your details are only used to deliver this order.{" "}
            <a href="/policies#terms" target="_blank" className="underline">Terms</a>
          </p>
        </div>
      </form>
    </dialog>
  );
}

function Field({
  label, name, value, error, onChange, hint, prefix, ...input
}: {
  label: string;
  name: keyof CheckoutFields;
  value: string;
  error?: string;
  onChange: (key: keyof CheckoutFields, value: string) => void;
  hint?: string;
  prefix?: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "name" | "value" | "onChange" | "prefix">) {
  const id = useId();
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">{label}</label>
      <div className={`flex items-center rounded-xl border-2 bg-white transition-colors focus-within:border-ink ${error ? "border-aero" : "border-mist"}`}>
        {prefix && <span className="pl-3.5 text-ink-soft">{prefix}</span>}
        <input
          id={id}
          name={name}
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          className="h-12 w-full min-w-0 rounded-xl bg-transparent px-3.5 text-base outline-none placeholder:text-ink-soft/50"
          {...input}
        />
      </div>
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-aero-deep">{error}</p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-sm text-ink-soft" aria-live="polite">{hint}</p>
      ) : null}
    </div>
  );
}

function PaymentOption({ checked, onSelect, icon, title, detail, tag }: {
  checked: boolean; onSelect: () => void; icon: React.ReactNode; title: string; detail: string; tag?: string;
}) {
  return (
    <label
      className={`flex w-full cursor-pointer items-center gap-3.5 rounded-2xl border-2 bg-white px-4 py-3.5 transition-colors has-focus-visible:outline-3 has-focus-visible:outline-rose ${checked ? "border-ink" : "border-mist hover:border-ink-soft/40"}`}
    >
      <input type="radio" name="payment" checked={checked} onChange={onSelect} className="sr-only" />
      <span className={`grid size-10 shrink-0 place-items-center rounded-full ${checked ? "bg-ink text-white" : "bg-blush text-ink"}`}>{icon}</span>
      <span className="flex-1">
        <span className="block font-semibold">{title}</span>
        <span className="block text-sm text-ink-soft">{detail}</span>
      </span>
      {tag && <span className="rounded-full bg-ok/10 px-2.5 py-1 text-xs font-semibold text-ok">{tag}</span>}
    </label>
  );
}

function Row({ label, value, muted, accent }: { label: string; value: string; muted?: boolean; accent?: boolean }) {
  return (
    <div className={`flex justify-between ${muted ? "text-ink-soft" : ""} ${accent ? "font-medium text-ok" : ""}`}>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
