import { Check, Minus } from "lucide-react";

type Mark = boolean | "partly";

const rows: { label: string; pod: Mark; box: Mark; napkins: Mark }[] = [
  { label: "Sits in a cup holder", pod: true, box: false, napkins: false },
  { label: "Scents the car while you use it", pod: true, box: false, napkins: false },
  { label: "Tissues kept covered from dust", pod: true, box: "partly", napkins: false },
  { label: "Looks good in a new car", pod: true, box: false, napkins: false },
];

function Cell({ mark }: { mark: Mark }) {
  if (mark === true)
    return (
      <span className="inline-grid size-7 place-items-center rounded-full bg-ink text-white">
        <Check aria-label="Yes" className="size-4" strokeWidth={2.5} />
      </span>
    );
  if (mark === "partly") return <span className="text-sm text-ink-soft">Partly</span>;
  return <Minus aria-label="No" className="mx-auto size-5 text-ink-soft/50" />;
}

export function Comparison() {
  return (
    <section className="bg-blush/50 py-20 lg:py-28">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <h2 className="text-title font-semibold">why not just a tissue box?</h2>
        <p className="mt-4 max-w-xl leading-relaxed text-ink-soft">
          A box slides off the seat on the first turn, and napkins from the hotel end up in the door pocket. The pod
          fixes both.
        </p>
        <div className="mt-10 overflow-x-auto rounded-3xl bg-white">
          <table className="w-full min-w-[30rem] text-left">
            <thead>
              <tr className="border-b border-mist text-sm">
                <th scope="col" className="w-1/2 px-5 py-4 font-medium text-ink-soft">
                  <span className="sr-only">Feature</span>
                </th>
                <th scope="col" className="px-3 py-4 text-center font-semibold">
                  <span className="text-aero">A</span>ero pod
                </th>
                <th scope="col" className="px-3 py-4 text-center font-medium text-ink-soft">Tissue box</th>
                <th scope="col" className="px-3 py-4 text-center font-medium text-ink-soft">Paper napkins</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.label} className="border-b border-mist last:border-0">
                  <th scope="row" className="px-5 py-4 font-medium">
                    {r.label}
                  </th>
                  <td className="px-3 py-4 text-center">
                    <Cell mark={r.pod} />
                  </td>
                  <td className="px-3 py-4 text-center">
                    <Cell mark={r.box} />
                  </td>
                  <td className="px-3 py-4 text-center">
                    <Cell mark={r.napkins} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
