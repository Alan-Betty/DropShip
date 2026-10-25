# Aero pod Fragrance store

One-product store for the Aero pod scented car tissue pod: landing page, bundle pricing, cash on delivery and UPI checkout, order tracking page and an order dashboard.

Built with Next.js 16, React 19, Tailwind CSS 4 and lucide icons. Orders are saved to a JSON file, so there's no database to set up.

## Run it locally

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run build && npm start   # http://localhost:3000
```

`npm run dev` works too, for editing.

## Before you go live

Fill these in `.env.local` (or your host's environment settings), then **rebuild**. Values starting with `NEXT_PUBLIC_` are baked in at build time.

| Setting | What it does |
| --- | --- |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Support links, order questions, review collection. Without it, WhatsApp buttons are hidden. |
| `NEXT_PUBLIC_UPI_ID` | Turns on UPI payment with a ₹20 discount. Without it, checkout is cash on delivery only. Use a business UPI ID. |
| `ADMIN_PASSWORD` | Turns on the order dashboard at `/admin`. |
| `NEXT_PUBLIC_SITE_URL` | Your domain, for Google and WhatsApp/Instagram link previews. |
| `NEXT_PUBLIC_META_PIXEL_ID`, `NEXT_PUBLIC_GA_ID` | Ad tracking. Add them when you start running ads. |
| `ORDER_WEBHOOK_URL` | Optional copy of every order to a Google Sheet or Zapier. |

Prices, delivery fee, delivery times, stock size and policies are all in [`src/config/store.ts`](src/config/store.ts). Change them there and every page, the checkout and the server-side total follow.

## Hosting

Orders are written to `./data/orders.json` (or `ORDERS_DIR`). **The host must have a persistent disk.**

- Works: any VPS (DigitalOcean, Hostinger, AWS Lightsail in the Mumbai region), Render with a disk, Railway with a volume. Run `npm run build && npm start` behind a domain with HTTPS.
- Don't use as-is: Vercel or Netlify. Their file system is wiped between requests, so orders would be lost. Use them only after moving orders to a database.

Back up `data/orders.json` regularly. It holds customer names, phone numbers and addresses, which is why it's kept out of git.

## Daily operations

1. Open `/admin` and sign in.
2. For each new order, tap **Confirm on WhatsApp**. It opens a chat with a pre-written confirmation. Set the status to *Confirmed* once they reply.
3. For UPI orders, check your UPI app for the payment (the note shows the order ID), then set Payment to *Paid*.
4. Book the courier, paste the AWB number into Tracking, and set the status to *Shipped*. The customer's order page updates.
5. **Download CSV** exports all orders for bulk courier booking or accounts.

## Adding reviews

Add real buyer reviews to [`src/data/reviews.ts`](src/data/reviews.ts) and rebuild. Only add reviews from actual customers, with their permission.

## Tests

```bash
npm test     # pricing and validation
npm run lint
```
