import { cacheLife } from "next/cache";
import { isValidPincode } from "@/lib/validation";

type PostOffice = { Name: string; District: string; State: string };

// India Post's public PIN directory. A PIN's district never changes, so
// lookups are cached for as long as Next allows.
async function lookup(pin: string) {
  "use cache";
  cacheLife("max");
  const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`, {
    signal: AbortSignal.timeout(5000),
  });
  if (!res.ok) throw new Error(`PIN lookup returned ${res.status}`);
  const [result] = (await res.json()) as [{ Status: string; PostOffice: PostOffice[] | null }];
  const offices = result?.Status === "Success" ? (result.PostOffice ?? []) : [];
  if (!offices.length) return null;
  return {
    city: offices[0].District,
    state: offices[0].State,
    areas: offices.map((o) => o.Name).slice(0, 12),
  };
}

export async function GET(_request: Request, ctx: RouteContext<"/api/pincode/[pin]">) {
  const { pin } = await ctx.params;
  if (!isValidPincode(pin)) return Response.json({ error: "Enter a 6-digit PIN code." }, { status: 400 });
  try {
    const place = await lookup(pin);
    if (!place) return Response.json({ error: "We couldn't find that PIN code. Check the digits." }, { status: 404 });
    return Response.json(place);
  } catch {
    // The form still works without the lookup; the customer types city and state.
    return Response.json({ error: "PIN lookup is unavailable. Enter your city and state." }, { status: 503 });
  }
}
