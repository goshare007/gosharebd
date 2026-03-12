import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const revalidate = 60;

export async function GET() {
  try {
    const response = await prisma.package.findMany({
      where: {
        isActive: true,
        packageType: 'REGULAR',
      },
      select: {
        id: true,
        name: true,
        location: true,
        pricePerPerson: true,
        originalPrice: true,
        coverImage: true,
        durationDays: true,
        isActive: true,
        isBestseller: true,
        _count: {
          select: {
            departures: true,
            bookings: true,
          },
        },
      },
      orderBy: {
        bookings: {
          _count: 'desc',
        },
      },
      take: 6,
    });

    return NextResponse.json(response);
  } catch (_error) {
    return NextResponse.json(
      { error: 'Failed to fetch packages' },
      { status: 500 },
    );
  }
}
