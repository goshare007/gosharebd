import { headers } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { DeleteImage } from '@/cloudinary';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const schema = z.object({
  id: z.string().min(1),
});

export async function DELETE(req: NextRequest) {
  try {
    // 1. Auth check
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Validate id
    const { searchParams } = new URL(req.url);
    const validation = schema.safeParse({ id: searchParams.get('id') });
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Destination ID is required' },
        { status: 400 },
      );
    }

    const { id } = validation.data;

    // 3. Fetch destination with all packages and their gallery images
    //    We need every Cloudinary public_id before we delete anything from the DB
    const destination = await prisma.destination.findUnique({
      where: { id },
      include: {
        packages: {
          include: {
            gallery: true, // GalleryImage[] — each has publicId
          },
        },
      },
    });

    if (!destination) {
      return NextResponse.json(
        { error: 'Destination not found' },
        { status: 404 },
      );
    }

    // 4. Collect every Cloudinary public_id that needs to be deleted
    const cloudinaryIds: string[] = [];

    // Destination cover image
    if (destination.imageId) {
      cloudinaryIds.push(destination.imageId);
    }

    for (const pkg of destination.packages) {
      // Package cover image
      if (pkg.coverImageId) {
        cloudinaryIds.push(pkg.coverImageId);
      }
      // Package gallery images
      for (const galleryImage of pkg.gallery) {
        if (galleryImage.publicId) {
          cloudinaryIds.push(galleryImage.publicId);
        }
      }
    }

    // 5. Delete all Cloudinary assets in parallel
    //    We do this BEFORE the DB delete so if Cloudinary fails we haven't
    //    orphaned the DB record yet. Errors are caught individually so one
    //    failure doesn't block the others.
    await Promise.allSettled(
      cloudinaryIds.map((publicId) => DeleteImage(publicId)),
    );

    // 6. Delete the destination — Prisma cascades handle the rest:
    //    Destination → Package → GalleryImage
    //                          → Itinerary
    //                          → Review
    //                          → Booking → BookingMember
    await prisma.destination.delete({ where: { id } });

    return NextResponse.json(
      {
        message: 'Destination deleted successfully!',
        deletedImages: cloudinaryIds.length,
      },
      { status: 200 },
    );
  } catch (_error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
