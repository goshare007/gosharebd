import type { Metadata } from 'next';
import { Geist, Geist_Mono, Philosopher } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import TanstackQueryProvider from '@/context/tanstack-query-provider';
import { ThemeProvider } from '@/context/theme-provider';
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

export const metadata: Metadata = {
  title: 'GoShareBD | See Bangladesh Like Never Before',
  description: 'Where every discovery is a story worth sharing.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <TanstackQueryProvider>
      <html lang='en' suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} ${philosopher.variable} font-sans antialiased`}
        >
          <ThemeProvider
            attribute='class'
            defaultTheme='light'
            enableSystem
            disableTransitionOnChange
          >
            <TooltipProvider>{children}</TooltipProvider>
            <Toaster richColors />
          </ThemeProvider>
        </body>
      </html>
    </TanstackQueryProvider>
  );
}
