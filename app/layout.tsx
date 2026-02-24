import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AL Azeem Fish Feed Industries - Premium Fish Feed Products",
  description:
    "AL Azeem Fish Feed Industries offers premium quality fish feed products. Browse our catalog, check delivery availability, and order via WhatsApp.",
  keywords: "fish feed, fish food, aquaculture, AL Azeem, premium fish feed",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
