import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Goopi - Donde todo sucede",
  description: "Tu app de taxi, delivery y guía comercial. Pide taxi, realiza envíos y descubre los mejores lugares de tu ciudad.",
  keywords: ["Goopi", "Taxi", "Delivery", "Guía Comercial", "Turismo", "Ecuador", "Transporte"],
  authors: [{ name: "Goopi Team" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "Goopi - Donde todo sucede",
    description: "Tu app de taxi, delivery y guía comercial",
    url: "https://goopiapp.com",
    siteName: "Goopi",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Goopi - Donde todo sucede",
    description: "Tu app de taxi, delivery y guía comercial",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
