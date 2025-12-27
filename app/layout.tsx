import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";

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
    default: "Meme Explainer - AI-Powered Meme Analysis | 流行梗图解释器",
    template: "%s | Meme Explainer",
  },
  description: "Understand any meme instantly with AI. Upload memes and get detailed explanations powered by Grok Vision AI. 用AI秒懂流行梗图，详细解读梗的来源、含义和使用场景。",
  keywords: ["meme explainer", "meme analyzer", "AI meme", "Grok Vision", "梗图解释", "梗图分析", "AI解读", "网络文化"],
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
    title: "Meme Explainer - AI-Powered Meme Analysis",
    description: "Understand any meme instantly with AI. Upload memes and get detailed explanations powered by Grok Vision AI.",
    siteName: "Meme Explainer",
    images: [
      {
        url: `${baseUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Meme Explainer - AI-Powered Meme Analysis",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Meme Explainer - AI-Powered Meme Analysis",
    description: "Understand any meme instantly with AI powered by Grok Vision.",
    images: [`${baseUrl}/og-image.png`],
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
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#9333ea" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
