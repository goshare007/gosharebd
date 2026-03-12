import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const revalidate = 60;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const category = searchParams.get('category');
    const tag = searchParams.get('tag');

    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {
      status: 'PUBLISHED',
    };

    if (category) {
      where.category = { slug: category };
    }

    if (tag) {
      where.tags = { has: tag };
    }

    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        skip,
        take: limit,
        orderBy: { publishedAt: 'desc' },
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          coverImage: true,
          publishedAt: true,
          category: { select: { name: true } },
          author: { select: { name: true, image: true } },
        },
      }),
      prisma.blogPost.count({ where }),
    ]);

    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (_error) {
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
