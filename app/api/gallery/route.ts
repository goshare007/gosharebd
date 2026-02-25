import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Fetch all packages that have at least one gallery image,
    // selecting only the first image and the total count
    const packages = await prisma.package.findMany({
      where: {
        gallery: { some: {} }, // only packages with at least one image
      },
      select: {
        id: true,
        name: true,
        Location: true,
        gallery: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: {
            id: true,
            url: true,
            publicId: true,
            createdAt: true,
          },
        },
        _count: {
          select: { gallery: true }, // total image count for this package
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Shape the response to be flat and easy to consume on the frontend
    const result = packages.map((pkg) => ({
      packageId: pkg.id,
      packageName: pkg.name,
      Location: pkg.Location,
      thumbnail: pkg.gallery[0], // the single representative image
      imageCount: pkg._count.gallery,
    }));

    return NextResponse.json(result);
  } catch (_error) {
    return NextResponse.json(
      { error: 'Failed to fetch gallery data' },
      { status: 500 },
    );
  }
}
