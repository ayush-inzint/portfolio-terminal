import type { Metadata } from "next";
import { Courier_Prime } from "next/font/google";
import "./globals.css";

const courierPrime = Courier_Prime({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mark Gatere - Portfolio Terminal",
  description: "Interactive terminal portfolio of Mark Gatere - Software & AI Engineer. Explore my projects, skills, and experience through a unique command-line interface.",
  keywords: "portfolio, terminal, developer, software engineer, AI engineer, Mark Gatere",
  authors: [{ name: "Mark Gatere" }],
  creator: "Mark Gatere",
  publisher: "Mark Gatere",
  robots: "index, follow",
  openGraph: {
    title: "Mark Gatere's Portfolio Terminal",
    description: "Interactive terminal portfolio of Mark Gatere - Software & AI Engineer",
    url: "https://your-domain.com",
    siteName: "Mark Gatere Portfolio",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mark Gatere's Portfolio Terminal",
    description: "Interactive terminal portfolio of Mark Gatere - Software & AI Engineer",
    creator: "@gatere_mark",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${courierPrime.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
