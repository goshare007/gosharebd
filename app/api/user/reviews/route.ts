import { headers } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(_req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const reviews = await prisma.review.findMany({
      where: { userId: session.user.id },
      include: {
        package: {
          select: {
            id: true,
            name: true,
            slug: true,
            coverImage: true,
          },
        },
        images: true,
      },
      orderBy: { date: 'desc' },
    });

    const formattedReviews = reviews.map((review) => ({
      id: review.id,
      packageId: review.packageId,
      packageName: review.package.name,
      packageSlug: review.package.slug,
      packageImage: review.package.coverImage,
      rating: review.rating,
      comment: review.comment,
      date: review.date.toISOString(),
      approved: review.approved,
      isVerified: review.isVerified,
      images: review.images.map((img) => ({
        id: img.id,
        url: img.url,
      })),
    }));

    return NextResponse.json(formattedReviews);
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Review ID required' },
        { status: 400 },
      );
    }

    const review = await prisma.review.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    await prisma.review.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: 'Failed to delete review' },
      { status: 500 },
    );
  }
}
