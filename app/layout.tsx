import type { Metadata } from "next";
import "./globals.css";
import { siteMeta } from "./site-meta";

export const metadata: Metadata = {
  metadataBase: new URL(siteMeta.url),
  title: siteMeta.title,
  description: siteMeta.description,
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website", locale: "ja_JP", url: "/", siteName: siteMeta.name,
    title: siteMeta.title, description: siteMeta.description,
  },
  twitter: {
    card: "summary", title: siteMeta.title, description: siteMeta.description,
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased">{children}</body>
    </html>
  );
}
