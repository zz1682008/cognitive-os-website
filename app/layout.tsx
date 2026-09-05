import type { Metadata, Viewport } from "next";
import "./globals.css";

const title = "XELITI Business｜让 AI 真正懂你的企业";
const description =
  "让企业资料成为 AI 读得懂的知识，让财务、法务、智能客服与秘书台在同一套企业理解上协同。了解 XELITI Business 的产品设计与工作方式。";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
const socialImage = siteUrl ? `${siteUrl}/og-business-r5.webp` : undefined;

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
            width: 1320,
            height: 704,
            alt: "XELITI Business，让 AI 真正懂你的企业：抽象神经信号视觉",
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
