import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const response = await prisma.package.findMany({
      select: {
        id: true,
        name: true,
        Location: true,
        pricePerPerson: true,
        originalPrice: true,
        coverImage: true,
        durationDays: true,
        isActive: true,
        _count: {
          select: {
            departures: true,
            bookings: true,
          },
        },
      },
    });
    return NextResponse.json(response);
  } catch (_error) {
    return NextResponse.json(
      { error: 'Failed to fetch packages' },
      { status: 500 },
    );
  }
}
