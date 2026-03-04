import { headers } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return NextResponse.json({ wishlisted: false });

    const slug = req.nextUrl.searchParams.get('slug');
    if (!slug)
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });

    const wishlist = await prisma.wishlist.findFirst({
      where: {
        userId: session.user.id,
        package: { slug },
      },
      select: { id: true },
    });

    return NextResponse.json({ wishlisted: !!wishlist });
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch wishlist' },
      { status: 500 },
    );
  }
}
