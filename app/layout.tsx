import type { Metadata, Viewport } from "next";
import "./globals.css";

const title = "MASSOS 企业版｜持续理解，料事于先，提前防错";
const description =
  "MASSOS 企业版持续理解企业目标与经营背景，在关键决策前梳理结果、风险和连锁影响，主动发现问题并给出有依据的下一步建议。";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
const socialImage = siteUrl ? `${siteUrl}/og.png` : undefined;

export const metadata: Metadata = {
  title,
  description,
  applicationName: "MASSOS",
  metadataBase: siteUrl ? new URL(siteUrl) : undefined,
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    siteName: "MASSOS",
    title,
    description,
    images: socialImage
      ? [
          {
            url: socialImage,
            width: 1731,
            height: 909,
            alt: "MASSOS 企业版：持续理解，料事于先，提前防错",
          },
        ]
      : undefined,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: socialImage ? [socialImage] : undefined,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
