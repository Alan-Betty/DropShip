import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Check, CircleCheck, MessageCircle, Smartphone } from "lucide-react";
import { getTier, store, whatsappLink } from "@/config/store";
import { getOrder, type Order, type OrderStatus } from "@/lib/orders";
import { formatInr } from "@/lib/pricing";
import { upiLink, upiQrDataUrl } from "@/lib/upi";
import { Logo } from "@/components/Logo";
import { PurchaseTracker } from "@/components/PurchaseTracker";

export const metadata: Metadata = {
  title: "Your order",
  robots: { index: false },
};

export default function OrderPage({ params }: PageProps<"/order/[id]">) {
  return (
    <>
      <header className="border-b border-mist">
        <div className="mx-auto flex h-16 max-w-3xl items-center px-4 sm:px-6">
          <Link href="/">
            <Logo />
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 pb-20 pt-10 sm:px-6">
        <Suspense fallback={<p className="py-20 text-center text-ink-soft">Loading your order…</p>}>
          <OrderDetails params={params} />
        </Suspense>
      </main>
    </>
  );
}

const STEPS: { status: OrderStatus; label: string; detail: string }[] = [
  { status: "placed", label: "Order placed", detail: "We've received your order." },
  { status: "confirmed", label: "Confirmed", detail: "We've checked your details with you on WhatsApp." },
  { status: "shipped", label: "Shipped", detail: "On its way. Tracking details come on WhatsApp." },
  { status: "delivered", label: "Delivered", detail: "Enjoy the drive." },
];

const istDate = new Intl.DateTimeFormat("en-IN", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Kolkata",
});

async function OrderDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await getOrder(id);
  if (!order) notFound();

  const tier = getTier(order.tierId);
  const awaitingUpi = order.payment === "upi" && order.paymentStatus === "awaiting_payment";
  const support = whatsappLink(`Hi Aero pod, I have a question about my order ${order.id}.`);
  const maskedPhone = `+91 ${order.customer.phone.slice(0, 2)}••••${order.customer.phone.slice(-4)}`;

  return (
    <>
      <PurchaseTracker orderId={order.id} value={order.total} qty={order.qty} />

      <CircleCheck aria-hidden className="size-12 text-ok" strokeWidth={1.75} />
      <h1 className="mt-4 text-title font-semibold">
        {order.status === "cancelled"
          ? "This order was cancelled."
          : awaitingUpi
            ? "order placed. one step left."
            : `thank you, ${order.customer.name.split(" ")[0]}.`}
      </h1>
      <p className="mt-3 text-lg text-ink-soft">
        Order <strong className="font-semibold text-ink">{order.id}</strong>, placed{" "}
        {istDate.format(new Date(order.createdAt))}.
      </p>

      {awaitingUpi && <UpiPayment order={order} />}

      {order.payment === "cod" && order.status === "placed" && (
        <p className="mt-6 rounded-2xl bg-blush px-5 py-4 leading-relaxed">
          We&apos;ll message you on WhatsApp at {maskedPhone} to confirm before we ship. Please keep{" "}
          <strong>{formatInr(order.total)}</strong> ready for the courier.
        </p>
      )}

      {order.status !== "cancelled" && <Timeline order={order} />}

      <section aria-labelledby="summary-heading" className="mt-10 grid gap-6 rounded-[1.75rem] bg-white p-6 sm:grid-cols-[96px_1fr]">
        <div className="relative size-24 overflow-hidden rounded-2xl bg-petal">
          <Image src="/images/pod-studio.jpg" alt="" fill sizes="96px" className="object-contain p-1" />
        </div>
        <div>
          <h2 id="summary-heading" className="text-lg font-semibold">
            Aero pod Fragrance, {tier?.title ?? `${order.qty} pods`}
          </h2>
          <dl className="mt-3 space-y-1.5 text-sm">
            <SummaryRow label="Pack" value={formatInr(order.packPrice)} />
            <SummaryRow label="Delivery" value={order.delivery ? formatInr(order.delivery) : "Free"} />
            {order.upiDiscount > 0 && <SummaryRow label="UPI discount" value={`−${formatInr(order.upiDiscount)}`} />}
            <SummaryRow
              label={order.payment === "upi" ? "Total, by UPI" : "Total, cash on delivery"}
              value={formatInr(order.total)}
              strong
            />
          </dl>
          <h3 className="mt-5 text-sm font-semibold">Delivering to</h3>
          <p className="mt-1 text-sm leading-relaxed text-ink-soft">
            {order.customer.name}
            <br />
            {order.customer.address}
            {order.customer.landmark && `, ${order.customer.landmark}`}
            <br />
            {order.customer.city}, {order.customer.state} {order.customer.pincode}
          </p>
        </div>
      </section>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        {support && (
          <a
            href={support}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border-2 border-ink px-6 font-semibold transition-colors hover:bg-ink hover:text-white"
          >
            <MessageCircle aria-hidden className="size-5" />
            Ask about this order on WhatsApp
          </a>
        )}
        <Link href="/" className="inline-flex min-h-12 items-center justify-center px-6 font-semibold text-ink-soft hover:text-ink">
          Back to the shop
        </Link>
      </div>
    </>
  );
}

