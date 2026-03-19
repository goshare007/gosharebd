import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import PackageDetailClient from './PackageDetailClient';

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getPackage(slug: string) {
  try {
    const pkg = await prisma.package.findUnique({
      where: { slug },
      select: {
        name: true,
        slug: true,
        summary: true,
        coverImage: true,
        location: true,
        pricePerPerson: true,
        tags: true,
        _count: {
          select: {
            reviews: { where: { approved: true } },
          },
        },
      },
    });
    return pkg;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const pkg = await getPackage(slug);

  if (!pkg) {
    return {
      title: 'Package Not Found',
    };
  }

  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://gosharebd.com';

  return {
    title: `${pkg.name} - ${pkg.location} Tour Package`,
    description: pkg.summary,
    keywords: [
      ...pkg.tags,
      'Bangladesh tour',
      pkg.location,
      'travel package',
      'gosharebd',
    ],
    authors: [{ name: 'GoShareBD' }],
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: `${BASE_URL}/packages/${pkg.slug}`,
      siteName: 'GoShareBD',
      title: `${pkg.name} - ${pkg.location} Tour Package`,
      description: pkg.summary,
      images: [
        {
          url: pkg.coverImage,
          width: 1200,
          height: 630,
          alt: pkg.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${pkg.name} - ${pkg.location} Tour Package`,
      description: pkg.summary,
      images: [pkg.coverImage],
    },
    alternates: {
      canonical: `${BASE_URL}/packages/${pkg.slug}`,
    },
  };
}

export async function generateStaticParams() {
  try {
    const packages = await prisma.package.findMany({
      where: { isActive: true },
      select: { slug: true },
    });
    return packages.map((pkg) => ({ slug: pkg.slug }));
  } catch {
    return [];
  }
}

export const revalidate = 3600;

export default async function PackageDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const pkg = await getPackage(slug);

  if (!pkg) {
    notFound();
  }

  return <PackageDetailClient params={params} />;
}
