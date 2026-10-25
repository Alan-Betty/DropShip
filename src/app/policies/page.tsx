import type { Metadata } from "next";
import Link from "next/link";
import { store, whatsappLink } from "@/config/store";
import { formatInr } from "@/lib/pricing";
import { Logo } from "@/components/Logo";

export const metadata: Metadata = {
  title: "Shipping, returns and privacy",
  description: "How Aero pod ships, replaces damaged pods, handles returns and uses your details.",
};

export default function PoliciesPage() {
  const chat = whatsappLink("Hi Aero pod, I have a question about my order.");
  const contact = [chat && "WhatsApp", store.contact.email].filter(Boolean).join(" or ") || "the contact details on our site";

  return (
    <>
      <header className="border-b border-mist">
        <div className="mx-auto flex h-16 max-w-3xl items-center px-4 sm:px-6">
          <Link href="/"><Logo /></Link>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 pb-24 pt-12 sm:px-6 [&_h2]:mt-14 [&_h2]:text-2xl [&_h2]:font-semibold [&_p]:mt-4 [&_p]:leading-relaxed [&_p]:text-ink-soft [&_li]:leading-relaxed [&_li]:text-ink-soft [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
        <h1 className="text-title font-semibold">shipping, returns and privacy.</h1>
        <p>
          These policies apply to every order placed on this site. Questions? Reach us on {contact}.
        </p>

        <h2 id="shipping">Shipping</h2>
        <ul>
          <li>We ship across India from {store.shipsFrom}.</li>
          <li>
            Delivery takes {store.delivery.homeStateDays} within {store.delivery.homeState} and{" "}
            {store.delivery.restOfIndiaDays} to the rest of India, counted from when we confirm your order.
          </li>
          <li>
            Packs of 3 or more pods ship free. A single pod has a {formatInr(store.deliveryFee)} delivery charge,
            shown in checkout before you place the order.
          </li>
          <li>We confirm every order on WhatsApp before dispatch and send tracking details once it ships.</li>
        </ul>

        <h2 id="returns">Returns and replacements</h2>
        <ul>
          <li>
            If a pod arrives damaged or wrong, send us a photo within {store.damageClaimHours} hours of delivery. We
            replace it free, and you don&apos;t need to send the damaged pod back.
          </li>
          <li>
            Unopened pods can be returned within {store.returnWindowDays} days of delivery. Once we receive them, we
            refund the pod price by UPI or bank transfer within 5 working days.
          </li>
          <li>For hygiene reasons, pods that have been opened can&apos;t be returned unless they arrived damaged.</li>
          <li>You can cancel any order free of charge until it has shipped.</li>
        </ul>

        <h2 id="privacy">Privacy</h2>
        <p>
          We collect your name, mobile number and delivery address only to deliver your order and to update you
          about it on WhatsApp. We share them with our courier partner for delivery and with no one else. We
          don&apos;t sell your details or add you to marketing lists without asking. To have your details deleted,
          message us with your order ID.
        </p>
        <p>
          If advertising analytics are switched on, this site uses Meta and Google cookies to measure which ads lead
          to purchases. They don&apos;t receive your name, phone number or address.
        </p>

        <h2 id="terms">Terms of sale</h2>
        <ul>
          <li>
            All prices are in Indian rupees and include taxes. The MRP is {formatInr(store.mrp)} per pod; pack prices
            are never above MRP.
          </li>
          <li>
            Cash on delivery orders are paid to the courier. UPI orders are confirmed once we receive the payment.
          </li>
          <li>
            Repeatedly refusing cash on delivery parcels may mean we ask for UPI payment on future orders.
          </li>
          <li>The launch batch is limited to {store.launchStock.toLocaleString("en-IN")} pods and orders are fulfilled in the order they&apos;re placed.</li>
        </ul>
      </main>
    </>
  );
}
