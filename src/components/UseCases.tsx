import Image from "next/image";
import { Briefcase, CarFront, CloudRain, Gift, Mountain, UtensilsCrossed } from "lucide-react";

const uses = [
  {
    icon: CarFront,
    title: "Vyttila signal, 4:30 pm",
    body: "Wipe the sweat off before the meeting, not on your sleeve.",
  },
  {
    icon: UtensilsCrossed,
    title: "After the thattukada stop",
    body: "Porotta and beef fry, then clean fingers before you touch the steering wheel.",
  },
  {
    icon: CloudRain,
    title: "Monsoon mornings",
    body: "Clear a fogged mirror or a rain-wet phone screen in one pull.",
  },
  {
    icon: Mountain,
    title: "Ghat roads to Munnar",
    body: "The pod stays put in the cup holder through every hairpin bend.",
  },
  {
    icon: Briefcase,
    title: "Your office desk",
    body: "A tidy pod that smells of roses, instead of a crushed tissue box.",
  },
  {
    icon: Gift,
    title: "A new car in the family",
    body: "A useful first gift for the new car, and it costs less than the first car wash.",
  },
];

export function UseCases() {
  return (
    <section id="uses" className="bg-white py-20 lg:py-28">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <h2 className="text-title font-semibold">where it earns its place.</h2>
          <p className="mt-4 max-w-sm leading-relaxed text-ink-soft">
            Built for the car, useful anywhere you&apos;d otherwise reach for a crumpled napkin.
          </p>
          <div className="relative mt-8 hidden aspect-[4/5] overflow-hidden rounded-[2rem] lg:block">
            <Image
              src="/images/pod-cup-holder.jpg"
              alt="Aero pod sitting in the cup holder of a car's centre console"
              fill
              sizes="360px"
              className="object-cover"
            />
          </div>
        </div>
        <ul className="grid gap-x-10 sm:grid-cols-2 lg:col-span-8 lg:self-center">
          {uses.map(({ icon: Icon, title, body }) => (
            <li key={title} className="border-t border-mist py-7">
              <Icon aria-hidden className="size-6 text-rose" strokeWidth={1.6} />
              <h3 className="mt-4 text-xl font-semibold tracking-tight">{title}</h3>
              <p className="mt-1.5 leading-relaxed text-ink-soft">{body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
