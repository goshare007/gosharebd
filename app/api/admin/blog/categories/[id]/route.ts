import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { isAdmin } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';
import { toSlug } from '@/lib/slugify';

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
    const { name, slug, description } = body;

    if (!name || typeof name !== 'string') {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const existing = await prisma.blogCategory.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 },
      );
    }

    const updateData: {
      name: string;
      slug: string;
      description: string | null;
    } = {
      name: name.trim(),
      slug: slug && typeof slug === 'string' ? toSlug(slug) : toSlug(name),
      description: description?.trim() || null,
    };

    const duplicate = await prisma.blogCategory.findFirst({
      where: {
        OR: [
          { name: updateData.name, NOT: { id } },
          { slug: updateData.slug, NOT: { id } },
        ],
      },
    });

    if (duplicate) {
      return NextResponse.json(
        { error: 'Category with this name or slug already exists' },
        { status: 400 },
      );
    }

    const category = await prisma.blogCategory.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(category);
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

    const existing = await prisma.blogCategory.findUnique({
      where: { id },
      include: { _count: { select: { posts: true } } },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 },
      );
    }

    if (existing._count.posts > 0) {
      return NextResponse.json(
        { error: 'Cannot delete category with existing posts' },
        { status: 400 },
      );
    }

    await prisma.blogCategory.delete({ where: { id } });

    return new NextResponse(null, { status: 204 });
  } catch (_error) {
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
