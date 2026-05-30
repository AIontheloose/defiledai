import "./globals.css";
import type { Metadata } from "next";
import Navbar from "../components/Navbar";

export const metadata: Metadata = {
  title: "DefiledAI",
  description:
    "Local AI research, quantization analysis, benchmarks, and open-weight model intelligence.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#050816] text-white">
        <Navbar />

        {children}
      </body>
    </html>
  );
}