import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import GoogleAnalytics from "@/components/GoogleAnalytics";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://explainthismeme.online';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Explain This Meme - AI Meme Explainer | Understand Any Meme Instantly | 解释这个梗",
    template: "%s | Explain This Meme",
  },
  description: "Can't understand a meme? Upload any meme and get instant AI-powered explanations. Explain this meme, decode cultural references, and never miss the joke again. Free meme explanation tool using Grok Vision AI. 看不懂梗图？上传任何梗图，AI立即解释含义、来源和使用场景。",
  keywords: [
    // 核心热门关键词（基于X/Reddit调研）
    "explain this meme",
    "what does this meme mean",
    "meme explanation",
    "meme explainer",
    "can someone explain this meme",
    "explain the joke",
    "meme meaning",
    "internet meme explained",
    "meme analyzer",
    "understand memes",
    // 中文高频关键词
    "解释这个梗",
    "梗图什么意思",
    "梗解释",
    "看不懂梗图",
    "梗图解释",
    "梗图分析",
    "网络梗解释",
    "AI解读梗图",
    // 品牌和技术
    "AI meme",
    "Grok Vision",
    "meme culture",
    "网络文化"
  ],
  authors: [{ name: "Meme Explainer Team" }],
  creator: "Meme Explainer",
  publisher: "Meme Explainer",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["zh_CN"],
    url: baseUrl,
    title: "Explain This Meme - AI Meme Explainer | Understand Any Meme Instantly",
    description: "Can't understand a meme? Upload any meme and get instant AI-powered explanations. Explain this meme, decode cultural references, and never miss the joke again.",
    siteName: "Explain This Meme",
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: "Explain This Meme - AI Meme Explainer Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Explain This Meme - AI Meme Explainer",
    description: "Can't understand a meme? Get instant AI-powered explanations. Never miss the joke again.",
    images: ['/opengraph-image'],
    creator: "@memeexplainer",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
  alternates: {
    canonical: baseUrl,
    languages: {
      'en': `${baseUrl}/?lang=en`,
      'zh': `${baseUrl}/?lang=zh`,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-icon" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <meta name="theme-color" content="#9333ea" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  );
}
