import { Suspense } from "react";
import { store, tiers } from "@/config/store";
import { faqs, Faq } from "@/components/Faq";
import { CheckoutModal } from "@/components/CheckoutModal";
import { Comparison } from "@/components/Comparison";
import { Features } from "@/components/Features";
import { FinalCta } from "@/components/FinalCta";
import { Footer } from "@/components/Footer";
import { AnnouncementBar, Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { ProductShowcase } from "@/components/ProductShowcase";
import { Reviews } from "@/components/Reviews";
import { ShopProvider } from "@/components/ShopProvider";
import { StickyBuyBar } from "@/components/StickyBuyBar";
import { StockBar, StockMeter } from "@/components/StockMeter";
import { UseCases } from "@/components/UseCases";

// Lets Google show price and availability next to the search result.
const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Aero pod Fragrance",
    description: "Rose-scented dry tissues in a car cup holder pod.",
    brand: { "@type": "Brand", name: store.brand },
    image: [`${store.siteUrl}/images/pod-studio.jpg`, `${store.siteUrl}/images/pod-night-drive.jpg`],
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "INR",
      lowPrice: Math.min(...tiers.map((t) => t.price)),
      highPrice: Math.max(...tiers.map((t) => t.price)),
      offerCount: tiers.length,
      availability: "https://schema.org/InStock",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  },
];

export default function Home() {
  return (
    <ShopProvider>
      <AnnouncementBar />
      <Header />
      <main>
        <Hero />
        <Suspense fallback={<StockBar />}>
          <StockMeter />
        </Suspense>
        <Features />
        <UseCases />
        <ProductShowcase />
        <Comparison />
        <Reviews />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
      <StickyBuyBar />
      <CheckoutModal />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
      />
    </ShopProvider>
  );
}
