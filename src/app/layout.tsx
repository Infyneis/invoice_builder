import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Invoice Builder | Professional Invoice Generation",
  description:
    "Create professional invoices in seconds. Business and Freelancer modes with PDF export. Year Coding Challenge #7",
  keywords: [
    "invoice",
    "invoice generator",
    "invoice builder",
    "PDF invoice",
    "freelancer invoice",
    "business invoice",
  ],
  authors: [{ name: "Samy DJEMILI" }],
  openGraph: {
    title: "Invoice Builder | Professional Invoice Generation",
    description:
      "Create professional invoices in seconds. Business and Freelancer modes with PDF export.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-background text-foreground`}>
        <Providers>
          {/* Background effects */}
          <div className="fixed inset-0 bg-gradient-radial pointer-events-none" />
          <div className="fixed inset-0 bg-grid-pattern pointer-events-none" />

          {/* Main content */}
          <main className="relative min-h-screen">{children}</main>

          {/* Toast notifications */}
          <Toaster position="top-right" richColors />
        </Providers>
      </body>
    </html>
  );
}
