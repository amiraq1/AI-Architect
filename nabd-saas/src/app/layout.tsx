import type { Metadata, Viewport } from "next";
import { Cairo, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-cairo",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5, // Allow zooming for accessibility
  userScalable: true,
  themeColor: '#020617', // Matches brand background
};

export const metadata: Metadata = {
  metadataBase: new URL('https://nabd.amiraq.online'),
  title: {
    default: "نبض AI | الذكاء الاصطناعي العراقي الأول",
    template: "%s | نبض AI"
  },
  description: "مساعد ذكي متطور يفهم اللهجة العراقية واللغة العربية الفصحى. يساعدك في البرمجة، الكتابة، والتحليل بسرعة وكفاءة.",
  keywords: ["ذكاء اصطناعي", "عراق", "شات بوت", "لهجة عراقية", "AI Iraq", "Nabd", "مساعد شخصي", "برمجة", "تحليل بيانات"],
  authors: [{ name: "Nabd Team" }],
  creator: "Amiraq",
  openGraph: {
    type: 'website',
    locale: 'ar_IQ',
    url: 'https://nabd.amiraq.online',
    siteName: 'Nabd AI',
    title: 'نبض AI | ذكاء اصطناعي بلسانك',
    description: 'جرب أول ذكاء اصطناعي يفهم ثقافتك ولهجتك. ابدأ الآن مجاناً.',
    images: [
      {
        url: '/og-image.jpg', // We should ensure this image exists later
        width: 1200,
        height: 630,
        alt: 'Nabd AI Interface',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'نبض AI - الذكاء الاصطناعي العراقي',
    description: 'مساعدك الذكي الذي يتحدث لغتك.',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: '/',
    languages: {
      'ar-IQ': '/',
      'ar': '/',
    },
  },
  robots: {
    index: true,
    follow: true,
  }
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Nabd AI',
  applicationCategory: 'Productivity',
  operatingSystem: 'Web',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  description: 'مساعد ذكي متطور يفهم اللهجة العراقية واللغة العربية الفصحى.',
};

import SessionProvider from "@/components/providers/SessionProvider";
import { auth } from "@/auth";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} ${jetbrainsMono.variable}`}>
      <body className={`${cairo.className} antialiased bg-slate-950 text-slate-50 min-h-screen`}>
        <SessionProvider>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}

