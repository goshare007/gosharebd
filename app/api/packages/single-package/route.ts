import { headers } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';
import { DeleteImage, UploadImage } from '@/cloudinary';
import { auth } from '@/lib/auth';
import { isAdmin } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';
import type {
  Division,
  PackageType,
} from '@/prisma/generated/prisma/client/enums';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');
    if (!slug) {
      return NextResponse.json({ error: 'Missing slug' }, { status: 400 });
    }
    const pkg = await prisma.package.findUnique({
      where: { slug },
      include: {
        gallery: {
          select: {
            id: true,
            url: true,
            publicId: true,
          },
        },
        itinerary: { orderBy: { order: 'asc' } },
      },
    });
    if (!pkg) {
      return NextResponse.json({ error: 'Package not found' }, { status: 404 });
    }
    return NextResponse.json(pkg);
  } catch (_error) {
    return NextResponse.json(
      { error: 'Failed to fetch package' },
      { status: 500 },
    );
  }
}

// ─── PATCH ────────────────────────────────────────────────────────────────────
export async function PATCH(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const packageId = searchParams.get('packageId');
    if (!packageId) {
      return NextResponse.json({ error: 'Missing packageId' }, { status: 400 });
    }

    // ── Auth ─────────────────────────────────────────────────────────────────
    const session = await auth.api.getSession({ headers: await headers() });
    if (!isAdmin(session)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // ── Verify package exists ────────────────────────────────────────────────
    const existing = await prisma.package.findUnique({
      where: { slug: packageId },
      include: { gallery: true },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Package not found' }, { status: 404 });
    }

    // ── Parse FormData ───────────────────────────────────────────────────────
    const formData = await req.formData();

    const name = formData.get('name') as string | null;
    const slug = formData.get('slug') as string | null;
    const packageType = formData.get('packageType') as PackageType;
    const division = formData.get('division') as Division;
    const summary = formData.get('summary') as string | null;
    const location = formData.get('location') as string | null;
    const durationDaysRaw = formData.get('durationDays') as string | null;
    const minGroupSizeRaw = formData.get('minGroupSize') as string | null;
    const maxGroupSizeRaw = formData.get('maxGroupSize') as string | null;
    const pricePerPersonRaw = formData.get('pricePerPerson') as string | null;
    const originalPriceRaw = formData.get('originalPrice') as string | null;
    const isCoupleRaw = formData.get('isCouple') as string | null;
    const couplePriceRaw = formData.get('couplePrice') as string | null;
    const originalCouplePriceRaw = formData.get('originalCouplePrice') as
      | string
      | null;
    const coverImageFile = formData.get('coverImage') as File | null;
    const keepCoverImage = formData.get('keepCoverImage') === 'true';
    const tagsRaw = formData.get('tags') as string | null;
    const highlightsRaw = formData.get('highlights') as string | null;
    const includesRaw = formData.get('includes') as string | null;
    const excludesRaw = formData.get('excludes') as string | null;
    const itineraryRaw = formData.get('itinerary') as string | null;
    const cancellationPolicy = formData.get('cancellationPolicy') as
      | string
      | null;
    const weatherPolicy = formData.get('weatherPolicy') as string | null;
    const ageRestriction = formData.get('ageRestriction') as string | null;
    const isBestsellerRaw = formData.get('isBestseller') as string | null;
    const isActiveRaw = formData.get('isActive') as string | null;

    // ── Required field validation ────────────────────────────────────────────
    if (
      !slug ||
      !division ||
      !name ||
      !summary ||
      !location ||
      !durationDaysRaw ||
      !minGroupSizeRaw ||
      !maxGroupSizeRaw ||
      !pricePerPersonRaw ||
      !itineraryRaw ||
      !packageType ||
      (!coverImageFile && !keepCoverImage)
    ) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      );
    }

    // ── Parse primitives ─────────────────────────────────────────────────────
    const durationDays = parseInt(durationDaysRaw, 10);
    const minGroupSize = parseInt(minGroupSizeRaw, 10);
    const maxGroupSize = parseInt(maxGroupSizeRaw, 10);
    const pricePerPerson = parseFloat(pricePerPersonRaw);
    const originalPrice = originalPriceRaw
      ? parseFloat(originalPriceRaw)
      : null;
    const isCouple = isCoupleRaw === 'true';
    const couplePrice = couplePriceRaw ? parseFloat(couplePriceRaw) : null;
    const originalCouplePrice = originalCouplePriceRaw
      ? parseFloat(originalCouplePriceRaw)
      : null;
    const isBestseller = isBestsellerRaw === 'true';
    const isActive = isActiveRaw !== 'false';

    // ── Parse JSON arrays ────────────────────────────────────────────────────
    let tags: string[] = [];
    let highlights: string[] = [];
    let includes: string[] = [];
    let excludes: string[] = [];
    const removedGalleryIds: string[] = [];
    let itinerary: {
      time: string;
      title: string;
      description: string;
      order: number;
    }[] = [];

    try {
      if (tagsRaw) tags = JSON.parse(tagsRaw);
      if (highlightsRaw) highlights = JSON.parse(highlightsRaw);
      if (includesRaw) includes = JSON.parse(includesRaw);
      if (excludesRaw) excludes = JSON.parse(excludesRaw);
      itinerary = JSON.parse(itineraryRaw);
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON in array fields' },
        { status: 400 },
      );
    }

    const [coverResult] = await Promise.all([
      // 1. New cover upload (or null if keeping existing)
      coverImageFile && !keepCoverImage
        ? UploadImage(coverImageFile, 'packages/covers')
        : Promise.resolve(null),

      // 3. Delete old cover (fire-and-forget style via allSettled — don't let
      //    a CDN miss block the whole update)
      coverImageFile && !keepCoverImage
        ? // biome-ignore lint/suspicious/noConsole: this is fine
          DeleteImage(existing.coverImageId).catch(console.error)
        : Promise.resolve(null),
    ]);

    // Resolve final cover values
    const coverImage = coverResult
      ? coverResult.secure_url
      : existing.coverImage;
    const coverImageId = coverResult
      ? coverResult.public_id
      : existing.coverImageId;

    // ── DB update in a transaction ────────────────────────────────────────────
    // Using $transaction so itinerary delete+create and gallery deletes are atomic.
    const updatedPackage = await prisma.$transaction(async (tx) => {
      // Remove gallery DB records for deleted images
      if (removedGalleryIds.length > 0) {
        await tx.galleryImage.deleteMany({
          where: { id: { in: removedGalleryIds } },
        });
      }

      return tx.package.update({
        where: { slug: packageId },
        data: {
          name,
          summary,
          location,
          slug,
          packageType,
          division,
          durationDays,
          minGroupSize,
          maxGroupSize,
          pricePerPerson,
          originalPrice,
          isCouple,
          couplePrice,
          originalCouplePrice,
          coverImage,
          coverImageId,
          tags,
          highlights,
          includes,
          excludes,
          cancellationPolicy: cancellationPolicy || null,
          weatherPolicy: weatherPolicy || null,
          ageRestriction: ageRestriction || null,
          isBestseller,
          isActive,
          // Replace all itinerary items — avoids complex diffing
          itinerary: {
            deleteMany: {},
            create: itinerary.map((item) => ({
              time: item.time,
              title: item.title,
              description: item.description,
              order: item.order,
            })),
          },
        },
        include: {
          itinerary: { orderBy: { order: 'asc' } },
          gallery: true,
        },
      });
    });

    return NextResponse.json(updatedPackage, { status: 200 });
  } catch (_error) {
    return NextResponse.json(
      { error: 'Failed to update package' },
      { status: 500 },
    );
  }
}

// ─── DELETE ───────────────────────────────────────────────────────────────────
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const packageId = searchParams.get('packageId');
    if (!packageId) {
      return NextResponse.json({ error: 'Missing packageId' }, { status: 400 });
    }

    const existing = await prisma.package.findUnique({
      where: { id: packageId },
      include: { gallery: true },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Package not found' }, { status: 404 });
    }

    await Promise.allSettled([
      DeleteImage(existing.coverImageId),
      ...existing.gallery.map((img) => DeleteImage(img.publicId)),
    ]);

    await prisma.package.delete({ where: { id: packageId } });

    return NextResponse.json({ message: 'Package deleted successfully' });
  } catch (_error) {
    return NextResponse.json(
      { error: 'Failed to delete package' },
      { status: 500 },
    );
  }
}
