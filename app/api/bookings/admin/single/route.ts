import { headers } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { isAdmin } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';
import type { BookingStatus } from '@/prisma/generated/prisma/client/enums';

export async function GET(req: NextRequest) {
  try {
    // 1. Auth check
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!isAdmin(session)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Validate id
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json(
        { error: 'Missing booking id' },
        { status: 400 },
      );
    }

    // 3. Fetch full booking
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
            coverImage: true,
            durationDays: true,
            Location: true,
            destination: {
              select: { name: true, division: true },
            },
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
    // 1. Auth check
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!isAdmin(session)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Query params
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const status = searchParams.get('status');
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

    const response = await prisma.booking.findUnique({ where: { id } });
    if (!response) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    await prisma.booking.update({
      where: { id },
      data: { status: status as BookingStatus },
    });

    return NextResponse.json({ message: 'Booking status updated' });
  } catch (_error) {
    return NextResponse.json(
      { error: 'Failed to update booking status' },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    // 1. Auth check
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!isAdmin(session)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Query params
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Missing booking ID' },
        { status: 400 },
      );
    }

    const response = await prisma.booking.findUnique({ where: { id } });
    if (!response) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    await prisma.booking.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Booking deleted' });
  } catch (_error) {
    return NextResponse.json(
      { error: 'Failed to delete booking' },
      { status: 500 },
    );
  }
}
