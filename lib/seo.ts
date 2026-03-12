import type { Metadata } from 'next';

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

export const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${BASE_URL}/#organization`,
      name: 'GoShareBD',
      url: BASE_URL,
      sameAs: [
        'https://www.facebook.com/gosharebd',
        'https://www.instagram.com/gosharebd',
        'https://twitter.com/gosharebd',
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+880-1XXXXXXXXX',
        contactType: 'Customer Service',
        availableLanguage: ['English', 'Bengali'],
      },
    },
    {
      '@type': 'WebSite',
      '@id': `${BASE_URL}/#website`,
      url: BASE_URL,
      name: 'GoShareBD',
      publisher: {
        '@id': `${BASE_URL}/#organization`,
      },
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${BASE_URL}/packages?search={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'WebPage',
      '@id': `${BASE_URL}/#webpage`,
      url: BASE_URL,
      name: 'GoShareBD - Travel Bangladesh',
      isPartOf: {
        '@id': `${BASE_URL}/#website`,
      },
      about: {
        '@id': `${BASE_URL}/#organization`,
      },
      description:
        'Where every discovery is a story worth sharing. Explore the beautiful destinations of Bangladesh with curated travel packages.',
    },
  ],
};
