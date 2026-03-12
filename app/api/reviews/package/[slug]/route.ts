import { type NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const skip = (page - 1) * limit;

    const pkg = await prisma.package.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!pkg) {
      return NextResponse.json({ error: 'Package not found' }, { status: 404 });
    }

    const [reviews, total, ratingStats] = await Promise.all([
      prisma.review.findMany({
        where: {
          packageId: pkg.id,
          approved: true,
        },
        include: {
          images: {
            select: {
              id: true,
              url: true,
              publicId: true,
            },
          },
        },
        orderBy: { date: 'desc' },
        skip,
        take: limit,
      }),
      prisma.review.count({
        where: {
          packageId: pkg.id,
          approved: true,
        },
      }),
      prisma.review.groupBy({
        by: ['rating'],
        where: {
          packageId: pkg.id,
          approved: true,
        },
        _count: true,
      }),
    ]);

    const ratingDistribution = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };

    let totalRating = 0;
    ratingStats.forEach((stat) => {
      ratingDistribution[stat.rating as keyof typeof ratingDistribution] =
        stat._count;
      totalRating += stat.rating * stat._count;
    });

    const reviewCount = total;
    const averageRating =
      reviewCount > 0
        ? Math.round((totalRating / reviewCount) * 10) / 10
        : null;

    return NextResponse.json({
      reviews,
      stats: {
        averageRating,
        reviewCount,
        ratingDistribution,
      },
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    // biome-ignore lint/suspicious/noConsole: needed for debugging
    console.error('Get package reviews error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 },
    );
  }
}
