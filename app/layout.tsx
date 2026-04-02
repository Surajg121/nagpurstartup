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

export const metadata: Metadata = {
  title: "Nagpur Startup Hub",
  description: "Insights, stories, news, and opportunities from Nagpur startups",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${roboto.variable} ${oswald.variable} h-full antialiased`}>
      <body className="flex flex-col min-h-screen bg-gray-100 font-[var(--font-roboto)]">
        <Navbar />
        <div className="flex-grow">{children}</div>
        <Footer />
      </body>
    </html>
  );
}