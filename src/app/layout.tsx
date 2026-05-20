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
  title: "युवा हिंदुस्तानी अवाम मोर्चा | Yuva Hindustani Awam Morcha (YHAM)",
  description: "Empowering India's youth for nation-building. YHAM - सशक्त युवा, मजबूत भारत. A national youth movement for inclusive and progressive society.",
  keywords: ["YHAM", "Yuva Hindustani Awam Morcha", "Youth Morcha", "Indian Youth", "Hindustani Awam Morcha", "Youth Empowerment", "India", "National Development"],
  authors: [{ name: "Yuva Hindustani Awam Morcha" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "युवा हिंदुस्तानी अवाम मोर्चा | YHAM",
    description: "सशक्त युवा, मजबूत भारत - Empowered Youth, Strong India",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "युवा हिंदुस्तानी अवाम मोर्चा | YHAM",
    description: "सशक्त युवा, मजबूत भारत - Empowered Youth, Strong India",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hi" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
