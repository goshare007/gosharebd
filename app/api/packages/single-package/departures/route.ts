import { type NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const revalidate = 30;

export async function GET(req: NextRequest) {
  try {
    const slug = req.nextUrl.searchParams.get('slug');
    if (!slug)
      return NextResponse.json({ error: 'Missing slug' }, { status: 400 });

    const pkg = await prisma.package.findUnique({
      where: { slug },
      include: {
        gallery: {
          select: { id: true, url: true, publicId: true },
        },
        itinerary: {
          orderBy: { order: 'asc' },
        },
        departures: {
          where: {
            status: 'ACTIVE',
            startDate: { gte: new Date() },
          },
          orderBy: { startDate: 'asc' },
          select: {
            id: true,
            startDate: true,
            endDate: true,
            status: true,
            totalSeats: true,
            bookedSeats: true,
            isGuaranteed: true,
            note: true,
            // Per-departure price overrides (nullable — fall back to package)
            pricePerPerson: true,
            originalPrice: true,
            couplePrice: true,
            originalCouplePrice: true,
          },
        },
      },
    });

    if (!pkg)
      return NextResponse.json({ error: 'Package not found' }, { status: 404 });

    // ── Package-level prices as plain numbers ─────────────────────────────────
    const pkgPrices = {
      pricePerPerson: Number(pkg.pricePerPerson),
      originalPrice: pkg.originalPrice ? Number(pkg.originalPrice) : null,
      couplePrice: pkg.couplePrice ? Number(pkg.couplePrice) : null,
      originalCouplePrice: pkg.originalCouplePrice
        ? Number(pkg.originalCouplePrice)
        : null,
    };

    // ── Enrich each departure ─────────────────────────────────────────────────
    //
    // Departure overrides take precedence when set; otherwise fall back to the
    // package default. All Decimal values are converted to numbers here so the
    // client never has to touch Prisma's Decimal type.
    //
    const departures = pkg.departures.map((d) => {
      // Availability
      const availableSeats = d.totalSeats - d.bookedSeats;
      const fillPct =
        d.totalSeats > 0 ? Math.round((d.bookedSeats / d.totalSeats) * 100) : 0;

      // Resolved effective prices
      const effectivePricePerPerson = d.pricePerPerson
        ? Number(d.pricePerPerson)
        : pkgPrices.pricePerPerson;

      const effectiveOriginalPrice = d.originalPrice
        ? Number(d.originalPrice)
        : pkgPrices.originalPrice;

      const effectiveCouplePrice = d.couplePrice
        ? Number(d.couplePrice)
        : pkgPrices.couplePrice;

      const effectiveOriginalCouplePrice = d.originalCouplePrice
        ? Number(d.originalCouplePrice)
        : pkgPrices.originalCouplePrice;

      // Discount % off the original price (null if no discount)
      const discountPct =
        effectiveOriginalPrice &&
        effectiveOriginalPrice > effectivePricePerPerson
          ? Math.round(
              ((effectiveOriginalPrice - effectivePricePerPerson) /
                effectiveOriginalPrice) *
                100,
            )
          : null;

      // Whether this departure advertises a different price than the package default
      const hasPriceOverride = !!d.pricePerPerson || !!d.couplePrice;

      const urgency: 'available' | 'low' | 'critical' | 'full' =
        availableSeats === 0
          ? 'full'
          : availableSeats <= 3
            ? 'critical'
            : availableSeats <= 8
              ? 'low'
              : 'available';

      return {
        id: d.id,
        startDate: d.startDate,
        endDate: d.endDate,
        status: d.status,
        isGuaranteed: d.isGuaranteed,
        note: d.note,

        // Seat availability
        totalSeats: d.totalSeats,
        bookedSeats: d.bookedSeats,
        availableSeats,
        fillPct,
        urgency,

        // Effective prices — always resolved, always numbers
        effectivePricePerPerson,
        effectiveOriginalPrice,
        effectiveCouplePrice,
        effectiveOriginalCouplePrice,

        // UI helpers
        hasPriceOverride,
        discountPct,
      };
    });

    return NextResponse.json({
      ...pkg,
      // Overwrite Decimal fields with plain numbers
      ...pkgPrices,
      departures,
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch package' },
      { status: 500 },
    );
  }
}
