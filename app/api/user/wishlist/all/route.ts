import { headers } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import type { WishlistType } from '@/types/wishlist';

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return NextResponse.json({ wishlisted: false });

    const packageId = req.nextUrl.searchParams.get('packageId');

    // If packageId is provided, check single package wishlist status
    if (packageId) {
      const wishlist = await prisma.wishlist.findUnique({
        where: { userId_packageId: { userId: session.user.id, packageId } },
      });
      return NextResponse.json({ wishlisted: !!wishlist });
    }

    // Otherwise return all wishlisted packages
    const wishlists = await prisma.wishlist.findMany({
      where: { userId: session.user.id },
      include: {
        package: {
          select: {
            id: true,
            slug: true,
            name: true,
            coverImage: true,
            pricePerPerson: true,
            originalPrice: true,
            isCouple: true,
            durationDays: true,
            maxGroupSize: true,
            minGroupSize: true,
            location: true,
            isBestseller: true,
            reviews: { select: { rating: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const packages: WishlistType[] = wishlists.map(({ package: pkg }) => ({
      id: pkg.id,
      slug: pkg.slug,
      name: pkg.name,
      coverImage: pkg.coverImage,
      pricePerPerson: Number(pkg.pricePerPerson),
      originalPrice: Number(pkg.originalPrice),
      isCouple: pkg.isCouple,
      durationDays: pkg.durationDays,
      maxGroupSize: pkg.maxGroupSize,
      minGroupSize: pkg.minGroupSize,
      Location: pkg.location,
      isBestseller: pkg.isBestseller,
      reviewCount: pkg.reviews.length,
      averageRating:
        pkg.reviews.length > 0
          ? pkg.reviews.reduce((sum, r) => sum + r.rating, 0) /
            pkg.reviews.length
          : null,
    }));

    return NextResponse.json(packages);
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch wishlist' },
      { status: 500 },
    );
  }
}
