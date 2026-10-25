import { MessageCircle, Star } from "lucide-react";
import { whatsappLink } from "@/config/store";
import { reviews } from "@/data/reviews";

export function Reviews() {
  const shareLink = whatsappLink("Hi Aero pod, here's my review and a photo of the pod in my car:");

  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
      <h2 className="text-title font-semibold">from people who drive with one.</h2>

      {reviews.length > 0 ? (
        <ul className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((r) => (
            <li key={`${r.name}-${r.text.slice(0, 20)}`} className="border-t border-mist pt-6">
              <p className="flex gap-0.5 text-rose" aria-label={`${r.rating} out of 5 stars`}>
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} aria-hidden className="size-4" fill={i < r.rating ? "currentColor" : "none"} />
                ))}
              </p>
              <blockquote className="mt-4 text-lg leading-relaxed">&ldquo;{r.text}&rdquo;</blockquote>
              <p className="mt-4 font-semibold">
                {r.name}, <span className="font-normal text-ink-soft">{r.place}</span>
              </p>
              <p className="text-sm text-ink-soft">{r.purchase}</p>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-8 grid gap-8 rounded-[2rem] bg-white p-8 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-xl font-semibold">The launch batch is just going out.</p>
            <p className="mt-3 max-w-xl leading-relaxed text-ink-soft">
              We only show reviews from people who&apos;ve actually bought a pod, so this space fills up as the first
              orders arrive. Already have yours? Send us a photo of it in your car and a line about how you use it.
            </p>
          </div>
          {shareLink && (
            <a
              href={shareLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border-2 border-ink px-6 font-semibold transition-colors hover:bg-ink hover:text-white"
            >
              <MessageCircle aria-hidden className="size-5" />
              Send your review on WhatsApp
            </a>
          )}
        </div>
      )}
    </section>
  );
}
