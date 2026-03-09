import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { isAdmin } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';
import { toSlug } from '@/lib/slugify';

export async function GET(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!isAdmin(session)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') as
      | 'DRAFT'
      | 'PUBLISHED'
      | 'ARCHIVED'
      | null;

    const where: Record<string, unknown> = {};
    if (status) {
      where.status = status;
    }

    const posts = await prisma.blogPost.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        author: { select: { id: true, name: true, image: true } },
        _count: { select: { comments: true, images: true } },
      },
    });

    return NextResponse.json(posts);
  } catch (_error) {
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!isAdmin(session)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'User not found' }, { status: 400 });
    }

    const body = await request.json();

    const {
      title,
      slug,
      excerpt,
      content,
      coverImage,
      coverImageId,
      metaImage,
      metaImageId,
      categoryId,
      tags,
      status,
      featured,
      metaTitle,
      metaDescription,
    } = body;

    if (!title || typeof title !== 'string') {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    if (!categoryId || typeof categoryId !== 'string') {
      return NextResponse.json(
        { error: 'Category is required' },
        { status: 400 },
      );
    }

    const slugToUse =
      slug && typeof slug === 'string' ? toSlug(slug) : toSlug(title);

    const existingSlug = await prisma.blogPost.findUnique({
      where: { slug: slugToUse },
    });

    if (existingSlug) {
      return NextResponse.json(
        { error: 'Slug already exists' },
        { status: 400 },
      );
    }

    const isPublishing = status === 'PUBLISHED';

    const post = await prisma.blogPost.create({
      data: {
        title: title.trim(),
        slug: slugToUse,
        excerpt: excerpt?.trim() || '',
        content: content || '',
        coverImage: coverImage || '',
        coverImageId: coverImageId || '',
        metaImage: metaImage || null,
        metaImageId: metaImageId || null,
        categoryId,
        tags: tags || [],
        status: status || 'DRAFT',
        featured: featured || false,
        metaTitle: metaTitle || null,
        metaDescription: metaDescription || null,
        authorId: session.user.id,
        publishedAt: isPublishing ? new Date() : null,
      },
    });

    if (post.id) {
      await prisma.blogImage.updateMany({
        where: {
          postId: '',
          createdAt: { lt: new Date(Date.now() - 30 * 60 * 1000) },
        },
        data: { postId: post.id },
      });
    }

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
