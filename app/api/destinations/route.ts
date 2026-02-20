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
          select: {
            packages: true,
          },
        },
      },
    });
    return NextResponse.json(destinations);
  } catch (_error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
