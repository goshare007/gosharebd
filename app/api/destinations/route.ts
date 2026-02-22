import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const destinations = await prisma.destination.findMany({
      select: {
        id: true,
        name: true,
        image: true,
        division: true,
        summary: true,
        tags: true,
        _count: {
          select: { packages: true },
        },
        packages: {
          select: { pricePerPerson: true },
          orderBy: { pricePerPerson: 'asc' },
          take: 1,
        },
      },
    });

    const response = destinations.map(({ packages, _count, ...dest }) => ({
      ...dest,
      packageCount: _count.packages,
      startingPrice: packages[0]?.pricePerPerson ?? null,
    }));

    return NextResponse.json(response);
  } catch (_error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