async function UpiPayment({ order }: { order: Order }) {
  const qr = await upiQrDataUrl(order.id, order.total);
  const sendProof = whatsappLink(`Hi Aero pod, I've paid ${formatInr(order.total)} by UPI for order ${order.id}. Screenshot attached.`);

  return (
    <section aria-labelledby="pay-heading" className="mt-8 rounded-[1.75rem] bg-night p-6 text-white sm:p-8">
      <h2 id="pay-heading" className="text-2xl font-semibold">
        Pay {formatInr(order.total)} by UPI to confirm
      </h2>
      <div className="mt-6 grid items-center gap-8 sm:grid-cols-[220px_1fr]">
        {/* eslint-disable-next-line @next/next/no-img-element -- generated data URL, nothing to optimise */}
        <img src={qr} alt={`UPI QR code to pay ${formatInr(order.total)} to ${store.upiId}`} className="w-full max-w-[220px] rounded-2xl bg-white p-3" />
        <div>
          <a
            href={upiLink(order.id, order.total)}
            className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-aero px-7 font-semibold text-white hover:bg-aero-deep sm:w-auto"
          >
            <Smartphone aria-hidden className="size-5" />
            Open UPI app to pay
          </a>
          <p className="mt-4 text-sm leading-relaxed text-white/75">
            On a phone, tap the button. On a computer, scan the code with any UPI app. Paying to{" "}
            <span className="font-semibold text-white">{store.upiId}</span>.
          </p>
          {sendProof && (
            <p className="mt-3 text-sm text-white/75">
              Paid?{" "}
              <a href={sendProof} target="_blank" rel="noopener noreferrer" className="font-semibold text-white underline">
                Send the screenshot on WhatsApp
              </a>{" "}
              and we&apos;ll confirm your order.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

function Timeline({ order }: { order: Order }) {
  const current = STEPS.findIndex((s) => s.status === order.status);
  return (
    <ol className="mt-10 space-y-0" aria-label="Order progress">
      {STEPS.map((step, i) => {
        const done = i <= current;
        return (
          <li key={step.status} className="relative grid grid-cols-[2rem_1fr] gap-x-4 pb-7 last:pb-0">
            {i < STEPS.length - 1 && (
              <span aria-hidden className={`absolute left-[15px] top-8 h-[calc(100%-2rem)] w-0.5 ${i < current ? "bg-ink" : "bg-mist"}`} />
            )}
            <span
              className={`grid size-8 place-items-center rounded-full border-2 ${done ? "border-ink bg-ink text-white" : "border-mist bg-petal"}`}
            >
              {done && <Check aria-hidden className="size-4" strokeWidth={3} />}
            </span>
            <div className="pt-1">
              <p className={`font-semibold ${done ? "" : "text-ink-soft"}`}>
                {step.label}
                {i === current && <span className="sr-only"> (current step)</span>}
              </p>
              <p className="text-sm text-ink-soft">
                {step.status === "shipped" && order.tracking && done ? `Tracking: ${order.tracking}` : step.detail}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function SummaryRow({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className={`flex justify-between ${strong ? "border-t border-mist pt-2 text-base font-semibold" : "text-ink-soft"}`}>
      <dt>{label}</dt>
      <dd className={strong ? "" : "text-ink"}>{value}</dd>
    </div>
  );
}
