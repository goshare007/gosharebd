import { headers } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { isAdmin } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ packageId: string }> },
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!isAdmin(session)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { packageId } = await params;
    const { imageUrl, publicId } = await request.json();

    if (!imageUrl || !publicId) {
      return NextResponse.json(
        { error: 'imageUrl and publicId are required' },
        { status: 400 },
      );
    }

    const newImage = await prisma.galleryImage.create({
      data: { url: imageUrl, publicId, packageId },
    });

    return NextResponse.json(newImage, { status: 201 });
  } catch (_error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
