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
