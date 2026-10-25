import { isAdmin } from "@/lib/admin-auth";
import { listOrders } from "@/lib/orders";

// One row per order with everything a courier booking needs, for bulk upload
// to a shipping panel or a spreadsheet.
const COLUMNS = [
  "Order ID", "Order date", "Status", "Payment", "Payment status", "Pods", "Order total",
  "Name", "Phone", "Address", "Landmark", "City", "State", "PIN", "Tracking",
] as const;

function cell(value: string | number): string {
  const s = String(value);
  // Quote everything and neutralise leading = + - @ so Excel can't run it as a formula.
  return `"${(/^[=+\-@]/.test(s) ? `'${s}` : s).replace(/"/g, '""')}"`;
}

export async function GET() {
  if (!(await isAdmin())) return new Response("Sign in at /admin first.", { status: 401 });
  const orders = await listOrders();
  const rows = orders.map((o) =>
    [
      o.id, o.createdAt, o.status, o.payment.toUpperCase(), o.paymentStatus, o.qty, o.total,
      o.customer.name, o.customer.phone, o.customer.address, o.customer.landmark, o.customer.city,
      o.customer.state, o.customer.pincode, o.tracking,
    ].map(cell).join(","),
  );
  const csv = [COLUMNS.map(cell).join(","), ...rows].join("\r\n");
  return new Response(`﻿${csv}`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="aeropod-orders.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
