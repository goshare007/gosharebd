import { type NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { message: 'Destination ID is required' },
        { status: 400 },
      );
    }
    const response = await prisma.destination.findUnique({
      where: { id },
    });

    if (!response) {
      return NextResponse.json(
        { message: 'Destination not found' },
        { status: 404 },
      );
    }

    return NextResponse.json(response);
  } catch (_error) {
    return NextResponse.json(
      { message: 'Failed to fetch destination' },
      { status: 500 },
    );
  }
}
