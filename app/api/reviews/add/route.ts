import { headers } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';
import { UploadImage } from '@/cloudinary';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();

    const packageId = formData.get('packageId') as string;
    const rating = parseInt(formData.get('rating') as string, 10);
    const comment = formData.get('comment') as string;
    const imageFiles = (formData.getAll('images') as File[]).filter(
      (file) => file && file.size > 0,
    );

    if (!packageId || !rating || !comment) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 },
      );
    }

    const pkg = await prisma.package.findUnique({
      where: { id: packageId },
    });

    if (!pkg) {
      return NextResponse.json({ error: 'Package not found' }, { status: 404 });
    }

    const existingReview = await prisma.review.findUnique({
      where: {
        userId_packageId: {
          userId: session.user.id,
          packageId,
        },
      },
    });

    if (existingReview) {
      return NextResponse.json(
        { error: 'You have already reviewed this package' },
        { status: 400 },
      );
    }

    const verifiedBooking = await prisma.booking.findFirst({
      where: {
        userId: session.user.id,
        packageId,
        status: 'CONFIRMED',
      },
      orderBy: { createdAt: 'desc' },
    });

    const uploadedImages: { url: string; publicId: string }[] = [];
    if (imageFiles.length > 0) {
      const uploadPromises = imageFiles.map((file) =>
        UploadImage(file, 'reviews'),
      );
      const results = await Promise.all(uploadPromises);
      uploadedImages.push(
        ...results.map((r) => ({
          url: r.secure_url,
          publicId: r.public_id,
        })),
      );
    }

    const review = await prisma.review.create({
      data: {
        packageId,
        userId: session.user.id,
        name: session.user.name || 'Anonymous',
        avatar: session.user.image,
        rating,
        comment,
        approved: false,
        isVerified: !!verifiedBooking,
        bookingId: verifiedBooking?.id,
        images: {
          create: uploadedImages,
        },
      },
      include: {
        images: true,
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    // biome-ignore lint/suspicious/noConsole: needed for debugging
    console.error('Review creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 },
    );
  }
}
