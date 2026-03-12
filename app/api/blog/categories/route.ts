import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const revalidate = 300;

export async function GET() {
  try {
    const categories = await prisma.blogCategory.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        _count: { select: { posts: { where: { status: 'PUBLISHED' } } } },
      },
      orderBy: { name: 'asc' },
    });

    const result = categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      postCount: cat._count.posts,
    }));

    return NextResponse.json(result);
  } catch (_error) {
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
