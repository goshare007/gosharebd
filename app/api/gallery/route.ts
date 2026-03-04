import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const result = await prisma.galleryImage.findMany();

    return NextResponse.json(result);
  } catch (_error) {
    return NextResponse.json(
      { error: 'Failed to fetch gallery data' },
      { status: 500 },
    );
  }
}
