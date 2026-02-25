import { headers } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { DeleteImage, UploadImage } from '@/cloudinary';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const schema = z.object({
  id: z.string().min(1),
  name: z.string().min(2),
  division: z.string().min(1),
  summary: z.string().min(20),
  tags: z.array(z.string()).default([]),
});

export async function PUT(req: NextRequest) {
  try {
    // 1. Auth check
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();

    // 2. Parse tags
    const rawTags = formData.get('tags') as string;
    let parsedTags: string[] = [];
    if (rawTags) {
      try {
        parsedTags = JSON.parse(rawTags);
      } catch (_e) {
        return NextResponse.json(
          { error: 'Invalid tags format' },
          { status: 400 },
        );
      }
    }

    // 3. Validate
    const validation = schema.safeParse({
      id: formData.get('id'),
      name: formData.get('name'),
      division: formData.get('division'),
      summary: formData.get('summary'),
      tags: parsedTags,
    });
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.format() },
        { status: 400 },
      );
    }

    const { id, name, division, summary, tags } = validation.data;

    // 4. Check destination exists
    const existing = await prisma.destination.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: 'Destination not found' },
        { status: 404 },
      );
    }

    // 5. Handle image — optional on edit
    let imageUrl = existing.image;
    let imageId = existing.imageId;

    const coverImage = formData.get('coverImage') as Blob | null;
    if (coverImage) {
      // Delete the old image from Cloudinary before uploading the new one
      if (existing.imageId) {
        await DeleteImage(existing.imageId);
      }
      const uploaded = await UploadImage(coverImage, 'destinations');
      imageUrl = uploaded.secure_url;
      imageId = uploaded.public_id;
    }

    // 6. Update record
    const destination = await prisma.destination.update({
      where: { id },
      data: { name, division, summary, tags, image: imageUrl, imageId },
    });

    return NextResponse.json(
      { message: 'Destination updated successfully!', id: destination.id },
      { status: 200 },
    );
  } catch (_error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
