import { Plus } from "lucide-react";
import { store } from "@/config/store";
import { formatInr } from "@/lib/pricing";

export const faqs = [
  {
    q: "Is cash on delivery available?",
    a: `Yes, everywhere we deliver in India. You pay the courier when the parcel arrives.${
      store.upiId ? ` If you pay by UPI when ordering, you save ${formatInr(store.upiDiscount)}.` : ""
    }`,
  },
  {
    q: "How long does delivery take?",
    a: `${store.delivery.homeStateDays} within ${store.delivery.homeState}, and ${store.delivery.restOfIndiaDays} to the rest of India. We send you the tracking details on WhatsApp once it ships.`,
  },
  {
    q: "Are these wet wipes?",
    a: "No. They're soft, dry tissues with a rose fragrance, so nothing dries out or leaks. Use them for hands, faces, sunglasses, a fogged mirror or a spill on the console.",
  },
  {
    q: "Will it fit my car's cup holder?",
    a: "The pod is a slim cylinder made to sit in a standard car cup holder. If your car's holder is unusually small, it stands just as well in the door pocket, the centre tray or on your desk.",
  },
  {
    q: "What does it smell like?",
    a: "A soft rose floral. You notice it when you pull a tissue, without the car smelling like a strong air freshener.",
  },
  {
    q: "What if my pod arrives damaged?",
    a: `Send a photo on WhatsApp within ${store.damageClaimHours} hours of delivery and we'll ship a replacement free. No need to send the damaged one back.`,
  },
  {
    q: "Why is 3 pods the recommended pack?",
    a: "Most people keep one in the car, one at home and one on the office desk. Three pods also ship free, which brings each pod to about ₹100 instead of ₹130 plus delivery.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="bg-white py-20 lg:py-28">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-12">
        <h2 className="text-title font-semibold lg:col-span-4">questions, answered.</h2>
        <div className="divide-y divide-mist border-y border-mist lg:col-span-8">
          {faqs.map(({ q, a }) => (
            <details key={q} className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-lg font-semibold [&::-webkit-details-marker]:hidden">
                {q}
                <Plus aria-hidden className="size-5 shrink-0 text-ink-soft transition-transform group-open:rotate-45" />
              </summary>
              <p className="max-w-2xl pb-6 leading-relaxed text-ink-soft">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
