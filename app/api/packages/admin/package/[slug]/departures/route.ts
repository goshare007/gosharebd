// app/api/admin/packages/[slug]/departures/route.ts

import { addDays } from 'date-fns';
import { headers } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import { isAdmin } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';

type RouteContext = { params: Promise<{ slug: string }> };

// ─── validation ───────────────────────────────────────────────────────────────

const pricingFields = {
  pricePerPerson: z.number().positive().optional().nullable(),
  originalPrice: z.number().positive().optional().nullable(),
  couplePrice: z.number().positive().optional().nullable(),
  originalCouplePrice: z.number().positive().optional().nullable(),
};

const createSingleSchema = z.object({
  mode: z.literal('single'),
  startDate: z.string().datetime(),
  totalSeats: z.number().int().min(1),
  isGuaranteed: z.boolean().default(false),
  note: z.string().optional(),
  ...pricingFields,
});

const createBulkSchema = z.object({
  mode: z.literal('bulk'),
  recurringDays: z.array(z.number().int().min(0).max(6)).min(1),
  rangeStart: z.string().datetime(),
  rangeEnd: z.string().datetime(),
  totalSeats: z.number().int().min(1),
  isGuaranteed: z.boolean().default(false),
  note: z.string().optional(),
  ...pricingFields,
});

const createSchema = z.discriminatedUnion('mode', [
  createSingleSchema,
  createBulkSchema,
]);

// ─── GET ──────────────────────────────────────────────────────────────────────

export async function GET(_req: NextRequest, { params }: RouteContext) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!isAdmin(session))
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { slug } = await params;

    const pkg = await prisma.package.findUnique({
      where: { slug },
      select: { id: true, name: true, durationDays: true, slug: true },
    });
    if (!pkg)
      return NextResponse.json({ error: 'Package not found' }, { status: 404 });

    const departures = await prisma.departure.findMany({
      where: { packageId: pkg.id }, // ← was incorrectly `id: pkg.id`
      orderBy: { startDate: 'asc' },
      include: { _count: { select: { bookings: true } } },
    });

    return NextResponse.json({ package: pkg, departures });
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch departures' },
      { status: 500 },
    );
  }
}

// ─── POST ─────────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest, { params }: RouteContext) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!isAdmin(session))
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { slug } = await params; // ← was destructuring `id` from `[id]` params

    const pkg = await prisma.package.findUnique({
      where: { slug },
      select: { id: true, durationDays: true },
    });
    if (!pkg)
      return NextResponse.json({ error: 'Package not found' }, { status: 404 });

    const parsed = createSchema.safeParse(await req.json());
    if (!parsed.success)
      return NextResponse.json(
        { error: 'Validation failed', issues: parsed.error.issues },
        { status: 400 },
      );

    const data = parsed.data;

    const pricing = {
      pricePerPerson: data.pricePerPerson ?? null,
      originalPrice: data.originalPrice ?? null,
      couplePrice: data.couplePrice ?? null,
      originalCouplePrice: data.originalCouplePrice ?? null,
    };

    const shared = {
      packageId: pkg.id,
      totalSeats: data.totalSeats,
      isGuaranteed: data.isGuaranteed,
      note: data.note ?? null,
      ...pricing,
    };

    // ── single ────────────────────────────────────────────────────────────────
    if (data.mode === 'single') {
      const startDate = new Date(data.startDate);
      const endDate = addDays(startDate, pkg.durationDays - 1);

      const departure = await prisma.departure.create({
        data: { ...shared, startDate, endDate },
        include: { _count: { select: { bookings: true } } },
      });

      return NextResponse.json({ departure }, { status: 201 });
    }

    // ── bulk ──────────────────────────────────────────────────────────────────
    const rangeStart = new Date(data.rangeStart);
    const rangeEnd = new Date(data.rangeEnd);

    if (rangeStart >= rangeEnd)
      return NextResponse.json(
        { error: 'rangeStart must be before rangeEnd' },
        { status: 400 },
      );

    const dates: Date[] = [];
    const cursor = new Date(rangeStart);
    while (cursor <= rangeEnd) {
      if (data.recurringDays.includes(cursor.getDay()))
        dates.push(new Date(cursor));
      cursor.setDate(cursor.getDate() + 1);
    }

    if (dates.length === 0)
      return NextResponse.json(
        { error: 'No dates match the selected weekdays in this range' },
        { status: 400 },
      );

    const created = await prisma.departure.createMany({
      data: dates.map((startDate) => ({
        ...shared,
        startDate,
        endDate: addDays(startDate, pkg.durationDays - 1),
      })),
      skipDuplicates: true,
    });

    return NextResponse.json(
      { count: created.count, message: `${created.count} departures created` },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      { error: 'Failed to create departures' },
      { status: 500 },
    );
  }
}
