import { headers } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { packageId } = await req.json();

    if (!packageId) {
      return NextResponse.json(
        { error: 'packageId is required' },
        { status: 400 },
      );
    }

    const existing = await prisma.wishlist.findUnique({
      where: {
        userId_packageId: {
          userId: session.user.id,
          packageId,
        },
      },
    });

    if (existing) {
      await prisma.wishlist.delete({
        where: { userId_packageId: { userId: session.user.id, packageId } },
      });
      return NextResponse.json({ wishlisted: false });
    }

    await prisma.wishlist.create({
      data: { userId: session.user.id, packageId },
    });

    return NextResponse.json({ wishlisted: true }, { status: 201 });
  } catch (_error) {
    return NextResponse.json(
      { error: 'Failed to toggle wishlist' },
      { status: 500 },
    );
  }
}
