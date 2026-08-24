import type { Metadata, Viewport } from "next";
import "./globals.css";

const title = "XELITI｜让每个产品都拥有认知能力";
const description =
  "XELITI 是通用认知平台，通过共享 Agent Harness、Cognitive Kernel 与状态记忆能力，支持 Business、Personal 和未来产品持续理解并采取下一步行动。";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
const socialImage = siteUrl ? `${siteUrl}/og.png` : undefined;

export const metadata: Metadata = {
  title,
  description,
  applicationName: "XELITI",
  metadataBase: siteUrl ? new URL(siteUrl) : undefined,
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    siteName: "XELITI",
    title,
    description,
    images: socialImage
      ? [
          {
            url: socialImage,
            width: 1731,
            height: 909,
            alt: "XELITI 通用认知平台",
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
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f6f7" },
    { media: "(prefers-color-scheme: dark)", color: "#15181c" },
  ],
  colorScheme: "light dark",
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
