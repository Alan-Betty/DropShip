import { formatInr } from "@/lib/pricing";
import { store, tiers } from "@/config/store";
import { BuyButton } from "./BuyButton";
import { Logo } from "./Logo";

const trio = tiers.find((t) => t.id === "trio")!;

export function AnnouncementBar() {
  return (
    <p className="bg-night px-4 py-2 text-center text-[0.8rem] text-white/85 sm:text-sm">
      Free delivery on 3 pods or more. Cash on delivery across India.
      {store.upiId && <span className="hidden sm:inline"> Pay by UPI and save {formatInr(store.upiDiscount)}.</span>}
    </p>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-mist/70 bg-petal/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a href="#top" className="rounded-md">
          <Logo />
        </a>
        <nav aria-label="Main" className="hidden items-center gap-8 text-sm font-medium text-ink-soft md:flex">
          <a href="#shop" className="hover:text-ink">Shop</a>
          <a href="#uses" className="hover:text-ink">Where to use it</a>
          <a href="#faq" className="hover:text-ink">FAQ</a>
        </nav>
        <BuyButton tierId={trio.id} className="min-h-10! px-5! text-sm!">
          Buy 3 for {formatInr(trio.price)}
        </BuyButton>
      </div>
    </header>
  );
}
