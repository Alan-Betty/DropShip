import Image from "next/image";
import { tiers } from "@/config/store";
import { formatInr } from "@/lib/pricing";
import { BuyButton } from "./BuyButton";

const trio = tiers.find((t) => t.id === "trio")!;

export function FinalCta() {
  return (
    <section className="bg-night text-white">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:py-24">
        <div>
          <h2 className="text-title font-semibold">your next drive could smell a lot better.</h2>
          <p className="mt-4 max-w-md text-lg leading-relaxed text-white/75">
            3 pods for {formatInr(trio.price)} with free delivery. Pay when it reaches your door.
          </p>
          <BuyButton tierId={trio.id} className="mt-8 w-full sm:w-auto sm:px-10">
            Buy 3 pods for {formatInr(trio.price)}
          </BuyButton>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem]">
          <Image
            src="/images/pod-cup-holder.jpg"
            alt="Aero pod in a car cup holder under soft pink light"
            fill
            sizes="(min-width: 1024px) 540px, 100vw"
            className="object-cover object-[50%_55%]"
          />
        </div>
      </div>
    </section>
  );
}
