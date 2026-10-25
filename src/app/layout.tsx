import type { Metadata, Viewport } from "next";
import { Urbanist } from "next/font/google";
import { Analytics } from "@/components/Analytics";
import { store } from "@/config/store";
import "./globals.css";

const urbanist = Urbanist({
  variable: "--font-urbanist",
  subsets: ["latin"],
  display: "swap",
});

const description =
  "A rose-scented tissue pod that sits in your car's cup holder. ₹130 MRP, 3 pods for ₹299 with free delivery. Cash on delivery across India, shipped from Kerala.";

export const metadata: Metadata = {
  metadataBase: new URL(store.siteUrl),
  title: {
    default: "Aero pod Fragrance | Scented car tissue pod",
    template: "%s | Aero pod Fragrance",
  },
  description,
  keywords: [
    "car tissue holder",
    "scented tissue",
    "car cup holder tissue",
    "car accessories Kerala",
    "car freshener tissue",
    "Aero pod",
  ],
  openGraph: {
    title: "Aero pod Fragrance: freshness that rides with you",
    description,
    type: "website",
    locale: "en_IN",
    images: [{ url: "/images/pod-night-drive.jpg", width: 1179, height: 1575, alt: "Aero pod tissue pod on a car armrest at night" }],
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#0e1713",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-IN" className={`${urbanist.variable} antialiased`}>
      <body className="min-h-dvh font-sans">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
