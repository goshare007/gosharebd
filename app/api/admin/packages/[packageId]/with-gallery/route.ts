import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { isAdmin } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ packageId: string }> },
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!isAdmin(session)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { packageId } = await params;

    const pkg = await prisma.package.findUnique({
      where: { id: packageId },
      include: {
        gallery: true,
      },
    });

    if (!pkg) {
      return NextResponse.json({ error: 'Package not found' }, { status: 404 });
    }

    return NextResponse.json(pkg);
  } catch (_error) {
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
