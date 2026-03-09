import { type NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(_req: NextRequest) {
  try {
    const now = new Date();

    const packages = await prisma.package.findMany({
      where: { packageType: 'FESTIVAL', isActive: true },
      select: {
        id: true,
        name: true,
        slug: true,
        location: true,
        division: true,
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
        summary: true,
        highlights: true,
        departures: {
          where: { status: { not: 'CANCELLED' } },
          select: {
            id: true,
            startDate: true,
            endDate: true,
            status: true,
            totalSeats: true,
            bookedSeats: true,
            isGuaranteed: true,
            note: true,
            pricePerPerson: true,
          },
          orderBy: { startDate: 'asc' },
        },
        reviews: { select: { rating: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const response = packages.map(({ reviews, departures, ...pkg }) => {
      const reviewCount = reviews.length;
      const averageRating =
        reviewCount > 0
          ? Math.round(
              (reviews.reduce((s, r) => s + r.rating, 0) / reviewCount) * 10,
            ) / 10
          : null;

      // Classify departures
      const upcomingDepartures = departures.filter(
        (d) => new Date(d.startDate) > now && d.status === 'ACTIVE',
      );
      const pastDepartures = departures.filter(
        (d) => new Date(d.endDate) < now,
      );

      // Next upcoming departure (closest future one)
      const nextDeparture = upcomingDepartures[0] ?? null;

      // Determine festival status
      let status: 'upcoming' | 'past' | 'coming_soon';
      if (upcomingDepartures.length > 0) {
        status = 'upcoming';
      } else if (pastDepartures.length > 0 && upcomingDepartures.length === 0) {
        status = 'past';
      } else {
        status = 'coming_soon'; // active package but no departures added yet
      }

      // Spots for next departure
      const spotsLeft = nextDeparture
        ? nextDeparture.totalSeats - nextDeparture.bookedSeats
        : null;

      // Effective price — departure override takes priority
      const effectivePrice = nextDeparture?.pricePerPerson
        ? Number(nextDeparture.pricePerPerson)
        : Number(pkg.pricePerPerson);

      return {
        ...pkg,
        pricePerPerson: effectivePrice,
        originalPrice: pkg.originalPrice ? Number(pkg.originalPrice) : null,
        reviewCount,
        averageRating,
        status,
        nextDeparture,
        upcomingDeparturesCount: upcomingDepartures.length,
        pastDeparturesCount: pastDepartures.length,
        spotsLeft,
        // For past section: last completed departure info
        lastDeparture: pastDepartures.at(-1) ?? null,
      };
    });

    return NextResponse.json(response);
  } catch (_error) {
    return NextResponse.json(
      { error: 'Failed to fetch festivals' },
      { status: 500 },
    );
  }
}
