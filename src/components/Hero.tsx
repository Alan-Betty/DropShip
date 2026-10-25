import Image from "next/image";
import { Banknote, MapPin, ShieldCheck, Truck } from "lucide-react";
import { store, tiers } from "@/config/store";
import { formatInr } from "@/lib/pricing";
import { BuyButton } from "./BuyButton";

const trio = tiers.find((t) => t.id === "trio")!;

const promises = [
  { icon: Banknote, text: "Cash on delivery" },
  { icon: Truck, text: "Free delivery on 3+ pods" },
  { icon: ShieldCheck, text: "Free replacement if damaged" },
  { icon: MapPin, text: `Shipped from ${store.shipsFrom}` },
];

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-night text-white">
      <div className="mx-auto grid max-w-6xl lg:grid-cols-12 lg:gap-10 lg:px-6 lg:py-16">
        <div className="relative h-[58vh] min-h-[380px] lg:order-2 lg:col-span-6 lg:h-[640px] lg:overflow-hidden lg:rounded-[2rem]">
          <Image
            src="/images/pod-night-drive.jpg"
            alt="The Aero pod tissue pod, black with pink roses, on a leather car armrest at night"
            fill
            priority
            sizes="(min-width: 1024px) 560px, 100vw"
            className="object-cover object-[50%_30%]"
          />
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-night to-transparent lg:hidden" />
          {/* Runs bottom-to-top like the wordmark on the can. Decorative, the logo is in the header. */}
          <p
            aria-hidden
            className="wordmark-rise absolute bottom-6 left-3 font-semibold leading-none tracking-tight text-white/95 [writing-mode:vertical-rl] rotate-180 text-[5.5rem] sm:text-[7rem] lg:bottom-8 lg:left-5 lg:text-[9.5rem]"
          >
            <span className="text-aero">A</span>ero pod
          </p>
        </div>

        <div className="relative px-4 pb-12 pt-2 sm:px-6 lg:order-1 lg:col-span-6 lg:flex lg:flex-col lg:justify-center lg:px-0 lg:py-0">
          <h1 className="text-display font-semibold">{store.tagline}</h1>
          <p className="mt-5 max-w-[34rem] text-lg leading-relaxed text-white/80">
            A rose-scented tissue pod made for your car&apos;s cup holder. Soft tissues within reach, and a cabin that
            smells good every time you pull one.
          </p>

          <p className="mt-7 text-white/90">
            <span className="text-2xl font-semibold text-white">{formatInr(trio.price)}</span> for 3 pods, delivered free.{" "}
            <span className="text-white/60">Single pod {formatInr(store.mrp)}.</span>
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <BuyButton tierId={trio.id} className="sm:px-9">
              Buy 3 pods for {formatInr(trio.price)}
            </BuyButton>
            <a
              href="#shop"
              className="inline-flex min-h-14 items-center justify-center rounded-full border border-white/25 px-7 font-semibold text-white transition-colors hover:bg-white/10"
            >
              See all packs
            </a>
          </div>

          <ul className="mt-9 grid grid-cols-2 gap-x-4 gap-y-3 text-sm text-white/80">
            {promises.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-2.5">
                <Icon aria-hidden className="size-[18px] shrink-0 text-rose-light" strokeWidth={1.75} />
                {text}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
