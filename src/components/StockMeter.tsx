import { connection } from "next/server";
import { store } from "@/config/store";
import { stockLeft } from "@/lib/orders";

// Real stock, counted from saved orders. Never inflate or fake this number:
// false scarcity is a banned dark pattern under India's CCPA guidelines.
export async function StockMeter() {
  await connection();
  const left = await stockLeft();
  const pctLeft = (left / store.launchStock) * 100;

  return (
    <StockBar>
      {left > 0 ? (
        <>
          <span className="font-semibold text-ink">{left.toLocaleString("en-IN")}</span> of{" "}
          {store.launchStock.toLocaleString("en-IN")} pods left in the launch batch
        </>
      ) : (
        <span className="font-semibold text-ink">The launch batch is sold out. The next batch is on its way.</span>
      )}
      <span className="mt-2 block h-1.5 overflow-hidden rounded-full bg-mist" aria-hidden>
        <span className="block h-full rounded-full bg-rose" style={{ width: `${pctLeft}%` }} />
      </span>
    </StockBar>
  );
}

export function StockBar({ children }: { children?: React.ReactNode }) {
  return (
    <div className="border-b border-mist bg-blush/60">
      <p className="mx-auto min-h-[3.75rem] max-w-6xl px-4 py-3 text-sm text-ink-soft sm:px-6">{children}</p>
    </div>
  );
}
