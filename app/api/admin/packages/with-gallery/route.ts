import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { isAdmin } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!isAdmin(session)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Fetch all packages and include their gallery images
    const packagesWithGalleries = await prisma.package.findMany({
      include: {
        gallery: true, // Include the gallery relation
      },
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(packagesWithGalleries);
  } catch (_error) {
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
