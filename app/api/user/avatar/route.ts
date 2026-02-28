// app/api/user/avatar/route.ts

import { headers } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';
import { DeleteImage, UploadImage } from '@/cloudinary';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('image') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Image must be under 2MB' },
        { status: 400 },
      );
    }

    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type)) {
      return NextResponse.json(
        { error: 'Only JPG, PNG, and WEBP are allowed' },
        { status: 400 },
      );
    }

    // Fetch current imageId to delete the old avatar from Cloudinary
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { imageId: true },
    });

    // Delete previous image — non-fatal if it fails
    if (user?.imageId) {
      try {
        await DeleteImage(user.imageId);
      } catch {
        // biome-ignore lint/suspicious/noConsole: this is fine
        console.warn('Could not delete old avatar:', user.imageId);
      }
    }

    // Upload new image
    const { secure_url, public_id } = await UploadImage(file, 'avatars');

    // Save both URL and public_id to the user record
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        image: secure_url,
        imageId: public_id,
      },
    });

    // Sync into better-auth session so useSession() updates on the client
    await auth.api.updateUser({
      headers: await headers(),
      body: { image: secure_url },
    });

    return NextResponse.json({ image: secure_url, imageId: public_id });
  } catch (_error) {
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 },
    );
  }
}
