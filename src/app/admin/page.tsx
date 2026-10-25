import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";
import { Download, LogOut, MessageCircle, Phone } from "lucide-react";
import { getTier, store } from "@/config/store";
import { adminConfigured, isAdmin } from "@/lib/admin-auth";
import { listOrders, ORDER_STATUSES, type Order } from "@/lib/orders";
import { formatInr } from "@/lib/pricing";
import { Logo } from "@/components/Logo";
import { logout, saveOrder } from "./actions";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Orders",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <Logo />
      <Suspense fallback={<p className="mt-16 text-ink-soft">Loading…</p>}>
        <Admin />
      </Suspense>
    </div>
  );
}

async function Admin() {
  // Read ADMIN_PASSWORD per request, not once at build time.
  await connection();
  if (!adminConfigured()) {
    return (
      <p className="mt-16 max-w-lg leading-relaxed">
        The order dashboard is switched off. Set <code className="rounded bg-blush px-1.5">ADMIN_PASSWORD</code> in the
        server&apos;s environment variables and restart the site to turn it on.
      </p>
    );
  }
  if (!(await isAdmin())) return <LoginForm />;
  return <Dashboard orders={await listOrders()} />;
}

const istDate = new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" });

const PAYMENT_LABELS = { cod_pending: "COD, collect on delivery", awaiting_payment: "UPI, not yet received", paid: "Paid" };

function confirmMessage(o: Order): string {
  const pack = getTier(o.tierId)?.title ?? `${o.qty} pods`;
  const pay = o.payment === "cod" ? `${formatInr(o.total)} cash on delivery` : `${formatInr(o.total)} by UPI`;
  const text =
    `Hi ${o.customer.name.split(" ")[0]}, this is ${store.brand}. Confirming your order ${o.id}: ` +
    `${pack} of Aero pod Fragrance, ${pay}, delivering to ${o.customer.city} ${o.customer.pincode}. ` +
    `Reply YES to confirm and we'll ship it.`;
  return `https://wa.me/91${o.customer.phone}?text=${encodeURIComponent(text)}`;
}

function Dashboard({ orders }: { orders: Order[] }) {
  const live = orders.filter((o) => o.status !== "cancelled");
  const podsSold = live.reduce((s, o) => s + o.qty, 0);
  const revenue = live.reduce((s, o) => s + o.total, 0);
  const codShare = live.length ? Math.round((live.filter((o) => o.payment === "cod").length / live.length) * 100) : 0;
  const toConfirm = live.filter((o) => o.status === "placed").length;

  const stats = [
    { label: "Orders", value: live.length.toLocaleString("en-IN") },
    { label: "Pods sold", value: `${podsSold} of ${store.launchStock}` },
    { label: "Order value", value: formatInr(revenue) },
    { label: "Paying by COD", value: `${codShare}%` },
    { label: "Waiting to confirm", value: String(toConfirm) },
  ];

  return (
    <>
      <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-title font-semibold">orders</h1>
        <div className="flex gap-2">
          <a href="/admin/orders.csv" className="inline-flex h-11 items-center gap-2 rounded-full border-2 border-ink px-5 text-sm font-semibold">
            <Download aria-hidden className="size-4" /> Download CSV
          </a>
          <form action={logout}>
            <button className="inline-flex h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold text-ink-soft hover:text-ink">
              <LogOut aria-hidden className="size-4" /> Sign out
            </button>
          </form>
        </div>
      </div>

      <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-mist sm:grid-cols-5">
        {stats.map((s) => (
          <div key={s.label} className="bg-white px-4 py-4">
            <dt className="text-sm text-ink-soft">{s.label}</dt>
            <dd className="mt-1 text-xl font-semibold">{s.value}</dd>
          </div>
        ))}
      </dl>

      {orders.length === 0 ? (
        <p className="mt-12 text-ink-soft">No orders yet. They&apos;ll appear here the moment someone checks out.</p>
      ) : (
        <ul className="mt-8 space-y-4">
          {orders.map((o) => (
            <li key={o.id} className={`rounded-2xl bg-white p-5 ${o.status === "cancelled" ? "opacity-60" : ""}`}>
              <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
                <div>
                  <p className="font-semibold">
                    <a href={`/order/${o.id}`} target="_blank" className="underline-offset-2 hover:underline">{o.id}</a>
                    <span className="font-normal text-ink-soft"> · {istDate.format(new Date(o.createdAt))}</span>
                  </p>
                  <p className="mt-1">
                    {getTier(o.tierId)?.title ?? `${o.qty} pods`}, <strong>{formatInr(o.total)}</strong>{" "}
                    <span className="text-ink-soft">({PAYMENT_LABELS[o.paymentStatus]})</span>
                  </p>
                </div>
                <div className="flex gap-2">
                  <a href={confirmMessage(o)} target="_blank" rel="noopener noreferrer"
                    className="inline-flex h-10 items-center gap-1.5 rounded-full bg-ok px-4 text-sm font-semibold text-white">
                    <MessageCircle aria-hidden className="size-4" /> Confirm on WhatsApp
                  </a>
                  <a href={`tel:+91${o.customer.phone}`} aria-label={`Call ${o.customer.name}`}
                    className="grid size-10 place-items-center rounded-full border-2 border-mist">
                    <Phone aria-hidden className="size-4" />
                  </a>
                </div>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                <span className="font-medium text-ink">{o.customer.name}</span>, +91 {o.customer.phone}
                <br />
                {o.customer.address}
                {o.customer.landmark && `, ${o.customer.landmark}`}, {o.customer.city}, {o.customer.state}{" "}
                {o.customer.pincode}
              </p>
              <form action={saveOrder} className="mt-4 flex flex-wrap items-end gap-3 border-t border-mist pt-4 text-sm">
                <input type="hidden" name="id" value={o.id} />
                <label className="grid gap-1">
                  <span className="text-ink-soft">Status</span>
                  <select name="status" defaultValue={o.status} className="h-10 rounded-lg border-2 border-mist bg-white px-2 capitalize">
                    {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </label>
                <label className="grid gap-1">
                  <span className="text-ink-soft">Payment</span>
                  <select name="paymentStatus" defaultValue={o.paymentStatus} className="h-10 rounded-lg border-2 border-mist bg-white px-2">
                    {Object.entries(PAYMENT_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                  </select>
                </label>
                <label className="grid min-w-56 flex-1 gap-1">
                  <span className="text-ink-soft">Tracking (courier and AWB number)</span>
                  <input name="tracking" defaultValue={o.tracking} placeholder="Delhivery 1234567890"
                    className="h-10 rounded-lg border-2 border-mist px-3" />
                </label>
                <button className="h-10 rounded-full bg-ink px-5 font-semibold text-white">Save</button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
