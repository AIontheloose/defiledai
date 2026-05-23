import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DefiledAI",
  description: "The home of unrestricted local AI.",
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
