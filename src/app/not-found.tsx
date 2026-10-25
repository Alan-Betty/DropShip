import Link from "next/link";
import { Logo } from "@/components/Logo";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col items-start justify-center px-6">
      <Logo />
      <h1 className="mt-10 text-title font-semibold">we couldn&apos;t find that page.</h1>
      <p className="mt-3 leading-relaxed text-ink-soft">
        If you were looking for an order, check the order ID in your confirmation message. It starts with AP.
      </p>
      <Link href="/" className="mt-8 inline-flex min-h-12 items-center rounded-full bg-ink px-6 font-semibold text-white">
        Go to the shop
      </Link>
    </main>
  );
}
