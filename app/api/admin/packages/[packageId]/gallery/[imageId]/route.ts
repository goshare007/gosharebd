import { headers } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';
import { DeleteImage } from '@/cloudinary';
import { auth } from '@/lib/auth';
import { isAdmin } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ imageId: string }> },
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!isAdmin(session)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { imageId } = await params;

    const image = await prisma.galleryImage.findUnique({
      where: { id: imageId },
    });

    if (!image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    await DeleteImage(image.publicId);

    await prisma.galleryImage.delete({ where: { id: imageId } });

    return NextResponse.json({ message: 'Image deleted successfully' });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Cloudinary')) {
      return NextResponse.json(
        { error: `Cloudinary error: ${error.message}` },
        { status: 502 },
      );
    }
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
