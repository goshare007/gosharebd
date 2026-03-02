import { headers } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return NextResponse.json({ wishlisted: false });

    const packageId = req.nextUrl.searchParams.get('packageId');
    if (!packageId)
      return NextResponse.json(
        { error: 'packageId is required' },
        { status: 400 },
      );

    const wishlist = await prisma.wishlist.findUnique({
      where: { userId_packageId: { userId: session.user.id, packageId } },
    });

    return NextResponse.json({ wishlisted: !!wishlist });
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch wishlist' },
      { status: 500 },
    );
  }
}
