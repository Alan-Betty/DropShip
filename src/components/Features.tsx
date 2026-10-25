import Image from "next/image";
import { CupSoda, Flower2, Gem, Sparkles } from "lucide-react";

const features = [
  {
    icon: Flower2,
    title: "Rose fragrance in every tissue",
    body: "Each pull lifts a light floral scent into the cabin. No hanging freshener, no gel tin melting on the dashboard.",
  },
  {
    icon: CupSoda,
    title: "Made for the cup holder",
    body: "The round pod drops into a cup holder and stays there, instead of sliding off the seat at the first speed breaker.",
  },
  {
    icon: Sparkles,
    title: "Soft, hygienic tissues",
    body: "Tissues stay inside the pod, away from dust, spilled tea and wet umbrellas, until you pull one out.",
  },
  {
    icon: Gem,
    title: "Looks like it belongs",
    body: "Matte black with dark roses. It suits a new car's interior far better than a cardboard box with a cartoon on it.",
  },
];

export function Features() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="relative aspect-square overflow-hidden rounded-[2rem] bg-white">
          <Image
            src="/images/pod-studio.jpg"
            alt="Aero pod Fragrance tissue pod with a white tissue rising out of the top"
            fill
            sizes="(min-width: 1024px) 540px, 100vw"
            className="object-contain p-6"
          />
        </div>
        <div>
          <h2 className="text-title max-w-md font-semibold">a tissue box, rethought for the car.</h2>
          <dl className="mt-10 space-y-8">
            {features.map(({ icon: Icon, title, body }) => (
              <div key={title} className="grid grid-cols-[2.75rem_1fr] gap-x-4">
                <dt className="contents">
                  <span className="grid size-11 place-items-center rounded-full bg-blush text-rose">
                    <Icon aria-hidden className="size-5" strokeWidth={1.75} />
                  </span>
                  <span className="self-center text-lg font-semibold">{title}</span>
                </dt>
                <dd className="col-start-2 mt-1 max-w-[30rem] leading-relaxed text-ink-soft">{body}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
