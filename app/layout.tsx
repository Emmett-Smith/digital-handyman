import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { site } from "@/content/site";
import "./globals.css";
const geist = localFont({
  src: "../public/fonts/geist.woff2",
  variable: "--font-geist",
  display: "optional",
  weight: "100 900",
});
const mono = localFont({
  src: "../public/fonts/geist-mono.woff2",
  variable: "--font-geist-mono",
  display: "optional",
  weight: "100 900",
});
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Throughline AI — Good people. Less repeat work.",
    template: "%s | Throughline AI",
  },
  description: site.description,
  openGraph: {
    type: "website",
    siteName: site.name,
    title: "Good people. Less repeat work.",
    description: site.description,
  },
  twitter: { card: "summary_large_image" },
  robots: { index: !site.url.includes("localhost"), follow: true },
  icons: { icon: "/icon.svg" },
};
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#10161D",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geist.variable} ${mono.variable}`}>
      <body>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <div id="main-content">{children}</div>
      </body>
    </html>
  );
}
