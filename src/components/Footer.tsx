import Link from "next/link";
import { store, whatsappLink } from "@/config/store";
import { Logo } from "./Logo";

export function Footer() {
  const chat = whatsappLink("Hi Aero pod, I have a question about the tissue pod.");
  return (
    <footer className="border-t border-mist bg-petal pb-28 pt-14 lg:pb-14">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 md:grid-cols-3">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-soft">
            Scented tissue pods for the car, packed and shipped from {store.shipsFrom}.
          </p>
        </div>
        <div>
          <h2 className="font-semibold">Help</h2>
          <ul className="mt-3 space-y-2 text-sm text-ink-soft">
            {chat && (
              <li>
                <a href={chat} target="_blank" rel="noopener noreferrer" className="hover:text-ink">
                  Chat on WhatsApp
                </a>
              </li>
            )}
            {store.contact.email && (
              <li>
                <a href={`mailto:${store.contact.email}`} className="hover:text-ink">
                  {store.contact.email}
                </a>
              </li>
            )}
            <li>
              <a href="#faq" className="hover:text-ink">
                FAQ
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h2 className="font-semibold">Policies</h2>
          <ul className="mt-3 space-y-2 text-sm text-ink-soft">
            <li><Link href="/policies#shipping" className="hover:text-ink">Shipping</Link></li>
            <li><Link href="/policies#returns" className="hover:text-ink">Returns and replacements</Link></li>
            <li><Link href="/policies#privacy" className="hover:text-ink">Privacy</Link></li>
            <li><Link href="/policies#terms" className="hover:text-ink">Terms of sale</Link></li>
          </ul>
        </div>
      </div>
      <p className="mx-auto mt-12 max-w-6xl px-4 text-xs text-ink-soft sm:px-6">
        © 2026 {store.brand}. MRP ₹{store.mrp} per pod, inclusive of all taxes.
      </p>
    </footer>
  );
}
