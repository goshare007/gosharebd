import { type NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const revalidate = 60;

type PackageType = 'REGULAR' | 'FESTIVAL';
const VALID_TYPES: PackageType[] = ['REGULAR', 'FESTIVAL'];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;

    // ── packageType ──────────────────────────────────────────────────────────
    // No type param (or unrecognised value) → undefined → no filter → all types
    const typeParam = searchParams.get('type')?.toUpperCase();
    const packageType: PackageType | undefined =
      typeParam && VALID_TYPES.includes(typeParam as PackageType)
        ? (typeParam as PackageType)
        : undefined;

    // ── isActive ─────────────────────────────────────────────────────────────
    // No isActive param → undefined → no filter → all packages
    const isActiveParam = searchParams.get('isActive');
    const isActive =
      isActiveParam === 'true'
        ? true
        : isActiveParam === 'false'
          ? false
          : undefined;

    // ── Query ─────────────────────────────────────────────────────────────────
    const packages = await prisma.package.findMany({
      where: {
        ...(packageType !== undefined && { packageType }),
        ...(isActive !== undefined && { isActive }),
      },
      select: {
        id: true,
        name: true,
        slug: true,
        location: true,
        division: true,
        packageType: true,
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
        _count: { select: { reviews: true } },
        reviews: { select: { rating: true } },
      },
    });

    // ── Shape response ────────────────────────────────────────────────────────
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
