import { headers } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { slug } = await req.json();
    if (!slug)
      return NextResponse.json({ error: 'slug is required' }, { status: 400 });

    // Resolve slug → packageId (slug is @unique so findUnique is fine here)
    const pkg = await prisma.package.findUnique({
      where: { slug },
      select: { id: true },
    });
    if (!pkg)
      return NextResponse.json({ error: 'Package not found' }, { status: 404 });

    const userId = session.user.id;
    const packageId = pkg.id;

    const existing = await prisma.wishlist.findUnique({
      where: { userId_packageId: { userId, packageId } },
      select: { id: true },
    });

    if (existing) {
      await prisma.wishlist.delete({
        where: { userId_packageId: { userId, packageId } },
      });
      return NextResponse.json({ wishlisted: false });
    }

    await prisma.wishlist.create({
      data: { userId, packageId },
    });
    return NextResponse.json({ wishlisted: true }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: 'Failed to toggle wishlist' },
      { status: 500 },
    );
  }
}
