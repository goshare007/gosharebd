import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import type { Metadata } from 'next';
import { Geist, Geist_Mono, Philosopher } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { LenisProvider } from '@/context/lenis-provider';
import TanstackQueryProvider from '@/context/tanstack-query-provider';
import { ThemeProvider } from '@/context/theme-provider';
import { jsonLd } from '@/lib/seo';
import './globals.css';

// 1. Set Geist as our primary Sans font
const geistSans = Geist({
  variable: '--font-sans', // Changed from --font-geist-sans
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-mono', // Changed from --font-geist-mono
  subsets: ['latin'],
});

// 2. Set Philosopher as our Display font
const philosopher = Philosopher({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-philosopher',
});

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://gosharebd.com';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'GoShareBD | See Bangladesh Like Never Before',
    template: '%s | GoShareBD',
  },
  description:
    'Where every discovery is a story worth sharing. Explore the beautiful destinations of Bangladesh with curated travel packages.',
  keywords: [
    'travel',
    'Bangladesh',
    'tourism',
    'vacation',
    'holiday',
    'destinations',
    'packages',
    'booking',
    'Bangladesh tour',
    'travel Bangladesh',
    'Dhaka',
    'Sylhet',
    "Cox's Bazar",
    'Sundarbans',
  ],
  authors: [{ name: 'GoShareBD' }],
  creator: 'GoShareBD',
  publisher: 'GoShareBD',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: BASE_URL,
    siteName: 'GoShareBD',
    title: 'GoShareBD | See Bangladesh Like Never Before',
    description:
      'Where every discovery is a story worth sharing. Explore the beautiful destinations of Bangladesh with curated travel packages.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'GoShareBD - Travel Bangladesh',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GoShareBD | See Bangladesh Like Never Before',
    description:
      'Where every discovery is a story worth sharing. Explore the beautiful destinations of Bangladesh.',
    images: ['/og-image.jpg'],
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
  alternates: {
    canonical: BASE_URL,
    languages: {
      en: BASE_URL,
      'en-BD': BASE_URL,
    },
  },
  category: 'travel',
  classification: 'Travel and Tourism',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <TanstackQueryProvider>
      <html lang='en' suppressHydrationWarning>
        <head>
          <script
            type='application/ld+json'
            // biome-ignore lint/security/noDangerouslySetInnerHtml: this is fine
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
        </head>
        <body
          className={`${geistSans.variable} ${geistMono.variable} ${philosopher.variable} font-sans antialiased`}
        >
          <LenisProvider>
            <ThemeProvider
              attribute='class'
              defaultTheme='light'
              enableSystem
              disableTransitionOnChange
            >
              <TooltipProvider>
                {children}
                <Toaster richColors />
                {process.env.NODE_ENV === 'development' && (
                  <ReactQueryDevtools initialIsOpen={false} />
                )}
              </TooltipProvider>
            </ThemeProvider>
          </LenisProvider>
        </body>
      </html>
    </TanstackQueryProvider>
  );
}
