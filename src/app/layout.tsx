import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { school } from "@/config/school";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: school.name,
    template: `%s | ${school.shortName}`,
  },
  description: school.description,
  metadataBase: new URL(school.url),
  openGraph: {
    title: school.name,
    description: school.description,
    url: school.url,
    siteName: school.shortName,
    images: [
      {
        url: school.ogImage, // 1200x630 image for social media shares
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: school.name,
    description: school.description,
    images: [school.ogImage],
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