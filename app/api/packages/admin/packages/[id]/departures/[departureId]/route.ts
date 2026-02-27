// app/api/admin/packages/[id]/departures/[departureId]/route.ts

import { addDays } from 'date-fns';
import { headers } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import { isAdmin } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';

const updateSchema = z.object({
  startDate: z.string().datetime().optional(),
  totalSeats: z.number().int().min(1).optional(),
  status: z.enum(['ACTIVE', 'FULL', 'CANCELLED', 'COMPLETED']).optional(),
  isGuaranteed: z.boolean().optional(),
  note: z.string().optional().nullable(),
  pricePerPerson: z.number().positive().optional().nullable(),
  originalPrice: z.number().positive().optional().nullable(),
  couplePrice: z.number().positive().optional().nullable(),
  originalCouplePrice: z.number().positive().optional().nullable(),
});

type RouteParams = { params: Promise<{ id: string; departureId: string }> };

// ─── PATCH — update a departure ───────────────────────────────────────────────

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!isAdmin(session)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: packageId, departureId } = await params;

    const existing = await prisma.departure.findFirst({
      where: { id: departureId, packageId },
      include: { package: { select: { durationDays: true } } },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Departure not found' },
        { status: 404 },
      );
    }

    const body = await req.json();
    const parsed = updateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', issues: parsed.error.issues },
        { status: 400 },
      );
    }

    const data = parsed.data;

    // Recalculate endDate if startDate changes
    const startDate = data.startDate ? new Date(data.startDate) : undefined;
    const endDate = startDate
      ? addDays(startDate, existing.package.durationDays - 1)
      : undefined;

    const updated = await prisma.departure.update({
      where: { id: departureId },
      data: {
        ...(startDate && { startDate, endDate }),
        ...(data.totalSeats !== undefined && { totalSeats: data.totalSeats }),
        ...(data.status !== undefined && { status: data.status }),
        ...(data.isGuaranteed !== undefined && {
          isGuaranteed: data.isGuaranteed,
        }),
        ...('note' in data && { note: data.note }),
        ...('pricePerPerson' in data && {
          pricePerPerson: data.pricePerPerson,
        }),
        ...('originalPrice' in data && { originalPrice: data.originalPrice }),
        ...('couplePrice' in data && { couplePrice: data.couplePrice }),
        ...('originalCouplePrice' in data && {
          originalCouplePrice: data.originalCouplePrice,
        }),
      },
    });

    return NextResponse.json({ departure: updated });
  } catch (_error) {
    return NextResponse.json(
      { error: 'Failed to update departure' },
      { status: 500 },
    );
  }
}

// ─── DELETE — delete a departure (only if no bookings) ────────────────────────

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!isAdmin(session)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: packageId, departureId } = await params;

    const departure = await prisma.departure.findFirst({
      where: { id: departureId, packageId },
      include: { _count: { select: { bookings: true } } },
    });

    if (!departure) {
      return NextResponse.json(
        { error: 'Departure not found' },
        { status: 404 },
      );
    }

    if (departure._count.bookings > 0) {
      return NextResponse.json(
        {
          error:
            'Cannot delete a departure with existing bookings. Cancel it instead.',
        },
        { status: 409 },
      );
    }

    await prisma.departure.delete({ where: { id: departureId } });

    return NextResponse.json({ success: true });
  } catch (_error) {
    return NextResponse.json(
      { error: 'Failed to delete departure' },
      { status: 500 },
    );
  }
}
