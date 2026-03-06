import { headers } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { isAdmin } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';
import type { BookingStatus } from '@/prisma/generated/prisma/client/enums';

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!isAdmin(session)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = req.nextUrl;
    const status = searchParams.get('status') as BookingStatus | null;
    const page = Math.max(1, Number(searchParams.get('page') ?? '1'));
    const limit = Math.min(
      50,
      Math.max(1, Number(searchParams.get('limit') ?? '20')),
    );
    const skip = (page - 1) * limit;

    const where = status ? { status } : {};

    const [bookings, total, pending, confirmed, cancelled, all] =
      await Promise.all([
        prisma.booking.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            status: true,
            travelDate: true,
            createdAt: true,
            updatedAt: true,
            notes: true,
            subtotal: true,
            vat: true,
            total: true,
            adultCount: true,
            preteenCount: true,
            childCount: true,
            infantCount: true,
            user: {
              select: { id: true, name: true, email: true },
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
                idNumber: true,
                email: true,
                phone: true,
              },
            },
          },
        }),
        prisma.booking.count({ where }),
        prisma.booking.count({ where: { status: 'PENDING' } }),
        prisma.booking.count({ where: { status: 'CONFIRMED' } }),
        prisma.booking.count({ where: { status: 'CANCELLED' } }),
        // Grand total regardless of filter — for the "All" tab count
        prisma.booking.count(),
      ]);

    return NextResponse.json({
      bookings,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
      },
      counts: {
        all, // always the unfiltered grand total
        pending,
        confirmed,
        cancelled,
      },
    });
  } catch (_error) {
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 },
    );
  }
}
