import { type NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    // 2. Validate packageId
    const { searchParams } = new URL(req.url);
    const packageId = searchParams.get('packageId');
    if (!packageId) {
      return NextResponse.json({ error: 'Missing packageId' }, { status: 400 });
    }

    // 3. Check package exists
    const pkg = await prisma.package.findUnique({
      where: { id: packageId },
      select: {
        name: true,
        tags: true,
        Location: true,
        summary: true,
      },
    });
    if (!pkg) {
      return NextResponse.json({ error: 'Package not found' }, { status: 404 });
    }

    // 4. Fetch gallery images
    const images = await prisma.galleryImage.findMany({
      where: { packageId },
      select: { id: true, url: true, publicId: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });

    // 5. Return flattened response — no nested package object on each image
    return NextResponse.json({
      package: pkg,
      images,
      total: images.length,
    });
  } catch (_error) {
    return NextResponse.json(
      { error: 'Failed to fetch gallery images' },
      { status: 500 },
    );
  }
}
