import { type NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('slug');

  if (!slug || slug.trim().length === 0) {
    return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
  }

  const existing = await prisma.package.findUnique({
    where: { slug },
    select: { id: true },
  });

  return NextResponse.json({ available: !existing });
}
