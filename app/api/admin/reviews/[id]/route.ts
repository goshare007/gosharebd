import { headers } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';
import { DeleteImage } from '@/cloudinary';
import { auth } from '@/lib/auth';
import { isAdmin } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!isAdmin(session)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { approved } = await req.json();

    const existing = await prisma.review.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    const review = await prisma.review.update({
      where: { id },
      data: { approved },
    });

    return NextResponse.json(review);
  } catch (error) {
    // biome-ignore lint/suspicious/noConsole: needed for debugging
    console.error('Update review error:', error);
    return NextResponse.json(
      { error: 'Failed to update review' },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!isAdmin(session)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const existing = await prisma.review.findUnique({
      where: { id },
      include: { images: true },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    if (existing.images.length > 0) {
      await Promise.allSettled(
        existing.images.map((img) => DeleteImage(img.publicId)),
      );
    }

    await prisma.review.delete({ where: { id } });

    return NextResponse.json({ message: 'Review deleted successfully' });
  } catch (error) {
    // biome-ignore lint/suspicious/noConsole: needed for debugging
    console.error('Delete review error:', error);
    return NextResponse.json(
      { error: 'Failed to delete review' },
      { status: 500 },
    );
  }
}
