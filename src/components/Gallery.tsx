"use client";

import Image from "next/image";
import { useState } from "react";

const photos = [
  { src: "/images/pod-night-drive.jpg", alt: "Aero pod on a car armrest at night", position: "50% 30%" },
  { src: "/images/pod-cup-holder.jpg", alt: "Aero pod in a car cup holder", position: "50% 60%" },
  { src: "/images/pod-studio.jpg", alt: "Aero pod on a white background", position: "50% 50%", contain: true },
  { src: "/images/pod-poster.jpg", alt: "Aero pod with rose petals: long-lasting fragrance, soft hygienic tissues", position: "50% 50%", contain: true },
];

export function Gallery() {
  const [active, setActive] = useState(0);
  const photo = photos[active];

  return (
    <div className="lg:sticky lg:top-24">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-white">
        <Image
          key={photo.src}
          src={photo.src}
          alt={photo.alt}
          fill
          sizes="(min-width: 1024px) 520px, 100vw"
          className={photo.contain ? "object-contain p-6" : "object-cover"}
          style={{ objectPosition: photo.position }}
        />
      </div>
      <div className="mt-3 grid grid-cols-4 gap-3" role="group" aria-label="Product photos">
        {photos.map((p, i) => (
          <button
            key={p.src}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`Show photo ${i + 1}: ${p.alt}`}
            aria-pressed={i === active}
            className={`relative aspect-square overflow-hidden rounded-2xl bg-white ring-2 transition ${
              i === active ? "ring-ink" : "ring-transparent opacity-75 hover:opacity-100"
            }`}
          >
            <Image src={p.src} alt="" fill sizes="120px" className={p.contain ? "object-contain p-1" : "object-cover"} />
          </button>
        ))}
      </div>
    </div>
  );
}
