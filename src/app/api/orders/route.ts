import { after } from "next/server";
import { getTier, store } from "@/config/store";
import { createOrder, notifyWebhook, OutOfStockError } from "@/lib/orders";
import { validateCheckout } from "@/lib/validation";

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "The order could not be read. Refresh the page and try again." }, { status: 400 });
  }

  const tier = typeof body.tierId === "string" ? getTier(body.tierId) : undefined;
  if (!tier) return Response.json({ error: "Choose a pack before placing the order." }, { status: 400 });

  const payment = body.payment === "upi" && store.upiId ? "upi" : body.payment === "cod" ? "cod" : null;
  if (!payment) return Response.json({ error: "Choose how you'd like to pay." }, { status: 400 });

  const checked = validateCheckout((body.customer ?? {}) as Record<string, unknown>);
  if (!checked.ok) {
    return Response.json({ error: "Some details need fixing.", fields: checked.errors }, { status: 422 });
  }

  try {
    const order = await createOrder({ tierId: tier.id, payment, customer: checked.data });
    after(() => notifyWebhook(order));
    return Response.json({ id: order.id, total: order.total }, { status: 201 });
  } catch (err) {
    if (err instanceof OutOfStockError) return Response.json({ error: err.message }, { status: 409 });
    console.error("Order failed:", err);
    return Response.json({ error: "We couldn't save your order. Please try again in a minute." }, { status: 500 });
  }
}
