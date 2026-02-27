// app/api/admin/packages/[id]/departures/route.ts

import { addDays } from 'date-fns';
import { headers } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import { isAdmin } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';

// ─── validation ───────────────────────────────────────────────────────────────

const createSingleSchema = z.object({
  mode: z.literal('single'),
  startDate: z.string().datetime(),
  totalSeats: z.number().int().min(1),
  isGuaranteed: z.boolean().default(false),
  note: z.string().optional(),
  pricePerPerson: z.number().positive().optional().nullable(),
  originalPrice: z.number().positive().optional().nullable(),
  couplePrice: z.number().positive().optional().nullable(),
  originalCouplePrice: z.number().positive().optional().nullable(),
});

const createBulkSchema = z.object({
  mode: z.literal('bulk'),
  // Days of week: 0=Sun, 1=Mon … 6=Sat
  recurringDays: z.array(z.number().int().min(0).max(6)).min(1),
  rangeStart: z.string().datetime(),
  rangeEnd: z.string().datetime(),
  totalSeats: z.number().int().min(1),
  isGuaranteed: z.boolean().default(false),
  note: z.string().optional(),
  pricePerPerson: z.number().positive().optional().nullable(),
  originalPrice: z.number().positive().optional().nullable(),
  couplePrice: z.number().positive().optional().nullable(),
  originalCouplePrice: z.number().positive().optional().nullable(),
});

const createSchema = z.discriminatedUnion('mode', [
  createSingleSchema,
  createBulkSchema,
]);

// ─── GET — list all departures for a package ──────────────────────────────────

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!isAdmin(session)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: packageId } = await params;

    const pkg = await prisma.package.findUnique({
      where: { id: packageId },
      select: { id: true, name: true, durationDays: true },
    });

    if (!pkg) {
      return NextResponse.json({ error: 'Package not found' }, { status: 404 });
    }

    const departures = await prisma.departure.findMany({
      where: { packageId },
      orderBy: { startDate: 'asc' },
      include: {
        _count: { select: { bookings: true } },
      },
    });

    return NextResponse.json({ package: pkg, departures });
  } catch (_error) {
    return NextResponse.json(
      { error: 'Failed to fetch departures' },
      { status: 500 },
    );
  }
}

// ─── POST — create single or bulk departures ──────────────────────────────────

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!isAdmin(session)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: packageId } = await params;

    const pkg = await prisma.package.findUnique({
      where: { id: packageId },
      select: { id: true, durationDays: true },
    });

    if (!pkg) {
      return NextResponse.json({ error: 'Package not found' }, { status: 404 });
    }

    const body = await req.json();
    const parsed = createSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', issues: parsed.error.issues },
        { status: 400 },
      );
    }

    const data = parsed.data;

    const pricingFields = {
      pricePerPerson: data.pricePerPerson ?? null,
      originalPrice: data.originalPrice ?? null,
      couplePrice: data.couplePrice ?? null,
      originalCouplePrice: data.originalCouplePrice ?? null,
    };

    // ── Single departure ──────────────────────────────────────────────────────
    if (data.mode === 'single') {
      const startDate = new Date(data.startDate);
      const endDate = addDays(startDate, pkg.durationDays - 1);

      const departure = await prisma.departure.create({
        data: {
          packageId,
          startDate,
          endDate,
          totalSeats: data.totalSeats,
          isGuaranteed: data.isGuaranteed,
          note: data.note ?? null,
          ...pricingFields,
        },
      });

      return NextResponse.json({ departure }, { status: 201 });
    }

    // ── Bulk departures ───────────────────────────────────────────────────────
    const rangeStart = new Date(data.rangeStart);
    const rangeEnd = new Date(data.rangeEnd);

    if (rangeStart >= rangeEnd) {
      return NextResponse.json(
        { error: 'rangeStart must be before rangeEnd' },
        { status: 400 },
      );
    }

    // Collect all dates in range that match the selected weekdays
    const departureDates: Date[] = [];
    const cursor = new Date(rangeStart);

    while (cursor <= rangeEnd) {
      if (data.recurringDays.includes(cursor.getDay())) {
        departureDates.push(new Date(cursor));
      }
      cursor.setDate(cursor.getDate() + 1);
    }

    if (departureDates.length === 0) {
      return NextResponse.json(
        { error: 'No dates match the selected weekdays in this range' },
        { status: 400 },
      );
    }

    const created = await prisma.departure.createMany({
      data: departureDates.map((startDate) => ({
        packageId,
        startDate,
        endDate: addDays(startDate, pkg.durationDays - 1),
        totalSeats: data.totalSeats,
        isGuaranteed: data.isGuaranteed,
        note: data.note ?? null,
        ...pricingFields,
      })),
      skipDuplicates: true,
    });

    return NextResponse.json(
      { count: created.count, message: `${created.count} departures created` },
      { status: 201 },
    );
  } catch (_error) {
    return NextResponse.json(
      { error: 'Failed to create departures' },
      { status: 500 },
    );
  }
}
