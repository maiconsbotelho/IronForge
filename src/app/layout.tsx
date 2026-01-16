import type { Metadata } from "next";
import { Inter, Teko } from "next/font/google"; // Using Teko for the "Strong" headers if available
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
// Using standard sans for now, easy to swap

export const metadata: Metadata = {
  title: "IronForge",
  description: "Functional Training & CrossFit Tracker",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={cn(inter.variable, "antialiased min-h-screen bg-background")}
      >
        <Navbar />

        <main className="container mx-auto px-4 py-8 pb-24 md:pt-20 md:pb-8 max-w-5xl">
          {children}
        </main>
      </body>
    </html>
  );
}
