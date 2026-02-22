import { type NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const destination = await prisma.destination.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        image: true,
        tags: true,
        division: true,
        summary: true,
        _count: {
          select: { packages: true },
        },
        packages: {
          select: {
            id: true,
            name: true,
            coverImage: true,
            tags: true,
            isBestseller: true,
            summary: true,
            durationDays: true,
            maxGroupSize: true,
            minGroupSize: true,
            pricePerPerson: true,
            originalPrice: true,
            couplePrice: true,
            _count: {
              select: { reviews: true },
            },
            reviews: {
              select: { rating: true },
            },
          },
        },
      },
    });

    if (!destination) {
      return NextResponse.json(
        { error: 'Destination not found' },
        { status: 404 },
      );
    }

    const { _count, ...rest } = destination;

    const packages = destination.packages.map(({ reviews, _count, ...pkg }) => {
      const reviewCount = _count.reviews;
      const avgRating =
        reviewCount > 0
          ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount
          : null;

      return {
        ...pkg,
        reviewCount,
        avgRating: avgRating ? Math.round(avgRating * 10) / 10 : null,
      };
    });

    return NextResponse.json({
      ...rest,
      packageCount: _count.packages,
      packages,
    });
  } catch (_error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
