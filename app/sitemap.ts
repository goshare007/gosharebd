import type { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://gosharebd.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    '',
    '/about',
    '/blog',
    '/book',
    '/careers',
    '/contact',
    '/cookies',
    '/faq',
    '/festivals',
    '/gallery',
    '/help',
    '/packages',
    '/privacy',
    '/refund',
    '/safety',
    '/terms',
    '/press',
    '/sign-in',
  ];

  const staticUrls = staticRoutes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  const [destinations, packages] = await Promise.all([
    prisma.destination.findMany({
      select: { id: true, updatedAt: true },
    }),
    prisma.package.findMany({
      where: { isActive: true },
      select: { id: true, updatedAt: true },
    }),
  ]);

  const dynamicUrls = [
    ...destinations.map((d) => ({
      url: `${BASE_URL}/destinations/${d.id}`,
      lastModified: d.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
    ...packages.map((p) => ({
      url: `${BASE_URL}/packages/${p.id}`,
      lastModified: p.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
  ];

  return [...staticUrls, ...dynamicUrls];
}
