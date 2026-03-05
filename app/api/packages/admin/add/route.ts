import { headers } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';
import { UploadImage } from '@/cloudinary';
import { auth } from '@/lib/auth';
import { isAdmin } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';
import type { Division } from '@/prisma/generated/prisma/client/enums';

const VALID_DIVISIONS: Division[] = [
  'DHAKA',
  'CHITTAGONG',
  'SYLHET',
  'RAJSHAHI',
  'KHULNA',
  'BARISAL',
  'RANGPUR',
  'MYMENSINGH',
];

export async function POST(req: NextRequest) {
  try {
    // ── Auth ──────────────────────────────────────────────────────────────
    const session = await auth.api.getSession({ headers: await headers() });
    if (!isAdmin(session)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // ── Parse FormData ────────────────────────────────────────────────────
    const formData = await req.formData();
    const name = formData.get('name') as string | null;
    const summary = formData.get('summary') as string | null;
    const division = formData.get('division') as string | null;
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
    const slug = formData.get('slug') as string | null;

    // ── Required field validation ─────────────────────────────────────────
    if (
      !name ||
      !summary ||
      !division ||
      !location ||
      !durationDaysRaw ||
      !minGroupSizeRaw ||
      !maxGroupSizeRaw ||
      !pricePerPersonRaw ||
      !coverImageFile ||
      !itineraryRaw ||
      !slug
    ) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      );
    }

    // ── Validate division enum ────────────────────────────────────────────
    if (!VALID_DIVISIONS.includes(division as Division)) {
      return NextResponse.json(
        {
          error: `Invalid division. Must be one of: ${VALID_DIVISIONS.join(', ')}`,
        },
        { status: 400 },
      );
    }

    // ── Parse primitives ──────────────────────────────────────────────────
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

    // ── Parse JSON arrays ─────────────────────────────────────────────────
    let tags: string[] = [];
    let highlights: string[] = [];
    let includes: string[] = [];
    let excludes: string[] = [];
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

    // ── Upload cover image ────────────────────────────────────────────────
    const cover = await UploadImage(coverImageFile, 'packages/covers');

    // ── Create package with nested writes ─────────────────────────────────
    const newPackage = await prisma.package.create({
      data: {
        name,
        slug,
        summary,
        division: division as Division,
        location,
        durationDays,
        minGroupSize,
        maxGroupSize,
        pricePerPerson,
        originalPrice,
        isCouple,
        couplePrice,
        originalCouplePrice,
        coverImage: cover.secure_url,
        coverImageId: cover.public_id,
        tags,
        highlights,
        includes,
        excludes,
        cancellationPolicy: cancellationPolicy || null,
        weatherPolicy: weatherPolicy || null,
        ageRestriction: ageRestriction || null,
        isBestseller,
        isActive,
        itinerary: {
          create: itinerary.map((item) => ({
            time: item.time,
            title: item.title,
            description: item.description,
            order: item.order,
          })),
        },
      },
      include: {
        itinerary: true,
      },
    });

    return NextResponse.json(newPackage, { status: 200 });
  } catch (_error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
