import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { DeleteImage } from '@/cloudinary';
import { auth } from '@/lib/auth';
import { isAdmin } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';
import { toSlug } from '@/lib/slugify';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!isAdmin(session)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const post = await prisma.blogPost.findUnique({
      where: { id },
      include: {
        category: true,
        author: { select: { id: true, name: true, image: true } },
        images: true,
      },
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (_error) {
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!isAdmin(session)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const existing = await prisma.blogPost.findUnique({
      where: { id },
      include: { images: true },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const {
      title,
      slug,
      excerpt,
      content,
      coverImage,
      coverImageId,
      categoryId,
      tags,
      status,
      featured,
      metaTitle,
      metaDescription,
    } = body;

    const isPublishing =
      status === 'PUBLISHED' &&
      existing.status !== 'PUBLISHED' &&
      !existing.publishedAt;

    const slugToUse =
      slug && typeof slug === 'string' ? toSlug(slug) : existing.slug;

    const duplicateSlug = await prisma.blogPost.findFirst({
      where: { slug: slugToUse, NOT: { id } },
    });

    if (duplicateSlug) {
      return NextResponse.json(
        { error: 'Slug already exists' },
        { status: 400 },
      );
    }

    const updateData: Record<string, unknown> = {};

    if (title) updateData.title = title;
    if (slug) updateData.slug = slugToUse;
    if (excerpt) updateData.excerpt = excerpt;
    if (content) updateData.content = content;
    if (coverImage) updateData.coverImage = coverImage;
    if (coverImageId) updateData.coverImageId = coverImageId;
    if (categoryId) updateData.categoryId = categoryId;
    if (tags) updateData.tags = tags;
    if (status) updateData.status = status;
    if (featured !== undefined) updateData.featured = featured;
    if (metaTitle !== undefined) updateData.metaTitle = metaTitle;
    if (metaDescription !== undefined)
      updateData.metaDescription = metaDescription;

    if (isPublishing) {
      updateData.publishedAt = new Date();
    }

    const post = await prisma.blogPost.update({
      where: { id },
      data: updateData,
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

    return NextResponse.json(post);
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!isAdmin(session)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const existing = await prisma.blogPost.findUnique({
      where: { id },
      include: { images: true },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    for (const image of existing.images) {
      await DeleteImage(image.publicId);
    }

    if (existing.coverImageId) {
      await DeleteImage(existing.coverImageId);
    }

    await prisma.blogPost.delete({ where: { id } });

    return new NextResponse(null, { status: 204 });
  } catch (_error) {
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
