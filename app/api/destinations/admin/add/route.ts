import { headers } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { UploadImage } from '@/cloudinary';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// 1. Define a schema to validate the incoming data
const schema = z.object({
  name: z.string().min(2),
  division: z.string().min(1),
  summary: z.string().min(20),
  tags: z.array(z.string()).default([]),
});

export async function POST(req: NextRequest) {
  try {
    // 2. Auth Check
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();

    // 3. Extract and Parse Tags Safely
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

    // 4. Validate Data with Zod
    const validation = schema.safeParse({
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

    const coverImage = formData.get('coverImage') as Blob | null;
    if (!coverImage) {
      return NextResponse.json(
        { error: 'Cover image is required' },
        { status: 400 },
      );
    }

    // 5. Upload Image
    const imageUrl = await UploadImage(coverImage, 'destinations');

    // 6. Create Record
    const { name, division, summary, tags } = validation.data;
    const destination = await prisma.destination.create({
      data: {
        name,
        division,
        summary,
        tags,
        image: imageUrl.secure_url,
        imageId: imageUrl.public_id,
      },
    });

    return NextResponse.json(
      { message: 'Destination added successfully!', id: destination.id },
      { status: 201 },
    );
  } catch (_error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
