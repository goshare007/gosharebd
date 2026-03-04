import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const packages = await prisma.package.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        location: true,
        pricePerPerson: true,
        originalPrice: true,
        coverImage: true,
        durationDays: true,
        isActive: true,
        isBestseller: true,
        minGroupSize: true,
        maxGroupSize: true,
        couplePrice: true,
        originalCouplePrice: true,
        isCouple: true,
        tags: true,
        _count: {
          select: {
            reviews: true,
          },
        },
        reviews: {
          select: { rating: true },
        },
      },
    });

    const response = packages.map(({ reviews, ...pkg }) => ({
      ...pkg,
      reviewCount: reviews.length,
      averageRating:
        reviews.length > 0
          ? Math.round(
              (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) *
                10,
            ) / 10
          : null,
    }));

    return NextResponse.json(response);
  } catch (_error) {
    return NextResponse.json(
      { error: 'Failed to fetch packages' },
      { status: 500 },
    );
  }
}
