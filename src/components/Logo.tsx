export function Logo({ className = "", tone = "dark" }: { className?: string; tone?: "dark" | "light" }) {
  return (
    <span className={`inline-flex flex-col leading-none ${className}`} aria-label="Aero pod Fragrance">
      <span aria-hidden className={`text-2xl font-semibold tracking-tight ${tone === "light" ? "text-white" : "text-ink"}`}>
        <span className="text-aero">A</span>ero pod
      </span>
      <span aria-hidden className={`mt-0.5 self-end text-[0.65rem] tracking-[0.2em] ${tone === "light" ? "text-white/70" : "text-ink-soft"}`}>
        Fragrance
      </span>
    </span>
  );
}
