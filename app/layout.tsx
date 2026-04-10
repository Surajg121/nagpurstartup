import type { Metadata } from "next";
import { Roboto, Oswald } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://nagpurstartup.in";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Nagpur Startup Hub — Insights, Stories & Opportunities",
    template: "%s | Nagpur Startup Hub",
  },
  description:
    "Your go-to platform for Nagpur startup news, founder stories, market insights, and job opportunities. Stay ahead of the growing central India startup ecosystem.",
  keywords: [
    "Nagpur startups",
    "Nagpur startup ecosystem",
    "startup news Nagpur",
    "startup jobs Nagpur",
    "founder stories India",
    "central India startups",
    "Vidarbha startups",
    "Nagpur tech hub",
    "startup insights India",
    "Nagpur entrepreneurship",
    "agri-tech startups Nagpur",
    "logistics startups Nagpur",
    "startup opportunities Nagpur",
  ],
  authors: [{ name: "Nagpur Startup Hub", url: SITE_URL }],
  creator: "Nagpur Startup Hub",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: "Nagpur Startup Hub",
    title: "Nagpur Startup Hub — Insights, Stories & Opportunities",
    description:
      "Your go-to platform for Nagpur startup news, founder stories, market insights, and job opportunities.",
    images: [{ url: "/logo.png", width: 1200, height: 630, alt: "Nagpur Startup Hub" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nagpur Startup Hub",
    description:
      "Startup news, founder stories, insights, and jobs from Nagpur — central India's growing startup ecosystem.",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  alternates: { canonical: SITE_URL },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: "Nagpur Startup Hub",
        url: SITE_URL,
        logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.png` },
        description:
          "A media platform covering the Nagpur startup ecosystem — insights, founder stories, startup news, and job opportunities.",
        sameAs: [],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: "Nagpur Startup Hub",
        publisher: { "@id": `${SITE_URL}/#organization` },
        potentialAction: {
          "@type": "SearchAction",
          target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/blog?q={search_term_string}` },
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };

  return (
    <html lang="en" className={`${roboto.variable} ${oswald.variable} h-full antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="flex flex-col min-h-screen bg-gray-100 font-[var(--font-roboto)]">
        <Navbar />
        <div className="flex-grow">{children}</div>
        <Footer />
      </body>
    </html>
  );
}