import { type NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const packageId = searchParams.get('packageId');

    if (!packageId) {
      return NextResponse.json(
        { error: 'Package ID is required' },
        { status: 400 },
      );
    }

    const pkg = await prisma.package.findUnique({
      where: { id: packageId },
      include: {
        itinerary: {
          orderBy: { order: 'asc' },
        },
        _count: {
          select: { reviews: true },
        },
        reviews: {
          select: { rating: true },
        },
      },
    });

    if (!pkg) {
      return NextResponse.json({ error: 'Package not found' }, { status: 404 });
    }

    const { reviews, _count, ...rest } = pkg;

    const reviewCount = _count.reviews;
    const avgRating =
      reviewCount > 0
        ? Math.round(
            (reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount) * 10,
          ) / 10
        : null;

    return NextResponse.json({ ...rest, reviewCount, avgRating });
  } catch (_error) {
    return NextResponse.json(
      { error: 'Failed to fetch package details' },
      { status: 500 },
    );
  }
}
