// ─── app/api/bookings/admin/single/route.ts ───────────────────────────────────

import { headers } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { isAdmin } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';
import type { BookingStatus } from '@/prisma/generated/prisma/client/enums';

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!isAdmin(session)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const id = req.nextUrl.searchParams.get('id');
    if (!id) {
      return NextResponse.json(
        { error: 'Missing booking id' },
        { status: 400 },
      );
    }

    const booking = await prisma.booking.findUnique({
      where: { id },
      select: {
        id: true,
        status: true,
        travelDate: true,
        createdAt: true,
        updatedAt: true,
        notes: true,
        adultCount: true,
        preteenCount: true,
        childCount: true,
        infantCount: true,
        subtotal: true,
        vat: true,
        total: true,
        user: {
          select: { id: true, name: true, email: true, image: true },
        },
        package: {
          select: {
            id: true,
            name: true,
            slug: true,
            coverImage: true,
            durationDays: true,
            location: true,
            division: true,
          },
        },
        members: {
          select: {
            id: true,
            type: true,
            fullName: true,
            gender: true,
            email: true,
            phone: true,
            idNumber: true,
          },
        },
      },
    });

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    return NextResponse.json(booking);
  } catch (_error) {
    return NextResponse.json(
      { error: 'Failed to fetch booking' },
      { status: 500 },
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!isAdmin(session)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const id = req.nextUrl.searchParams.get('id');
    const status = req.nextUrl.searchParams.get('status');
    const validStatuses: BookingStatus[] = [
      'PENDING',
      'CONFIRMED',
      'CANCELLED',
    ];

    if (!id || !status || !validStatuses.includes(status as BookingStatus)) {
      return NextResponse.json(
        { error: 'Missing booking ID or invalid status' },
        { status: 400 },
      );
    }

    // Let Prisma throw if the booking doesn't exist — no need for a pre-check
    await prisma.booking.update({
      where: { id },
      data: { status: status as BookingStatus },
    });

    return NextResponse.json({ message: 'Booking status updated' });
  } catch (error) {
    // P2025 = record not found
    if ((error as { code?: string }).code === 'P2025') {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }
    return NextResponse.json(
      { error: 'Failed to update booking status' },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!isAdmin(session)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const id = req.nextUrl.searchParams.get('id');
    if (!id) {
      return NextResponse.json(
        { error: 'Missing booking ID' },
        { status: 400 },
      );
    }

    await prisma.booking.delete({ where: { id } });

    return NextResponse.json({ message: 'Booking deleted' });
  } catch (error) {
    if ((error as { code?: string }).code === 'P2025') {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }
    return NextResponse.json(
      { error: 'Failed to delete booking' },
      { status: 500 },
    );
  }
}
