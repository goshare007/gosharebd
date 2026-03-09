import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { UploadImage } from '@/cloudinary';
import { auth } from '@/lib/auth';
import { isAdmin } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!isAdmin(session)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('image') as File | null;
    const postId = formData.get('postId') as string | null;

    if (!file || !file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Image file is required' },
        { status: 400 },
      );
    }

    const { secure_url, public_id } = await UploadImage(file, 'blog');

    const blogImage = await prisma.blogImage.create({
      data: {
        url: secure_url,
        publicId: public_id,
        postId: postId || '',
      },
    });

    return NextResponse.json({
      url: blogImage.url,
      publicId: blogImage.publicId,
    });
  } catch (_error) {
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
