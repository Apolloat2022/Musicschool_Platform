import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Apollo Performing Arts & Academy",
    template: "%s | Apollo Performing Arts",
  },
  description: "High-fidelity live music lessons and masterclasses. Join the elite musical journey at apollotunes.com.",
  metadataBase: new URL("https://www.apollotunes.com"),
  openGraph: {
    title: "Apollo Performing Arts & Academy",
    description: "Experience the next level of online music education.",
    url: "https://www.apollotunes.com",
    siteName: "Apollo Academy",
    images: [
      {
        url: "/og-image.png", // Create a 1200x630 image for social media shares
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Apollo Performing Arts & Academy",
    description: "Live high-fidelity music lessons.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>{children}</body>
      </html>
    </ClerkProvider>
  );
}