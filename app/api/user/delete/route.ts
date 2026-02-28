// app/api/user/delete/route.ts

import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { DeleteImage } from '@/cloudinary';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function DELETE() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    // Fetch imageId before deletion so we can clean up Cloudinary
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { imageId: true },
    });

    // Delete avatar from Cloudinary — non-fatal
    if (user?.imageId) {
      try {
        await DeleteImage(user.imageId);
      } catch {
        // biome-ignore lint/suspicious/noConsole: this is fine
        console.warn('Could not delete avatar from Cloudinary:', user.imageId);
      }
    }

    // Delete the user — Prisma cascade handles sessions, accounts,
    // bookings, booking members, and reviews automatically
    await prisma.user.delete({ where: { id: userId } });

    return NextResponse.json({ success: true });
  } catch (_error) {
    return NextResponse.json(
      { error: 'Failed to delete account' },
      { status: 500 },
    );
  }
}
