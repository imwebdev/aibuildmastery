import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Build Mastery — Curated AI Knowledge for Builders & Leaders",
  description:
    "A curated knowledge hub for AI practitioners. Structured articles on AI models, agents, MCP, cloud infrastructure, and leadership strategy.",
  openGraph: {
    title: "AI Build Mastery",
    description: "Curated AI knowledge for builders and leaders",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background text-foreground antialiased">
        <Header />
        <main className="pt-12">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
