import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;

    const post = await prisma.blogPost.findUnique({
      where: { slug, status: 'PUBLISHED' },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        author: { select: { id: true, name: true, image: true } },
      },
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    await prisma.$executeRaw`
      UPDATE blog_post SET "viewCount" = "viewCount" + 1 WHERE id = ${post.id}
    `;

    return NextResponse.json(post);
  } catch (_error) {
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
