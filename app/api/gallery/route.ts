import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const revalidate = 300;

export async function GET() {
  try {
    const images = await prisma.galleryImage.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        url: true,
        package: {
          select: {
            name: true,
            slug: true,
            location: true,
          },
        },
      },
    });

    return NextResponse.json(images);
  } catch (_error) {
    return NextResponse.json(
      { error: 'Failed to fetch gallery data' },
      { status: 500 },
    );
  }
}
